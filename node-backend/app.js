require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

// Routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const departmentRoutes = require("./routes/departments");
const designationRoutes = require("./routes/designations");
const leaveRoutes = require("./routes/leaves");
const attendanceRoutes = require("./routes/attendance");
const checkinRoutes = require("./routes/checkins");
const shiftRoutes = require("./routes/shifts");
const payrollRoutes = require("./routes/payroll");
const salaryRoutes = require("./routes/salary");
const expenseRoutes = require("./routes/expenses");
const recruitmentRoutes = require("./routes/recruitment");
const appraisalRoutes = require("./routes/appraisal");
const trainingRoutes = require("./routes/training");
const onboardingRoutes = require("./routes/onboarding");
const holidayRoutes = require("./routes/holidays");
const reportRoutes = require("./routes/reports");

const app = express();

// Security headers
app.use(helmet());

// CORS
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

// Rate limiting
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize inputs against NoSQL injection
app.use(mongoSanitize());

// HTTP logging in development
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

// Health check
app.get("/api/health", (_req, res) => res.json({ success: true, status: "ok", timestamp: new Date() }));

// API Routes
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

// 404 / Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
