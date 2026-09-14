import React, { useEffect } from 'react';
import { X, Navigation, MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function LocationModal({ isOpen, onClose }) {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={24} style={{ color: '#ef4444' }} />
            <h3 id="location-modal-title" className="modal-title">FAITH CENTER</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close location window"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ lineHeight: '1.9', fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '1.15rem', marginBottom: '4px' }}>
              Faith Center
            </strong>
            <p>{siteConfig.location.line1}</p>
            <p>{siteConfig.location.landmark}</p>
            <p>{siteConfig.location.area}</p>
            <p>{siteConfig.location.city}</p>
            <p>{siteConfig.location.state} {siteConfig.location.pincode}</p>
            <p>{siteConfig.location.country}</p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href={siteConfig.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flex: '1 1 auto' }}
            >
              <Navigation size={18} />
              GET DIRECTIONS
            </a>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
