import { Workout } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ─── Create workout (coach) ─── */
export const createWorkout = async (req, res) => {
  try {
    const { name, thumbnail, videoUrl, reps, sets, caloriesBurn } = req.body;

    const workout = await Workout.create({
      name,
      thumbnail,
      videoUrl,
      reps,
      sets,
      caloriesBurn,
      createdBy: req.user._id,
    });

    return successResponse(res, workout, "Workout created.", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Get all workouts (public) ─── */
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().populate("createdBy", "name email");
    return successResponse(res,  workouts );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Get single workout ─── */
export const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!workout) return errorResponse(res, "Workout not found.", 404);
    return successResponse(res, workout);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Update workout (coach - own only) ─── */
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return errorResponse(res, "Workout not found.", 404);

    // Only the coach who created it (or admin) can update
    if (
      req.user.role !== "admin" &&
      workout.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized to update this workout.", 403);
    }

    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return successResponse(res, updated, "Workout updated.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Delete workout (coach - own only or admin) ─── */
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return errorResponse(res, "Workout not found.", 404);

    if (
      req.user.role !== "admin" &&
      workout.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized to delete this workout.", 403);
    }

    await workout.deleteOne();
    return successResponse(res, null, "Workout deleted.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
