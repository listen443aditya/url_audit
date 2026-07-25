// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(
    {
      err: err.message,
      stack: err.stack,
      requestId: req.headers["x-request-id"],
    },
    "Unhandled Exception",
  );

  res.status(500).json({
    success: false,
    requestId: req.headers["x-request-id"],
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};
