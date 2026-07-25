// src/middleware/validation.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          requestId: req.headers["x-request-id"],
          error: {
            code: "INVALID_INPUT",
            message: error.issues[0].message,
          },
        });
      }
      next(error);
    }
  };
