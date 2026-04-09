import { Router } from "express";
import {
  logWorkout,
  getMyWorkoutLogs,
  deleteWorkoutLog,
} from "../controllers/workoutLog.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/", requireRole("athlete"), logWorkout);
router.get("/", requireRole("athlete"), getMyWorkoutLogs);   // ?startDate=&endDate=
router.delete("/:id", requireRole("athlete"), deleteWorkoutLog);

export default router;
