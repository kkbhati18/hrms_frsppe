import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import LeaveType from "../models/LeaveType";
import LeaveAllocation from "../models/LeaveAllocation";
import LeaveApplication from "../models/LeaveApplication";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

// ── Leave Types ────────────────────────────────────────────────────────────────

router.get("/types", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await paginate(LeaveType, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/types",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lt = await LeaveType.create(req.body);
      return sendCreated(res, lt);
    } catch (err) { next(err); }
  }
);

router.put("/types/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lt = await LeaveType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lt) return sendError(res, "Leave type not found", 404);
    return sendSuccess(res, lt);
  } catch (err) { next(err); }
});

router.delete("/types/:id", authorize("System Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await LeaveType.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Leave type deleted");
  } catch (err) { next(err); }
});

// ── Leave Allocations ──────────────────────────────────────────────────────────

router.get("/allocations", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.leaveType) filter.leaveType = req.query.leaveType;
    const result = await paginate(LeaveAllocation, filter, req.query, "employee leaveType");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/allocations",
  authorize("System Manager", "HR Manager", "HR User"),
  [
    body("employee").notEmpty(),
    body("leaveType").notEmpty(),
    body("fromDate").isISO8601(),
    body("toDate").isISO8601(),
    body("newLeaves").isNumeric(),
    validate,
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const alloc = await LeaveAllocation.create(req.body);
      return sendCreated(res, alloc);
    } catch (err) { next(err); }
  }
);

router.put("/allocations/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const alloc = await LeaveAllocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alloc) return sendError(res, "Allocation not found", 404);
    return sendSuccess(res, alloc);
  } catch (err) { next(err); }
});

// ── Leave Applications ─────────────────────────────────────────────────────────

router.get("/applications", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.leaveType) filter.leaveType = req.query.leaveType;
    const result = await paginate(LeaveApplication, filter, req.query, "employee leaveType leaveApprover");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/applications/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const app = await LeaveApplication.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId")
      .populate("leaveType", "name")
      .populate("leaveApprover", "firstName lastName");
    if (!app) return sendError(res, "Leave application not found", 404);
    return sendSuccess(res, app);
  } catch (err) { next(err); }
});

router.post(
  "/applications",
  [
    body("employee").notEmpty(),
    body("leaveType").notEmpty(),
    body("fromDate").isISO8601(),
    body("toDate").isISO8601(),
    validate,
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const app = await LeaveApplication.create({ ...req.body, postedBy: req.user!._id });
      return sendCreated(res, app);
    } catch (err) { next(err); }
  }
);

router.patch(
  "/applications/:id/approve",
  authorize("System Manager", "HR Manager", "Leave Approver"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const app = await LeaveApplication.findByIdAndUpdate(
        req.params.id,
        { status: "Approved", approvedBy: req.user!._id, approvedAt: new Date() },
        { new: true }
      );
      if (!app) return sendError(res, "Leave application not found", 404);
      return sendSuccess(res, app, "Leave application approved");
    } catch (err) { next(err); }
  }
);

router.patch(
  "/applications/:id/reject",
  authorize("System Manager", "HR Manager", "Leave Approver"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const app = await LeaveApplication.findByIdAndUpdate(
        req.params.id,
        { status: "Rejected", rejectionReason: (req.body as { rejectionReason?: string }).rejectionReason },
        { new: true }
      );
      if (!app) return sendError(res, "Leave application not found", 404);
      return sendSuccess(res, app, "Leave application rejected");
    } catch (err) { next(err); }
  }
);

router.patch("/applications/:id/cancel", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const app = await LeaveApplication.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ["Open", "Approved"] } },
      { status: "Cancelled" },
      { new: true }
    );
    if (!app) return sendError(res, "Leave application not found or cannot be cancelled", 404);
    return sendSuccess(res, app, "Leave application cancelled");
  } catch (err) { next(err); }
});

export default router;
