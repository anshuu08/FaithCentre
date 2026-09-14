import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { generateDeletionToken, hashDeletionToken, saveLocalTestimonyToken } from '../services/testimonyTokenService';

export default function TestimonyModal({ isOpen, onClose, onTestimonySubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    testimony: '',
    promise: '',
    message_details: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const nameInputRef = useRef(null);

  // Focus on name input when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage('');
      setFormData({
        name: '',
        testimony: '',
        promise: '',
        message_details: ''
      });
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic frontend validations
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!formData.testimony.trim()) {
      setErrorMessage('Please enter your testimony.');
      return;
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }

    if (formData.testimony.trim().length < 10) {
      setErrorMessage('Please share a few more details about your testimony (at least 10 characters).');
      return;
    }

    setLoading(true);

    try {
      // 1. Generate cryptographically secure random token & SHA-256 hash
      const rawToken = generateDeletionToken();
      const tokenHash = await hashDeletionToken(rawToken);

      // 2. Submit testimony to server with token hash
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          delete_token_hash: tokenHash
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit testimony. Please try again.');
      }

      // 3. Store private token in browser's localStorage for this testimony ID
      if (data.id) {
        saveLocalTestimonyToken(data.id, rawToken);
      }

      setIsSuccess(true);
      if (onTestimonySubmitted) {
        onTestimonySubmitted();
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 id="modal-title" className="modal-title">Share Your Testimony</h3>
            <p className="modal-subtitle">Give glory to God for what He has done in your life</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {isSuccess ? (
            <div className="form-alert-success">
              <CheckCircle2 className="form-success-icon" />
              <h4 className="form-success-title">Testimony Received</h4>
              <p className="form-success-text">
                Thank you for sharing your testimony. Your story has been received and will encourage many hearts in Christ.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
                style={{ marginTop: '12px' }}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="form-alert form-alert-error" role="alert">
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Name (Required) */}
              <div className="form-group">
                <label htmlFor="testimony-name" className="form-label">
                  <span>Your Name</span>
                  <span className="badge-required">Required</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="testimony-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Emmanuel"
                  className="form-input"
                  maxLength={100}
                  required
                  disabled={loading}
                />
              </div>

              {/* 2. Testimony (Required) */}
              <div className="form-group">
                <label htmlFor="testimony-text" className="form-label">
                  <span>Your Testimony</span>
                  <span className="badge-required">Required</span>
                </label>
                <textarea
                  id="testimony-text"
                  name="testimony"
                  value={formData.testimony}
                  onChange={handleChange}
                  placeholder="Share the miraculous work God has done..."
                  className="form-textarea"
                  maxLength={2500}
                  required
                  disabled={loading}
                />
              </div>

              {/* 3. Your Promise (Optional) */}
              <div className="form-group">
                <label htmlFor="testimony-promise" className="form-label">
                  <span>Your Promise</span>
                  <span className="badge-optional">Optional</span>
                </label>
                <input
                  id="testimony-promise"
                  type="text"
                  name="promise"
                  value={formData.promise}
                  onChange={handleChange}
                  placeholder="e.g. Isaiah 41:10 — 'Fear not, for I am with you...'"
                  className="form-input"
                  maxLength={500}
                  disabled={loading}
                />
              </div>

              {/* 4. Link or Details of Message (Optional) */}
              <div className="form-group">
                <label htmlFor="testimony-message" className="form-label">
                  <span>Link or details of the message that strengthened you</span>
                  <span className="badge-optional">Optional</span>
                </label>
                <input
                  id="testimony-message"
                  type="text"
                  name="message_details"
                  value={formData.message_details}
                  onChange={handleChange}
                  placeholder="e.g. Faith Over Fear Sunday Sermon (July 2026)"
                  className="form-input"
                  maxLength={500}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '12px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'SUBMIT TESTIMONY'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
