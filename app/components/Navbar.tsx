'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home',      href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
];

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 28 };
const EASE   = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered]   = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    // Small delay so the orb is visible before expanding
    const t = setTimeout(() => setExpanded(true), 380);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  if (!mounted) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        position: 'fixed',
        top: 18,
        left: '50%',
        x: '-50%',
        zIndex: 9000,
      }}
    >
      {/* ── Pill container — layout-animated so it grows from center ── */}
      <motion.div
        layout
        transition={SPRING}
        animate={{
          background: scrolled ? 'rgba(10,7,3,0.9)' : 'rgba(10,7,3,0.55)',
          boxShadow: scrolled
            ? '0 14px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.08), inset 0 1px 0 rgba(245,166,35,0.1)'
            : '0 4px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(245,166,35,0.07)',
          borderColor: scrolled ? 'rgba(245,166,35,0.28)' : 'rgba(245,166,35,0.16)',
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '6px',
          border: '1px solid rgba(245,166,35,0.16)',
          borderRadius: 99,
          backdropFilter: 'blur(32px) saturate(1.9)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.9)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {/* ── Planet orb — always visible, acts as logo & Home link ── */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <motion.div
            layout
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={SPRING}
            style={{
              display: 'flex', alignItems: 'center', gap: 0,
              padding: '3px',
              borderRadius: 99,
              cursor: 'pointer',
            }}
          >
            {/* Spinning planet */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5A623 0%, #2D4A3E 100%)',
                boxShadow: '0 0 18px rgba(245,166,35,0.5)',
                position: 'relative', overflow: 'hidden', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: '50%', left: '-25%',
                width: '150%', height: '2.5px',
                background: 'rgba(255,210,125,0.6)',
                transform: 'translateY(-50%) rotate(-28deg)',
                borderRadius: 99,
              }} />
            </motion.div>

            {/* Brand name — slides in when expanded */}
            <AnimatePresence>
              {expanded && (
                <motion.span
                  key="brand"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ ...SPRING, opacity: { duration: 0.22, delay: 0.08 } }}
                  style={{
                    fontSize: '0.9rem', fontWeight: 800,
                    fontFamily: 'Outfit, sans-serif',
                    background: 'linear-gradient(118deg, #F5EDD6 15%, #F5A623 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                    overflow: 'hidden', display: 'inline-block',
                  }}
                >
                  StudyNest
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* ── Divider + nav items — appear after brand ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="nav-items"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ ...SPRING, opacity: { duration: 0.2, delay: 0.14 } }}
              style={{
                display: 'flex', alignItems: 'center', gap: 2,
                overflow: 'hidden',
              }}
            >
              {/* Divider */}
              <div style={{
                width: 1, height: 16, flexShrink: 0,
                background: 'rgba(245,166,35,0.22)',
                margin: '0 4px',
              }} />

              {NAV_ITEMS.map((item, idx) => {
                const isActive  = pathname === item.href;
                const isHovered = hovered === item.href;
                const lit = isActive || isHovered;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING, delay: 0.16 + idx * 0.07 }}
                  >
                    <Link href={item.href} style={{ textDecoration: 'none' }}>
                      <motion.div
                        onHoverStart={() => setHovered(item.href)}
                        onHoverEnd={() => setHovered(null)}
                        animate={{ color: lit ? '#F5A623' : 'rgba(245,237,214,0.6)' }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ color: { duration: 0.15 } }}
                        style={{
                          position: 'relative',
                          padding: '6px 15px',
                          borderRadius: 99,
                          fontSize: '0.81rem',
                          fontWeight: isActive ? 700 : 500,
                          letterSpacing: '0.01em',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        {/* Hover / active bg */}
                        <AnimatePresence>
                          {lit && (
                            <motion.span
                              layoutId="nav-bg"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{ duration: 0.18, ease: EASE }}
                              style={{
                                position: 'absolute', inset: 0, borderRadius: 99,
                                background: isActive ? 'rgba(245,166,35,0.13)' : 'rgba(245,237,214,0.06)',
                                border: '1px solid ' + (isActive ? 'rgba(245,166,35,0.3)' : 'rgba(245,237,214,0.09)'),
                              }}
                            />
                          )}
                        </AnimatePresence>

                        {/* Active dot */}
                        {isActive && (
                          <motion.span
                            layoutId="nav-dot"
                            transition={SPRING}
                            style={{
                              position: 'absolute', bottom: 3, left: '50%',
                              width: 3, height: 3, borderRadius: '50%',
                              background: '#F5A623',
                              boxShadow: '0 0 6px rgba(245,166,35,0.9)',
                              transform: 'translateX(-50%)',
                            }}
                          />
                        )}

                        <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}
