import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Navbar({ onOpenTestimonyModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [inHero, setInHero] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll detection and active section indicator on homepage
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname === '/') {
        const heroEl = document.getElementById('home');
        const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : window.innerHeight;
        // Navbar is hidden while in the hero section
        const currentlyInHero = window.scrollY < heroBottom - 90;
        setInHero(currentlyInHero);

        // Sections in reverse order from bottom to top
        const sectionIds = ['location', 'books', 'services', 'about'];
        const scrollPosition = window.scrollY + 240;

        let current = currentlyInHero ? 'home' : '';
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && scrollPosition >= el.offsetTop) {
            current = id;
            break;
          }
        }
        setActiveSection(current || (currentlyInHero ? 'home' : 'about'));
      } else {
        setInHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle hash scrolling on route change or direct external link
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle ESC key for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'HOME', path: '/', sectionId: 'home' },
    { label: 'ABOUT US', path: '/#about', sectionId: 'about' },
    { label: 'TESTIMONIES', path: '/testimonies', sectionId: null },
    { label: 'SERVICES', path: '/#services', sectionId: 'services' },
    { label: 'BOOKS', path: '/#books', sectionId: 'books' },
    { label: 'LOCATION', path: '/#location', sectionId: 'location' },
  ];

  const handleNavClick = (e, item) => {
    if (item.path === '/testimonies') {
      setMobileMenuOpen(false);
      return; // Regular router navigation to /testimonies page
    }

    e.preventDefault();
    setMobileMenuOpen(false);

    if (item.sectionId === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, null, '/');
      } else {
        navigate('/');
      }
      return;
    }

    if (item.sectionId) {
      if (location.pathname === '/') {
        const el = document.getElementById(item.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState(null, null, `/#${item.sectionId}`);
        }
      } else {
        navigate(`/#${item.sectionId}`);
      }
    }
  };

  const isItemActive = (item) => {
    if (item.path === '/testimonies') {
      return location.pathname === '/testimonies';
    }
    if (location.pathname !== '/') return false;
    return activeSection === item.sectionId;
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${inHero ? 'navbar-in-hero' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo / Brand Name */}
          <Link
            to="/"
            className="navbar-brand"
            aria-label="Faith Center Home"
            onClick={(e) => handleNavClick(e, navItems[0])}
          >
            <span className="brand-title">{siteConfig.churchName}</span>
            <span className="brand-subtitle">— {siteConfig.pastorName} —</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop" aria-label="Main Navigation">
            <ul className="nav-links">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <li key={item.label} style={{ flexShrink: 0 }}>
                    <Link
                      to={item.path}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`nav-link ${active ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={onOpenTestimonyModal}
                  className="nav-link nav-link-btn"
                >
                  ADD TESTIMONY
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-drawer-header">
          <div className="navbar-brand">
            <span className="brand-title" style={{ color: 'var(--primary)' }}>{siteConfig.churchName}</span>
            <span className="brand-subtitle" style={{ color: '#0284c7' }}>— {siteConfig.pastorName} —</span>
          </div>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`mobile-nav-link ${active ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTestimonyModal();
              }}
              className="mobile-nav-link"
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
            >
              ADD TESTIMONY
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
