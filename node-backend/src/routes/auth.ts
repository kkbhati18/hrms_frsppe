import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { validate } from "../middleware/validate";
import { protect, AuthRequest } from "../middleware/auth";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import config from "../config/config";

const router = Router();

const signToken = (id: unknown): string =>
  jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as object);

const signRefreshToken = (id: unknown): string =>
  jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn } as object);

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 8 }).withMessage("Password min 8 chars"),
    body("fullName").notEmpty().withMessage("Full name required"),
    validate,
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, fullName, role } = req.body as {
        email: string;
        password: string;
        fullName: string;
        role?: string;
      };
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
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
router.post("/refresh", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) return sendError(res, "Refresh token required", 400);

    let decoded: { id: string };
    try {
      decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: string };
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
router.post("/logout", protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndUpdate(req.user!._id, { refreshToken: null });
    return sendSuccess(res, {}, "Logged out successfully");
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", protect, (req: AuthRequest, res) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user!._id).select("+password");
      if (!user) return sendError(res, "User not found", 404);
      if (!(await user.matchPassword((req.body as { currentPassword: string }).currentPassword))) {
        return sendError(res, "Current password is incorrect", 400);
      }
      user.password = (req.body as { newPassword: string }).newPassword;
      await user.save();
      return sendSuccess(res, {}, "Password updated");
    } catch (err) {
      next(err);
    }
  }
);

export default router;
