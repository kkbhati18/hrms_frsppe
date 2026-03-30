const express = require("express");
const { body } = require("express-validator");
const EmployeeOnboarding = require("../models/EmployeeOnboarding");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.employee) filter.employee = req.query.employee;
    const result = await paginate(EmployeeOnboarding, filter, req.query, "employee department designation");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const o = await EmployeeOnboarding.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId")
      .populate("department", "name")
      .populate("designation", "name");
    if (!o) return sendError(res, "Onboarding record not found", 404);
    return sendSuccess(res, o);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "HR Manager", "HR User"),
  [body("firstName").notEmpty(), body("boardingBegins").isISO8601(), validate],
  async (req, res, next) => {
    try {
      const o = await EmployeeOnboarding.create(req.body);
      return sendCreated(res, o);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const o = await EmployeeOnboarding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!o) return sendError(res, "Onboarding record not found", 404);
    return sendSuccess(res, o);
  } catch (err) { next(err); }
});

router.patch("/:id/activity/:index/complete", async (req, res, next) => {
  try {
    const o = await EmployeeOnboarding.findById(req.params.id);
    if (!o) return sendError(res, "Onboarding record not found", 404);
    const idx = parseInt(req.params.index);
    if (!o.activities[idx]) return sendError(res, "Activity not found", 404);
    o.activities[idx].completed = true;
    o.activities[idx].completedOn = new Date();
    const allDone = o.activities.filter((a) => a.required).every((a) => a.completed);
    if (allDone) o.status = "Completed";
    await o.save();
    return sendSuccess(res, o, "Activity marked complete");
  } catch (err) { next(err); }
});

module.exports = router;
