const express = require("express");
const { body, query } = require("express-validator");
const Employee = require("../models/Employee");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendSuccess, sendCreated, sendError } = require("../utils/apiResponse");
const { paginate } = require("../utils/pagination");
const upload = require("../utils/upload");

const router = express.Router();

router.use(protect);

// GET /api/employees
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.company) filter.company = req.query.company;
    if (req.query.search) {
      filter.$or = [
        { firstName: new RegExp(req.query.search, "i") },
        { lastName: new RegExp(req.query.search, "i") },
        { employeeId: new RegExp(req.query.search, "i") },
        { companyEmail: new RegExp(req.query.search, "i") },
      ];
    }

    const result = await paginate(
      Employee,
      filter,
      req.query,
      "department designation reportsTo"
    );
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
});

// GET /api/employees/:id
router.get("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department", "name")
      .populate("designation", "name")
      .populate("reportsTo", "firstName lastName employeeId");
    if (!employee) return sendError(res, "Employee not found", 404);
    return sendSuccess(res, employee);
  } catch (err) {
    next(err);
  }
});

// POST /api/employees
router.post(
  "/",
  authorize("System Manager", "HR Manager", "HR User"),
  [
    body("firstName").notEmpty().withMessage("First name required"),
    body("lastName").notEmpty().withMessage("Last name required"),
    body("dateOfJoining").isISO8601().withMessage("Valid joining date required"),
    body("company").notEmpty().withMessage("Company required"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const employee = await Employee.create(req.body);
      return sendCreated(res, employee);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/employees/:id
router.put(
  "/:id",
  authorize("System Manager", "HR Manager", "HR User"),
  async (req, res, next) => {
    try {
      const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!employee) return sendError(res, "Employee not found", 404);
      return sendSuccess(res, employee);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/employees/:id
router.delete(
  "/:id",
  authorize("System Manager", "HR Manager"),
  async (req, res, next) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) return sendError(res, "Employee not found", 404);
      return sendSuccess(res, {}, "Employee deleted");
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/employees/:id/image
router.post(
  "/:id/image",
  authorize("System Manager", "HR Manager", "HR User"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) return sendError(res, "No image uploaded", 400);
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { image: req.file.filename },
        { new: true }
      );
      if (!employee) return sendError(res, "Employee not found", 404);
      return sendSuccess(res, { image: employee.image });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
