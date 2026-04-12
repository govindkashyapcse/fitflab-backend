import { User, AthleteProfile } from "../models/index.js";
import { generateToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ─── Register Athlete ─── */
export const registerAthlete = async (req, res) => {
  try {
    const { email, password, name, gender, dob, weight, height } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email already registered.", 409);
    }

    const user = await User.create({
      email,
      password,
      name,
      gender,
      role: "athlete",
      isApproved: true,
    });

    // Create athlete profile
    await AthleteProfile.create({ user: user._id, dob, weight, height });

    const token = generateToken(user._id);
    const athleteData = {
      token: token,
      _id: user._id,
      email: user.email,
      name: user.name
    }

    return successResponse(
      res,
      athleteData,
      "Athlete registered successfully.",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Register Coach ─── */
export const registerCoach = async (req, res) => {
  try {
    const { email, password, name, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email already registered.", 409);
    }

    const user = await User.create({
      email,
      password,
      name,
      gender,
      role: "coach",
      isApproved: false, // Awaits admin approval
    });

    return successResponse(
      res,
      user,
      "Coach account created. Awaiting admin approval before you can log in.",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Login (Athlete + Coach) ─── */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "Invalid credentials.", 401);
    }

    // Admins do not log in through this endpoint
    if (user.role === "admin") {
      return errorResponse(res, "Please use the admin login endpoint.", 403);
    }

    const isPasswordCorrect = await user.comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return errorResponse(res, "Invalid credentials.", 401);
    }

    // Block unapproved coaches
    if (user.role === "coach" && !user.isApproved) {
      return errorResponse(
        res,
        "Your coach account is pending admin approval.",
        403
      );
    }

    const token = generateToken(user._id);
    const userData = {
      token: token,
      _id: user._id,
      email: user.email,
      name: user.name
    }

    return successResponse(
      res,
      userData,
      "Login successful."
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Admin Login ─── */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required.");
    }

    const user = await User.findOne({ email, role: "admin" }).select("+password");
    if (!user) {
      return errorResponse(res, "Invalid credentials.", 401);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return errorResponse(res, "Invalid credentials.", 401);
    }

    const token = generateToken(user._id);
    const adminData = {
      token: token,
      _id: user._id,
      email: user.email,
      name: user.name
    }

    return successResponse(
      res,
      adminData,
      "Admin login successful."
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ─── Get Current User (me) ─── */
export const getMe = async (req, res) => {
  try {
    return successResponse(res, req.user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};


