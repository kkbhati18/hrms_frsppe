import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import PayrollEntry from "../models/PayrollEntry";
import SalarySlip from "../models/SalarySlip";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(PayrollEntry, filter, req.query, "department designation");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const entry = await PayrollEntry.findById(req.params.id)
      .populate("department", "name")
      .populate("employees.employee", "firstName lastName employeeId");
    if (!entry) return sendError(res, "Payroll entry not found", 404);
    return sendSuccess(res, entry);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "Payroll Manager", "HR Manager"),
  [
    body("company").notEmpty(),
    body("startDate").isISO8601(),
    body("endDate").isISO8601(),
    validate,
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const entry = await PayrollEntry.create(req.body);
      return sendCreated(res, entry);
    } catch (err) { next(err); }
  }
);

router.patch("/:id/submit", authorize("System Manager", "Payroll Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const entry = await PayrollEntry.findByIdAndUpdate(
      req.params.id,
      { status: "Submitted", docStatus: 1 },
      { new: true }
    );
    if (!entry) return sendError(res, "Payroll entry not found", 404);
    return sendSuccess(res, entry, "Payroll entry submitted");
  } catch (err) { next(err); }
});

router.patch("/:id/cancel", authorize("System Manager", "Payroll Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const entry = await PayrollEntry.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled", docStatus: 2 },
      { new: true }
    );
    if (!entry) return sendError(res, "Payroll entry not found", 404);
    return sendSuccess(res, entry, "Payroll entry cancelled");
  } catch (err) { next(err); }
});

router.get("/:id/slips", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slips = await SalarySlip.find({ payrollEntry: req.params.id })
      .populate("employee", "firstName lastName employeeId");
    return sendSuccess(res, slips);
  } catch (err) { next(err); }
});

export default router;
