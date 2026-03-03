'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClassroomScene = dynamic(() => import('./components/BedroomScene'), {
  ssr: false,
});

export default function Home() {
  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      <Suspense
        fallback={
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '3px solid rgba(245,166,35,0.2)',
                borderTop: '3px solid #F5A623',
                animation: 'spin 1s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }
      >
        <ClassroomScene />
      </Suspense>
    </main>
  );
}
