import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure local directory 'public/uploads' exists for static serving
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 1. Configure Multer Disk Storage for static upload saving
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const randomId = Math.random().toString(36).substring(2, 10);
    const safeFilename = `${Date.now()}-${randomId}${fileExt}`;
    cb(null, safeFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Strict 5MB file limit
  },
  fileFilter: (req: Request, file: any, cb: any) => {
    const allowedExtensions = /jpeg|jpg|png|webp/;
    const isMimetypeAllowed = allowedExtensions.test(file.mimetype);
    const isExtensionAllowed = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    if (isMimetypeAllowed && isExtensionAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Security Block: Only image files (JPEG, JPG, PNG, WEBP) are allowed!'));
    }
  },
});

/**
 * POST /api/upload
 * Saves photo to static server folder public/uploads
 * PROTECTED (Admin verified + strict file validation)
 */
router.post(
  '/',
  authenticateAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size limit exceeded. Max is 5MB.' });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'Missing uploaded file' });
        return;
      }

      // Format dynamic self-referencing absolute HTTP/HTTPS URL
      const relativePath = `/uploads/${file.filename}`;
      const publicUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

      res.status(200).json({ image_url: publicUrl });
    } catch (error) {
      console.error('Image Upload controller exception:', error);
      res.status(500).json({ error: 'Internal server error during upload' });
    }
  }
);

export default router;
