import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  path?: string;
  value?: unknown;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  stack?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field '${field}'`;
  }

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 422;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token"; }
  if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token expired"; }

  if (statusCode >= 500) logger.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
