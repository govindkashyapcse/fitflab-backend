import { Router } from "express";
import {
  getAllCoaches,
  approveCoach,
  revokeCoach,
  getAllUsers,
  deleteUser,
} from "../controllers/admin.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// All admin routes — must be logged in as admin
router.use(protect, requireRole("admin"));

router.get("/coaches", getAllCoaches);                   // ?status=pending|approved
router.patch("/coaches/:coachId/approve", approveCoach);
router.patch("/coaches/:coachId/revoke", revokeCoach);
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

export default router;
