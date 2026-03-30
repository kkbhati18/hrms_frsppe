const config = {
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "change_me_refresh",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxFileSizeMB: Number(process.env.MAX_FILE_SIZE_MB) || 10,
} as const;

export default config;
