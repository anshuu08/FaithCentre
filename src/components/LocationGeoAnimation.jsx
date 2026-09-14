import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import indiaMapData from '../data/indiaMapData.json';

export default function LocationGeoAnimation({ onOpenLocationModal }) {
  // Step 0: India Overview
  // Step 1: Andhra Pradesh Zoom & Highlight
  // Step 2: Guntur District Zoom
  // Step 3: Faith Centre Pin & Breathing Pulse
  const [activeStep, setActiveStep] = useState(0);
  const timerRef = useRef(null);

  const steps = [
    { id: 0, label: 'INDIA' },
    { id: 1, label: 'ANDHRA PRADESH' },
    { id: 2, label: 'GUNTUR' },
    { id: 3, label: 'FAITH CENTRE' }
  ];

  // Auto-progressing sequence:
  // Step 0: India (2.8s)
  // Step 1: Andhra Pradesh (2.8s)
  // Step 2: Guntur (2.8s)
  // Step 3: Faith Centre pin (5.5s)
  useEffect(() => {
    let current = 0;
    const scheduleNext = () => {
      const delay = current === 3 ? 5500 : 2800;
      timerRef.current = setTimeout(() => {
        current = (current + 1) % 4;
        setActiveStep(current);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStepClick = (e, index) => {
    e.stopPropagation();
    setActiveStep(index);
  };

  // Precise Camera Zoom Settings mapped to authentic GeoJSON bounds
  // Canvas ViewBox: 0 0 600 680 (Center: 300, 340)
  // AP Center: 261, 423
  // Guntur Center: 247, 415
  // Faith Centre: 254.7, 414.3
  const getCameraStyle = () => {
    switch (activeStep) {
      case 1:
        // Andhra Pradesh Zoom
        return {
          transform: 'translate(39px, -83px) scale(2.6)',
          transformOrigin: '261px 423px'
        };
      case 2:
        // Guntur District Zoom
        return {
          transform: 'translate(53px, -75px) scale(6.2)',
          transformOrigin: '247px 415px'
        };
      case 3:
        // Faith Centre Precision Pin Zoom
        return {
          transform: 'translate(45.3px, -74.3px) scale(9.5)',
          transformOrigin: '254.7px 414.3px'
        };
      case 0:
      default:
        // Complete India National Outline
        return {
          transform: 'translate(0px, 0px) scale(1)',
          transformOrigin: '300px 340px'
        };
    }
  };

  const fc = indiaMapData.faithCentre;

  return (
    <div
      className="geo-anim-card"
      onClick={onOpenLocationModal}
      role="button"
      tabIndex={0}
      aria-label="Interactive Geographically Accurate India Locator - Click to open location modal"
    >
      {/* Top Header Bar */}
      <div className="geo-anim-header">
        <div className="geo-header-title">
          <Navigation size={15} className="geo-nav-icon" style={{ color: 'var(--primary)' }} />
          <span>SANCTUARY COORDINATES</span>
        </div>
        <span className="geo-badge">{fc.lat}° N, {fc.lon}° E</span>
      </div>

      {/* Interactive Step Navigation */}
      <div className="geo-steps-row" onClick={(e) => e.stopPropagation()}>
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          const isPassed = activeStep > idx;
          return (
            <button
              key={step.id}
              type="button"
              className={`geo-step-btn ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
              onClick={(e) => handleStepClick(e, idx)}
              aria-label={`Focus on ${step.label}`}
            >
              <span className="geo-step-dot" />
              <span className="geo-step-text">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Map Viewport */}
      <div className="geo-map-viewport">
        <svg
          viewBox={indiaMapData.viewBox}
          className="geo-svg"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Geographically accurate locator map of India, Andhra Pradesh, and Guntur"
        >
          <defs>
            {/* Subtle background radial gradient */}
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#105467" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#105467" stopOpacity="0" />
            </radialGradient>

            {/* Subtle cartographic grid lines */}
            <pattern id="geoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 84, 103, 0.05)" strokeWidth="0.8" />
            </pattern>

            {/* Glowing filter for Faith Centre Red Pin */}
            <filter id="redPinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ef4444" floodOpacity="0.75" />
            </filter>
            <filter id="badgeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(16, 84, 103, 0.4)" />
            </filter>
          </defs>

          {/* Cartographic Background */}
          <rect width="100%" height="100%" fill="#ffffff" />
          <rect width="100%" height="100%" fill="url(#geoGrid)" />
          <rect width="100%" height="100%" fill="url(#mapGlow)" />

          {/* Smooth Camera Transform Group */}
          <g
            className="geo-camera"
            style={{
              ...getCameraStyle(),
              transition: 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {/* 1. ALL 36 INDIAN STATES (Real Geographic Polygons from official GeoJSON) */}
            <g className="geo-all-states">
              {indiaMapData.statePaths.map((st) => {
                const isAP = st.name === 'Andhra Pradesh';
                return (
                  <path
                    key={st.name}
                    d={st.path}
                    className={`geo-state-boundary ${isAP ? 'ap-state' : ''}`}
                    fill={isAP ? (activeStep >= 1 ? 'rgba(16, 84, 103, 0.16)' : 'rgba(16, 84, 103, 0.07)') : 'rgba(16, 84, 103, 0.025)'}
                    stroke="#105467"
                    strokeWidth={activeStep > 1 ? 0.35 : 0.85}
                    strokeOpacity={isAP ? (activeStep >= 1 ? 0.95 : 0.6) : 0.38}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* INDIA Central Label on Step 0 */}
            {activeStep === 0 && (
              <g className="geo-india-label" opacity="0.85">
                <text
                  x="285"
                  y="310"
                  textAnchor="middle"
                  fill="#105467"
                  fontSize="15"
                  fontFamily="'Cinzel', 'Playfair Display', serif"
                  fontWeight="700"
                  letterSpacing="0.28em"
                >
                  INDIA
                </text>
              </g>
            )}

            {/* 2. ANDHRA PRADESH ENHANCED STATE BOUNDARY */}
            <path
              d={indiaMapData.apPath}
              className={`geo-ap-highlight ${activeStep >= 1 ? 'active' : ''}`}
              fill={activeStep >= 1 ? 'rgba(16, 84, 103, 0.14)' : 'transparent'}
              stroke="#105467"
              strokeWidth={activeStep >= 1 ? 1.4 : 0.6}
              strokeOpacity={activeStep >= 1 ? 1 : 0.3}
              strokeLinejoin="round"
            />

            {/* Andhra Pradesh Label (Visible at Step 1) */}
            {activeStep === 1 && (
              <g className="geo-ap-label">
                <text
                  x="284"
                  y="442"
                  textAnchor="middle"
                  fill="#105467"
                  fontSize="6.2"
                  fontFamily="'Inter', sans-serif"
                  fontWeight="700"
                  letterSpacing="0.12em"
                >
                  ANDHRA PRADESH
                </text>
              </g>
            )}

            {/* 3. GUNTUR DISTRICT ACCURATE BOUNDARY */}
            <path
              d={indiaMapData.gunturPath}
              className={`geo-guntur-highlight ${activeStep >= 2 ? 'active' : ''}`}
              fill={activeStep >= 2 ? 'rgba(16, 84, 103, 0.28)' : 'transparent'}
              stroke="#105467"
              strokeWidth={activeStep >= 2 ? 0.7 : 0.2}
              strokeOpacity={activeStep >= 2 ? 1 : 0}
              strokeLinejoin="round"
            />

            {/* Guntur District Label */}
            {activeStep >= 2 && (
              <g className="geo-guntur-label">
                <text
                  x="247"
                  y={activeStep >= 3 ? "409" : "411"}
                  textAnchor="middle"
                  fill="#105467"
                  fontSize={activeStep >= 3 ? "2.2" : "3.6"}
                  fontFamily="'Inter', sans-serif"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  GUNTUR
                </text>
              </g>
            )}

            {/* 4. FAITH CENTRE EXACT PIN & PULSING RINGS */}
            {/* Pulsing Ripple Rings */}
            {activeStep >= 2 && (
              <>
                <circle
                  cx={fc.x}
                  cy={fc.y}
                  r="4"
                  className="geo-pulse-ring geo-pulse-ring-1"
                />
                <circle
                  cx={fc.x}
                  cy={fc.y}
                  r="7"
                  className="geo-pulse-ring geo-pulse-ring-2"
                />
              </>
            )}

            {/* Red Map Pointer Pin */}
            <g className={`geo-pin-group ${activeStep >= 2 ? 'active' : ''}`}>
              {/* Red Pin Path pointing exactly to fc.x, fc.y */}
              <path
                d={`M ${fc.x} ${fc.y} 
                    C ${fc.x - 1.6} ${fc.y - 2.2}, ${fc.x - 3.2} ${fc.y - 4.5}, ${fc.x - 3.2} ${fc.y - 7} 
                    C ${fc.x - 3.2} ${fc.y - 8.8}, ${fc.x - 1.8} ${fc.y - 10.2}, ${fc.x} ${fc.y - 10.2} 
                    C ${fc.x + 1.8} ${fc.y - 10.2}, ${fc.x + 3.2} ${fc.y - 8.8}, ${fc.x + 3.2} ${fc.y - 7} 
                    C ${fc.x + 3.2} ${fc.y - 4.5}, ${fc.x + 1.6} ${fc.y - 2.2}, ${fc.x} ${fc.y} Z`}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="0.55"
                filter="url(#redPinGlow)"
              />
              <circle cx={fc.x} cy={fc.y - 7} r="1.15" fill="#ffffff" />

              {/* Faith Centre Floating Badge on Step 3 */}
              {activeStep === 3 && (
                <g className="geo-fc-callout">
                  <rect
                    x={fc.x - 22}
                    y={fc.y - 19.5}
                    width="44"
                    height="8.2"
                    rx="1.5"
                    fill="#105467"
                    stroke="#ffffff"
                    strokeWidth="0.35"
                    filter="url(#badgeShadow)"
                  />
                  <text
                    x={fc.x}
                    y={fc.y - 14.3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="2.7"
                    fontFamily="'Inter', sans-serif"
                    fontWeight="700"
                    letterSpacing="0.08em"
                  >
                    FAITH CENTRE
                  </text>
                  {/* Subtle Pointer Arrow down to the pin */}
                  <polygon
                    points={`${fc.x - 1.2},${fc.y - 11.3} ${fc.x + 1.2},${fc.y - 11.3} ${fc.x},${fc.y - 10.4}`}
                    fill="#105467"
                  />
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Card Footer */}
      <div className="geo-anim-footer">
        <div className="geo-footer-location">
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>Amaravati Road, Gorantla, Guntur</span>
        </div>
        <div className="geo-pulse-indicator">
          <span className="live-dot" />
          <span>Tap for directions</span>
        </div>
      </div>
    </div>
  );
}
