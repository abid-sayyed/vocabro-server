import { NextFunction, Request, Response } from 'express';
import { getErrorMessage } from '@src/utils/errorHandler';
import CustomError from '@src/utils/customError/customError';

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent || process.env.APP_DEBUG === 'true') {
    next(error);
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }
  res.status(500).json({
    error: {
      message:
        getErrorMessage(error) ||
        'An error occurred. Please view logs for more details',
    },
  });
}
