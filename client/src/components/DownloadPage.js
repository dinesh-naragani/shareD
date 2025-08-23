import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Download, File, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const DownloadPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadCode, setDownloadCode] = useState(code || '');

  const fetchFileInfo = useCallback(async () => {
    if (!downloadCode.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.info(downloadCode));
      setFileInfo(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Share code not found or has expired');
      } else {
        setError('Failed to fetch file information');
      }
      setFileInfo(null);
    } finally {
      setLoading(false);
    }
  }, [downloadCode]);

  useEffect(() => {
    if (code) {
      fetchFileInfo();
    }
  }, [code, fetchFileInfo]);

  const handleDownload = () => {
    window.open(API_ENDPOINTS.download(downloadCode), '_blank');
  };

  const handleIndividualDownload = (filename) => {
    window.open(API_ENDPOINTS.downloadFile(downloadCode, filename), '_blank');
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (downloadCode.trim()) {
      fetchFileInfo();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text font-gilroy mb-3 sm:mb-4">
            Share'D - Download Files
          </h1>
          <p className="text-gray-300 text-base sm:text-lg slide-up px-4">
            Enter a 4-digit share code to download files
          </p>
        </div>

        {/* Code Input Card */}
        <div className="card mb-6 sm:mb-8 slide-up">
          <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">
                Share Code
              </label>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  value={downloadCode}
                  onChange={(e) => setDownloadCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  className="input-field text-center text-2xl sm:text-4xl font-mono tracking-wider sm:tracking-widest w-32 h-14 sm:w-40 sm:h-16 bg-gray-800/50 border-gray-600 focus:border-gray-400"
                />
                <button
                  type="submit"
                  disabled={!downloadCode.trim() || loading}
                  className="btn-primary h-14 sm:h-16 px-4 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed hover-lift w-full sm:w-auto"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-gray-700"></div>
                  ) : (
                    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card mb-6 sm:mb-8 border-red-500/30 bg-red-500/10 slide-up stagger-1">
            <div className="flex items-center space-x-2 sm:space-x-3 text-red-400">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <span className="text-base sm:text-lg">{error}</span>
            </div>
          </div>
        )}

        {/* File Information */}
        {fileInfo && (
          <div className="space-y-4 sm:space-y-6 slide-up stagger-2">
            {/* File List */}
            <div className="card hover-lift">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-3 sm:mb-4 text-center">
                Available Files
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {fileInfo.files.map((file, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg hover-lift stagger-3 space-y-2 sm:space-y-0" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <File className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-gray-200 font-medium text-sm sm:text-base truncate block">{file.originalName}</span>
                        <p className="text-xs sm:text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleIndividualDownload(file.originalName)}
                      className="btn-secondary flex items-center space-x-2 hover-lift w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-3 sm:px-4"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Download All Button */}
              <div className="mt-4 sm:mt-6 text-center">
                <button
                  onClick={handleDownload}
                  className="btn-primary text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 flex items-center justify-center space-x-2 mx-auto hover-lift w-full sm:w-auto"
                >
                  <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Download All as ZIP</span>
                </button>
              </div>
            </div>

            {/* Expiration Info */}
            <div className="card bg-gray-800/50 hover-lift">
              <div className="text-center">
                <p className="text-gray-300 text-sm sm:text-base">
                  <strong>Note:</strong> Files expire at{' '}
                  {new Date(fileInfo.expiresAt).toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  Download before they expire!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center justify-center space-x-2 mx-auto hover-lift slide-up stagger-3 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Back to Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
