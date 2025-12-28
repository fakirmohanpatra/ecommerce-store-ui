import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Checkout } from './checkout';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { CartResponse, CheckoutRequest, OrderResponse } from '../../models';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCart: CartResponse = {
    userId: 'user1',
    items: [
      {
        itemId: 'item1',
        itemName: 'Laptop',
        quantity: 1,
        itemPrice: 999.99,
        subtotal: 999.99,
        stock: 10
      },
      {
        itemId: 'item2',
        itemName: 'Mouse',
        quantity: 2,
        itemPrice: 29.99,
        subtotal: 59.98,
        stock: 25
      }
    ],
    totalItems: 3,
    totalAmount: 1059.97
  };

  const mockOrderResponse: OrderResponse = {
    orderId: 'order123',
    userId: 'user1',
    orderNumber: 1,
    items: mockCart.items,
    subtotal: 1059.97,
    totalAmount: 1059.97,
    discountAmount: 0,
    couponCode: null,
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString()
  };

  beforeEach(async () => {
    const orderServiceMock = jasmine.createSpyObj('OrderService', [
      'checkout',
      'getOrderHistory'
    ]);
    const cartServiceMock = jasmine.createSpyObj('CartService', [
      'getUserCart'
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Checkout, HttpClientTestingModule],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load cart on init', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));

      component.ngOnInit();

      expect(cartServiceSpy.getUserCart).toHaveBeenCalledWith('user1');
      expect(component.cart).toEqual(mockCart);
    });

    it('should handle cart loading error', () => {
      const error = new Error('Server error');
      cartServiceSpy.getUserCart.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(component.errorMessage).toBe('Failed to load cart. Please try again.');
    });

    it('should handle empty cart', () => {
      const emptyCart: CartResponse = { userId: 'user1', items: [], totalItems: 0, totalAmount: 0 };
      cartServiceSpy.getUserCart.and.returnValue(of(emptyCart));

      component.ngOnInit();

      expect(component.cart).toEqual(emptyCart);
    });
  });

  describe('loadCart', () => {
    it('should load cart successfully', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));

      component.loadCart();

      expect(component.cart).toEqual(mockCart);
    });

    it('should handle loading error', () => {
      const error = new Error('Network error');
      cartServiceSpy.getUserCart.and.returnValue(throwError(() => error));

      component.loadCart();

      expect(component.errorMessage).toBe('Failed to load cart. Please try again.');
    });
  });

  describe('checkout', () => {
    it('should checkout successfully', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      orderServiceSpy.checkout.and.returnValue(of(mockOrderResponse));

      component.ngOnInit();
      component.checkout();

      const expectedRequest: CheckoutRequest = {
        userId: 'user1',
        couponCode: ''
      };
      expect(orderServiceSpy.checkout).toHaveBeenCalledWith(expectedRequest);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders']);
    });

    it('should checkout with coupon code', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      orderServiceSpy.checkout.and.returnValue(of(mockOrderResponse));
      component.couponCode = 'DISCOUNT10';

      component.ngOnInit();
      component.checkout();

      const expectedRequest: CheckoutRequest = {
        userId: 'user1',
        couponCode: 'DISCOUNT10'
      };
      expect(orderServiceSpy.checkout).toHaveBeenCalledWith(expectedRequest);
    });

    it('should not checkout with empty cart', () => {
      const emptyCart: CartResponse = { userId: 'user1', items: [], totalItems: 0, totalAmount: 0 };
      cartServiceSpy.getUserCart.and.returnValue(of(emptyCart));

      component.ngOnInit();
      component.checkout();

      expect(orderServiceSpy.checkout).not.toHaveBeenCalled();
    });

    it('should handle checkout error', () => {
      const error = { error: { message: 'Payment failed' } };
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      orderServiceSpy.checkout.and.returnValue(throwError(() => error));

      component.ngOnInit();
      component.checkout();

      expect(component.errorMessage).toBe('Payment failed');
    });

    it('should handle coupon error and allow proceeding without coupon', () => {
      const error = { error: { message: 'Invalid coupon code' } };
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      orderServiceSpy.checkout.and.returnValues(throwError(() => error), of(mockOrderResponse));
      spyOn(window, 'confirm').and.returnValue(true);

      component.ngOnInit();
      component.couponCode = 'INVALID';
      component.checkout();

      // Should call checkout twice - once with invalid coupon, then without
      expect(orderServiceSpy.checkout).toHaveBeenCalledTimes(2);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders']);
    });

    it('should not proceed without coupon when user cancels', () => {
      const error = { error: { message: 'Invalid coupon code' } };
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      orderServiceSpy.checkout.and.returnValue(throwError(() => error));
      spyOn(window, 'confirm').and.returnValue(false);

      component.ngOnInit();
      component.couponCode = 'INVALID';
      component.checkout();

      // Should only call checkout once with invalid coupon
      expect(orderServiceSpy.checkout).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('proceedWithoutCoupon', () => {
    it('should checkout without coupon', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      orderServiceSpy.checkout.and.returnValue(of(mockOrderResponse));

      component.ngOnInit();
      component.couponCode = 'INVALID';
      component.proceedWithoutCoupon();

      const expectedRequest: CheckoutRequest = {
        userId: 'user1',
        couponCode: ''
      };
      expect(orderServiceSpy.checkout).toHaveBeenCalledWith(expectedRequest);
      expect(component.couponCode).toBe('');
      expect(component.errorMessage).toBe('');
    });

    it('should handle checkout error in proceedWithoutCoupon', () => {
      const error = { error: { message: 'Server error' } };
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      orderServiceSpy.checkout.and.returnValue(throwError(() => error));

      component.ngOnInit();
      component.proceedWithoutCoupon();

      expect(component.errorMessage).toBe('Server error');
    });
  });

  describe('component state', () => {
    it('should initialize with correct default values', () => {
      expect(component.cart).toBeNull();
      expect(component.couponCode).toBe('');
      expect(component.userId).toBe('user1');
      expect(component.errorMessage).toBe('');
    });
  });
});