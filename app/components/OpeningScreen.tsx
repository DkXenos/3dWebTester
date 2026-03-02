'use client';

import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpeningScene = lazy(() => import('./OpeningScene'));

interface OpeningScreenProps {
  onComplete: () => void;
}

export default function OpeningScreen({ onComplete }: OpeningScreenProps) {
  const [textVisible, setTextVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onComplete, 900);
  }, [exiting, onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setTextVisible(true), 700);
    const t2 = setTimeout(dismiss, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="opening-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.9, ease: [0.43, 0, 0.25, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'linear-gradient(145deg, #050301 0%, #0A0802 45%, #080C06 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 3D Scene – full bleed background */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Suspense fallback={null}>
              <OpeningScene />
            </Suspense>
          </div>

          {/* Radial vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(5,3,1,0.65) 100%)',
          }} />

          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%',
            background: 'linear-gradient(to bottom, transparent, rgba(5,3,1,0.9))',
            pointerEvents: 'none',
          }} />

          {/* ── Headline content ── */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 24px',
            pointerEvents: 'none',
          }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 18 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 16px',
                background: 'rgba(245,166,35,0.12)',
                border: '1px solid rgba(245,166,35,0.3)',
                borderRadius: 99,
                marginBottom: 22,
              }}
            >
              <span style={{
                fontSize: '0.7rem',
                color: '#F5A623',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                ✦ Your Digital Sanctuary
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 28 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(3.2rem, 8vw, 7rem)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: '#F5EDD6',
                marginBottom: 18,
                textShadow: '0 0 60px rgba(245,166,35,0.3)',
              }}
            >
              Study
              <span style={{
                background: 'linear-gradient(135deg, #F5A623 0%, #FFD27D 50%, #F5A623 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Nest
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
                color: 'rgba(245,237,214,0.55)',
                maxWidth: 480,
                lineHeight: 1.65,
                margin: '0 auto',
                letterSpacing: '0.01em',
              }}
            >
              Ruang belajar yang cozy — AI companion, Pomodoro timer,
              dan kalkulator IPK dalam satu ekosistem premium.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 16 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: 28,
              }}
            >
              {['🍅 Pomodoro', '🎓 IPK Tracker', '🤖 AI Companion', '🚀 Launchpad'].map((f, i) => (
                <motion.span
                  key={f}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: textVisible ? 1 : 0, scale: textVisible ? 1 : 0.85 }}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.07 }}
                  style={{
                    padding: '5px 13px',
                    background: 'rgba(245,237,214,0.07)',
                    border: '1px solid rgba(245,166,35,0.18)',
                    borderRadius: 99,
                    fontSize: '0.74rem',
                    color: 'rgba(245,237,214,0.6)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* ── Enter button ── */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 10 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            onClick={dismiss}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 42,
              padding: '12px 36px',
              background: 'linear-gradient(135deg, rgba(245,166,35,0.2) 0%, rgba(245,166,35,0.1) 100%)',
              border: '1px solid rgba(245,166,35,0.45)',
              borderRadius: 99,
              color: '#F5A623',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 28px rgba(245,166,35,0.12), inset 0 1px 0 rgba(245,166,35,0.15)',
              transition: 'box-shadow 0.2s',
            }}
          >
            Enter StudyNest →
          </motion.button>

          {/* Auto-progress bar */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 2,
              background: 'linear-gradient(90deg, #F5A623, #FFD27D)',
              zIndex: 3,
              boxShadow: '0 0 8px rgba(245,166,35,0.6)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: exiting ? '100%' : '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
