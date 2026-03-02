'use client';

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import StarField from './StarField';
import ScrollArrow from './ScrollArrow';

const HeroScene = lazy(() => import('./HeroScene'));

const FEATURES = ['🍅 Pomodoro', '🎓 IPK Tracker', '🤖 AI Companion', '🚀 Launchpad'];

interface HeroSectionProps {
  heroOpacity: number;
  scrollProgress: number;
  dashboardVisible: boolean;
  mounted: boolean;
}

export default function HeroSection({ heroOpacity, scrollProgress, dashboardVisible, mounted }: HeroSectionProps) {
  return (
    <div
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

      {/* Ambient glow */}
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

      {/* Bottom feature badges + scroll arrow */}
      <div style={{
        position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        opacity: Math.max(0, heroOpacity),
        zIndex: 2,
      }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {FEATURES.map((f, i) => (
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
  );
}
