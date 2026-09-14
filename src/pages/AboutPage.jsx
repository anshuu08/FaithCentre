import React, { useEffect } from 'react';
import About from '../components/About';
import Books from '../components/Books';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={{ paddingTop: '100px' }}>
      <About />
      <Books />
    </main>
  );
}
