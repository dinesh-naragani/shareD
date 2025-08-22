import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center">
          {/* Copyright - Right Aligned */}
          <div className="text-gray-400 text-sm">
            © 2025 Dinesh Naragani. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
