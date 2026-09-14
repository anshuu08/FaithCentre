import React, { useEffect } from 'react';
import Location from '../components/Location';

export default function LocationPage({ onOpenLocationModal }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={{ paddingTop: '100px', minHeight: '75vh' }}>
      <Location onOpenLocationModal={onOpenLocationModal} />
    </main>
  );
}
