import { Router } from "express";
import {
  registerAthlete,
  registerCoach,
  login,
  adminLogin,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.post("/register/athlete", registerAthlete);
router.post("/register/coach", registerCoach);
router.post("/login", login);
router.post("/admin/login", adminLogin);

// Protected
router.get("/me", protect, getMe);

export default router;
