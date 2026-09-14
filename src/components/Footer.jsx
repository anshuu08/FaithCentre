import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: 'Home', path: '/', sectionId: 'home' },
    { label: 'About Us', path: '/#about', sectionId: 'about' },
    { label: 'Testimonies', path: '/testimonies', sectionId: null },
    { label: 'Services', path: '/#services', sectionId: 'services' },
    { label: 'Books', path: '/#books', sectionId: 'books' },
    { label: 'Location', path: '/#location', sectionId: 'location' },
  ];

  const handleFooterLinkClick = (e, link) => {
    if (link.path === '/testimonies') {
      return; // Route to /testimonies
    }

    e.preventDefault();

    if (link.sectionId === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, null, '/');
      } else {
        navigate('/');
      }
      return;
    }

    if (link.sectionId) {
      if (location.pathname === '/') {
        const el = document.getElementById(link.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState(null, null, `/#${link.sectionId}`);
        }
      } else {
        navigate(`/#${link.sectionId}`);
      }
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <div className="footer-brand-title">{siteConfig.churchName}</div>
            <div className="footer-brand-sub">— {siteConfig.pastorName} —</div>
          </div>

          {/* Navigation Links */}
          <nav className="footer-nav" aria-label="Footer Navigation">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={(e) => handleFooterLinkClick(e, link)}
                className="footer-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {siteConfig.social.facebook && (
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            )}
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            )}
            {siteConfig.social.youtube && (
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {currentYear} Faith Center - Nehemiah David. All rights reserved.</p>
          <p>A place of faith, hope, transformation and God's presence.</p>
        </div>
      </div>
    </footer>
  );
}
