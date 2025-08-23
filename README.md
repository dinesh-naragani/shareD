# Share'D

A simple, fast file-sharing web application that allows users to upload files, generate a temporary 4-digit share code, and enable unlimited downloads until the files expire.

## ✨ Features

- **Quick File Sharing**: Upload multiple files and get a 4-digit code instantly
- **Fixed Expiration**: Files automatically expire after 5 minutes
- **Unlimited Downloads**: Any number of users can download until expiration
- **Individual File Downloads**: Download specific files or all files as ZIP
- **Drag & Drop Interface**: Modern, intuitive file upload experience
- **QR Code Sharing**: Generate QR codes for easy mobile sharing
- **Real-time Storage Monitoring**: Track storage usage and limits
- **Simple 4-Digit Codes**: Easy to remember and share

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Archiver** - ZIP file creation
- **Node-cron** - Automated cleanup

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **QRCode.react** - QR code generation

## 🚀 Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
       cd shareD
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Start the backend server**
   ```bash
   # From root directory
   npm start
   ```

5. **Start the frontend development server**
   ```bash
   # From client directory
   npm start
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
shareD/
├── server.js              # Backend server
├── package.json           # Backend dependencies
├── uploads/               # File storage directory
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── public/            # Static assets
└── README.md              # Project documentation
```

## 🔧 API Endpoints

- `POST /api/upload` - Upload files and get share code
- `GET /api/info/:code` - Get file information for a share code
- `GET /api/download/:code` - Download all files as ZIP
- `GET /api/download/:code/:filename` - Download specific file
- `GET /api/storage` - Get storage usage information

## 💡 Usage

1. **Upload Files**: Drag and drop files or click to select
2. **Get Share Code**: Receive a 4-digit code instantly
3. **Share Code**: Send the code to others via text, email, or QR code
4. **Download Files**: Recipients enter the code to download files
5. **Auto-Cleanup**: Files are automatically deleted after 5 minutes

## 🔒 Security & Limits

- **File Size**: Maximum 200MB per file
- **File Count**: Maximum 15 files per upload
- **Total Storage**: Maximum 2GB total storage
- **Expiration**: Files expire after 5 minutes
- **File Types**: All file types supported

## 🚀 Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
