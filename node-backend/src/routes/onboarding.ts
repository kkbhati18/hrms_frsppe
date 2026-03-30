import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import EmployeeOnboarding from "../models/EmployeeOnboarding";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.employee) filter.employee = req.query.employee;
    const result = await paginate(EmployeeOnboarding, filter, req.query, "employee");
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const o = await EmployeeOnboarding.findById(req.params.id).populate("employee", "firstName lastName employeeId");
    if (!o) return sendError(res, "Onboarding record not found", 404);
    return sendSuccess(res, o);
  } catch (err) { next(err); }
});

router.post(
  "/",
  authorize("System Manager", "HR Manager"),
  [body("employee").notEmpty(), body("dateOfJoining").isISO8601(), validate],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const o = await EmployeeOnboarding.create(req.body);
      return sendCreated(res, o);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const o = await EmployeeOnboarding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!o) return sendError(res, "Onboarding record not found", 404);
    return sendSuccess(res, o);
  } catch (err) { next(err); }
});

router.patch("/:id/activity/:index/complete", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const o = await EmployeeOnboarding.findById(req.params.id);
    if (!o) return sendError(res, "Onboarding record not found", 404);

    const idx = parseInt(req.params.index as string, 10);
    if (!o.activities || idx < 0 || idx >= o.activities.length) {
      return sendError(res, "Activity index out of range", 400);
    }

    o.activities[idx].completed = true;
    o.activities[idx].completedOn = new Date();

    const allRequiredDone = o.activities
      .filter((a) => a.required)
      .every((a) => a.completed);
    if (allRequiredDone) o.status = "Completed";

    await o.save();
    return sendSuccess(res, o, "Activity marked complete");
  } catch (err) { next(err); }
});

export default router;
