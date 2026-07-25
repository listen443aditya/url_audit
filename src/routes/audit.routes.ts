// src/routes/audit.routes.ts
import { Router } from "express";
import { auditController } from "../controllers/audit.controller";
import { validate } from "../middleware/validation";
import { auditSchema } from "../validators/audit.validator";

const router = Router();

router.post("/", validate(auditSchema), auditController);

export default router;
