import { NextFunction, Request, Response } from 'express';
import { getErrorMessage } from '@src/utils/errorHandler'; // Import getErrorMessage
import CustomError from '@src/utils/customError/customError';

// The main error handler function
export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent || process.env.APP_DEBUG === 'true') {
    next(error);
    return;
  }

  // Handling Custom Errors
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      message: error.message || 'Custom Error',
      code: error.code,
    });
    return;
  }

  // Handle specific HTTP error cases based on status codes
  if (error instanceof Error) {
    const statusCode = res.statusCode || 500;

    switch (statusCode) {
      case 400: // Bad Request (validation errors)
        res.status(400).json({
          title: 'Validation Failed',
          message: error.message || 'Invalid request data',
        });
        break;

      case 401: // Unauthorized
        res.status(401).json({
          title: 'Unauthorized',
          message: error.message || 'Authentication is required',
        });
        break;

      case 403: // Forbidden
        res.status(403).json({
          title: 'Forbidden',
          message:
            error.message ||
            'You do not have permission to access this resource',
        });
        break;

      case 404: // Not Found
        res.status(404).json({
          title: 'Not Found',
          message:
            error.message || 'The resource you requested could not be found',
        });
        break;

      case 500: // Internal Server Error
        res.status(500).json({
          title: 'Internal Server Error',
          message:
            error.message ||
            'Something went wrong on the server, please try again later.',
        });
        break;

      default:
        res.status(500).json({
          title: 'Internal Server Error',
          message: error.message || 'An unexpected error occurred',
        });
        break;
    }
  } else {
    // If the error is not an instance of Error, return a generic message
    res.status(500).json({
      title: 'Internal Server Error',
      message:
        getErrorMessage(error) ||
        'An error occurred. Please view logs for more details',
    });
  }
}
