export interface ErrorResponse {
  message: string;
  errorCode: string;
  timestamp: string;  // ISO 8601
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_JSON = 'INVALID_JSON',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}