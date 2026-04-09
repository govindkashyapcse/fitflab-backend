import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workout.controller.js";
import {
  protect,
  requireRole,
  requireApprovedCoach,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Public — any authenticated user can browse
router.get("/", getAllWorkouts);
router.get("/:id", getWorkout);

// Coach / Admin only — write operations
router.post(
  "/",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  createWorkout
);
router.patch(
  "/:id",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  updateWorkout
);
router.delete(
  "/:id",
  protect,
  requireRole("coach", "admin"),
  requireApprovedCoach,
  deleteWorkout
);

export default router;
