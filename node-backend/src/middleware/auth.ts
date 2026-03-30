import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";
import User from "../models/User";
import config from "../config/config";

export interface AuthRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Not authorised, token missing", 401);
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    req.user = await User.findById(decoded.id).select("-password -refreshToken") as InstanceType<typeof User>;
    if (!req.user) { sendError(res, "User not found", 401); return; }
    if (!req.user.isActive) { sendError(res, "Account is disabled", 403); return; }
    next();
  } catch {
    sendError(res, "Not authorised, invalid token", 401);
  }
};

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, `Role '${req.user?.role}' is not allowed to access this resource`, 403);
      return;
    }
    next();
  };
