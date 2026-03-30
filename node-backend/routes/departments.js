const express = require("express");
const { body } = require("express-validator");
const Department = require("../models/Department");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.disabled !== undefined) filter.disabled = req.query.disabled === "true";
    const result = await paginate(Department, filter, req.query, "parentDepartment");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id).populate("parentDepartment", "name");
    if (!dept) return sendError(res, "Department not found", 404);
    return sendSuccess(res, dept);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), body("company").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const dept = await Department.create(req.body);
      return sendCreated(res, dept);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return sendError(res, "Department not found", 404);
    return sendSuccess(res, dept);
  } catch (err) { next(err); }
});

router.delete("/:id", authorize("System Manager"), async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return sendError(res, "Department not found", 404);
    return sendSuccess(res, {}, "Department deleted");
  } catch (err) { next(err); }
});

module.exports = router;
