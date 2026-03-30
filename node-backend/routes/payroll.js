const express = require("express");
const { body } = require("express-validator");
const PayrollEntry = require("../models/PayrollEntry");
const SalarySlip = require("../models/SalarySlip");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

// GET /api/payroll
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(PayrollEntry, filter, req.query, "department designation");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

// GET /api/payroll/:id
router.get("/:id", async (req, res, next) => {
  try {
    const entry = await PayrollEntry.findById(req.params.id)
      .populate("department", "name")
      .populate("employees.employee", "firstName lastName employeeId");
    if (!entry) return sendError(res, "Payroll entry not found", 404);
    return sendSuccess(res, entry);
  } catch (err) { next(err); }
});

// POST /api/payroll
router.post(
  "/",
  authorize("System Manager", "Payroll Manager", "HR Manager"),
  [
    body("company").notEmpty(),
    body("startDate").isISO8601(),
    body("endDate").isISO8601(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const entry = await PayrollEntry.create(req.body);
      return sendCreated(res, entry);
    } catch (err) { next(err); }
  }
);

// PATCH /api/payroll/:id/submit
router.patch("/:id/submit", authorize("System Manager", "Payroll Manager"), async (req, res, next) => {
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

// PATCH /api/payroll/:id/cancel
router.patch("/:id/cancel", authorize("System Manager", "Payroll Manager"), async (req, res, next) => {
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

// GET /api/payroll/:id/slips
router.get("/:id/slips", async (req, res, next) => {
  try {
    const slips = await SalarySlip.find({ payrollEntry: req.params.id })
      .populate("employee", "firstName lastName employeeId");
    return sendSuccess(res, slips);
  } catch (err) { next(err); }
});

module.exports = router;
