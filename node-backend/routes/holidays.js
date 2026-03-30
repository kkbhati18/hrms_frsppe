const express = require("express");
const { body } = require("express-validator");
const HolidayList = require("../models/HolidayList");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const result = await paginate(HolidayList, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const h = await HolidayList.findById(req.params.id);
    if (!h) return sendError(res, "Holiday list not found", 404);
    return sendSuccess(res, h);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "HR Manager"),
  [
    body("name").notEmpty(),
    body("fromDate").isISO8601(),
    body("toDate").isISO8601(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const h = await HolidayList.create({
        ...req.body,
        totalHolidays: (req.body.holidays || []).length,
      });
      return sendCreated(res, h);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req, res, next) => {
  try {
    if (req.body.holidays !== undefined) req.body.totalHolidays = req.body.holidays.length;
    const h = await HolidayList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!h) return sendError(res, "Holiday list not found", 404);
    return sendSuccess(res, h);
  } catch (err) { next(err); }
});

router.delete("/:id", authorize("System Manager"), async (req, res, next) => {
  try {
    await HolidayList.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Holiday list deleted");
  } catch (err) { next(err); }
});

module.exports = router;
