import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Upload, File, Clock, Zap } from 'lucide-react';

const HomePage = ({ setUploadData }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(API_ENDPOINTS.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadData(response.data);
      // Automatic redirect to share page and scroll to top
      navigate('/share', { replace: true });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-4">
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8 fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 gradient-text font-gilroy">
          Share'D
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 slide-up">
          Quick file sharing with 4-digit codes. Upload, share, and download in minutes.
        </p>
        
        {/* Feature Highlights */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 px-4">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-300 slide-up stagger-1">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            <span className="text-sm sm:text-base">Lightning Fast</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-300 slide-up stagger-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <span className="text-sm sm:text-base">5-Minute Expiry</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-300 slide-up stagger-3">
            <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <span className="text-sm sm:text-base">Unlimited Downloads</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="w-full max-w-2xl slide-up px-3 sm:px-0">
        <div className={`card hover-lift ${dragActive ? 'border-gray-400 bg-gray-800/50' : ''}`}>
          <form onSubmit={handleUpload} className="space-y-4 sm:space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-gray-400 bg-gray-800/50' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg text-gray-300 mb-2">
                {dragActive ? 'Drop your files here' : 'Drag & drop files here'}
              </p>
              <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary hover-lift text-sm sm:text-base py-3 sm:py-3 px-6 sm:px-8"
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Fixed Expiration Info */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-500/10 to-gray-400/10 rounded-lg sm:rounded-xl border border-gray-500/20 hover-lift">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300">
                  <strong>Files expire in 5 minutes</strong> - Quick sharing for immediate needs
                </span>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-200">Selected Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover-lift stagger-1" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base truncate">{file.name}</span>
                      <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 text-xs sm:text-sm ml-2 flex-shrink-0 py-1 px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
              <button
                type="submit"
                disabled={isUploading}
                className="w-full btn-primary text-base sm:text-lg py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-gray-700"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Upload & Get Share Code</span>
                  </div>
                )}
              </button>
            )}
          </form>
        </div>

        {/* Download Section */}
        <div className="mt-6 sm:mt-8 card hover-lift slide-up stagger-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-3 sm:mb-4 text-center">
            Have a Share Code?
          </h3>
          <div className="text-center">
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base px-2">
              Enter a 4-digit code to download shared files
            </p>
            <button
              onClick={() => navigate('/download')}
              className="btn-secondary hover-lift text-sm sm:text-base py-3 px-6"
            >
              Download Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
