const express = require("express");
const { body } = require("express-validator");
const LeaveType = require("../models/LeaveType");
const LeaveAllocation = require("../models/LeaveAllocation");
const LeaveApplication = require("../models/LeaveApplication");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

// ── Leave Types ────────────────────────────────────────────────────────────────

router.get("/types", async (req, res, next) => {
  try {
    const result = await paginate(LeaveType, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/types",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const lt = await LeaveType.create(req.body);
      return sendCreated(res, lt);
    } catch (err) { next(err); }
  }
);

router.put("/types/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const lt = await LeaveType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lt) return sendError(res, "Leave type not found", 404);
    return sendSuccess(res, lt);
  } catch (err) { next(err); }
});

router.delete("/types/:id", authorize("System Manager"), async (req, res, next) => {
  try {
    await LeaveType.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Leave type deleted");
  } catch (err) { next(err); }
});

// ── Leave Allocations ──────────────────────────────────────────────────────────

router.get("/allocations", async (req, res, next) => {
  try {
    const filter = {};
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
  async (req, res, next) => {
    try {
      const alloc = await LeaveAllocation.create(req.body);
      return sendCreated(res, alloc);
    } catch (err) { next(err); }
  }
);

router.put("/allocations/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const alloc = await LeaveAllocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alloc) return sendError(res, "Allocation not found", 404);
    return sendSuccess(res, alloc);
  } catch (err) { next(err); }
});

// ── Leave Applications ─────────────────────────────────────────────────────────

router.get("/applications", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.leaveType) filter.leaveType = req.query.leaveType;
    const result = await paginate(LeaveApplication, filter, req.query, "employee leaveType leaveApprover");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/applications/:id", async (req, res, next) => {
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
  async (req, res, next) => {
    try {
      const app = await LeaveApplication.create({ ...req.body, postedBy: req.user._id });
      return sendCreated(res, app);
    } catch (err) { next(err); }
  }
);

router.patch("/applications/:id/approve", authorize("System Manager", "HR Manager", "Leave Approver"), async (req, res, next) => {
  try {
    const app = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    );
    if (!app) return sendError(res, "Leave application not found", 404);
    return sendSuccess(res, app, "Leave application approved");
  } catch (err) { next(err); }
});

router.patch("/applications/:id/reject", authorize("System Manager", "HR Manager", "Leave Approver"), async (req, res, next) => {
  try {
    const app = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", rejectionReason: req.body.rejectionReason },
      { new: true }
    );
    if (!app) return sendError(res, "Leave application not found", 404);
    return sendSuccess(res, app, "Leave application rejected");
  } catch (err) { next(err); }
});

router.patch("/applications/:id/cancel", async (req, res, next) => {
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

module.exports = router;
