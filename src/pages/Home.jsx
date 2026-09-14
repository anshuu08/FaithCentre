import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import TestimonyCTA from '../components/TestimonyCTA';
import Services from '../components/Services';
import Location from '../components/Location';
import Books from '../components/Books';
import SowSeed from '../components/SowSeed';
import SocialMedia from '../components/SocialMedia';

export default function Home({ onOpenTestimonyModal, onOpenLocationModal }) {
  return (
    <main>
      {/* 1. Hero */}
      <Hero onOpenTestimonyModal={onOpenTestimonyModal} />

      {/* 2. About Us */}
      <About />

      {/* 3. Share Your Testimony */}
      <TestimonyCTA onOpenModal={onOpenTestimonyModal} />

      {/* 5. Worship & Gatherings (Service Details) */}
      <Services />

      {/* 6. Location */}
      <Location onOpenLocationModal={onOpenLocationModal} />

      {/* 7. Books Written by Nehemiah David (3D Covers) */}
      <Books />

      {/* 8. Partnership & Generosity (Sow a Seed) */}
      <SowSeed />

      {/* 9. Community & Fellowship (Connect With Faith Center) */}
      <SocialMedia />
    </main>
  );
}
