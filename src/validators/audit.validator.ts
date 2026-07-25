// src/validators/audit.validator.ts
import { z } from "zod";

export const auditSchema = z.object({
  body: z.object({
    url: z
      .string()
      .min(1, "URL is required")
      .url("Invalid URL format")
      .refine(
        (val) => {
          try {
            const parsed = new URL(val);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
              return false;
            if (
              parsed.hostname === "localhost" ||
              parsed.hostname.startsWith("127.")
            )
              return false;
            return true;
          } catch {
            return false;
          }
        },
        {
          message:
            "Only public HTTP/HTTPS URLs are permitted. Localhost is forbidden.",
        },
      ),
  }),
});
