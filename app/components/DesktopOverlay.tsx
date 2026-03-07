'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface DesktopOverlayProps {
  visible: boolean;
}

const dockApps = [
  { name: 'StudyNest', icon: '📚', href: '/dashboard' },
  { name: 'Timer', icon: '⏱️', href: '/dashboard' },
  { name: 'Calculator', icon: '🧮', href: '/dashboard' },
  { name: 'Notes', icon: '📝', href: '/dashboard' },
  { name: 'Music', icon: '🎵', href: '#' },
  { name: 'Settings', icon: '⚙️', href: '#' },
];

const desktopIcons = [
  { name: 'Projects', icon: '📁' },
  { name: 'Terminal', icon: '💻' },
  { name: 'Gallery', icon: '🖼️' },
];

export default function DesktopOverlay({ visible }: DesktopOverlayProps) {
  const [time, setTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="desktop-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', system-ui, sans-serif",
            overflow: 'hidden',
          }}
        >
          {/* Wallpaper */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 120% 80% at 30% 20%, rgba(45,74,62,0.5) 0%, transparent 50%),
                radial-gradient(ellipse 100% 60% at 70% 80%, rgba(245,166,35,0.15) 0%, transparent 50%),
                radial-gradient(ellipse 80% 80% at 50% 50%, rgba(61,43,20,0.3) 0%, transparent 60%),
                linear-gradient(160deg, #0A0802 0%, #120D06 35%, #0E0A05 70%, #0A0802 100%)
              `,
              zIndex: -1,
            }}
          />

          {/* ── Top Menu Bar ── */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 32,
              background: 'rgba(14, 10, 5, 0.85)',
              backdropFilter: 'blur(24px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
              borderBottom: '1px solid rgba(245,166,35,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--cream)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#F5A623', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                ✦ StudyNest
              </span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>File</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Edit</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>View</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Help</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.7rem' }}>🔋 100%</span>
              <span style={{ fontSize: '0.7rem' }}>Wi-Fi</span>
              <span style={{ fontWeight: 500 }}>{time}</span>
            </div>
          </motion.div>

          {/* ── Desktop Area ── */}
          <div style={{ flex: 1, position: 'relative', padding: 24 }}>
            {/* Desktop icons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {desktopIcons.map((item) => (
                <button
                  key={item.name}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: 'rgba(245,237,214,0.06)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(245,166,35,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ color: 'var(--cream)', fontSize: '0.65rem', fontWeight: 500 }}>
                    {item.name}
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Welcome message */}
            <AnimatePresence>
              {showWelcome && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <h1
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #FFD27D, #F5A623, #E8921C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: 8,
                    }}
                  >
                    Welcome to StudyNest
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Your digital sanctuary is ready
                  </p>
                </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Center area — after welcome fades */}
            <AnimatePresence>
              {!showWelcome && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <a
                    href="/dashboard"
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 12,
                      textDecoration: 'none',
                      padding: '32px 48px',
                      borderRadius: 20,
                      background: 'rgba(245,237,214,0.04)',
                      border: '1px solid rgba(245,166,35,0.15)',
                      backdropFilter: 'blur(16px)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245,166,35,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)';
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(245,166,35,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(245,237,214,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: '3rem' }}>📚</span>
                    <span
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: '#F5A623',
                      }}
                    >
                      Open StudyNest
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Launch your study dashboard
                    </span>
                  </a>
                </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Dock ── */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 20,
                background: 'rgba(14, 10, 5, 0.7)',
                backdropFilter: 'blur(24px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
                border: '1px solid rgba(245,166,35,0.12)',
              }}
            >
              {dockApps.map((app) => (
                <a
                  key={app.name}
                  href={app.href}
                  title={app.name}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(245,237,214,0.06)',
                    border: '1px solid rgba(245,166,35,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    textDecoration: 'none',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.15)';
                    e.currentTarget.style.background = 'rgba(245,166,35,0.15)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,166,35,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.background = 'rgba(245,237,214,0.06)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {app.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
