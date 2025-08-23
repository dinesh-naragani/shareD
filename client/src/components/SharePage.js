import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, ArrowLeft, Download, AlertCircle } from 'lucide-react';

const SharePage = ({ uploadData: propUploadData }) => {
  const navigate = useNavigate();
  const [uploadData] = useState(propUploadData || null);
  const [copied, setCopied] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if we have upload data
  useEffect(() => {
    if (!uploadData) {
      setShowRedirect(true);
      // Redirect to home after 3 seconds
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadData, navigate]);

  if (!uploadData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-4">
        <div className="w-full max-w-2xl text-center">
          {/* Error Icon */}
          <div className="mb-6 sm:mb-8 fade-in">
            <AlertCircle className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-3 sm:mb-4">
              No Files to Share
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mb-4 sm:mb-6 px-4">
              You need to upload files first before accessing the share page.
            </p>
          </div>

          {/* Redirect Message */}
          {showRedirect && (
            <div className="card mb-6 sm:mb-8 slide-up">
              <div className="text-center">
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Redirecting you to the upload page in a few seconds...
                </p>
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  <span className="text-sm sm:text-base">Redirecting...</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4 slide-up stagger-1 px-4">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="btn-primary flex items-center justify-center space-x-2 mx-auto hover-lift w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Go to Upload Page</span>
            </button>
            
            <button
              onClick={() => navigate('/download', { replace: true })}
              className="btn-secondary flex items-center justify-center space-x-2 mx-auto hover-lift w-full sm:w-auto"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Go to Download Page</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uploadData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Share\'D Files',
        text: `Download my files using code: ${uploadData.code}`,
        url: `${window.location.origin}/download/${uploadData.code}`
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text font-gilroy mb-3 sm:mb-4">
            Share'D - Files Ready!
          </h1>
          <p className="text-gray-300 text-base sm:text-lg slide-up px-4">
            Share this code with others to let them download your files
          </p>
        </div>

        {/* Share Code and QR Code Side by Side - No Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 mb-8 sm:mb-12">
          {/* Share Code Section - No Card */}
          <div className="text-center slide-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-6 sm:mb-8">
              Your Share Code
            </h2>
            <div className="mb-6 sm:mb-8">
              <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tracking-wider sm:tracking-widest mb-4 sm:mb-6 font-gilroy scale-in">
                {uploadData.code}
              </div>
              <p className="text-gray-400 text-xs sm:text-sm slide-up stagger-1 px-2">
                Valid for 5 minutes • Unlimited downloads
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={copyToClipboard}
                className="btn-primary flex items-center justify-center space-x-2 hover-lift w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
              
              <button
                onClick={shareCode}
                className="btn-secondary flex items-center justify-center space-x-2 hover-lift w-full sm:w-auto"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* QR Code Section - No Card, with Border Radius */}
          <div className="text-center flex flex-col items-center justify-center slide-up stagger-1">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-6 sm:mb-8">
              QR Code
            </h3>
            <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
              <QRCodeSVG
                value={`${window.location.origin}/download/${uploadData.code}`}
                size={160}
                level="H"
                className="w-40 h-40 sm:w-48 sm:h-48 lg:w-50 lg:h-50"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6 slide-up stagger-2 px-2">
              Scan with your phone to download files
            </p>
          </div>
        </div>

        {/* File Info Card */}
        <div className="card mb-6 sm:mb-8 hover-lift slide-up stagger-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-3 sm:mb-4 text-center">
            Files Shared
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {uploadData.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover-lift stagger-3" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm sm:text-base truncate">{file.originalName}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 p-3 bg-gradient-to-r from-gray-500/10 to-gray-400/10 rounded-lg">
            <p className="text-gray-300 text-xs sm:text-sm text-center">
              <strong>Total:</strong> {uploadData.files.length} file(s) • 
              Expires at {new Date(uploadData.expiresAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center justify-center space-x-2 mx-auto hover-lift slide-up stagger-3 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Upload More Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePage;
