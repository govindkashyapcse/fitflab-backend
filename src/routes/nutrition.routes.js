import { Router } from "express";
import {
  createFood,
  getAllFoods,
  getFood,
  updateFood,
  deleteFood,
  setNutritionGoal,
  getNutritionGoal,
} from "../controllers/nutrition.controller.js";
import {
  protect,
  requireRole,
  requireApprovedCoach,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

// Food — browseable by all authenticated users
router.get("/foods", getAllFoods);          // ?search=chicken
router.get("/foods/:id", getFood);

// Food — write by coach/admin only
router.post(
  "/foods",
  requireRole("coach", "admin"),
  requireApprovedCoach,
  createFood
);
router.patch(
  "/foods/:id",
  requireRole("coach", "admin"),
  requireApprovedCoach,
  updateFood
);
router.delete(
  "/foods/:id",
  requireRole("coach", "admin"),
  requireApprovedCoach,
  deleteFood
);

// Nutrition goal — athlete only
router.get("/goal", requireRole("athlete"), getNutritionGoal);
router.post("/goal", requireRole("athlete"), setNutritionGoal);

export default router;
