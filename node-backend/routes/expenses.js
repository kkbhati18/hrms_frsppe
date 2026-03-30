const express = require("express");
const { body } = require("express-validator");
const ExpenseClaim = require("../models/ExpenseClaim");
const ExpenseClaimType = require("../models/ExpenseClaimType");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");
const upload = require("../utils/upload");

const router = express.Router();
router.use(protect);

// ── Expense Claim Types ──────────────────────────────────────────────────────

router.get("/types", async (req, res, next) => {
  try {
    const result = await paginate(ExpenseClaimType, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/types",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const t = await ExpenseClaimType.create(req.body);
      return sendCreated(res, t);
    } catch (err) { next(err); }
  }
);

// ── Expense Claims ───────────────────────────────────────────────────────────

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(ExpenseClaim, filter, req.query, "employee approver");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
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
  async (req, res, next) => {
    try {
      const claimed = (req.body.expenses || []).reduce((s, e) => s + (e.claimAmount || 0), 0);
      const ec = await ExpenseClaim.create({ ...req.body, totalClaimedAmount: claimed });
      return sendCreated(res, ec);
    } catch (err) { next(err); }
  }
);

router.put("/:id", async (req, res, next) => {
  try {
    const ec = await ExpenseClaim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ec) return sendError(res, "Expense claim not found", 404);
    return sendSuccess(res, ec);
  } catch (err) { next(err); }
});

router.patch(
  "/:id/approve",
  authorize("System Manager", "HR Manager", "Expense Approver"),
  async (req, res, next) => {
    try {
      const ec = await ExpenseClaim.findByIdAndUpdate(
        req.params.id,
        {
          status: "Approved",
          approvalStatus: "Approved",
          totalSanctionedAmount: req.body.totalSanctionedAmount,
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
  async (req, res, next) => {
    try {
      const ec = await ExpenseClaim.findByIdAndUpdate(
        req.params.id,
        { status: "Rejected", approvalStatus: "Rejected", rejectionReason: req.body.rejectionReason },
        { new: true }
      );
      if (!ec) return sendError(res, "Expense claim not found", 404);
      return sendSuccess(res, ec, "Expense claim rejected");
    } catch (err) { next(err); }
  }
);

// POST /api/expenses/:id/attachment
router.post("/:id/attachment", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "No file uploaded", 400);
    const ec = await ExpenseClaim.findById(req.params.id);
    if (!ec) return sendError(res, "Expense claim not found", 404);
    ec.expenses[0].attachments = ec.expenses[0].attachments || [];
    ec.expenses[0].attachments.push(req.file.filename);
    await ec.save();
    return sendSuccess(res, { filename: req.file.filename });
  } catch (err) { next(err); }
});

module.exports = router;
