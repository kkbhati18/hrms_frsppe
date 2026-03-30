import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import ShiftType from "../models/ShiftType";
import ShiftAssignment from "../models/ShiftAssignment";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

// ── Shift Types ────────────────────────────────────────────────────────────────

router.get("/types", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await paginate(ShiftType, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/types/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const s = await ShiftType.findById(req.params.id);
    if (!s) return sendError(res, "Shift type not found", 404);
    return sendSuccess(res, s);
  } catch (err) { next(err); }
});

router.post(
  "/types",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), body("startTime").notEmpty(), body("endTime").notEmpty(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const s = await ShiftType.create(req.body);
      return sendCreated(res, s);
    } catch (err) { next(err); }
  }
);

router.put("/types/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const s = await ShiftType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return sendError(res, "Shift type not found", 404);
    return sendSuccess(res, s);
  } catch (err) { next(err); }
});

// ── Shift Assignments ──────────────────────────────────────────────────────────

router.get("/assignments", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(ShiftAssignment, filter, req.query, "employee shiftType");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/assignments",
  authorize("System Manager", "HR Manager", "HR User"),
  [body("employee").notEmpty(), body("shiftType").notEmpty(), body("startDate").isISO8601(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sa = await ShiftAssignment.create(req.body);
      return sendCreated(res, sa);
    } catch (err) { next(err); }
  }
);

router.put("/assignments/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sa = await ShiftAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sa) return sendError(res, "Assignment not found", 404);
    return sendSuccess(res, sa);
  } catch (err) { next(err); }
});

router.delete(
  "/assignments/:id",
  authorize("System Manager", "HR Manager"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await ShiftAssignment.findByIdAndDelete(req.params.id);
      return sendSuccess(res, {}, "Assignment deleted");
    } catch (err) { next(err); }
  }
);

export default router;
