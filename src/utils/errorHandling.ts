import { logger } from './logger';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleError(error: unknown): string {
  if (error instanceof APIError) {
    logger.error('API Error', { 
      message: error.message, 
      statusCode: error.statusCode,
      data: error.data 
    });
    return error.message;
  }
  
  if (error instanceof Error) {
    logger.error('Application Error', { 
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return error.message;
  }
  
  logger.error('Unknown Error', { error });
  return 'An unexpected error occurred';
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}