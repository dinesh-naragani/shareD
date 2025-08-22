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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-8 fade-in">
        <h1 className="text-6xl font-bold mb-6 gradient-text font-gilroy">
          Share'D
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 slide-up">
          Quick file sharing with 4-digit codes. Upload, share, and download in minutes.
        </p>
        
        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center space-x-2 text-gray-300 slide-up stagger-1">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 slide-up stagger-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span>5-Minute Expiry</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 slide-up stagger-3">
            <File className="h-5 w-5 text-gray-400" />
            <span>Unlimited Downloads</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="w-full max-w-2xl slide-up">
        <div className={`card hover-lift ${dragActive ? 'border-gray-400 bg-gray-800/50' : ''}`}>
          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-gray-400 bg-gray-800/50' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg text-gray-300 mb-2">
                {dragActive ? 'Drop your files here' : 'Drag & drop files here'}
              </p>
              <p className="text-gray-500 mb-4">or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary hover-lift"
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
            <div className="p-4 bg-gradient-to-r from-gray-500/10 to-gray-400/10 rounded-xl border border-gray-500/20 hover-lift">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">
                  <strong>Files expire in 5 minutes</strong> - Quick sharing for immediate needs
                </span>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-200">Selected Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover-lift stagger-1" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-300">{file.name}</span>
                      <span className="text-sm text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
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
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload & Get Share Code</span>
                  </div>
                )}
              </button>
            )}
          </form>
        </div>

        {/* Download Section */}
        <div className="mt-8 card hover-lift slide-up stagger-1">
          <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">
            Have a Share Code?
          </h3>
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Enter a 4-digit code to download shared files
            </p>
            <button
              onClick={() => navigate('/download')}
              className="btn-secondary hover-lift"
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
