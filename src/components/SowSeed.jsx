import React, { useState } from 'react';
import { Copy, Check, Heart } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function SowSeed() {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (key, value) => {
    const fallbackCopy = () => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2500);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value)
        .then(() => {
          setCopiedKey(key);
          setTimeout(() => setCopiedKey(null), 2500);
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  };

  const details = [
    {
      key: 'accountName',
      label: 'Account Name',
      value: siteConfig.giving.details.accountName,
      copyValue: siteConfig.giving.details.accountName,
      canCopy: true
    },
    {
      key: 'accountNumber',
      label: 'Account Number',
      value: siteConfig.giving.details.accountNumber,
      copyValue: siteConfig.giving.details.accountNumber,
      canCopy: true
    },
    {
      key: 'ifscCode',
      label: 'IFSC Code',
      value: `${siteConfig.giving.details.ifscCode} (${siteConfig.giving.details.bankName})`,
      copyValue: siteConfig.giving.details.ifscCode,
      canCopy: true
    },
    {
      key: 'upiId',
      label: 'Google Pay / UPI Number',
      value: `${siteConfig.giving.details.upiId} (Name: ${siteConfig.giving.details.upiName})`,
      copyValue: siteConfig.giving.details.upiId,
      canCopy: true
    }
  ];

  return (
    <section className="section section-alt" id="giving" aria-label="Sow a Seed and Giving">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          {/* <span className="section-tag">Partnership & Generosity</span> */}
          <h2 className="section-title">{siteConfig.giving.heading}</h2>
          <p className="section-subtitle">{siteConfig.giving.subheading}</p>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
            <div className="section-divider-line" />
          </div>
        </div>

        {/* Giving Card */}
        <div className="giving-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <Heart size={20} fill="var(--primary-soft)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Direct Bank & UPI Contribution
            </span>
          </div>

          <div className="giving-grid">
            {details.map((item) => (
              <div key={item.key} className="giving-row">
                <div className="giving-meta">
                  <span className="giving-label">{item.label}</span>
                  <span className="giving-value">{item.value}</span>
                </div>

                {item.canCopy && (
                  <button
                    type="button"
                    className={`copy-btn ${copiedKey === item.key ? 'copied' : ''}`}
                    onClick={() => handleCopy(item.key, item.copyValue || item.value)}
                    aria-label={`Copy ${item.label}`}
                  >
                    {copiedKey === item.key ? (
                      <>
                        <Check size={14} />
                        Copied ✓
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
