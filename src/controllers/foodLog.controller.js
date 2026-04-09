import { FoodLog, Food, NutritionGoal } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ─── Log food intake ─── */
export const logFood = async (req, res) => {
  try {
    const { foodId, quantity = 1, date } = req.body;

    const food = await Food.findById(foodId);
    if (!food) return errorResponse(res, "Food not found.", 404);

    const calories = food.calories * quantity;

    const log = await FoodLog.create({
      food: foodId,
      user: req.user._id,
      quantity,
      calories,
      date: date || new Date(),
    });

    return successResponse(res, { log }, "Food logged.", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Get my food logs with nutrition summary ─── */
export const getMyFoodLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const logs = await FoodLog.find(filter)
      .populate("food")
      .sort({ date: -1 });

    // Aggregate totals
    const totals = logs.reduce(
      (acc, log) => {
        acc.calories += log.calories || 0;
        if (log.food) {
          acc.protein += (log.food.nutrients.protein || 0) * (log.quantity || 1);
          acc.carbs += (log.food.nutrients.carbs || 0) * (log.quantity || 1);
          acc.fats += (log.food.nutrients.fats || 0) * (log.quantity || 1);
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    // Compare against goal if set
    const goal = await NutritionGoal.findOne({ user: req.user._id });

    return successResponse(res, { logs, totals, goal });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Delete a food log ─── */
export const deleteFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findOne({
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
