import { Injectable } from '@angular/core';

export interface ErrorContext {
  operation: string;
  component?: string;
  showUserMessage?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /**
   * Handles API errors with consistent logging and user feedback
   */
  handleError(error: any, context: ErrorContext): string {
    // Log error details for debugging (development mode)
    console.error(`[${context.component || 'Unknown'}] ${context.operation} failed:`, {
      error,
      status: error?.status,
      message: error?.message,
      url: error?.url
    });

    // Return user-friendly error message
    return this.getUserFriendlyMessage(error, context);
  }

  /**
   * Gets user-friendly error messages based on error type
   */
  private getUserFriendlyMessage(error: any, context: ErrorContext): string {
    // Network errors
    if (!error?.status) {
      return 'Network connection error. Please check your internet connection.';
    }

    // HTTP status codes
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'Access denied. You don\'t have permission for this action.';
      case 404:
        return `${context.operation} not found.`;
      case 409:
        return 'Conflict detected. This action cannot be completed right now.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Failed to ${context.operation.toLowerCase()}. Please try again.`;
    }
  }

  /**
   * Creates error context for common operations
   */
  createContext(operation: string, component: string): ErrorContext {
    return { operation, component };
  }
}