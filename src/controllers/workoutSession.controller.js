import { WorkoutSession } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createWorkoutSession = async (req, res) => {
  try {
    const { name, thumbnail, workouts, intensity } = req.body;

    const session = await WorkoutSession.create({
      name,
      thumbnail,
      workouts,
      intensity,
      createdBy: req.user._id,
    });

    return successResponse(res, session, "Workout session created.", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllWorkoutSessions = async (req, res) => {
  try {
    const sessions = await WorkoutSession.find()
      .populate("workouts")
      .populate("createdBy", "name email");
    return successResponse(res, sessions);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getWorkoutSession = async (req, res) => {
  try {
    const session = await WorkoutSession.findById(req.params.id)
      .populate("workouts")
      .populate("createdBy", "name email");
    if (!session) return errorResponse(res, "Session not found.", 404);
    return successResponse(res, session);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateWorkoutSession = async (req, res) => {
  try {
    const session = await WorkoutSession.findById(req.params.id);
    if (!session) return errorResponse(res, "Session not found.", 404);

    if (
      req.user.role !== "admin" &&
      session.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized.", 403);
    }

    const updated = await WorkoutSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("workouts");

    return successResponse(res, updated, "Session updated.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteWorkoutSession = async (req, res) => {
  try {
    const session = await WorkoutSession.findById(req.params.id);
    if (!session) return errorResponse(res, "Session not found.", 404);

    if (
      req.user.role !== "admin" &&
      session.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized.", 403);
    }

    await session.deleteOne();
    return successResponse(res, null, "Session deleted.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
