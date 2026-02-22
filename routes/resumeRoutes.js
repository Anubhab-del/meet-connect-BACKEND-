import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeResume } from '../controllers/resumeController.js';
import protect from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `resume_${Date.now()}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Create uploads folder if not exists
import fs from 'fs';
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const router = express.Router();

router.post('/analyze', protect, upload.single('resume'), analyzeResume);

export default router;