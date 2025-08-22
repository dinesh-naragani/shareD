import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Download, File, ArrowLeft, Search, AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold gradient-text font-gilroy mb-4">
            Share'D - Download Files
          </h1>
          <p className="text-gray-300 text-lg slide-up">
            Enter a 4-digit share code to download files
          </p>
        </div>

        {/* Code Input Card */}
        <div className="card mb-8 slide-up">
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Share Code
              </label>
              <div className="flex items-center justify-center space-x-4">
                <input
                  type="text"
                  value={downloadCode}
                  onChange={(e) => setDownloadCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  className="input-field text-center text-4xl font-mono tracking-widest w-40 h-16 bg-gray-800/50 border-gray-600 focus:border-gray-400"
                />
                <button
                  type="submit"
                  disabled={!downloadCode.trim() || loading}
                  className="btn-primary h-16 px-6 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700"></div>
                  ) : (
                    <Search className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card mb-8 border-red-500/30 bg-red-500/10 slide-up stagger-1">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="h-6 w-6" />
              <span className="text-lg">{error}</span>
            </div>
          </div>
        )}

        {/* File Information */}
        {fileInfo && (
          <div className="space-y-6 slide-up stagger-2">
            {/* File List */}
            <div className="card hover-lift">
              <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">
                Available Files
              </h3>
              <div className="space-y-3">
                {fileInfo.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover-lift stagger-3" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex items-center space-x-3">
                      <File className="h-6 w-6 text-gray-400" />
                      <div>
                        <span className="text-gray-200 font-medium">{file.originalName}</span>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleIndividualDownload(file.originalName)}
                      className="btn-secondary flex items-center space-x-2 hover-lift"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Download All Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleDownload}
                  className="btn-primary text-lg py-4 px-8 flex items-center justify-center space-x-2 mx-auto hover-lift"
                >
                  <Download className="h-6 w-6" />
                  <span>Download All as ZIP</span>
                </button>
              </div>
            </div>

            {/* Expiration Info */}
            <div className="card bg-gray-800/50 hover-lift">
              <div className="text-center">
                <p className="text-gray-300">
                  <strong>Note:</strong> Files expire at{' '}
                  {new Date(fileInfo.expiresAt).toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Download before they expire!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center justify-center space-x-2 mx-auto hover-lift slide-up stagger-3"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
