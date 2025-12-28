import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { CartResponse, AddToCartRequest, UpdateCartItemRequest } from '../models';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  const userId = 'user123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addItemToCart', () => {
    it('should add item to cart', () => {
      const request: AddToCartRequest = {
        itemId: 'item123',
        quantity: 2
      };

      const mockResponse: CartResponse = {
        userId: userId,
        items: [{
          itemId: 'item123',
          itemName: 'Test Item',
          quantity: 2,
          itemPrice: 10.99,
          subtotal: 21.98,
          stock: 50
        }],
        totalItems: 2,
        totalAmount: 21.98
      };

      service.addItemToCart(userId, request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}/items`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should handle add item error', () => {
      const request: AddToCartRequest = {
        itemId: 'invalid-item',
        quantity: 1
      };

      service.addItemToCart(userId, request).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}/items`);
      req.flush('Invalid item', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove item from cart', () => {
      const itemId = 'item123';
      const mockResponse: CartResponse = {
        userId: userId,
        items: [],
        totalItems: 0,
        totalAmount: 0
      };

      service.removeItemFromCart(userId, itemId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}/items/${itemId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle remove item error', () => {
      const itemId = 'nonexistent-item';

      service.removeItemFromCart(userId, itemId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}/items/${itemId}`);
      req.flush('Item not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update item quantity', () => {
      const itemId = 'item123';
      const request: UpdateCartItemRequest = {
        quantity: 5
      };

      const mockResponse: CartResponse = {
        userId: userId,
        items: [{
          itemId: 'item123',
          itemName: 'Test Item',
          quantity: 5,
          itemPrice: 10.99,
          subtotal: 54.95,
          stock: 50
        }],
        totalItems: 5,
        totalAmount: 54.95
      };

      service.updateCartItemQuantity(userId, itemId, request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}/items/${itemId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should handle update quantity error', () => {
      const itemId = 'item123';
      const request: UpdateCartItemRequest = {
        quantity: -1 // Invalid quantity
      };

      service.updateCartItemQuantity(userId, itemId, request).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}/items/${itemId}`);
      req.flush('Invalid quantity', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getUserCart', () => {
    it('should get user cart', () => {
      const mockResponse: CartResponse = {
        userId: userId,
        items: [{
          itemId: 'item123',
          itemName: 'Test Item',
          quantity: 2,
          itemPrice: 10.99,
          subtotal: 21.98,
          stock: 50
        }],
        totalItems: 2,
        totalAmount: 21.98
      };

      service.getUserCart(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty cart', () => {
      const mockResponse: CartResponse = {
        userId: userId,
        items: [],
        totalItems: 0,
        totalAmount: 0
      };

      service.getUserCart(userId).subscribe(response => {
        expect(response.items).toEqual([]);
        expect(response.totalAmount).toBe(0);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}`);
      req.flush(mockResponse);
    });

    it('should handle get cart error', () => {
      service.getUserCart(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('clearCart', () => {
    it('should clear cart', () => {
      service.clearCart(userId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle clear cart error', () => {
      service.clearCart(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart/${userId}`);
      req.flush('Clear failed', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});