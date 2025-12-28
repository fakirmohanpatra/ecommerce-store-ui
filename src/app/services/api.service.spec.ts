import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make GET request and return data', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';

      service['get'](endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:8080/test');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle GET request error', () => {
      const endpoint = '/test';
      const errorMessage = '404 error';

      service['get'](endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/test');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('POST requests', () => {
    it('should make POST request with body and return data', () => {
      const mockData = { id: 1, name: 'Created' };
      const endpoint = '/test';
      const body = { name: 'Test' };

      service['post'](endpoint, body).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:8080/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockData);
    });

    it('should make POST request without body', () => {
      const mockData = { success: true };
      const endpoint = '/test';

      service['post'](endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:8080/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockData);
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request with body and return data', () => {
      const mockData = { id: 1, name: 'Updated' };
      const endpoint = '/test/1';
      const body = { name: 'Updated Name' };

      service['put'](endpoint, body).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:8080/test/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockData);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request and return data', () => {
      const mockData = { deleted: true };
      const endpoint = '/test/1';

      service['delete'](endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:8080/test/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockData);
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', () => {
      const endpoint = '/test';

      service['get'](endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/test');
      req.error(new ErrorEvent('network error'));
    });

    it('should handle 500 server errors', () => {
      const endpoint = '/test';

      service['get'](endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/test');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle 404 not found errors', () => {
      const endpoint = '/test';

      service['get'](endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/test');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});