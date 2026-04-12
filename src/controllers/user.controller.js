import { User, AthleteProfile } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ─── Get athlete profile ─── */
export const getAthleteProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const profile = await AthleteProfile.findOne({ user: userId }).populate(
      "user",
      "-password"
    );

    if (!profile) {
      return errorResponse(res, "Profile not found.", 404);
    }

    return successResponse(res, profile);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Update athlete profile ─── */
export const updateAthleteProfile = async (req, res) => {
  try {
    const { dob, weight, height } = req.body;

    const profile = await AthleteProfile.findOneAndUpdate(
      { user: req.user._id },
      { dob, weight, height },
      { new: true, upsert: true }
    );

    return successResponse(res, profile, "Profile updated.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Update user basic info ─── */
export const updateUserInfo = async (req, res) => {
  try {
    const { name, gender } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, gender },
      { new: true }
    )

    return successResponse(res, user, "User info updated.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Change password ─── */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return errorResponse(res, "Current password is incorrect.", 401);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, null, "Password changed successfully.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
