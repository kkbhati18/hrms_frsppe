const express = require("express");
const { body } = require("express-validator");
const TrainingEvent = require("../models/TrainingEvent");
const TrainingProgram = require("../models/TrainingProgram");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

// ── Training Programs ────────────────────────────────────────────────────────

router.get("/programs", async (req, res, next) => {
  try {
    const result = await paginate(TrainingProgram, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/programs",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const p = await TrainingProgram.create(req.body);
      return sendCreated(res, p);
    } catch (err) { next(err); }
  }
);

// ── Training Events ──────────────────────────────────────────────────────────

router.get("/events", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.program) filter.trainingProgram = req.query.program;
    const result = await paginate(TrainingEvent, filter, req.query, "trainingProgram attendees.employee");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/events/:id", async (req, res, next) => {
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
  async (req, res, next) => {
    try {
      const e = await TrainingEvent.create(req.body);
      return sendCreated(res, e);
    } catch (err) { next(err); }
  }
);

router.put("/events/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const e = await TrainingEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!e) return sendError(res, "Training event not found", 404);
    return sendSuccess(res, e);
  } catch (err) { next(err); }
});

router.patch("/events/:id/mark-attendance", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const { attendances } = req.body; // [{ employee, attendanceStatus }]
    const e = await TrainingEvent.findById(req.params.id);
    if (!e) return sendError(res, "Training event not found", 404);
    for (const entry of attendances) {
      const att = e.attendees.find((a) => String(a.employee) === entry.employee);
      if (att) att.attendanceStatus = entry.attendanceStatus;
    }
    await e.save();
    return sendSuccess(res, e, "Attendance updated");
  } catch (err) { next(err); }
});

module.exports = router;
