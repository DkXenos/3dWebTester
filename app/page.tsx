'use client';

import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';

const HeroScene = lazy(() => import('./components/HeroScene'));

function ScrollArrow() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        color: 'var(--text-muted)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'default',
      }}
    >
      <span>Scroll</span>
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <rect x="1" y="1" width="18" height="18" rx="9" stroke="currentColor" strokeWidth="1.5" />
        <motion.circle
          cx="10" cy="7" r="2.5" fill="currentColor"
          animate={{ cy: [7, 12, 7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path d="M6 23l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function StarField() {
  const stars = Array.from({ length: 80 }).map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: i % 5 === 0 ? 'var(--amber-light)' : 'var(--cream)',
          }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(scrollTop / heroHeight, 1);
      setScrollProgress(progress);
      setHeroOpacity(1 - progress * 1.6);
      setDashboardVisible(progress > 0.35);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ background: 'var(--background)' }}>
      {/* ═══ HERO SECTION ═══ */}
      <div
        ref={heroRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1,
          pointerEvents: dashboardVisible && scrollProgress > 0.85 ? 'none' : 'auto',
        }}
      >
        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 70% at 50% 20%, rgba(45,74,62,0.4) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 75% 80%, rgba(245,166,35,0.12) 0%, transparent 50%),
            linear-gradient(160deg, #0A0802 0%, #0F0B05 30%, #120D06 60%, #0A0802 100%)
          `,
          zIndex: 0,
        }} />

        <StarField />

        {/* 3D Canvas */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: Math.max(0, heroOpacity),
          transition: 'opacity 0.1s',
        }}>
          {mounted && (
            <Suspense fallback={null}>
              <HeroScene scrollProgress={scrollProgress} />
            </Suspense>
          )}
        </div>

        {/* Ambient glow beneath the workstation */}
        <div style={{
          position: 'absolute',
          bottom: '15%', left: '50%',
          transform: 'translateX(-50%)',
          width: '40vw', height: '8vh',
          background: 'radial-gradient(ellipse, rgba(245,166,35,0.25) 0%, transparent 70%)',
          filter: 'blur(20px)',
          opacity: Math.max(0, heroOpacity),
          pointerEvents: 'none',
        }} />

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            opacity: Math.max(0, heroOpacity),
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              background: 'rgba(245,166,35,0.1)',
              border: '1px solid rgba(245,166,35,0.25)',
              borderRadius: 99,
              marginBottom: 18,
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.05em' }}>
              ✦ DIGITAL SANCTUARY
            </span>
          </motion.div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--cream)',
              marginBottom: 18,
            }}
          >
            Selamat Datang di{' '}
            <span className="text-gradient-amber">StudyNest</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.6,
            margin: '0 auto',
          }}>
            Ruang belajar digitalmu yang cozy — AI companion, Pomodoro timer,
            dan kalkulator IPK dalam satu ekosistem premium.
          </p>
        </motion.div>

        {/* Bottom hero info */}
        <div style={{
          position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          opacity: Math.max(0, heroOpacity),
          zIndex: 2,
        }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {['🍅 Pomodoro', '🎓 IPK Tracker', '🤖 AI Companion', '🚀 Launchpad'].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.12 }}
                style={{
                  padding: '5px 14px',
                  background: 'rgba(245,237,214,0.06)',
                  border: '1px solid rgba(245,166,35,0.15)',
                  borderRadius: 99,
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {f}
              </motion.div>
            ))}
          </div>
          <ScrollArrow />
        </div>

        {/* Gradient fade to dashboard */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to bottom, transparent, var(--background))',
          pointerEvents: 'none', zIndex: 3,
        }} />
      </div>

      {/* ═══ SCROLL SPACER ═══ */}
      <div style={{ height: '80vh' }} />

      {/* ═══ DASHBOARD SECTION ═══ */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--background)',
        minHeight: '100vh',
        borderTop: '1px solid rgba(245,166,35,0.1)',
      }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: dashboardVisible ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            padding: '28px 0 0',
          }}
        >
          <span style={{
            display: 'inline-block',
            padding: '4px 16px',
            background: 'rgba(45,74,62,0.25)',
            border: '1px solid rgba(45,74,62,0.5)',
            borderRadius: 99,
            fontSize: '0.7rem',
            color: 'var(--forest-light)',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            ✦ Study Dashboard
          </span>
        </motion.div>

        <Dashboard visible={dashboardVisible} />
      </div>
    </div>
  );
}
