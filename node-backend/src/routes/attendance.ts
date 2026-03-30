import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import Attendance from "../models/Attendance";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from || req.query.to) {
      const dateFilter: Record<string, Date> = {};
      if (req.query.from) dateFilter.$gte = new Date(req.query.from as string);
      if (req.query.to) dateFilter.$lte = new Date(req.query.to as string);
      filter.attendanceDate = dateFilter;
    }
    const result = await paginate(Attendance, filter, req.query, "employee shift leaveType");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const att = await Attendance.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId")
      .populate("shift", "name startTime endTime");
    if (!att) return sendError(res, "Attendance not found", 404);
    return sendSuccess(res, att);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "HR Manager", "HR User"),
  [
    body("employee").notEmpty(),
    body("attendanceDate").isISO8601(),
    body("status").isIn(["Present", "Absent", "On Leave", "Half Day", "Work From Home"]),
    validate,
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const att = await Attendance.create(req.body);
      return sendCreated(res, att);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager", "HR User"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!att) return sendError(res, "Attendance not found", 404);
    return sendSuccess(res, att);
  } catch (err) { next(err); }
});

router.delete("/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Attendance deleted");
  } catch (err) { next(err); }
});

export default router;
