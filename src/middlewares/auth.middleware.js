import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/index.js";
import { errorResponse } from "../utils/response.js";

// Verify JWT and attach user to request
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Not authorized. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, "User no longer exists.", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token.", 401);
  }
};

// Restrict access to specific roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required role: ${roles.join(" or ")}.`,
        403
      );
    }
    next();
  };
};

// Coach must be approved by admin to use coach features
export const requireApprovedCoach = (req, res, next) => {
  if (req.user.role === "coach" && !req.user.isApproved) {
    return errorResponse(
      res,
      "Your coach account is pending admin approval.",
      403
    );
  }
  next();
};
