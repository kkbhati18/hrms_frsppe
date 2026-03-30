# HRMS Node.js + MongoDB Backend

A complete REST API backend for Frappe HRMS built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
The existing Frappe/Python code is **untouched**.

---

## Quick Start

```bash
cd node-backend
npm install

# Copy and fill in environment variables
cp .env.example .env

npm run dev   # development (nodemon)
npm start     # production
```

---

## Environment Variables (`.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | HTTP port |
| `MONGO_URI` | `mongodb://localhost:27017/hrms` | MongoDB connection string |
| `JWT_SECRET` | — | Secret for access tokens |
| `JWT_EXPIRES_IN` | `7d` | Access token TTL |
| `JWT_REFRESH_SECRET` | — | Secret for refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | Refresh token TTL |
| `ALLOWED_ORIGINS` | — | Comma-separated CORS origins |

---

## Project Structure

```
node-backend/
├── server.js               # Entry point
├── app.js                  # Express app
├── config/
│   ├── db.js               # MongoDB connection
│   └── config.js           # App configuration
├── middleware/
│   ├── auth.js             # JWT protect + role authorize
│   ├── errorHandler.js     # Centralised error handler
│   ├── notFound.js         # 404 handler
│   └── validate.js         # express-validator helper
├── models/
│   ├── User.js
│   ├── Employee.js
│   ├── Department.js
│   ├── Designation.js
│   ├── HolidayList.js
│   ├── LeaveType.js
│   ├── LeaveAllocation.js
│   ├── LeaveApplication.js
│   ├── Attendance.js
│   ├── EmployeeCheckin.js
│   ├── ShiftType.js
│   ├── ShiftAssignment.js
│   ├── SalaryComponent.js
│   ├── SalaryStructure.js
│   ├── SalaryStructureAssignment.js
│   ├── SalarySlip.js
│   ├── PayrollEntry.js
│   ├── ExpenseClaim.js
│   ├── ExpenseClaimType.js
│   ├── JobOpening.js
│   ├── JobApplicant.js
│   ├── Interview.js
│   ├── Appraisal.js
│   ├── AppraisalCycle.js
│   ├── TrainingEvent.js
│   ├── TrainingProgram.js
│   └── EmployeeOnboarding.js
├── routes/
│   ├── auth.js             # POST /api/auth/*
│   ├── employees.js        # /api/employees
│   ├── departments.js      # /api/departments
│   ├── designations.js     # /api/designations
│   ├── leaves.js           # /api/leaves/types|allocations|applications
│   ├── attendance.js       # /api/attendance
│   ├── checkins.js         # /api/checkins
│   ├── shifts.js           # /api/shifts/types|assignments
│   ├── salary.js           # /api/salary/components|structures|assignments|slips
│   ├── payroll.js          # /api/payroll
│   ├── expenses.js         # /api/expenses
│   ├── recruitment.js      # /api/recruitment/openings|applicants|interviews
│   ├── appraisal.js        # /api/appraisal/cycles|appraisals
│   ├── training.js         # /api/training/programs|events
│   ├── onboarding.js       # /api/onboarding
│   ├── holidays.js         # /api/holidays
│   └── reports.js          # /api/reports/*
└── utils/
    ├── apiResponse.js      # Standardised JSON responses
    ├── pagination.js       # Generic paginate helper
    ├── upload.js           # Multer file upload config
    └── logger.js           # Winston logger
```

---

## API Endpoints Summary

| Module | Prefix | Key endpoints |
|---|---|---|
| Auth | `/api/auth` | `POST /register`, `POST /login`, `POST /refresh`, `GET /me` |
| Employees | `/api/employees` | Full CRUD + image upload |
| Departments | `/api/departments` | Full CRUD |
| Designations | `/api/designations` | Full CRUD |
| Leaves | `/api/leaves` | Types, allocations, applications (approve/reject/cancel) |
| Attendance | `/api/attendance` | CRUD + summary aggregation |
| Checkins | `/api/checkins` | Employee check-in/out logs |
| Shifts | `/api/shifts` | Shift types + assignments |
| Salary | `/api/salary` | Components, structures, assignments, slips |
| Payroll | `/api/payroll` | Payroll runs (submit/cancel) |
| Expenses | `/api/expenses` | Claims + types (approve/reject) |
| Recruitment | `/api/recruitment` | Job openings, applicants, interviews |
| Appraisal | `/api/appraisal` | Cycles + appraisals |
| Training | `/api/training` | Programs + events with attendance |
| Onboarding | `/api/onboarding` | Onboarding checklists |
| Holidays | `/api/holidays` | Holiday lists |
| Reports | `/api/reports` | Headcount, attendance, leave balance, payroll, expenses |

---

## Security

- Helmet for HTTP headers
- express-mongo-sanitize for NoSQL injection prevention
- JWT authentication (access + refresh tokens)
- Role-based access control
- express-rate-limit on all routes
- Input validation via express-validator
- bcryptjs for password hashing (cost 12)
