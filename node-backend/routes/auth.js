const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { validate } = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const config = require("../config/config");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

const signRefreshToken = (id) =>
  jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 8 }).withMessage("Password min 8 chars"),
    body("fullName").notEmpty().withMessage("Full name required"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { email, password, fullName, role } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return sendError(res, "Email already registered", 409);

      const user = await User.create({ email, password, fullName, role });
      const token = signToken(user._id);
      const refreshToken = signRefreshToken(user._id);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return sendCreated(res, {
        token,
        refreshToken,
        user: { _id: user._id, email: user.email, fullName: user.fullName, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password +refreshToken");
      if (!user || !(await user.matchPassword(password))) {
        return sendError(res, "Invalid email or password", 401);
      }
      if (!user.isActive) return sendError(res, "Account disabled", 403);

      const token = signToken(user._id);
      const refreshToken = signRefreshToken(user._id);
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      return sendSuccess(res, {
        token,
        refreshToken,
        user: { _id: user._id, email: user.email, fullName: user.fullName, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/refresh
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, "Refresh token required", 400);

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch {
      return sendError(res, "Invalid or expired refresh token", 401);
    }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, "Refresh token mismatch", 401);
    }

    const newToken = signToken(user._id);
    const newRefresh = signRefreshToken(user._id);
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, { token: newToken, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post("/logout", protect, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    return sendSuccess(res, {}, "Logged out successfully");
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  return sendSuccess(res, req.user);
});

// PATCH /api/auth/change-password
router.patch(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 8 }),
    validate,
  ],
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).select("+password");
      if (!(await user.matchPassword(req.body.currentPassword))) {
        return sendError(res, "Current password is incorrect", 400);
      }
      user.password = req.body.newPassword;
      await user.save();
      return sendSuccess(res, {}, "Password updated");
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
