import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = 500;
    const message = 'Internal Server Error';
    error = new AppError(message, statusCode);
  }

  const appError = error as AppError;

  res.status(appError.statusCode).json({
    success: false,
    error: appError.message,
    ...(process.env.NODE_ENV === 'development' && { stack: appError.stack })
  });
};