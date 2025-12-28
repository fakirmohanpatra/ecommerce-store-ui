import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { ItemResponse } from '../models';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllItems', () => {
    it('should return all items', () => {
      const mockItems: ItemResponse[] = [
        {
          itemId: 'item1',
          name: 'Laptop',
          price: 999.99,
          stock: 50
        },
        {
          itemId: 'item2',
          name: 'Mouse',
          price: 29.99,
          stock: 100
        }
      ];

      service.getAllItems().subscribe(items => {
        expect(items).toEqual(mockItems);
        expect(items.length).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/items');
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should handle empty items list', () => {
      const mockItems: ItemResponse[] = [];

      service.getAllItems().subscribe(items => {
        expect(items).toEqual([]);
        expect(items.length).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/items');
      req.flush(mockItems);
    });

    it('should handle get all items error', () => {
      service.getAllItems().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/items');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getItemById', () => {
    it('should return item by id', () => {
      const itemId = 'item123';
      const mockItem: ItemResponse = {
        itemId: itemId,
        name: 'Gaming Laptop',
        price: 1499.99,
        stock: 25
      };

      service.getItemById(itemId).subscribe(item => {
        expect(item).toEqual(mockItem);
        expect(item.itemId).toBe(itemId);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/items/${itemId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });

    it('should handle item not found', () => {
      const itemId = 'nonexistent-item';

      service.getItemById(itemId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/items/${itemId}`);
      req.flush('Item not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle get item error', () => {
      const itemId = 'item123';

      service.getItemById(itemId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/items/${itemId}`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});