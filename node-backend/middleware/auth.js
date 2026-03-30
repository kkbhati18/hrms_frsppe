const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/apiResponse");
const User = require("../models/User");
const config = require("../config/config");

/**
 * Verify JWT and attach req.user.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Not authorised, token missing", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!req.user) return sendError(res, "User not found", 401);
    if (!req.user.isActive) return sendError(res, "Account is disabled", 403);
    next();
  } catch {
    return sendError(res, "Not authorised, invalid token", 401);
  }
};

/**
 * Role-based access control.
 * Usage: authorize("HR Manager", "System Manager")
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendError(res, `Role '${req.user.role}' is not allowed to access this resource`, 403);
  }
  next();
};

module.exports = { protect, authorize };
