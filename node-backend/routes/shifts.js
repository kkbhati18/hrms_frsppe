const express = require("express");
const { body } = require("express-validator");
const ShiftType = require("../models/ShiftType");
const ShiftAssignment = require("../models/ShiftAssignment");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

// ── Shift Types ─────────────────────────────────────────────────────────────

router.get("/types", async (req, res, next) => {
  try {
    const result = await paginate(ShiftType, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/types/:id", async (req, res, next) => {
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
  async (req, res, next) => {
    try {
      const s = await ShiftType.create(req.body);
      return sendCreated(res, s);
    } catch (err) { next(err); }
  }
);

router.put("/types/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const s = await ShiftType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return sendError(res, "Shift type not found", 404);
    return sendSuccess(res, s);
  } catch (err) { next(err); }
});

// ── Shift Assignments ────────────────────────────────────────────────────────

router.get("/assignments", async (req, res, next) => {
  try {
    const filter = {};
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
  async (req, res, next) => {
    try {
      const sa = await ShiftAssignment.create(req.body);
      return sendCreated(res, sa);
    } catch (err) { next(err); }
  }
);

router.put("/assignments/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const sa = await ShiftAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sa) return sendError(res, "Assignment not found", 404);
    return sendSuccess(res, sa);
  } catch (err) { next(err); }
});

router.delete("/assignments/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    await ShiftAssignment.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Assignment deleted");
  } catch (err) { next(err); }
});

module.exports = router;
