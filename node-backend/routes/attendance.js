const express = require("express");
const { body } = require("express-validator");
const Attendance = require("../models/Attendance");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

// GET /api/attendance
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from || req.query.to) {
      filter.attendanceDate = {};
      if (req.query.from) filter.attendanceDate.$gte = new Date(req.query.from);
      if (req.query.to) filter.attendanceDate.$lte = new Date(req.query.to);
    }
    const result = await paginate(Attendance, filter, req.query, "employee shift leaveType");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

// GET /api/attendance/:id
router.get("/:id", async (req, res, next) => {
  try {
    const att = await Attendance.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId")
      .populate("shift", "name startTime endTime");
    if (!att) return sendError(res, "Attendance not found", 404);
    return sendSuccess(res, att);
  } catch (err) { next(err); }
});

// POST /api/attendance
router.post(
  "/",
  authorize("System Manager", "HR Manager", "HR User"),
  [
    body("employee").notEmpty(),
    body("attendanceDate").isISO8601(),
    body("status").isIn(["Present", "Absent", "On Leave", "Half Day", "Work From Home"]),
    validate,
  ],
  async (req, res, next) => {
    try {
      const att = await Attendance.create(req.body);
      return sendCreated(res, att);
    } catch (err) { next(err); }
  }
);

// PUT /api/attendance/:id
router.put("/:id", authorize("System Manager", "HR Manager", "HR User"), async (req, res, next) => {
  try {
    const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!att) return sendError(res, "Attendance not found", 404);
    return sendSuccess(res, att);
  } catch (err) { next(err); }
});

// DELETE /api/attendance/:id
router.delete("/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Attendance deleted");
  } catch (err) { next(err); }
});

// GET /api/attendance/summary/:employeeId
router.get("/summary/:employeeId", async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { from, to } = req.query;
    const match = { employee: require("mongoose").Types.ObjectId.createFromHexString(employeeId) };
    if (from || to) {
      match.attendanceDate = {};
      if (from) match.attendanceDate.$gte = new Date(from);
      if (to) match.attendanceDate.$lte = new Date(to);
    }
    const summary = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    return sendSuccess(res, summary);
  } catch (err) { next(err); }
});

module.exports = router;
