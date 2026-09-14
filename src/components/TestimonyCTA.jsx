import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowRight } from 'lucide-react';

export default function TestimonyCTA({ onOpenModal }) {
  return (
    <section className="section section-alt" aria-label="Share Your Testimony CTA">
      <div className="container">
        <div className="testimony-cta-card">
          <span className="section-tag">Testimonies of Grace</span>
          <h2 className="section-title">SHARE YOUR TESTIMONY</h2>
          
          <p className="testimony-cta-quote">
            "Your story may be the encouragement someone else is praying for."
          </p>

          <div className="testimony-cta-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenModal}
            >
              <HeartHandshake size={18} />
              ADD YOUR TESTIMONY
            </button>
            <Link to="/testimonies" className="btn btn-secondary">
              VIEW ALL TESTIMONIES
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
