import React from 'react';
import { ChevronDown } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Hero({ onOpenTestimonyModal }) {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="home" aria-label="Welcome Hero">
      {/* Background Video */}
      <div className="hero-video-wrapper">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/pastors.png"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
          <source src="/assets/WhatsApp Video 2026-09-09 at 9.50.17 PM.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Subtle Cinematic Overlay */}
      <div className="hero-overlay" />

      {/* Glass Content Panel */}
      <div className="container hero-content-container">
        <div className="hero-glass-panel">
          <span className="hero-eyebrow">
            Welcome to the House of the Lord
          </span>


          <h1 className="hero-title">{siteConfig.churchName}</h1>
          <div className="hero-pastor-title">— {siteConfig.pastorName} —</div>

          <p className="hero-tagline">{siteConfig.tagline}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenTestimonyModal}
            >
              SHARE YOUR TESTIMONY
            </button>
            <button
              type="button"
              className="btn btn-glass"
              onClick={scrollToAbout}
            >
              DISCOVER OUR STORY
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div
        className="hero-scroll-indicator"
        onClick={scrollToAbout}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Scroll to About section"
      >
        <span>Scroll</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
}
