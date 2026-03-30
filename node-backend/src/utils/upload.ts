import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import config from "../config/config";

const storage: StorageEngine = multer.diskStorage({
  destination(_req: Request, _file: Express.Multer.File, cb) {
    cb(null, path.join(__dirname, "..", "..", config.uploadDir));
  },
  filename(_req: Request, file: Express.Multer.File, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|csv/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Unsupported file type"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSizeMB * 1024 * 1024 },
});

export default upload;
