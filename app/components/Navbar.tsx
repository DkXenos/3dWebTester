'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home',      href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [hovered, setHovered]       = useState<string | null>(null);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 18,
        left: '50%',
        x: '-50%',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
      }}
    >
      <motion.div
        animate={{
          background: scrolled
            ? 'rgba(14, 10, 5, 0.88)'
            : 'rgba(14, 10, 5, 0.52)',
          borderColor: scrolled
            ? 'rgba(245,166,35,0.25)'
            : 'rgba(245,166,35,0.15)',
          boxShadow: scrolled
            ? '0 12px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,166,35,0.06), inset 0 1px 0 rgba(245,166,35,0.08)'
            : '0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(245,166,35,0.06)',
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '7px 7px 7px 16px',
          border: '1px solid rgba(245,166,35,0.15)',
          borderRadius: 99,
          backdropFilter: 'blur(28px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" style={{ textDecoration: 'none', marginRight: 6 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          >
            {/* Planet icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5A623 0%, #2D4A3E 100%)',
                boxShadow: '0 0 14px rgba(245,166,35,0.45)',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Ring */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '-20%',
                width: '140%', height: 3,
                background: 'rgba(255,210,125,0.55)',
                transform: 'translateY(-50%) rotate(-25deg)',
                borderRadius: 99,
              }} />
            </motion.div>

            <span style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(120deg, #F5EDD6 20%, #F5A623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              StudyNest
            </span>
          </motion.div>
        </Link>

        {/* ── Divider ── */}
        <div style={{
          width: 1, height: 16,
          background: 'rgba(245,166,35,0.2)',
          marginRight: 4,
          flexShrink: 0,
        }} />

        {/* ── Nav items ── */}
        {NAV_ITEMS.map((item) => {
          const isActive  = pathname === item.href;
          const isHovered = hovered === item.href;
          const lit = isActive || isHovered;

          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <motion.div
                onHoverStart={() => setHovered(item.href)}
                onHoverEnd={() => setHovered(null)}
                animate={{ color: lit ? '#F5A623' : 'rgba(245,237,214,0.62)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ color: { duration: 0.18 } }}
                style={{
                  position: 'relative',
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 650 : 500,
                  letterSpacing: '0.01em',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {/* Sliding bg pill */}
                <AnimatePresence>
                  {lit && (
                    <motion.span
                      layoutId="nav-bg"
                      key={isActive ? 'active-' + item.href : 'hover-' + item.href}
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 99,
                        background: isActive
                          ? 'rgba(245,166,35,0.14)'
                          : 'rgba(245,237,214,0.07)',
                        border: '1px solid ' + (isActive
                          ? 'rgba(245,166,35,0.32)'
                          : 'rgba(245,237,214,0.1)'),
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Active dot */}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    style={{
                      position: 'absolute',
                      bottom: 3, left: '50%',
                      width: 4, height: 4, borderRadius: '50%',
                      background: '#F5A623',
                      boxShadow: '0 0 6px rgba(245,166,35,0.8)',
                      transform: 'translateX(-50%)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}

                <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* ── CTA button ── */}
        <Link href="/dashboard" style={{ textDecoration: 'none', marginLeft: 4 }}>
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 22px rgba(245,166,35,0.35), inset 0 1px 0 rgba(245,166,35,0.25)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            style={{
              padding: '7px 18px',
              background: 'linear-gradient(135deg, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.1) 100%)',
              border: '1px solid rgba(245,166,35,0.42)',
              borderRadius: 99,
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#F5A623',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(245,166,35,0.1), inset 0 1px 0 rgba(245,166,35,0.12)',
              whiteSpace: 'nowrap',
            }}
          >
            Dashboard →
          </motion.div>
        </Link>
      </motion.div>
    </motion.header>
  );
}
