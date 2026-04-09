import { Food, NutritionGoal } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ════════════════════════
   FOOD
════════════════════════ */

export const createFood = async (req, res) => {
  try {
    const { name, thumbnail, servingSize, nutrients, calories } = req.body;

    const food = await Food.create({
      name,
      thumbnail,
      servingSize,
      nutrients,
      calories,
      createdBy: req.user._id,
    });

    return successResponse(res, { food }, "Food created.", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllFoods = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const foods = await Food.find(filter).populate("createdBy", "name");
    return successResponse(res, { foods });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return errorResponse(res, "Food not found.", 404);
    return successResponse(res, { food });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return errorResponse(res, "Food not found.", 404);

    if (
      req.user.role !== "admin" &&
      food.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized.", 403);
    }

    const updated = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return successResponse(res, { food: updated }, "Food updated.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return errorResponse(res, "Food not found.", 404);

    if (
      req.user.role !== "admin" &&
      food.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized.", 403);
    }

    await food.deleteOne();
    return successResponse(res, null, "Food deleted.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ════════════════════════
   NUTRITION GOAL
════════════════════════ */

export const setNutritionGoal = async (req, res) => {
  try {
    const { caloriesTarget, nutrientsTarget } = req.body;

    const goal = await NutritionGoal.findOneAndUpdate(
      { user: req.user._id },
      { caloriesTarget, nutrientsTarget },
      { new: true, upsert: true }
    );

    return successResponse(res, { goal }, "Nutrition goal saved.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getNutritionGoal = async (req, res) => {
  try {
    const goal = await NutritionGoal.findOne({ user: req.user._id });
    if (!goal) return errorResponse(res, "No nutrition goal set.", 404);
    return successResponse(res, { goal });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
