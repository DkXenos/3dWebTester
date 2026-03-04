'use client';

import dynamic from 'next/dynamic';

const HeroPortal = dynamic(() => import('./components/HeroPortal'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
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
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(245,237,214,0.4)',
          letterSpacing: '0.1em',
        }}
      >
        Loading StudyNest...
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function Home() {
  return (
    <main style={{ background: '#000000' }}>
      <HeroPortal />
    </main>
  );
}
