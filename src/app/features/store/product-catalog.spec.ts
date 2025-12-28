import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ProductCatalog } from './product-catalog';
import { ItemService } from '../../services/item.service';
import { CartService } from '../../services/cart.service';
import { ItemResponse, CartResponse } from '../../models';

describe('ProductCatalog', () => {
  let component: ProductCatalog;
  let fixture: ComponentFixture<ProductCatalog>;
  let itemServiceSpy: jasmine.SpyObj<ItemService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockItems: ItemResponse[] = [
    {
      itemId: 'item1',
      name: 'Laptop',
      price: 999.99,
      stock: 10
    },
    {
      itemId: 'item2',
      name: 'Mouse',
      price: 29.99,
      stock: 25
    },
    {
      itemId: 'item3',
      name: 'Keyboard',
      price: 79.99,
      stock: 15
    }
  ];

  const mockCartResponse: CartResponse = {
    userId: 'user1',
    items: [],
    totalItems: 0,
    totalAmount: 0
  };

  beforeEach(async () => {
    const itemServiceMock = jasmine.createSpyObj('ItemService', ['getAllItems']);
    const cartServiceMock = jasmine.createSpyObj('CartService', ['addItemToCart']);

    await TestBed.configureTestingModule({
      imports: [ProductCatalog, HttpClientTestingModule],
      providers: [
        { provide: ItemService, useValue: itemServiceMock },
        { provide: CartService, useValue: cartServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCatalog);
    component = fixture.componentInstance;
    itemServiceSpy = TestBed.inject(ItemService) as jasmine.SpyObj<ItemService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load items on init', () => {
      itemServiceSpy.getAllItems.and.returnValue(of(mockItems));

      component.ngOnInit();

      expect(itemServiceSpy.getAllItems).toHaveBeenCalled();
      expect(component.items).toEqual(mockItems);
    });

    it('should handle loading error', () => {
      const error = new Error('Server error');
      itemServiceSpy.getAllItems.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading items:', error);
      expect(component.items).toEqual([]);
    });
  });

  describe('loadItems', () => {
    it('should load items successfully', () => {
      itemServiceSpy.getAllItems.and.returnValue(of(mockItems));

      component.loadItems();

      expect(component.items).toEqual(mockItems);
    });

    it('should handle loading error', () => {
      const error = new Error('Network error');
      itemServiceSpy.getAllItems.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.loadItems();

      expect(console.error).toHaveBeenCalledWith('Error loading items:', error);
    });
  });

  describe('addToCart', () => {
    it('should add item to cart successfully', () => {
      const item = mockItems[0];
      cartServiceSpy.addItemToCart.and.returnValue(of(mockCartResponse));
      spyOn(window, 'alert');

      component.addToCart(item);

      expect(cartServiceSpy.addItemToCart).toHaveBeenCalledWith('user1', {
        itemId: item.itemId,
        quantity: 1
      });
      expect(window.alert).toHaveBeenCalledWith('Item added to cart!');
    });

    it('should handle add to cart error', () => {
      const item = mockItems[0];
      const error = new Error('Add to cart failed');
      cartServiceSpy.addItemToCart.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.addToCart(item);

      expect(console.error).toHaveBeenCalledWith('Error adding to cart:', error);
    });
  });

  describe('component state', () => {
    it('should initialize with correct default values', () => {
      expect(component.items).toEqual([]);
      expect(component.userId).toBe('user1');
    });
  });
});