import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { CheckoutRequest, OrderResponse } from '../models';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkout', () => {
    it('should process checkout successfully', () => {
      const request: CheckoutRequest = {
        userId: 'user123',
        couponCode: 'SAVE10-001'
      };

      const mockResponse: OrderResponse = {
        orderId: 'order123',
        userId: 'user123',
        orderNumber: 1,
        items: [{
          itemId: 'item1',
          itemName: 'Laptop',
          quantity: 1,
          itemPrice: 999.99,
          subtotal: 999.99,
          stock: 10
        }],
        subtotal: 999.99,
        totalAmount: 899.99,
        discountAmount: 100.00,
        couponCode: 'SAVE10-001',
        paymentStatus: 'PAID',
        createdAt: '2025-12-28T10:00:00'
      };

      service.checkout(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.orderId).toBe('order123');
        expect(response.totalAmount).toBe(899.99);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/orders/checkout');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should process checkout without coupon', () => {
      const request: CheckoutRequest = {
        userId: 'user123',
        couponCode: ''
      };

      const mockResponse: OrderResponse = {
        orderId: 'order124',
        userId: 'user123',
        orderNumber: 2,
        items: [{
          itemId: 'item2',
          itemName: 'Mouse',
          quantity: 2,
          itemPrice: 29.99,
          subtotal: 59.98,
          stock: 25
        }],
        subtotal: 59.98,
        totalAmount: 59.98,
        discountAmount: 0,
        couponCode: null,
        paymentStatus: 'PAID',
        createdAt: '2025-12-28T11:00:00'
      };

      service.checkout(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.discountAmount).toBe(0);
        expect(response.couponCode).toBeNull();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/orders/checkout');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should handle checkout validation error', () => {
      const request: CheckoutRequest = {
        userId: 'user123',
        couponCode: 'INVALID-COUPON'
      };

      service.checkout(request).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/orders/checkout');
      req.flush('Invalid coupon code', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle payment failure', () => {
      const request: CheckoutRequest = {
        userId: 'user123',
        couponCode: ''
      };

      service.checkout(request).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(402);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/orders/checkout');
      req.flush('Payment failed', { status: 402, statusText: 'Payment Required' });
    });

    it('should handle checkout server error', () => {
      const request: CheckoutRequest = {
        userId: 'user123',
        couponCode: ''
      };

      service.checkout(request).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/orders/checkout');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getOrderHistory', () => {
    it('should return order history for user', () => {
      const userId = 'user123';
      const mockOrders: OrderResponse[] = [
        {
          orderId: 'order001',
          userId: userId,
          orderNumber: 1,
          items: [{
            itemId: 'item1',
            itemName: 'Laptop',
            quantity: 1,
            itemPrice: 999.99,
            subtotal: 999.99,
            stock: 10
          }],
          subtotal: 999.99,
          totalAmount: 999.99,
          discountAmount: 0,
          couponCode: null,
          paymentStatus: 'PAID',
          createdAt: '2025-12-28T09:00:00'
        },
        {
          orderId: 'order002',
          userId: userId,
          orderNumber: 2,
          items: [{
            itemId: 'item2',
            itemName: 'Mouse',
            quantity: 1,
            itemPrice: 29.99,
            subtotal: 29.99,
            stock: 25
          }],
          subtotal: 29.99,
          totalAmount: 29.99,
          discountAmount: 0,
          couponCode: null,
          paymentStatus: 'PAID',
          createdAt: '2025-12-28T10:00:00'
        }
      ];

      service.getOrderHistory(userId).subscribe(orders => {
        expect(orders).toEqual(mockOrders);
        expect(orders.length).toBe(2);
        expect(orders[0].orderId).toBe('order001');
        expect(orders[1].orderId).toBe('order002');
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/orders/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders);
    });

    it('should handle empty order history', () => {
      const userId = 'user456';
      const mockOrders: OrderResponse[] = [];

      service.getOrderHistory(userId).subscribe(orders => {
        expect(orders).toEqual([]);
        expect(orders.length).toBe(0);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/orders/${userId}`);
      req.flush(mockOrders);
    });

    it('should handle order history error', () => {
      const userId = 'user123';

      service.getOrderHistory(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/orders/${userId}`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});