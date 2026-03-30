import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import TrainingEvent from "../models/TrainingEvent";
import TrainingProgram from "../models/TrainingProgram";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

// ── Training Programs ──────────────────────────────────────────────────────────

router.get("/programs", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await paginate(TrainingProgram, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/programs",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const p = await TrainingProgram.create(req.body);
      return sendCreated(res, p);
    } catch (err) { next(err); }
  }
);

// ── Training Events ────────────────────────────────────────────────────────────

router.get("/events", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.program) filter.trainingProgram = req.query.program;
    const result = await paginate(TrainingEvent, filter, req.query, "trainingProgram attendees.employee");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/events/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const e = await TrainingEvent.findById(req.params.id)
      .populate("attendees.employee", "firstName lastName employeeId")
      .populate("trainingProgram", "name");
    if (!e) return sendError(res, "Training event not found", 404);
    return sendSuccess(res, e);
  } catch (err) { next(err); }
});

router.post(
  "/events",
  authorize("System Manager", "HR Manager", "HR User"),
  [body("eventName").notEmpty(), body("startTime").isISO8601(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const e = await TrainingEvent.create(req.body);
      return sendCreated(res, e);
    } catch (err) { next(err); }
  }
);

router.put("/events/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const e = await TrainingEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!e) return sendError(res, "Training event not found", 404);
    return sendSuccess(res, e);
  } catch (err) { next(err); }
});

router.patch(
  "/events/:id/mark-attendance",
  authorize("System Manager", "HR Manager"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { attendances } = req.body as {
        attendances: Array<{ employee: string; attendanceStatus: string }>;
      };
      const e = await TrainingEvent.findById(req.params.id);
      if (!e) return sendError(res, "Training event not found", 404);
      for (const entry of attendances) {
        const att = e.attendees?.find((a) => String(a.employee) === entry.employee);
        if (att) att.attendanceStatus = entry.attendanceStatus;
      }
      await e.save();
      return sendSuccess(res, e, "Attendance updated");
    } catch (err) { next(err); }
  }
);

export default router;
