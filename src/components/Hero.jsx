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

      {/* Minimalist Content */}
      <div className="container hero-content-container" style={{ animation: 'heroFadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
        <div style={{ transform: 'translateY(-6vh)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '-0.02em', fontWeight: '700', marginBottom: '0px', textShadow: '0 4px 24px rgba(0,0,0,0.4)', color: '#ffffff' }}>
            {siteConfig.churchName}
          </h1>
          <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)', letterSpacing: '0.35em', color: '#ffffff', textTransform: 'uppercase', marginTop: '12px', textShadow: '0 0 24px rgba(14, 165, 233, 0.8), 0 0 48px rgba(14, 165, 233, 0.4)' }}>
            {siteConfig.pastorName}
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenTestimonyModal}
            style={{
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              padding: '16px 36px',
              fontSize: '0.95rem',
              fontWeight: '500',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.transform = 'translateY(-3px)'; 
              e.currentTarget.style.background = '#1e293b'; 
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.transform = 'none'; 
              e.currentTarget.style.background = '#0f172a'; 
            }}
          >
            Add Testimony
          </button>

          <button
            type="button"
            onClick={scrollToAbout}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              borderRadius: '40px',
              padding: '16px 36px',
              fontSize: '0.95rem',
              fontWeight: '500',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.transform = 'translateY(-3px)'; 
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.transform = 'none'; 
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; 
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Discover our story <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>→</span>
          </button>
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
