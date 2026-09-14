import React from 'react';
import { siteConfig } from '../config/siteConfig';

export default function Books() {
  return (
    <section className="section" id="books" aria-label="Books written by Pastor Nehemiah David">
      <div className="container">
        {/* Section Header without Publications & Literature tag */}
        <div className="section-header">
          <h2 className="section-title">BOOKS WRITTEN BY PASTOR NEHEMIAH DAVID</h2>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
            <div className="section-divider-line" />
          </div>
        </div>

        {/* 3D Books Showcase */}
        <div className="books-3d-grid">
          {siteConfig.books.map((book) => (
            <div key={book.id} className="book-3d-card">
              <div className="book-3d-stage">
                <div className={`book-3d-item book-theme-${book.id}`}>
                  {/* Book 3D Container */}
                  <div className="book-3d-spine-edge" />
                  <div className="book-3d-pages-right" />
                  <div className="book-3d-pages-bottom" />

                  {/* Front Hardcover with Cover Image */}
                  <div className="book-3d-front">
                    <img
                      src={book.image}
                      alt={book.alt}
                      className="book-3d-image"
                      loading="lazy"
                    />
                    <div className="book-3d-crease" />
                    <div className="book-3d-glare" />
                  </div>
                </div>
                {/* Dynamic Ground Shadow */}
                <div className="book-3d-ground-shadow" />
              </div>

              {/* Book Info Caption */}
              <div className="book-info-caption">
                <h3 className="book-info-title">{book.title}</h3>
                {book.subtitle && <p className="book-info-subtitle">{book.subtitle}</p>}
                <p className="book-info-author">— {book.author} —</p>
                <span className="book-info-badge">Available at Faith Centre</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
