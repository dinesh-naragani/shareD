import React from 'react';
import Dock from './Dock';
import LightRays from './LightRays';
import { Upload, Download, Home, Settings } from 'lucide-react';

const DemoPage = () => {
  const dockItems = [
    { 
      icon: <Home size={24} color="#e0e0e0" />, 
      label: 'Home', 
      onClick: () => alert('Home clicked!') 
    },
    { 
      icon: <Upload size={24} color="#cccccc" />, 
      label: 'Upload Files', 
      onClick: () => alert('Upload clicked!') 
    },
    { 
      icon: <Download size={24} color="#e0e0e0" />, 
      label: 'Download Files', 
      onClick: () => alert('Download clicked!') 
    },
    { 
      icon: <Settings size={24} color="#cccccc" />, 
      label: 'Settings', 
      onClick: () => alert('Settings clicked!') 
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/* Light Rays Background */}
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
      
      {/* Hero Section */}
      <div className="text-center mb-12 relative z-10 fade-in">
        <h1 className="text-6xl font-bold mb-4 gradient-text font-gilroy">
          Share'D - Try it out!
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl slide-up stagger-1">
          Hover over the dock below to see the beautiful animations and interactions
        </p>
      </div>

      {/* Dock Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-400 mt-8 relative z-10 slide-up stagger-2">
        <p>Move your mouse over the dock to see the magic happen!</p>
      </div>
    </div>
  );
};

export default DemoPage;
