import { Router } from "express";
import {
  getAthleteProfile,
  updateAthleteProfile,
  updateUserInfo,
  changePassword,
} from "../controllers/user.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(protect);

router.get("/profile", getAthleteProfile);                        // own profile
router.get("/profile/:userId", getAthleteProfile);                // view any profile
router.patch("/profile", requireRole("athlete"), updateAthleteProfile);
router.patch("/me", updateUserInfo);
router.patch("/change-password", changePassword);

export default router;
