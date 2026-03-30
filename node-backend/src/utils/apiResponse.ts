import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: unknown = {},
  message = "Success",
  statusCode = 200
): Response =>
  res.status(statusCode).json({ success: true, message, data });

export const sendCreated = (res: Response, data: unknown = {}, message = "Created successfully"): Response =>
  sendSuccess(res, data, message, 201);

export const sendError = (
  res: Response,
  message = "Error",
  statusCode = 400,
  errors: unknown = null
): Response => {
  const payload: Record<string, unknown> = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};
