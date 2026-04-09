import { Router } from "express";
import {
  getPresignedUrl,
  deleteS3Object,
} from "../controllers/upload.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

// Any authenticated user can request a presigned URL
router.post("/presigned-url", getPresignedUrl);

// Only admin can delete arbitrary S3 objects via API
// (individual resource deletions are handled inside their own controllers)
router.delete("/", requireRole("admin"), deleteS3Object);

export default router;
