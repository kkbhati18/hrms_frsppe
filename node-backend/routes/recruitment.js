const express = require("express");
const { body } = require("express-validator");
const JobOpening = require("../models/JobOpening");
const JobApplicant = require("../models/JobApplicant");
const Interview = require("../models/Interview");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");
const upload = require("../utils/upload");

const router = express.Router();
router.use(protect);

// ── Job Openings ─────────────────────────────────────────────────────────────

router.get("/openings", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.search) filter.jobTitle = new RegExp(req.query.search, "i");
    const result = await paginate(JobOpening, filter, req.query, "department designation");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/openings/:id", async (req, res, next) => {
  try {
    const j = await JobOpening.findById(req.params.id)
      .populate("department", "name")
      .populate("designation", "name");
    if (!j) return sendError(res, "Job opening not found", 404);
    return sendSuccess(res, j);
  } catch (err) { next(err); }
});

router.post(
  "/openings",
  authorize("System Manager", "HR Manager", "HR User"),
  [body("jobTitle").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const j = await JobOpening.create(req.body);
      return sendCreated(res, j);
    } catch (err) { next(err); }
  }
);

router.put("/openings/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const j = await JobOpening.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!j) return sendError(res, "Job opening not found", 404);
    return sendSuccess(res, j);
  } catch (err) { next(err); }
});

// ── Job Applicants ───────────────────────────────────────────────────────────

router.get("/applicants", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.jobOpening) filter.jobOpening = req.query.jobOpening;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { applicantName: new RegExp(req.query.search, "i") },
        { email: new RegExp(req.query.search, "i") },
      ];
    }
    const result = await paginate(JobApplicant, filter, req.query, "jobOpening");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/applicants/:id", async (req, res, next) => {
  try {
    const a = await JobApplicant.findById(req.params.id).populate("jobOpening", "jobTitle");
    if (!a) return sendError(res, "Applicant not found", 404);
    return sendSuccess(res, a);
  } catch (err) { next(err); }
});

router.post(
  "/applicants",
  [body("applicantName").notEmpty(), body("jobOpening").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const a = await JobApplicant.create(req.body);
      return sendCreated(res, a);
    } catch (err) { next(err); }
  }
);

router.put("/applicants/:id", authorize("System Manager", "HR Manager", "HR User"), async (req, res, next) => {
  try {
    const a = await JobApplicant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!a) return sendError(res, "Applicant not found", 404);
    return sendSuccess(res, a);
  } catch (err) { next(err); }
});

router.post("/applicants/:id/resume", upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "No file uploaded", 400);
    const a = await JobApplicant.findByIdAndUpdate(req.params.id, { resume: req.file.filename }, { new: true });
    if (!a) return sendError(res, "Applicant not found", 404);
    return sendSuccess(res, { resume: a.resume });
  } catch (err) { next(err); }
});

// ── Interviews ───────────────────────────────────────────────────────────────

router.get("/interviews", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.jobApplicant) filter.jobApplicant = req.query.jobApplicant;
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(Interview, filter, req.query, "jobApplicant jobOpening");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/interviews",
  authorize("System Manager", "HR Manager", "HR User"),
  [body("jobApplicant").notEmpty(), body("scheduledOn").isISO8601(), validate],
  async (req, res, next) => {
    try {
      const i = await Interview.create(req.body);
      return sendCreated(res, i);
    } catch (err) { next(err); }
  }
);

router.patch("/interviews/:id/status", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const i = await Interview.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, rating: req.body.rating, notes: req.body.notes },
      { new: true }
    );
    if (!i) return sendError(res, "Interview not found", 404);
    return sendSuccess(res, i);
  } catch (err) { next(err); }
});

module.exports = router;
