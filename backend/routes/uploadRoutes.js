import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext) {
      if (file.mimetype === 'image/jpeg') ext = '.jpg';
      else if (file.mimetype === 'image/png') ext = '.png';
      else if (file.mimetype === 'image/webp') ext = '.webp';
      else ext = '.jpg';
    }
    const baseName = path.basename(file.originalname, ext);
    // Safe filename without spaces
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'image';
    
    // Just use the exact original name (sanitized) without timestamp
    cb(null, `${safeBaseName}${ext}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  res.send({
    message: 'Image Uploaded',
    image: `/uploads/${req.file.filename}`,
  });
});

export default router;
