import path from 'path';
import uploadToCloudinary from '../config/cloudinary.js';

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    // Validate PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    // Clean filename (Cloudinary safe)
    let filename = path.parse(req.file.originalname).name;
    filename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');

    const publicId = `kampuskart/pdfs/${filename}`;

    // Upload as raw resource type for PDFs; cloudinary.js will force raw+pdf
    const url = await uploadToCloudinary(req.file.buffer, publicId, 'raw', true);

    return res.json({ url });
  } catch (error) {
    console.error('[Upload] PDF upload error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const uploadScreenshot = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No screenshot provided' });
    }

    // Validate image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    // Get filename without extension for public_id
    const filename = path.parse(req.file.originalname).name;
    const publicId = `kampuskart/screenshots/${filename}`;

    // Upload as auto resource type for screenshots
    const url = await uploadToCloudinary(req.file.buffer, publicId, 'auto', false);

    return res.json({ url });
  } catch (error) {
    console.error('[Upload] Screenshot upload error:', error);
    return res.status(500).json({ error: error.message });
  }
};
