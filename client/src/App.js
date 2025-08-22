import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SharePage from './components/SharePage';
import DownloadPage from './components/DownloadPage';
import DemoPage from './components/DemoPage';
import Dock from './components/Dock';
import LightRays from './components/LightRays';
import Footer from './components/Footer';
import Header from './components/Header';
import { Upload, Download } from 'lucide-react';

function App() {
  const [uploadData, setUploadData] = useState(null);

  const dockItems = [
    {
      icon: <Upload size={24} color="#e0e0e0" />,
      label: 'Upload Files',
      onClick: () => {
        window.location.href = '/';
      }
    },
    {
      icon: <Download size={24} color="#cccccc" />,
      label: 'Download Files',
      onClick: () => {
        window.location.href = '/download';
      }
    }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-black relative flex flex-col">
        {/* Header */}
        <Header />

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

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<HomePage setUploadData={setUploadData} />} />
            <Route
              path="/share"
              element={<SharePage uploadData={uploadData} />}
            />
            <Route
              path="/download"
              element={<DownloadPage />}
            />
            <Route
              path="/download/:code"
              element={<DownloadPage />}
            />
            <Route
              path="/demo"
              element={<DemoPage />}
            />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />

        {/* Dock Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Dock
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            distance={120}
            spring={{ mass: 0.03, stiffness: 600, damping: 35 }}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;
