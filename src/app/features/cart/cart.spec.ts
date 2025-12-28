import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Cart } from './cart';
import { CartService } from '../../services/cart.service';
import { CartResponse, CartItemResponse, UpdateCartItemRequest } from '../../models';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
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

  const emptyCart: CartResponse = {
    userId: 'user1',
    items: [],
    totalItems: 0,
    totalAmount: 0
  };

  beforeEach(async () => {
    const cartServiceMock = jasmine.createSpyObj('CartService', [
      'getUserCart',
      'updateCartItemQuantity',
      'removeItemFromCart',
      'clearCart'
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Cart, HttpClientTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
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
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading cart:', error);
      expect(component.cart).toBeNull();
    });
  });

  describe('loadCart', () => {
    it('should load cart successfully', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));

      component.loadCart();

      expect(component.cart).toEqual(mockCart);
    });

    it('should handle empty cart', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(emptyCart));

      component.loadCart();

      expect(component.cart).toEqual(emptyCart);
      expect(component.cart?.items).toEqual([]);
      expect(component.cart?.totalAmount).toBe(0);
    });

    it('should handle loading error', () => {
      const error = new Error('Network error');
      cartServiceSpy.getUserCart.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.loadCart();

      expect(console.error).toHaveBeenCalledWith('Error loading cart:', error);
    });
  });

  describe('updateQuantity', () => {
    const item: CartItemResponse = {
      itemId: 'item1',
      itemName: 'Laptop',
      quantity: 1,
      itemPrice: 999.99,
      subtotal: 999.99,
      stock: 10
    };

    it('should update quantity with valid number', () => {
      const newQuantity = '3';
      const request: UpdateCartItemRequest = { quantity: 3 };
      cartServiceSpy.updateCartItemQuantity.and.returnValue(of(mockCart));
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));

      component.updateQuantity(item, newQuantity);

      expect(cartServiceSpy.updateCartItemQuantity).toHaveBeenCalledWith('user1', 'item1', request);
      expect(cartServiceSpy.getUserCart).toHaveBeenCalledWith('user1');
    });

    it('should not update quantity with invalid number', () => {
      const newQuantity = 'invalid';

      component.updateQuantity(item, newQuantity);

      expect(cartServiceSpy.updateCartItemQuantity).not.toHaveBeenCalled();
    });

    it('should not update quantity with zero', () => {
      const newQuantity = '0';

      component.updateQuantity(item, newQuantity);

      expect(cartServiceSpy.updateCartItemQuantity).not.toHaveBeenCalled();
    });

    it('should not update quantity with negative number', () => {
      const newQuantity = '-1';

      component.updateQuantity(item, newQuantity);

      expect(cartServiceSpy.updateCartItemQuantity).not.toHaveBeenCalled();
    });

    it('should handle update error', () => {
      const newQuantity = '2';
      const error = new Error('Update failed');
      cartServiceSpy.updateCartItemQuantity.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.updateQuantity(item, newQuantity);

      expect(console.error).toHaveBeenCalledWith('Error updating quantity:', error);
    });
  });

  describe('removeItem', () => {
    const item: CartItemResponse = {
      itemId: 'item1',
      itemName: 'Laptop',
      quantity: 1,
      itemPrice: 999.99,
      subtotal: 999.99,
      stock: 10
    };

    it('should remove item from cart', () => {
      cartServiceSpy.removeItemFromCart.and.returnValue(of(mockCart));
      cartServiceSpy.getUserCart.and.returnValue(of(emptyCart));

      component.removeItem(item);

      expect(cartServiceSpy.removeItemFromCart).toHaveBeenCalledWith('user1', 'item1');
      expect(cartServiceSpy.getUserCart).toHaveBeenCalledWith('user1');
    });

    it('should handle remove error', () => {
      const error = new Error('Remove failed');
      cartServiceSpy.removeItemFromCart.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.removeItem(item);

      expect(console.error).toHaveBeenCalledWith('Error removing item:', error);
    });
  });

  describe('clearCart', () => {
    it('should clear entire cart', () => {
      cartServiceSpy.clearCart.and.returnValue(of(void 0));
      cartServiceSpy.getUserCart.and.returnValue(of(emptyCart));

      component.clearCart();

      expect(cartServiceSpy.clearCart).toHaveBeenCalledWith('user1');
      expect(cartServiceSpy.getUserCart).toHaveBeenCalledWith('user1');
    });

    it('should handle clear cart error', () => {
      const error = new Error('Clear failed');
      cartServiceSpy.clearCart.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.clearCart();

      expect(console.error).toHaveBeenCalledWith('Error clearing cart:', error);
    });
  });

  describe('proceedToCheckout', () => {
    it('should navigate to checkout', () => {
      component.proceedToCheckout();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/checkout']);
    });
  });

  describe('component state', () => {
    it('should initialize with correct default values', () => {
      expect(component.cart).toBeNull();
      expect(component.userId).toBe('user1');
      expect(component.displayedColumns).toEqual(['itemName', 'quantity', 'itemPrice', 'subtotal', 'actions']);
    });
  });

  describe('cart calculations', () => {
    it('should display correct cart data', () => {
      cartServiceSpy.getUserCart.and.returnValue(of(mockCart));
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.cart?.totalAmount).toBe(1059.97);
      expect(component.cart?.items.length).toBe(2);
    });
  });
});