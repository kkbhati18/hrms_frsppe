import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import EmployeeCheckin from "../models/EmployeeCheckin";
import { protect, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.logType) filter.logType = req.query.logType;
    if (req.query.from || req.query.to) {
      const timeFilter: Record<string, Date> = {};
      if (req.query.from) timeFilter.$gte = new Date(req.query.from as string);
      if (req.query.to) timeFilter.$lte = new Date(req.query.to as string);
      filter.time = timeFilter;
    }
    const result = await paginate(
      EmployeeCheckin,
      filter,
      { ...req.query, sortBy: "time", order: "desc" },
      "employee"
    );
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const checkin = await EmployeeCheckin.create(req.body);
      return sendCreated(res, checkin);
    } catch (err) { next(err); }
  }
);

router.delete("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await EmployeeCheckin.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Checkin deleted");
  } catch (err) { next(err); }
});

export default router;
