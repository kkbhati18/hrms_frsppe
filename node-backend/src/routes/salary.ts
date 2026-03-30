import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import SalaryComponent from "../models/SalaryComponent";
import SalaryStructure from "../models/SalaryStructure";
import SalaryStructureAssignment from "../models/SalaryStructureAssignment";
import SalarySlip from "../models/SalarySlip";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

// ── Salary Components ──────────────────────────────────────────────────────────

router.get("/components", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;
    const result = await paginate(SalaryComponent, filter, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/components",
  authorize("System Manager", "HR Manager", "Payroll Manager"),
  [body("name").notEmpty(), body("abbr").notEmpty(), body("type").isIn(["Earning", "Deduction"]), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sc = await SalaryComponent.create(req.body);
      return sendCreated(res, sc);
    } catch (err) { next(err); }
  }
);

router.put("/components/:id", authorize("System Manager", "HR Manager", "Payroll Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sc = await SalaryComponent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sc) return sendError(res, "Salary component not found", 404);
    return sendSuccess(res, sc);
  } catch (err) { next(err); }
});

// ── Salary Structures ──────────────────────────────────────────────────────────

router.get("/structures", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await paginate(SalaryStructure, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/structures/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ss = await SalaryStructure.findById(req.params.id).populate(
      "earnings.salaryComponent deductions.salaryComponent"
    );
    if (!ss) return sendError(res, "Salary structure not found", 404);
    return sendSuccess(res, ss);
  } catch (err) { next(err); }
});

router.post(
  "/structures",
  authorize("System Manager", "HR Manager", "Payroll Manager"),
  [body("name").notEmpty(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const ss = await SalaryStructure.create(req.body);
      return sendCreated(res, ss);
    } catch (err) { next(err); }
  }
);

router.put("/structures/:id", authorize("System Manager", "Payroll Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ss = await SalaryStructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ss) return sendError(res, "Salary structure not found", 404);
    return sendSuccess(res, ss);
  } catch (err) { next(err); }
});

// ── Salary Structure Assignments ───────────────────────────────────────────────

router.get("/assignments", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    const result = await paginate(SalaryStructureAssignment, filter, req.query, "employee salaryStructure");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/assignments",
  authorize("System Manager", "HR Manager", "Payroll Manager"),
  [
    body("employee").notEmpty(),
    body("salaryStructure").notEmpty(),
    body("fromDate").isISO8601(),
    body("base").isNumeric(),
    validate,
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sa = await SalaryStructureAssignment.create(req.body);
      return sendCreated(res, sa);
    } catch (err) { next(err); }
  }
);

// ── Salary Slips ───────────────────────────────────────────────────────────────

router.get("/slips", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from) filter.startDate = { $gte: new Date(req.query.from as string) };
    if (req.query.to) filter.endDate = { $lte: new Date(req.query.to as string) };
    const result = await paginate(
      SalarySlip,
      filter,
      req.query,
      "employee department designation salaryStructure"
    );
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/slips/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slip = await SalarySlip.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId bankAccountNo")
      .populate("earnings.salaryComponent deductions.salaryComponent");
    if (!slip) return sendError(res, "Salary slip not found", 404);
    return sendSuccess(res, slip);
  } catch (err) { next(err); }
});

router.post(
  "/slips",
  authorize("System Manager", "Payroll Manager", "HR Manager"),
  [body("employee").notEmpty(), body("startDate").isISO8601(), body("endDate").isISO8601(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const slip = await SalarySlip.create(req.body);
      return sendCreated(res, slip);
    } catch (err) { next(err); }
  }
);

router.patch("/slips/:id/submit", authorize("System Manager", "Payroll Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slip = await SalarySlip.findByIdAndUpdate(
      req.params.id,
      { status: "Submitted", docStatus: 1 },
      { new: true }
    );
    if (!slip) return sendError(res, "Salary slip not found", 404);
    return sendSuccess(res, slip, "Salary slip submitted");
  } catch (err) { next(err); }
});

router.patch("/slips/:id/cancel", authorize("System Manager", "Payroll Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slip = await SalarySlip.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled", docStatus: 2 },
      { new: true }
    );
    if (!slip) return sendError(res, "Salary slip not found", 404);
    return sendSuccess(res, slip, "Salary slip cancelled");
  } catch (err) { next(err); }
});

export default router;
