import { Router, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Employee from "../models/Employee";
import Attendance from "../models/Attendance";
import LeaveAllocation from "../models/LeaveAllocation";
import LeaveApplication from "../models/LeaveApplication";
import SalarySlip from "../models/SalarySlip";
import ExpenseClaim from "../models/ExpenseClaim";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { sendSuccess, sendError } from "../utils/apiResponse";

const router = Router();
router.use(protect);
router.use(authorize("System Manager", "HR Manager", "Payroll Manager"));

// GET /api/reports/headcount
router.get("/headcount", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [byDept, total] = await Promise.all([
      Employee.aggregate([
        { $match: { status: "Active" } },
        { $group: { _id: "$department", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "dept",
          },
        },
        { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, departmentName: "$dept.name", count: 1 } },
        { $sort: { count: -1 } },
      ]),
      Employee.countDocuments({ status: "Active" }),
    ]);
    return sendSuccess(res, { total, byDepartment: byDept });
  } catch (err) { next(err); }
});

// GET /api/reports/attendance-summary?from=&to=
router.get("/attendance-summary", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const match: Record<string, unknown> = {};
    if (req.query.from || req.query.to) {
      const dateRange: Record<string, Date> = {};
      if (req.query.from) dateRange.$gte = new Date(req.query.from as string);
      if (req.query.to) dateRange.$lte = new Date(req.query.to as string);
      match.attendanceDate = dateRange;
    }
    const summary = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return sendSuccess(res, summary);
  } catch (err) { next(err); }
});

// GET /api/reports/leave-balance/:employeeId
router.get("/leave-balance/:employeeId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let empId: mongoose.Types.ObjectId;
    try {
      empId = new mongoose.Types.ObjectId(req.params.employeeId as string);
    } catch {
      return sendError(res, "Invalid employee id", 400);
    }

    const [allocations, consumed] = await Promise.all([
      LeaveAllocation.find({ employee: empId }).populate("leaveType", "name"),
      LeaveApplication.aggregate([
        { $match: { employee: empId, status: "Approved" } },
        { $group: { _id: "$leaveType", totalDays: { $sum: "$totalLeaveDays" } } },
      ]),
    ]);

    const consumedMap = new Map<string, number>(
      consumed.map((c) => [String(c._id), c.totalDays])
    );

    const balance = allocations.map((a) => {
      const used = consumedMap.get(String(a.leaveType)) ?? 0;
      return {
        leaveType: a.leaveType,
        allocated: a.totalLeavesAllocated,
        used,
        remaining: (a.totalLeavesAllocated ?? 0) - used,
      };
    });

    return sendSuccess(res, balance);
  } catch (err) { next(err); }
});

// GET /api/reports/payroll-summary?from=&to=
router.get("/payroll-summary", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const match: Record<string, unknown> = { docStatus: "Submitted" };
    if (req.query.from || req.query.to) {
      const dateRange: Record<string, Date> = {};
      if (req.query.from) dateRange.$gte = new Date(req.query.from as string);
      if (req.query.to) dateRange.$lte = new Date(req.query.to as string);
      match.startDate = dateRange;
    }
    const summary = await SalarySlip.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalGross: { $sum: "$grossPay" },
          totalDeductions: { $sum: "$totalDeduction" },
          totalNet: { $sum: "$netPay" },
          count: { $sum: 1 },
        },
      },
    ]);
    return sendSuccess(res, summary[0] ?? { totalGross: 0, totalDeductions: 0, totalNet: 0, count: 0 });
  } catch (err) { next(err); }
});

// GET /api/reports/expense-summary?from=&to=
router.get("/expense-summary", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const match: Record<string, unknown> = {};
    if (req.query.from || req.query.to) {
      const dateRange: Record<string, Date> = {};
      if (req.query.from) dateRange.$gte = new Date(req.query.from as string);
      if (req.query.to) dateRange.$lte = new Date(req.query.to as string);
      match.postingDate = dateRange;
    }
    const summary = await ExpenseClaim.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$totalClaimedAmount" },
          totalApproved: { $sum: "$totalSanctionedAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return sendSuccess(res, summary);
  } catch (err) { next(err); }
});

export default router;
