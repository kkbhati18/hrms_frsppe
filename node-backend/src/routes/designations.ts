import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import Designation from "../models/Designation";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.disabled !== undefined) filter.disabled = req.query.disabled === "true";
    const result = await paginate(Designation, filter, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const d = await Designation.create(req.body);
      return sendCreated(res, d);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const d = await Designation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!d) return sendError(res, "Designation not found", 404);
    return sendSuccess(res, d);
  } catch (err) { next(err); }
});

router.delete("/:id", authorize("System Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const d = await Designation.findByIdAndDelete(req.params.id);
    if (!d) return sendError(res, "Designation not found", 404);
    return sendSuccess(res, {}, "Designation deleted");
  } catch (err) { next(err); }
});

export default router;
