import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "path";

import errorHandler from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

import authRoutes from "./routes/auth";
import employeeRoutes from "./routes/employees";
import departmentRoutes from "./routes/departments";
import designationRoutes from "./routes/designations";
import leaveRoutes from "./routes/leaves";
import attendanceRoutes from "./routes/attendance";
import checkinRoutes from "./routes/checkins";
import shiftRoutes from "./routes/shifts";
import payrollRoutes from "./routes/payroll";
import salaryRoutes from "./routes/salary";
import expenseRoutes from "./routes/expenses";
import recruitmentRoutes from "./routes/recruitment";
import appraisalRoutes from "./routes/appraisal";
import trainingRoutes from "./routes/training";
import onboardingRoutes from "./routes/onboarding";
import holidayRoutes from "./routes/holidays";
import reportRoutes from "./routes/reports";

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS policy blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")));

app.get("/api/health", (_req: Request, res: Response) =>
  res.json({ success: true, status: "ok", timestamp: new Date() })
);

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/appraisal", appraisalRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
