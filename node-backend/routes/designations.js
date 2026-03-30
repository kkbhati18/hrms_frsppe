const express = require("express");
const { body } = require("express-validator");
const Designation = require("../models/Designation");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.disabled !== undefined) filter.disabled = req.query.disabled === "true";
    const result = await paginate(Designation, filter, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const d = await Designation.findById(req.params.id);
    if (!d) return sendError(res, "Designation not found", 404);
    return sendSuccess(res, d);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "HR Manager"),
  [body("name").notEmpty(), validate],
  async (req, res, next) => {
    try {
      const d = await Designation.create(req.body);
      return sendCreated(res, d);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    const d = await Designation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!d) return sendError(res, "Designation not found", 404);
    return sendSuccess(res, d);
  } catch (err) { next(err); }
});

router.delete("/:id", authorize("System Manager"), async (req, res, next) => {
  try {
    const d = await Designation.findByIdAndDelete(req.params.id);
    if (!d) return sendError(res, "Designation not found", 404);
    return sendSuccess(res, {}, "Designation deleted");
  } catch (err) { next(err); }
});

module.exports = router;
