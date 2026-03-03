'use client';

import { Suspense, lazy } from 'react';

const BedroomScene = lazy(() => import('./components/BedroomScene'));

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* 3D Bedroom background */}
      <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#0a0804' }} />}>
        <BedroomScene />
      </Suspense>

      {/* UI overlay — add your content on top of the 3D scene here */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      />
    </main>
  );
}
