import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  cacheTtl: Number(process.env.CACHE_TTL) || 300,
  requestTimeout: Number(process.env.REQUEST_TIMEOUT) || 10000,
  rateLimitWindow: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  maxConcurrentFetches: Number(process.env.MAX_CONCURRENT_FETCHES) || 5,
};
