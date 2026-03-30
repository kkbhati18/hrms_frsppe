import "dotenv/config";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";

const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`HRMS Node.js server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
});

process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception:", err.message);
  process.exit(1);
});
