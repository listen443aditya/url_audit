// src/controllers/audit.controller.ts
import { Request, Response } from "express";
import { performAudit } from "../services/audit.service";
import { logger } from "../middleware/logger";

export const auditController = async (req: Request, res: Response) => {
  const { url } = req.body;
  const requestId = req.headers["x-request-id"] as string;

  try {
    const { data, cached } = await performAudit(url, requestId);

    res.status(200).json({
      success: true,
      requestId,
      cached,
      data,
    });
  } catch (error: any) {
    let errorCode = "FETCH_ERROR";
    let message = "Failed to audit the provided URL.";
    let statusCode = 500;

    if (error.message === "TIMEOUT") {
      errorCode = "TIMEOUT";
      message = "The request exceeded the maximum allowed time.";
      statusCode = 504;
    } else if (
      error.code === "ENOTFOUND" ||
      error.cause?.code === "ENOTFOUND"
    ) {
      errorCode = "DNS_FAILURE";
      message = "Could not resolve the hostname.";
      statusCode = 400;
    }

    logger.error({ requestId, url, err: error.message }, "Audit Failure");

    res.status(statusCode).json({
      success: false,
      requestId,
      error: {
        code: errorCode,
        message,
      },
    });
  }
};
