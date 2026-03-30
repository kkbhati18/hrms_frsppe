import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import Employee from "../models/Employee";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";
import upload from "../utils/upload";

const router = Router();
router.use(protect);

// GET /api/employees
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.company) filter.company = req.query.company;
    if (req.query.search) {
      filter.$or = [
        { firstName: new RegExp(req.query.search as string, "i") },
        { lastName: new RegExp(req.query.search as string, "i") },
        { employeeId: new RegExp(req.query.search as string, "i") },
        { companyEmail: new RegExp(req.query.search as string, "i") },
      ];
    }
    const result = await paginate(Employee, filter, req.query, "department designation reportsTo");
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
});

// GET /api/employees/:id
router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
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

export default router;
