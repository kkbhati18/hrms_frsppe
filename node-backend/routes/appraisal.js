const express = require("express");
const { body } = require("express-validator");
const Appraisal = require("../models/Appraisal");
const AppraisalCycle = require("../models/AppraisalCycle");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

// ── Appraisal Cycles ─────────────────────────────────────────────────────────

router.get("/cycles", async (req, res, next) => {
  try {
    const result = await paginate(AppraisalCycle, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/cycles/:id", async (req, res, next) => {
  try {
    const c = await AppraisalCycle.findById(req.params.id);
    if (!c) return sendError(res, "Appraisal cycle not found", 404);
    return sendSuccess(res, c);
  } catch (err) { next(err); }
});

router.post(
  "/cycles",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), body("fromDate").isISO8601(), body("toDate").isISO8601(), validate],
  async (req, res, next) => {
    try {
      const c = await AppraisalCycle.create(req.body);
      return sendCreated(res, c);
    } catch (err) { next(err); }
  }
);

router.put("/cycles/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const c = await AppraisalCycle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return sendError(res, "Appraisal cycle not found", 404);
    return sendSuccess(res, c);
  } catch (err) { next(err); }
});

// ── Appraisals ───────────────────────────────────────────────────────────────

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.cycle) filter.appraisalCycle = req.query.cycle;
    const result = await paginate(Appraisal, filter, req.query, "employee appraisalCycle reviewedBy");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const a = await Appraisal.findById(req.params.id)
      .populate("employee", "firstName lastName designation department")
      .populate("appraisalCycle", "name fromDate toDate");
    if (!a) return sendError(res, "Appraisal not found", 404);
    return sendSuccess(res, a);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "HR Manager"),
  [body("employee").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const a = await Appraisal.create(req.body);
      return sendCreated(res, a);
    } catch (err) { next(err); }
  }
);

router.put("/:id", async (req, res, next) => {
  try {
    const a = await Appraisal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!a) return sendError(res, "Appraisal not found", 404);
    return sendSuccess(res, a);
  } catch (err) { next(err); }
});

router.patch("/:id/submit", async (req, res, next) => {
  try {
    const a = await Appraisal.findByIdAndUpdate(req.params.id, { status: "Submitted" }, { new: true });
    if (!a) return sendError(res, "Appraisal not found", 404);
    return sendSuccess(res, a, "Appraisal submitted");
  } catch (err) { next(err); }
});

router.patch(
  "/:id/complete",
  authorize("System Manager", "HR Manager"),
  async (req, res, next) => {
    try {
      const a = await Appraisal.findByIdAndUpdate(
        req.params.id,
        { status: "Completed", finalScore: req.body.finalScore, grade: req.body.grade, remarks: req.body.remarks },
        { new: true }
      );
      if (!a) return sendError(res, "Appraisal not found", 404);
      return sendSuccess(res, a, "Appraisal completed");
    } catch (err) { next(err); }
  }
);

module.exports = router;
