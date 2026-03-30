const express = require("express");
const { body } = require("express-validator");
const EmployeeCheckin = require("../models/EmployeeCheckin");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.logType) filter.logType = req.query.logType;
    if (req.query.from || req.query.to) {
      filter.time = {};
      if (req.query.from) filter.time.$gte = new Date(req.query.from);
      if (req.query.to) filter.time.$lte = new Date(req.query.to);
    }
    const result = await paginate(EmployeeCheckin, filter, { ...req.query, sortBy: "time", order: "desc" }, "employee");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post(
  "/",
  [
    body("employee").notEmpty(),
    body("logType").isIn(["IN", "OUT"]),
    body("time").isISO8601(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const checkin = await EmployeeCheckin.create(req.body);
      return sendCreated(res, checkin);
    } catch (err) { next(err); }
  }
);

router.delete("/:id", async (req, res, next) => {
  try {
    await EmployeeCheckin.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Checkin deleted");
  } catch (err) { next(err); }
});

module.exports = router;
