'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import StarField from './components/StarField';

const OpeningScene = lazy(() => import('./components/OpeningScene'));

const FEATURES = [
  { icon: '🍅', label: 'Pomodoro' },
  { icon: '🎓', label: 'IPK Tracker' },
  { icon: '🤖', label: 'AI Companion' },
  { icon: '🚀', label: 'Launchpad' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #050301 0%, #0A0802 50%, #080C06 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>

      {/* 3D Planet Scene */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {mounted && (
          <Suspense fallback={null}>
            <OpeningScene />
          </Suspense>
        )}
      </div>

      <StarField />

      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 22%, rgba(5,3,1,0.65) 100%)',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
        background: 'linear-gradient(to bottom, transparent, rgba(5,3,1,0.92))',
        pointerEvents: 'none',
      }} />
      {/* Top fade under navbar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '14%',
        background: 'linear-gradient(to top, transparent, rgba(5,3,1,0.55))',
        pointerEvents: 'none',
      }} />

      {/* Headline content */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', padding: '0 24px',
        pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 16px',
            background: 'rgba(245,166,35,0.1)',
            border: '1px solid rgba(245,166,35,0.28)',
            borderRadius: 99, marginBottom: 22,
          }}
        >
          <span style={{
            fontSize: '0.68rem', color: '#F5A623',
            fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            ✦ Your Digital Sanctuary
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(3.4rem, 9vw, 7.5rem)',
            fontWeight: 900, lineHeight: 0.95,
            letterSpacing: '-0.04em', color: '#F5EDD6',
            marginBottom: 20, fontFamily: 'Outfit, sans-serif',
            textShadow: '0 0 80px rgba(245,166,35,0.22)',
          }}
        >
          Study
          <span style={{
            background: 'linear-gradient(135deg, #F5A623 0%, #FFD27D 45%, #F5A623 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Nest
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.18rem)',
            color: 'rgba(245,237,214,0.52)',
            maxWidth: 460, lineHeight: 1.68, margin: '0 auto',
          }}
        >
          Ruang belajar digitalmu yang cozy — AI companion,
          Pomodoro timer, dan kalkulator IPK dalam satu ekosistem premium.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}
        >
          {FEATURES.map((f, i) => (
            <motion.span
              key={f.label}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 1.05 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '5px 13px',
                background: 'rgba(245,237,214,0.06)',
                border: '1px solid rgba(245,166,35,0.16)',
                borderRadius: 99, fontSize: '0.73rem',
                color: 'rgba(245,237,214,0.58)', whiteSpace: 'nowrap',
              }}
            >
              {f.icon} {f.label}
            </motion.span>
          ))}
        </motion.div>

      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        style={{
          position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: 'rgba(245,237,214,0.28)', fontSize: '0.62rem',
          letterSpacing: '0.14em', textTransform: 'uppercase', pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.28, 0.6, 0.28] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          <span>Scroll</span>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <rect x="0.75" y="0.75" width="12.5" height="12.5" rx="6.25" stroke="currentColor" strokeWidth="1.1" />
            <motion.circle
              cx="7" cy="5" r="1.8" fill="currentColor"
              animate={{ cy: [5, 8.5, 5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <path d="M3.5 15.5l3.5 2 3.5-2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
