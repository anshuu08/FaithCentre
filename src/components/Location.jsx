import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import LocationGeoAnimation from './LocationGeoAnimation';

export default function Location({ onOpenLocationModal }) {
  return (
    <section id="location" className="section section-alt" aria-label="Find Us Location" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '24px' }}>
          {/* <span className="section-tag">Gather With Us</span> */}
          <h2 className="section-title" style={{ marginBottom: '8px' }}>{siteConfig.location.heading}</h2>
          <div className="section-divider" style={{ marginTop: '12px' }}>
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
            <div className="section-divider-line" />
          </div>
        </div>

        {/* Location Card */}
        <div className="location-card">
          {/* Animated Geographic Locator Visualization (India -> AP -> Guntur -> Faith Center) */}
          <LocationGeoAnimation onOpenLocationModal={onOpenLocationModal} />


          {/* Details & Address Panel */}
          <div className="location-details-panel">
            <div className="location-address-box">
              <h3 className="location-address-title">{siteConfig.location.name}</h3>
              <p>{siteConfig.location.line1}</p>
              <p style={{ color: 'var(--primary)', fontWeight: 500 }}>{siteConfig.location.landmark}</p>
              <p>{siteConfig.location.area}</p>
              <p>{siteConfig.location.city}, {siteConfig.location.state} {siteConfig.location.pincode}</p>
              <p>{siteConfig.location.country}</p>
            </div>

            <div className="location-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenLocationModal}
              >
                <MapPin size={16} />
                VIEW LOCATION
              </button>
              <a
                href={siteConfig.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Navigation size={16} />
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
