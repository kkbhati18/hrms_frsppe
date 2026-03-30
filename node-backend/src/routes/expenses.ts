import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import ExpenseClaim from "../models/ExpenseClaim";
import ExpenseClaimType from "../models/ExpenseClaimType";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";
import upload from "../utils/upload";

const router = Router();
router.use(protect);

// ── Expense Claim Types ────────────────────────────────────────────────────────

router.get("/types", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await paginate(ExpenseClaimType, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/types",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = await ExpenseClaimType.create(req.body);
      return sendCreated(res, t);
    } catch (err) { next(err); }
  }
);

// ── Expense Claims ─────────────────────────────────────────────────────────────

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(ExpenseClaim, filter, req.query, "employee approver");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ec = await ExpenseClaim.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId")
      .populate("expenses.expenseType", "name");
    if (!ec) return sendError(res, "Expense claim not found", 404);
    return sendSuccess(res, ec);
  } catch (err) { next(err); }
});

router.post(
  "/",
  [body("employee").notEmpty(), body("expenses").isArray({ min: 1 }), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const expenses = (req.body.expenses || []) as Array<{ claimAmount?: number }>;
      const claimed = expenses.reduce((s, e) => s + (e.claimAmount || 0), 0);
      const ec = await ExpenseClaim.create({ ...req.body, totalClaimedAmount: claimed });
      return sendCreated(res, ec);
    } catch (err) { next(err); }
  }
);

router.put("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ec = await ExpenseClaim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ec) return sendError(res, "Expense claim not found", 404);
    return sendSuccess(res, ec);
  } catch (err) { next(err); }
});

router.patch(
  "/:id/approve",
  authorize("System Manager", "HR Manager", "Expense Approver"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const ec = await ExpenseClaim.findByIdAndUpdate(
        req.params.id,
        {
          status: "Approved",
          approvalStatus: "Approved",
          totalSanctionedAmount: (req.body as { totalSanctionedAmount?: number }).totalSanctionedAmount,
        },
        { new: true }
      );
      if (!ec) return sendError(res, "Expense claim not found", 404);
      return sendSuccess(res, ec, "Expense claim approved");
    } catch (err) { next(err); }
  }
);

router.patch(
  "/:id/reject",
  authorize("System Manager", "HR Manager", "Expense Approver"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const ec = await ExpenseClaim.findByIdAndUpdate(
        req.params.id,
        {
          status: "Rejected",
          approvalStatus: "Rejected",
          rejectionReason: (req.body as { rejectionReason?: string }).rejectionReason,
        },
        { new: true }
      );
      if (!ec) return sendError(res, "Expense claim not found", 404);
      return sendSuccess(res, ec, "Expense claim rejected");
    } catch (err) { next(err); }
  }
);

router.post("/:id/attachment", upload.single("file"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return sendError(res, "No file uploaded", 400);
    return sendSuccess(res, { filename: req.file.filename }, "File uploaded");
  } catch (err) { next(err); }
});

export default router;
