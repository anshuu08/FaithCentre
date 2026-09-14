import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Quote,
  RefreshCw,
  AlertCircle,
  Calendar,
  ArrowLeft,
  Trash2,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { isTestimonyOwner, getLocalTestimonyToken, removeLocalTestimonyToken } from '../services/testimonyTokenService';

// Reverent Christian Cross Icon matching Lucide design system and proportions
const Cross = ({ size = 44, color = '#0284c7', style = {}, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color, margin: '0 auto 16px auto', display: 'block', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2v20" />
    <path d="M7 8h10" />
  </svg>
);

export default function TestimoniesPage({ onOpenModal }) {
  const navigate = useNavigate();
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const fetchTestimonies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/testimonials');
      if (!res.ok) {
        throw new Error('Server returned error status');
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTestimonies(json.data);
      } else {
        setTestimonies([]);
      }
    } catch (err) {
      console.error('Failed to load testimonies:', err);
      setError("We couldn't load the testimonies right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchTestimonies]);

  const handleDeleteTestimony = async (id) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const rawToken = getLocalTestimonyToken(id);
      if (!rawToken) {
        throw new Error('Deletion token not found in this browser. You can only delete testimonies you submitted.');
      }

      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Delete-Token': rawToken
        },
        body: JSON.stringify({ delete_token: rawToken })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete testimony.');
      }

      // Remove token from browser's localStorage
      removeLocalTestimonyToken(id);

      // Immediately update the UI after successful deletion
      setTestimonies((prev) => prev.filter((item) => item.id !== id));
      setDeleteTarget(null);
      setDeleteSuccess('Testimony deleted successfully.');
      setTimeout(() => setDeleteSuccess(''), 4500);
    } catch (err) {
      console.error('Error deleting testimony:', err);
      setDeleteError(err.message || 'Failed to delete testimony from database. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <main className="section" style={{ paddingTop: '110px', minHeight: '80vh' }} aria-label="Testimonies">
      <div className="container">
        {/* Clear Back Arrow at Top of Testimonies Page */}
        <div className="testimonies-top-bar">
          <button
            type="button"
            onClick={handleBack}
            className="testimonies-back-btn"
            aria-label="Return to previous page"
          >
            <ArrowLeft size={17} />
            <span>Back</span>
          </button>
        </div>

        {/* Global Delete Notification Toast */}
        {deleteSuccess && (
          <div className="toast-success" role="status">
            <CheckCircle2 size={18} />
            <span>{deleteSuccess}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="section-header" style={{ marginTop: '16px' }}>
          <span className="section-tag">Living Proof of God's Power</span>
          <h1 className="section-title">TESTIMONIES</h1>
          <p className="section-subtitle">
            Stories of faith, grace, hope and God's faithfulness.
          </p>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
            <div className="section-divider-line" />
          </div>

          <div style={{ marginTop: '28px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenModal}
            >
              <HeartHandshake size={18} />
              SHARE YOUR TESTIMONY
            </button>
          </div>
        </div>


        {/* Loading State with Skeleton Cards */}
        {loading && (
          <div className="testimonials-grid" aria-busy="true" aria-label="Loading testimonies">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div className="skeleton-line" style={{ width: '45%', height: '22px' }} />
                  <div className="skeleton-line" style={{ width: '25%', height: '16px' }} />
                </div>
                <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '10px' }} />
                <div className="skeleton-line" style={{ width: '92%', height: '14px', marginBottom: '10px' }} />
                <div className="skeleton-line" style={{ width: '78%', height: '14px', marginBottom: '24px' }} />
                <div className="skeleton-line" style={{ width: '50%', height: '12px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State with Try Again Button */}
        {!loading && error && (
          <div className="testimonials-empty" role="alert">
            <AlertCircle size={44} style={{ color: '#dc2626', margin: '0 auto 16px auto' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
              {error}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchTestimonies}
            >
              <RefreshCw size={16} />
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && testimonies.length === 0 && (
          <div className="testimonials-empty">
            <Cross size={44} style={{ color: '#0284c7', margin: '0 auto 16px auto' }} />
            <h3 className="testimonials-empty-title">
              Every testimony begins with a story.<br />
              Be the first to share yours.
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Whether great or small, your testimony will ignite faith in others.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenModal}
            >
              <HeartHandshake size={18} />
              SHARE YOUR TESTIMONY
            </button>
          </div>
        )}

        {/* Testimonials List */}
        {!loading && !error && testimonies.length > 0 && (
          <div className="testimonials-grid">
            {testimonies.map((item) => (
              <article key={item.id} className="testimony-card">
                {/* Header: Name, Date & Delete Option */}
                <div className="testimony-card-header">
                  <div>
                    <h2 className="testimony-name">{item.name}</h2>
                    {item.created_at && (
                      <div className="testimony-date">
                        <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                        {formatDate(item.created_at)}
                      </div>
                    )}
                  </div>

                  {/* Delete Option - Only visible if this browser owns the private deletion token */}
                  {isTestimonyOwner(item.id) && (
                    <button
                      type="button"
                      className="testimony-delete-trigger"
                      onClick={() => {
                        setDeleteError(null);
                        setDeleteTarget(item);
                      }}
                      aria-label={`Delete testimony from ${item.name}`}
                      title="Delete your testimony"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {/* Testimony Body */}
                <div className="testimony-quote-body">
                  <Quote
                    size={22}
                    style={{
                      color: 'rgba(14, 165, 233, 0.22)',
                      fill: 'rgba(14, 165, 233, 0.22)',
                      marginBottom: '8px',
                      display: 'block'
                    }}
                  />
                  <p>{item.testimony}</p>
                </div>

                {/* Optional Promise & Message that Strengthened Me */}
                {(item.promise || item.message_details) && (
                  <div className="testimony-extra-section">
                    {item.promise && (
                      <div className="testimony-extra-item">
                        <div className="testimony-extra-label">Scripture / Promise</div>
                        <div className="testimony-extra-val">"{item.promise}"</div>
                      </div>
                    )}

                    {item.message_details && (
                      <div className="testimony-extra-item">
                        <div className="testimony-extra-label">Message That Strengthened Me</div>
                        <div className="testimony-extra-val">{item.message_details}</div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div
            className="modal-overlay"
            onClick={() => !deleting && setDeleteTarget(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div
              className="modal-card"
              style={{ maxWidth: '480px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c' }}>
                  <Trash2 size={20} />
                  <h3 id="delete-modal-title" className="modal-title" style={{ color: '#b91c1c', fontSize: '1.25rem' }}>
                    Delete Testimony
                  </h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => !deleting && setDeleteTarget(null)}
                  disabled={deleting}
                  aria-label="Cancel deletion"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '14px' }}>
                  Are you sure you want to delete the testimony shared by{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{deleteTarget.name}</strong>?
                </p>
                <div style={{ background: 'rgba(16, 84, 103, 0.04)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid var(--primary)', marginBottom: '18px' }}>
                  <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    "{deleteTarget.testimony?.slice(0, 110)}{deleteTarget.testimony?.length > 110 ? '...' : ''}"
                  </p>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '24px' }}>
                  This will permanently delete it from the database. This action cannot be undone.
                </p>

                {deleteError && (
                  <div className="form-alert form-alert-error" role="alert" style={{ marginBottom: '16px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{deleteError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger-action"
                    onClick={() => handleDeleteTestimony(deleteTarget.id)}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Testimony
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

