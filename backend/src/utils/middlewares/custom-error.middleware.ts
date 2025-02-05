import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import Logger from '../logger';
import { StatusCodes } from 'http-status-codes';

class CustomError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  private logger = new Logger(ErrorHandler.name);

  error(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof CustomError) {
      // Handle custom errors
      this.logger.error(`Custom Error: ${error.message}`);
      res.status(error.statusCode).json({
        status: 'error',
        statusCode: error.statusCode,
        message: error.message,
      });
    } else if (error.httpCode) {
      // Handle validation errors (e.g., from class-validator)
      this.logger.error(`Validation Error: ${error.message}`);
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        statusCode: StatusCodes.BAD_REQUEST,
        message: error.message,
        errors: error.errors, // Include validation errors
      });
    } else {
      // Handle unexpected errors
      this.logger.error(`Unexpected Error: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}