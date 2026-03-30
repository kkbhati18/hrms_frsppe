import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import HolidayList from "../models/HolidayList";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { paginate } from "../utils/pagination";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await paginate(HolidayList, {}, req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const h = await HolidayList.create({
        ...req.body,
        totalHolidays: (req.body.holidays || []).length,
      });
      return sendCreated(res, h);
    } catch (err) { next(err); }
  }
);

router.put("/:id", authorize("System Manager", "HR Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.body.holidays !== undefined) req.body.totalHolidays = req.body.holidays.length;
    const h = await HolidayList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!h) return sendError(res, "Holiday list not found", 404);
    return sendSuccess(res, h);
  } catch (err) { next(err); }
});

router.delete("/:id", authorize("System Manager"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await HolidayList.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, "Holiday list deleted");
  } catch (err) { next(err); }
});

export default router;
