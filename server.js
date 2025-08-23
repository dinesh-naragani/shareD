const express = require('express');
const cors = require('cors');
const multer = require('multer');
const archiver = require('archiver');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sd.dineshn.xyz',
    'https://dineshn.xyz'
  ],
  credentials: true
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// In-memory file store
const fileStore = {};

// Multer configuration for file uploads with limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// File size and count limits
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB per file
    files: 15, // Maximum 15 files per upload
    fieldSize: 2 * 1024 * 1024 // 2MB for other fields
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now - you can restrict this later if needed
    cb(null, true);
    
    // If you want to restrict file types, uncomment and modify this:
    /*
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript',
      'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/aac',
      'application/json', 'application/xml', 'application/javascript'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
    */
  }
});

// Global storage limit (2GB total)
const MAX_STORAGE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
let currentStorageBytes = 0;

// Helper function to generate random 4-digit numeric code
function generateShareCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Helper function to calculate expiration time
function calculateExpirationTime(expiresIn) {
  const now = new Date();
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1));
  
  switch (unit) {
    case 'm': // minutes
      return new Date(now.getTime() + value * 60 * 1000);
    case 'h': // hours
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case 'd': // days
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 60 * 60 * 1000); // Default 1 hour
  }
}

// API Endpoints

// GET /api/health - Health check for Render.com
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Share\'D Backend is running' });
});

// POST /api/upload - Handle file uploads
app.post('/api/upload', upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Check total file size
    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    
    // Check if upload would exceed storage limit
    if (currentStorageBytes + totalSize > MAX_STORAGE_BYTES) {
      // Clean up uploaded files
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error('Error cleaning up file:', err);
        }
      });
      
              return res.status(413).json({ 
          error: 'Storage limit exceeded. Total storage limit is 2GB.',
          currentUsage: formatBytes(currentStorageBytes),
          limit: '2GB'
        });
    }

    // Fixed 5-minute expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    // Generate unique share code
    let shareCode;
    do {
      shareCode = generateShareCode();
    } while (fileStore[shareCode]);

    // Prepare file metadata
    const files = req.files.map(file => ({
      originalName: file.originalname,
      savedPath: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    // Store in fileStore
    fileStore[shareCode] = {
      files: files,
      expiresAt: expiresAt.toISOString()
    };

    // Update storage usage
    currentStorageBytes += totalSize;

    res.json({
      code: shareCode,
      files: files.map(f => ({ originalName: f.originalName, size: f.size })),
      expiresAt: expiresAt.toISOString(),
      expiresIn: '5 minutes',
      storageInfo: {
        used: formatBytes(currentStorageBytes),
        limit: '2GB',
        remaining: formatBytes(MAX_STORAGE_BYTES - currentStorageBytes)
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error('Error cleaning up file:', err);
        }
      });
    }
    
    if (error.message === 'File type not allowed') {
      res.status(400).json({ error: 'One or more file types are not allowed' });
    } else       if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({ error: 'File too large. Maximum file size is 200MB' });
      } else if (error.code === 'LIMIT_FILE_COUNT') {
        res.status(413).json({ error: 'Too many files. Maximum 15 files per upload' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// GET /api/info/:code - Get file information
app.get('/api/info/:code', (req, res) => {
  const { code } = req.params;
  const fileData = fileStore[code];

  if (!fileData) {
    return res.status(404).json({ error: 'Share code not found' });
  }

  // Check if expired
  if (new Date() > new Date(fileData.expiresAt)) {
    return res.status(404).json({ error: 'Share code has expired' });
  }

  res.json({
    files: fileData.files.map(f => ({ originalName: f.originalName, size: f.size })),
    expiresAt: fileData.expiresAt
  });
});

// GET /api/download/:code - Download files as zip
app.get('/api/download/:code', (req, res) => {
  const { code } = req.params;
  const fileData = fileStore[code];

  if (!fileData) {
    return res.status(404).json({ error: 'Share code not found' });
  }

  // Check if expired
  if (new Date() > new Date(fileData.expiresAt)) {
    return res.status(404).json({ error: 'Share code has expired' });
  }

  // Create zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  // Set response headers
  res.attachment('shareD-files.zip');
  res.setHeader('Content-Type', 'application/zip');

  // Pipe archive to response
  archive.pipe(res);

  // Add files to archive
  fileData.files.forEach(file => {
    archive.file(file.savedPath, { name: file.originalName });
  });

  // Finalize archive
  archive.finalize();
});

// GET /api/download/:code/:filename - Download individual file
app.get('/api/download/:code/:filename', (req, res) => {
  const { code, filename } = req.params;
  const fileData = fileStore[code];

  if (!fileData) {
    return res.status(404).json({ error: 'Share code not found' });
  }

  // Check if expired
  if (new Date() > new Date(fileData.expiresAt)) {
    return res.status(404).json({ error: 'Share code has expired' });
  }

  // Find the specific file
  const file = fileData.files.find(f => f.originalName === filename);
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Check if file exists on disk
  if (!fs.existsSync(file.savedPath)) {
    return res.status(404).json({ error: 'File not found on disk' });
  }

  // Set response headers for file download
  res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
  res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
  res.setHeader('Content-Length', file.size);

  // Stream the file to response
  const fileStream = fs.createReadStream(file.savedPath);
  fileStream.pipe(res);

  // Handle errors
  fileStream.on('error', (error) => {
    console.error('File stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error reading file' });
    }
  });
});

// GET /api/download/:code/file/:index - Download file by index
app.get('/api/download/:code/file/:index', (req, res) => {
  const { code, index } = req.params;
  const fileData = fileStore[code];

  if (!fileData) {
    return res.status(404).json({ error: 'Share code not found' });
  }

  // Check if expired
  if (new Date() > new Date(fileData.expiresAt)) {
    return res.status(404).json({ error: 'Share code has expired' });
  }

  // Check if index is valid
  const fileIndex = parseInt(index);
  if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= fileData.files.length) {
    return res.status(404).json({ error: 'Invalid file index' });
  }

  const file = fileData.files[fileIndex];

  // Check if file exists on disk
  if (!fs.existsSync(file.savedPath)) {
    return res.status(404).json({ error: 'File not found on disk' });
  }

  // Set response headers for file download
  res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
  res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
  res.setHeader('Content-Length', file.size);

  // Stream the file to response
  const fileStream = fs.createReadStream(file.savedPath);
  fileStream.pipe(res);

  // Handle errors
  fileStream.on('error', (error) => {
    console.error('File stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error reading file' });
    }
  });
});

// GET /api/storage - Get current storage usage
app.get('/api/storage', (req, res) => {
  res.json({
    currentUsage: formatBytes(currentStorageBytes),
    limit: '2GB',
    remaining: formatBytes(MAX_STORAGE_BYTES - currentStorageBytes),
    usagePercentage: Math.round((currentStorageBytes / MAX_STORAGE_BYTES) * 100),
    activeCodes: Object.keys(fileStore).length
  });
});

// Cron job for cleanup (runs every 5 minutes)
cron.schedule('*/5 * * * *', () => {
  console.log('Running cleanup job...');
  const now = new Date();
  
  Object.keys(fileStore).forEach(code => {
    const fileData = fileStore[code];
    if (new Date(fileData.expiresAt) < now) {
      // Calculate total size of expired files
      const expiredSize = fileData.files.reduce((sum, file) => sum + file.size, 0);
      
      // Delete files from disk
      fileData.files.forEach(file => {
        try {
          if (fs.existsSync(file.savedPath)) {
            fs.unlinkSync(file.savedPath);
            console.log(`Deleted file: ${file.savedPath}`);
          }
        } catch (error) {
          console.error(`Error deleting file ${file.savedPath}:`, error);
        }
      });
      
      // Remove from fileStore
      delete fileStore[code];
      
      // Update storage usage
      currentStorageBytes = Math.max(0, currentStorageBytes - expiredSize);
      
      console.log(`Removed expired code: ${code}, freed ${formatBytes(expiredSize)}`);
    }
  });
  
  console.log(`Current storage usage: ${formatBytes(currentStorageBytes)} / 2GB`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Share'D server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
