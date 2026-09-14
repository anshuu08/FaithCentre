import React, { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../config/siteConfig';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section section-alt" aria-label="About Us">
      <div className="container">
        {/* 2-Column Desktop Grid */}
        <div className="about-grid">
          {/* Left Column: Header + Biography + Mission */}
          <div className="about-bio-content">
            <div className="about-header-left">
              <h2 className="section-title about-title-left">ABOUT US</h2>
            </div>

            <p
              className="about-bio-text"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
              }}
            >
              {siteConfig.pastors.paragraphs[0]}
            </p>

            <div
              className="about-mission-box"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.25s, transform 0.8s ease-out 0.25s'
              }}
            >
              <div className="about-mission-heading">Our Mission & Calling</div>
              <p className="about-mission-text">
                {siteConfig.pastors.paragraphs[1]}
              </p>
            </div>
          </div>

          {/* Right Column: Pastors Image inside Glass Container */}
          <div className="about-image-col">

            <div
              className="pastors-glass-frame"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.97)',
                transition: 'opacity 0.9s ease-out 0.15s, transform 0.9s ease-out 0.15s'
              }}
            >
              <div className="pastors-image-wrapper">
                <img
                  src={siteConfig.pastors.image}
                  alt={siteConfig.pastors.alt}
                  className="pastors-image"
                  loading="lazy"
                />
              </div>
              <div className="pastors-caption">
                <h3 className="pastors-caption-name">Pastor Nehemiah David & Pastor Prathibha</h3>
                <p className="pastors-caption-role">Founders & Senior Pastors — Faith Centre</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
