import React, { useEffect } from 'react';
import Services from '../components/Services';

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={{ paddingTop: '100px', minHeight: '75vh' }}>
      <Services />
    </main>
  );
}
