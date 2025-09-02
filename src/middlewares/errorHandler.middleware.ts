import { Request, Response, NextFunction } from "express";
import AppError from "../helpers/AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongoose errors
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}.`;
    err = new AppError(400, message);
  }

  // Mongoose duplicate key errors
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value.`;
    err = new AppError(400, message);
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    err = new AppError(400, message);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new AppError(401, "Invalid token. Please log in again.");
  }
  if (err.name === "TokenExpiredError") {
    err = new AppError(401, "Your token has expired. Please log in again.");
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
