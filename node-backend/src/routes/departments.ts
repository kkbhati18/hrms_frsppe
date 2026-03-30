import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import Department from "../models/Department";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.disabled !== undefined) filter.disabled = req.query.disabled === "true";
    const result = await paginate(Department, filter, req.query, "parentDepartment");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dept = await Department.create(req.body);
      return sendCreated(res, dept);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return sendError(res, "Department not found", 404);
    return sendSuccess(res, dept);
  } catch (err) { next(err); }
});

router.delete("/:id", authorize("System Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return sendError(res, "Department not found", 404);
    return sendSuccess(res, {}, "Department deleted");
  } catch (err) { next(err); }
});

export default router;
