import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { AdminStatsResponse, CouponResponse } from '../models';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAdminStats', () => {
    it('should return admin stats', () => {
      const mockStats: AdminStatsResponse = {
        totalPurchaseAmount: 1000,
        totalOrders: 50,
        totalItemsPurchased: 200,
        totalDiscountAmount: 100,
        ordersWithCoupons: 10,
        totalCouponsGenerated: 25,
        activeCoupon: 'SAVE10-001'
      };

      service.getAdminStats().subscribe(stats => {
        expect(stats).toEqual(mockStats);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/stats');
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });

    it('should handle error when getting admin stats', () => {
      service.getAdminStats().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/stats');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getAllCoupons', () => {
    it('should return all coupons', () => {
      const mockCoupons = {
        coupons: ['SAVE10-001', 'SAVE10-002', 'SAVE10-003'],
        totalGenerated: 3
      };

      service.getAllCoupons().subscribe(coupons => {
        expect(coupons).toEqual(mockCoupons);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/coupons');
      expect(req.request.method).toBe('GET');
      req.flush(mockCoupons);
    });

    it('should handle empty coupons list', () => {
      const mockCoupons = {
        coupons: [],
        totalGenerated: 0
      };

      service.getAllCoupons().subscribe(coupons => {
        expect(coupons.coupons).toEqual([]);
        expect(coupons.totalGenerated).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/coupons');
      req.flush(mockCoupons);
    });
  });

  describe('getActiveCoupon', () => {
    it('should return active coupon', () => {
      const mockCoupon: CouponResponse = {
        code: 'SAVE10-005',
        used: false,
        generatedAtOrderNumber: 5,
        createdAt: '2025-12-28T10:00:00'
      };

      service.getActiveCoupon().subscribe(coupon => {
        expect(coupon).toEqual(mockCoupon);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/coupons/active');
      expect(req.request.method).toBe('GET');
      req.flush(mockCoupon);
    });

    it('should handle 404 when no active coupon', () => {
      service.getActiveCoupon().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/coupons/active');
      req.flush('No active coupon', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('generateCoupon', () => {
    it('should generate new coupon', () => {
      const mockCoupon: CouponResponse = {
        code: 'SAVE10-006',
        used: false,
        generatedAtOrderNumber: 6,
        createdAt: '2025-12-28T11:00:00'
      };

      service.generateCoupon().subscribe(coupon => {
        expect(coupon).toEqual(mockCoupon);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/coupons/generate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockCoupon);
    });

    it('should handle generation error', () => {
      service.generateCoupon().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/coupons/generate');
      req.flush('Generation failed', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});