import { WorkoutLog, Workout } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ─── Log a workout (athlete) ─── */
export const logWorkout = async (req, res) => {
  try {
    const { workoutId, date } = req.body;

    const workout = await Workout.findById(workoutId);
    if (!workout) return errorResponse(res, "Workout not found.", 404);

    const log = await WorkoutLog.create({
      workout: workoutId,
      user: req.user._id,
      caloriesBurn: workout.caloriesBurn,
      date: date || new Date(),
    });

    return successResponse(res, log, "Workout logged.", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Get my workout logs ─── */
export const getMyWorkoutLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const logs = await WorkoutLog.find(filter)
      .populate("workout")
      .sort({ date: -1 });

    // Aggregate total calories burned
    const totalCaloriesBurned = logs.reduce(
      (sum, l) => sum + (l.caloriesBurn || 0),
      0
    );

    return successResponse(res, { logs, totalCaloriesBurned });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Delete a workout log ─── */
export const deleteWorkoutLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!log) return errorResponse(res, "Log not found.", 404);

    await log.deleteOne();
    return successResponse(res, null, "Log deleted.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
