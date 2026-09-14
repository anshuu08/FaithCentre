import React from 'react';
import { Clock } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Services() {
  return (
    <section id="services" className="section" aria-label="Service Details">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Worship & Gatherings</span>
          <h2 className="section-title">SERVICE DETAILS</h2>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
            <div className="section-divider-line" />
          </div>
        </div>

        {/* 3 Columns Desktop, 2 Columns Tablet, 1 Column Mobile */}
        <div className="services-grid">
          {siteConfig.services.map((service) => (
            <article key={service.id} className="service-card">
              <div className="service-image-box">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="service-image"
                  loading="lazy"
                />
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <div className="service-schedule">
                  <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                  {service.schedule}
                </div>
                <p className="service-desc">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
