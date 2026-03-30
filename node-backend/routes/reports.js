const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const LeaveApplication = require("../models/LeaveApplication");
const SalarySlip = require("../models/SalarySlip");
const ExpenseClaim = require("../models/ExpenseClaim");
const PayrollEntry = require("../models/PayrollEntry");
const { protect, authorize } = require("../middleware/auth");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();
router.use(protect);
router.use(authorize("System Manager", "HR Manager", "Payroll Manager"));

// GET /api/reports/headcount
router.get("/headcount", async (req, res, next) => {
  try {
    const byDept = await Employee.aggregate([
      { $match: { status: "Active" } },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "dept",
        },
      },
      { $unwind: { path: "$dept", preserveNullAndEmpty: true } },
      {
        $project: {
          department: { $ifNull: ["$dept.name", "Unassigned"] },
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);
    const total = await Employee.countDocuments({ status: "Active" });
    return sendSuccess(res, { total, byDepartment: byDept });
  } catch (err) { next(err); }
});

// GET /api/reports/attendance-summary?from=&to=
router.get("/attendance-summary", async (req, res, next) => {
  try {
    const match = {};
    if (req.query.from || req.query.to) {
      match.attendanceDate = {};
      if (req.query.from) match.attendanceDate.$gte = new Date(req.query.from);
      if (req.query.to) match.attendanceDate.$lte = new Date(req.query.to);
    }
    const summary = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    return sendSuccess(res, summary);
  } catch (err) { next(err); }
});

// GET /api/reports/leave-balance/:employeeId
router.get("/leave-balance/:employeeId", async (req, res, next) => {
  try {
    const LeaveAllocation = require("../models/LeaveAllocation");
    const allocs = await LeaveAllocation.find({
      employee: req.params.employeeId,
      status: "Submitted",
    }).populate("leaveType", "name");
    const used = await LeaveApplication.aggregate([
      {
        $match: {
          employee: mongoose.Types.ObjectId.createFromHexString(req.params.employeeId),
          status: "Approved",
        },
      },
      { $group: { _id: "$leaveType", totalDays: { $sum: "$totalLeaveDays" } } },
    ]);
    const usedMap = {};
    used.forEach((u) => { usedMap[String(u._id)] = u.totalDays; });

    const balance = allocs.map((a) => ({
      leaveType: a.leaveType,
      allocated: a.totalLeavesAllocated,
      used: usedMap[String(a.leaveType._id)] || 0,
      balance: a.totalLeavesAllocated - (usedMap[String(a.leaveType._id)] || 0),
    }));
    return sendSuccess(res, balance);
  } catch (err) { next(err); }
});

// GET /api/reports/payroll-summary?from=&to=
router.get("/payroll-summary", async (req, res, next) => {
  try {
    const match = {};
    if (req.query.company) match.company = req.query.company;
    if (req.query.from) match.startDate = { $gte: new Date(req.query.from) };
    if (req.query.to) match.endDate = { $lte: new Date(req.query.to) };

    const summary = await SalarySlip.aggregate([
      { $match: { ...match, status: "Submitted" } },
      {
        $group: {
          _id: null,
          totalGross: { $sum: "$grossPay" },
          totalDeductions: { $sum: "$totalDeductions" },
          totalNet: { $sum: "$netPay" },
          count: { $sum: 1 },
        },
      },
    ]);
    return sendSuccess(res, summary[0] || { totalGross: 0, totalDeductions: 0, totalNet: 0, count: 0 });
  } catch (err) { next(err); }
});

// GET /api/reports/expense-summary
router.get("/expense-summary", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const summary = await ExpenseClaim.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          totalClaimed: { $sum: "$totalClaimedAmount" },
          totalSanctioned: { $sum: "$totalSanctionedAmount" },
          count: { $sum: 1 },
        },
      },
    ]);
    return sendSuccess(res, summary);
  } catch (err) { next(err); }
});

module.exports = router;
