import { User } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ─── Get all coaches (pending + approved) ─── */
export const getAllCoaches = async (req, res) => {
  try {
    const { status } = req.query; // ?status=pending | approved | all
    const filter = { role: "coach" };

    if (status === "pending") filter.isApproved = false;
    else if (status === "approved") filter.isApproved = true;

    const coaches = await User.find(filter).select("-password");
    return successResponse(res, { coaches });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Approve a coach ─── */
export const approveCoach = async (req, res) => {
  try {
    const { coachId } = req.params;

    const coach = await User.findOneAndUpdate(
      { _id: coachId, role: "coach" },
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!coach) {
      return errorResponse(res, "Coach not found.", 404);
    }

    return successResponse(res, { coach }, "Coach approved successfully.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Revoke coach approval ─── */
export const revokeCoach = async (req, res) => {
  try {
    const { coachId } = req.params;

    const coach = await User.findOneAndUpdate(
      { _id: coachId, role: "coach" },
      { isApproved: false },
      { new: true }
    ).select("-password");

    if (!coach) {
      return errorResponse(res, "Coach not found.", 404);
    }

    return successResponse(res, { coach }, "Coach approval revoked.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Get all users (athletes) ─── */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "athlete" }).select("-password");
    return successResponse(res, { users });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Delete user ─── */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return errorResponse(res, "User not found.", 404);
    }

    return successResponse(res, null, "User deleted successfully.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
