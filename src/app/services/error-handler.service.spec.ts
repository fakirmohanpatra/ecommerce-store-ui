import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService, ErrorContext } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService]
    });
    service = TestBed.inject(ErrorHandlerService);

    // Mock console.error to avoid test output pollution
    spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    it('should handle network errors', () => {
      const error = { status: 0 };
      const context: ErrorContext = { operation: 'Test Operation', component: 'TestComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Network connection error. Please check your internet connection.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 400 Bad Request errors', () => {
      const error = { status: 400, message: 'Bad Request' };
      const context: ErrorContext = { operation: 'Save Data', component: 'FormComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Invalid request. Please check your input and try again.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 401 Unauthorized errors', () => {
      const error = { status: 401 };
      const context: ErrorContext = { operation: 'Load Data', component: 'DashboardComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Authentication required. Please log in again.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 403 Forbidden errors', () => {
      const error = { status: 403 };
      const context: ErrorContext = { operation: 'Delete Item', component: 'AdminComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Access denied. You don\'t have permission for this action.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 404 Not Found errors', () => {
      const error = { status: 404 };
      const context: ErrorContext = { operation: 'Load User', component: 'UserComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Load User not found.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 409 Conflict errors', () => {
      const error = { status: 409 };
      const context: ErrorContext = { operation: 'Update Item', component: 'EditComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Conflict detected. This action cannot be completed right now.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 422 Validation errors', () => {
      const error = { status: 422 };
      const context: ErrorContext = { operation: 'Submit Form', component: 'FormComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Validation error. Please check your input.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 500 Server errors', () => {
      const error = { status: 500 };
      const context: ErrorContext = { operation: 'Process Payment', component: 'CheckoutComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Server error. Please try again later.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 503 Service Unavailable errors', () => {
      const error = { status: 503 };
      const context: ErrorContext = { operation: 'Load Data', component: 'DashboardComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Service temporarily unavailable. Please try again later.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle unknown status codes', () => {
      const error = { status: 418 }; // I'm a teapot
      const context: ErrorContext = { operation: 'Brew Coffee', component: 'CoffeeComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Failed to brew coffee. Please try again.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle errors without status', () => {
      const error = { message: 'Unknown error' };
      const context: ErrorContext = { operation: 'Test Operation', component: 'TestComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Network connection error. Please check your internet connection.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle null/undefined error', () => {
      const error = null;
      const context: ErrorContext = { operation: 'Test Operation', component: 'TestComponent' };

      const result = service.handleError(error, context);

      expect(result).toBe('Network connection error. Please check your internet connection.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should work with minimal context', () => {
      const error = { status: 404 };
      const context: ErrorContext = { operation: 'Load Data' };

      const result = service.handleError(error, context);

      expect(result).toBe('Load Data not found.');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('createContext', () => {
    it('should create error context', () => {
      const context = service.createContext('Test Operation', 'TestComponent');

      expect(context).toEqual({
        operation: 'Test Operation',
        component: 'TestComponent'
      });
    });
  });

  describe('console logging', () => {
    it('should log error details with component name', () => {
      const error = { status: 500, message: 'Server Error', url: '/api/test' };
      const context: ErrorContext = { operation: 'Test Operation', component: 'TestComponent' };

      service.handleError(error, context);

      expect(console.error).toHaveBeenCalledWith('[TestComponent] Test Operation failed:', {
        error,
        status: 500,
        message: 'Server Error',
        url: '/api/test'
      });
    });

    it('should log with "Unknown" when component not provided', () => {
      const error = { status: 404 };
      const context: ErrorContext = { operation: 'Test Operation' };

      service.handleError(error, context);

      expect(console.error).toHaveBeenCalledWith('[Unknown] Test Operation failed:', {
        error,
        status: 404,
        message: undefined,
        url: undefined
      });
    });
  });
});