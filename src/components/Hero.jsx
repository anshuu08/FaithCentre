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
          <h1 className="hero-title" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', letterSpacing: '-0.03em', fontWeight: '800', marginBottom: '0px', textShadow: '0 2px 10px rgba(0,0,0,0.5)', color: '#ffffff' }}>
            {siteConfig.churchName}
          </h1>
          <div style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', letterSpacing: '0.3em', color: '#ffffff', textTransform: 'uppercase', marginTop: '10px', textShadow: '0 0 20px rgba(14, 165, 233, 0.9), 0 0 40px rgba(14, 165, 233, 0.5)' }}>
            {siteConfig.pastorName}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenTestimonyModal}
            style={{
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '14px 32px',
              fontSize: '1.05rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.transform = 'translateY(-2px)'; 
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
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '14px 32px',
              fontSize: '1.05rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#1e293b'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#0f172a'; }}
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
