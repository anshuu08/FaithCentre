import React from 'react';
import { Milestone } from 'lucide-react';

export default function Journey() {
  return (
    <section id="journey" className="section" aria-label="Our Journey">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">History & Milestones</span>
          <h2 className="section-title">OUR JOURNEY</h2>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
            <div className="section-divider-line" />
          </div>
        </div>

        {/* Empty Content Area - Prepared for future milestone data */}
        <div className="journey-empty-card">
          <Milestone className="journey-empty-icon" />
          <p className="journey-empty-text">
            The story of God's faithfulness and work through Faith Center will be chronicled here.
          </p>
        </div>
      </div>
    </section>
  );
}
