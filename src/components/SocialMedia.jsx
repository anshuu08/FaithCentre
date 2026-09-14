import React, { useState } from 'react';
import { Instagram, Youtube, Facebook, ArrowUpRight, Wifi, Battery, Signal } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function SocialMedia() {
  const [hoveredApp, setHoveredApp] = useState(null);

  const apps = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@faithcenter.in',
      url: siteConfig.social.instagram || 'https://www.instagram.com/faithcenter.in/',
      icon: Instagram,
      gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      actionText: 'Follow',
      accentColor: '#e1306c'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@NehemiahDavid',
      url: siteConfig.social.youtube || 'https://www.youtube.com/@NehemiahDavid',
      icon: Youtube,
      gradient: 'linear-gradient(135deg, #ff0000 0%, #c40000 100%)',
      actionText: 'Subscribe',
      accentColor: '#ff0000'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'faithcenter.in',
      url: siteConfig.social.facebook || 'https://www.facebook.com/faithcenter.in',
      icon: Facebook,
      gradient: 'linear-gradient(135deg, #1877f2 0%, #0d65d9 100%)',
      actionText: 'Connect',
      accentColor: '#1877f2'
    }
  ];

  return (
    <section className="section" id="community" aria-label="Connect With Faith Center">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">CONNECT WITH FAITH CENTER</h2>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
            <div className="section-divider-line" />
          </div>
        </div>

        {/* Centered Realistic iPhone Showcase */}
        <div className="iphone-showcase-wrapper">
          <div className={`iphone-device ${hoveredApp ? `hovered-${hoveredApp}` : ''}`}>
            {/* Precision Side Buttons */}
            <div className="iphone-btn-silent" aria-hidden="true" />
            <div className="iphone-btn-volume-up" aria-hidden="true" />
            <div className="iphone-btn-volume-down" aria-hidden="true" />
            <div className="iphone-btn-power" aria-hidden="true" />

            {/* Ultra-Thin Metallic Titanium Bezel */}
            <div className="iphone-outer-bezel">
              {/* Flush Glass Screen */}
              <div className="iphone-screen">
                {/* Subtle Curved Glass Specular Highlight */}
                <div className="iphone-screen-glare" aria-hidden="true" />

                {/* Status Bar */}
                <div className="iphone-status-bar">
                  <span className="iphone-status-time">9:41</span>
                  {/* Dynamic Island */}
                  <div className="iphone-dynamic-island">
                    <div className="iphone-camera-sensor" />
                  </div>
                  <div className="iphone-status-icons" aria-hidden="true">
                    <Signal size={10} strokeWidth={2.4} />
                    <Wifi size={10} strokeWidth={2.4} />
                    <Battery size={12} strokeWidth={2.4} />
                  </div>
                </div>

                {/* Screen Header Content */}
                <div className="iphone-app-header">
                  <div className="iphone-church-logo-wrap">
                    <img
                      src="/assets/fc-round.png"
                      alt="Faith Center Logo"
                      className="iphone-church-logo-img"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="iphone-church-title">{siteConfig.churchName}</h3>
                  <div className="iphone-church-subtitle">— {siteConfig.pastorName} —</div>
                  <span className="iphone-live-status">OFFICIAL CHANNELS</span>
                </div>

                {/* 3 Interactive App Icons Launcher */}
                <div className="iphone-app-launcher" role="list">
                  {apps.map((app) => {
                    const Icon = app.icon;
                    return (
                      <a
                        key={app.id}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`iphone-app-item iphone-app-${app.id}`}
                        aria-label={`Open Faith Center on ${app.name} (${app.handle})`}
                        onMouseEnter={() => setHoveredApp(app.id)}
                        onMouseLeave={() => setHoveredApp(null)}
                        role="listitem"
                      >
                        <div
                          className="iphone-app-icon"
                          style={{ background: app.gradient }}
                        >
                          <Icon size={18} className="iphone-icon-svg" />
                        </div>

                        <div className="iphone-app-details">
                          <span className="iphone-app-name">{app.name}</span>
                          <span className="iphone-app-handle">{app.handle}</span>
                        </div>

                        <div className="iphone-app-action" aria-hidden="true">
                          <ArrowUpRight size={13} className="iphone-action-arrow" />
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Bottom Home Indicator Bar */}
                <div className="iphone-home-indicator-area">
                  <div className="iphone-home-bar" />
                </div>
              </div>
            </div>

            {/* Realistic Ambient Ground Shadow */}
            <div className="iphone-ground-shadow" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
