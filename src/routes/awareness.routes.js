import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/awareness.controller.js";
import {
  protect,
  requireRole,
  requireApprovedCoach,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Public read for all authenticated users
router.get("/", protect, getAllPosts);
router.get("/:id", protect, getPost);

// Write — coach/admin only
router.post(
  "/",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  createPost
);
router.patch(
  "/:id",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  updatePost
);
router.delete(
  "/:id",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  deletePost
);

export default router;
