import { Router } from "express";
import {
  logFood,
  getMyFoodLogs,
  deleteFoodLog,
} from "../controllers/foodLog.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect, requireRole("athlete"));

router.post("/", logFood);
router.get("/", getMyFoodLogs);        // ?startDate=&endDate=
router.delete("/:id", deleteFoodLog);

export default router;
