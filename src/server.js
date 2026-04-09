import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import workoutSessionRoutes from "./routes/workoutSession.routes.js";
import workoutLogRoutes from "./routes/workoutLog.routes.js";
import nutritionRoutes from "./routes/nutrition.routes.js";
import foodLogRoutes from "./routes/foodLog.routes.js";
import awarenessRoutes from "./routes/awareness.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/workout-sessions", workoutSessionRoutes);
app.use("/api/workout-logs", workoutLogRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/food-logs", foodLogRoutes);
app.use("/api/awareness", awarenessRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FitFlab API running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app
