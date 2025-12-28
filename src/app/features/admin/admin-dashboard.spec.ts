import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AdminDashboard } from './admin-dashboard';
import { AdminService } from '../../services/admin.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AdminStatsResponse, CouponResponse } from '../../models';
import { Router } from '@angular/router';

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  const mockStats: AdminStatsResponse = {
    totalPurchaseAmount: 1500.50,
    totalOrders: 25,
    totalItemsPurchased: 75,
    totalDiscountAmount: 150.00,
    ordersWithCoupons: 5,
    totalCouponsGenerated: 10,
    activeCoupon: 'SAVE10-005'
  };

  const mockCoupons = {
    coupons: ['SAVE10-001', 'SAVE10-002', 'SAVE10-003'],
    totalGenerated: 3
  };

  const mockCouponResponse: CouponResponse = {
    code: 'SAVE10-006',
    used: false,
    generatedAtOrderNumber: 6,
    createdAt: '2025-12-28T12:00:00'
  };

  beforeEach(async () => {
    const adminServiceMock = jasmine.createSpyObj('AdminService', [
      'getAdminStats',
      'getAllCoupons',
      'getActiveCoupon',
      'generateCoupon'
    ]);
    const errorHandlerMock = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
      'createContext'
    ]);

    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routerMock.events = of();

    await TestBed.configureTestingModule({
      imports: [AdminDashboard, HttpClientTestingModule],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load stats and coupons on init', () => {
      adminServiceSpy.getAdminStats.and.returnValue(of(mockStats));
      adminServiceSpy.getAllCoupons.and.returnValue(of(mockCoupons));
      adminServiceSpy.getActiveCoupon.and.returnValue(of(mockCouponResponse));

      component.ngOnInit();

      expect(adminServiceSpy.getAdminStats).toHaveBeenCalled();
      expect(adminServiceSpy.getAllCoupons).toHaveBeenCalled();
      expect(adminServiceSpy.getActiveCoupon).toHaveBeenCalled();
      expect(component.stats).toEqual(mockStats);
      expect(component.activeCoupon).toBe('SAVE10-006');
      expect(component.coupons).toEqual(['SAVE10-001', 'SAVE10-002', 'SAVE10-003']);
    });


    it('should handle coupons loading error', () => {
      const error = new Error('Server error');
      adminServiceSpy.getAdminStats.and.returnValue(of(mockStats));
      adminServiceSpy.getAllCoupons.and.returnValue(throwError(() => error));
      adminServiceSpy.getActiveCoupon.and.returnValue(of(mockCouponResponse));
      errorHandlerSpy.handleError.and.callFake(() => 'Failed to load coupons');

      component.ngOnInit();

      expect(errorHandlerSpy.handleError).toHaveBeenCalled();
      expect(component.errorMessage).toBe('Failed to load coupons');
      expect(component.coupons).toEqual([]);
    });
  });

  describe('generateCoupon', () => {
    beforeEach(() => {
      adminServiceSpy.getAdminStats.and.returnValue(of(mockStats));
      adminServiceSpy.getAllCoupons.and.returnValue(of(mockCoupons));
      adminServiceSpy.getActiveCoupon.and.returnValue(of(mockCouponResponse));
      component.ngOnInit(); // Initialize with data
    });

    it('should generate coupon without confirmation when no active coupon', () => {
      component.activeCoupon = null;
      adminServiceSpy.generateCoupon.and.returnValue(of(mockCouponResponse));

      spyOn(window, 'alert');

      component.generateCoupon();

      expect(adminServiceSpy.generateCoupon).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('New coupon generated: SAVE10-006');
      expect(component.isGeneratingCoupon).toBeFalse();
    });

    it('should show confirmation dialog when active coupon exists', () => {
      component.activeCoupon = 'SAVE10-005';
      spyOn(window, 'confirm').and.returnValue(true);
      adminServiceSpy.generateCoupon.and.returnValue(of(mockCouponResponse));
      spyOn(window, 'alert');

      component.generateCoupon();

      expect(window.confirm).toHaveBeenCalledWith(
        'Warning: This will replace the existing active coupon "SAVE10-005".\n\nAre you sure you want to continue?'
      );
      expect(adminServiceSpy.generateCoupon).toHaveBeenCalled();
    });

    it('should not generate coupon if user cancels confirmation', () => {
      component.activeCoupon = 'SAVE10-005';
      spyOn(window, 'confirm').and.returnValue(false);

      component.generateCoupon();

      expect(adminServiceSpy.generateCoupon).not.toHaveBeenCalled();
      expect(component.isGeneratingCoupon).toBeFalse();
    });

    it('should set loading state during generation', fakeAsync(() => {
      component.activeCoupon = null;
      adminServiceSpy.generateCoupon.and.returnValue(of(mockCouponResponse).pipe(delay(0)));
      spyOn(window, 'alert');

      component.generateCoupon();

      expect(component.isGeneratingCoupon).toBeTrue();

      tick();

      expect(component.isGeneratingCoupon).toBeFalse();
    }));

    it('should handle generation error', () => {
      component.activeCoupon = null;
      const error = new Error('Generation failed');
      adminServiceSpy.generateCoupon.and.returnValue(throwError(() => error));
      errorHandlerSpy.handleError.and.returnValue('Failed to generate coupon');

      component.generateCoupon();

      expect(errorHandlerSpy.handleError).toHaveBeenCalled();
      expect(component.errorMessage).toBe('Failed to generate coupon');
      expect(component.isGeneratingCoupon).toBeFalse();
    });

    it('should reload data after successful generation', () => {
      component.activeCoupon = null;
      adminServiceSpy.generateCoupon.and.returnValue(of(mockCouponResponse));
      spyOn(window, 'alert');

      component.generateCoupon();

      expect(adminServiceSpy.getAdminStats).toHaveBeenCalledTimes(2); // Initial + reload
      expect(adminServiceSpy.getAllCoupons).toHaveBeenCalledTimes(2); // Initial + reload
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      component.errorMessage = 'Test error';

      component.clearError();

      expect(component.errorMessage).toBeNull();
    });
  });

  describe('component state', () => {
    it('should initialize with correct default values', () => {
      expect(component.stats).toBeNull();
      expect(component.coupons).toEqual([]);
      expect(component.activeCoupon).toBeNull();
      expect(component.isGeneratingCoupon).toBeFalse();
      expect(component.errorMessage).toBeNull();
    });
  });
});