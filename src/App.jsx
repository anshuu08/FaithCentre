import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TestimonyModal from './components/TestimonyModal';
import LocationModal from './components/LocationModal';

import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import TestimoniesPage from './pages/TestimoniesPage';
import ServicesPage from './pages/ServicesPage';
import LocationPage from './pages/LocationPage';

export default function App() {
  const [testimonyModalOpen, setTestimonyModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [testimoniesKey, setTestimoniesKey] = useState(0);

  const handleOpenTestimonyModal = () => {
    setTestimonyModalOpen(true);
  };

  const handleCloseTestimonyModal = () => {
    setTestimonyModalOpen(false);
  };

  const handleOpenLocationModal = () => {
    setLocationModalOpen(true);
  };

  const handleCloseLocationModal = () => {
    setLocationModalOpen(false);
  };

  const handleTestimonySubmitted = () => {
    // Increment key to trigger refresh of testimonies list if currently on testimonies page
    setTestimoniesKey((prev) => prev + 1);
  };

  return (
    <div className="app-layout">
      {/* Sticky Glass Navbar */}
      <Navbar onOpenTestimonyModal={handleOpenTestimonyModal} />

      {/* Main Routed Content */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onOpenTestimonyModal={handleOpenTestimonyModal}
              onOpenLocationModal={handleOpenLocationModal}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/journey" element={<Navigate to="/" replace />} />
        <Route
          path="/testimonies"
          element={
            <TestimoniesPage
              key={testimoniesKey}
              onOpenModal={handleOpenTestimonyModal}
            />
          }
        />
        <Route path="/services" element={<ServicesPage />} />
        <Route
          path="/location"
          element={<LocationPage onOpenLocationModal={handleOpenLocationModal} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals */}
      <TestimonyModal
        isOpen={testimonyModalOpen}
        onClose={handleCloseTestimonyModal}
        onTestimonySubmitted={handleTestimonySubmitted}
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={handleCloseLocationModal}
      />

      {/* Reverent Footer */}
      <Footer />
    </div>
  );
}
