import React, { useEffect } from 'react';
import Journey from '../components/Journey';

export default function JourneyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={{ paddingTop: '100px', minHeight: '75vh' }}>
      <Journey />
    </main>
  );
}
