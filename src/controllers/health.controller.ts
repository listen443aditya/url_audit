// src/controllers/health.controller.ts
import { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    _credit: "Built for Digital Heroes Training Task - digitalheroesco.com",
  });
};
