import { Router } from "express";
import {
  createWorkoutSession,
  getAllWorkoutSessions,
  getWorkoutSession,
  updateWorkoutSession,
  deleteWorkoutSession,
} from "../controllers/workoutSession.controller.js";
import {
  protect,
  requireRole,
  requireApprovedCoach,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllWorkoutSessions);
router.get("/:id", getWorkoutSession);

router.post(
  "/",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  createWorkoutSession
);
router.patch(
  "/:id",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  updateWorkoutSession
);
router.delete(
  "/:id",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  deleteWorkoutSession
);

export default router;
