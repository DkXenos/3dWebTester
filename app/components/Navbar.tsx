'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, createTimeline, easings } from 'animejs';

const NAV_ITEMS = [
  { label: 'Home',      href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
];

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 28 };
const EASE   = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered]   = useState<string | null>(null);
  const [mounted, setMounted]   = useState(false);

  // Refs for anime.js targets
  const pillRef    = useRef<HTMLDivElement>(null);
  const brandRef   = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Anime.js opening sequence ──────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    if (!pillRef.current || !brandRef.current || !dividerRef.current) return;

    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    const spring = easings.spring({ stiffness: 55, damping: 7, mass: 1.1, velocity: 0 });

    // Reset starting state via CSS (will be overridden by anime)
    Object.assign(pillRef.current.style,    { opacity: '0', transform: 'scaleX(0.18) scaleY(0.7)', transformOrigin: 'center' });
    Object.assign(brandRef.current.style,   { opacity: '0', transform: 'translateX(-10px)' });
    Object.assign(dividerRef.current.style, { opacity: '0', transform: 'scaleX(0)' });
    items.forEach(el => Object.assign(el.style, { opacity: '0', transform: 'translateX(-10px)' }));

    const tl = createTimeline({ defaults: { ease: spring } });

    // 1. Pill blooms open — scaleX bounce using spring
    tl.add(pillRef.current, {
      opacity:  { from: 0, to: 1 },
      scaleX:   { from: 0.18, to: 1 },
      scaleY:   { from: 0.7,  to: 1 },
      duration: spring.settlingDuration,
      delay: 120,
    });

    // 2. Brand name slides + fades in
    tl.add(brandRef.current, {
      opacity:    { from: 0, to: 1 },
      translateX: { from: -12, to: 0 },
      duration:   620,
      ease:       'outExpo',
    }, `-=${spring.settlingDuration * 0.55}`);

    // 3. Divider scales in
    tl.add(dividerRef.current, {
      opacity:  { from: 0, to: 1 },
      scaleX:   { from: 0, to: 1 },
      duration: 320,
      ease:     'outExpo',
    }, '-=500');

    // 4. Nav items stagger in with outElastic wave
    items.forEach((el, i) => {
      tl.add(el, {
        opacity:    { from: 0, to: 1 },
        translateX: { from: -10, to: 0 },
        duration:   700,
        ease:       'outElastic(1, 0.55)',
      }, `-=${i === 0 ? 460 : 560}`);
    });

    return () => { tl.pause?.(); };
  }, [mounted]);
  // ──────────────────────────────────────────────────────────────────────────

  if (!mounted) return null;

  return (
    <header
      style={{
        position: 'fixed',
        top: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9000,
      }}
    >
      {/* Pill container — anime.js owns the opening animation */}
      <motion.div
        ref={pillRef}
        animate={{
          background: scrolled ? 'rgba(10,7,3,0.9)' : 'rgba(10,7,3,0.55)',
          boxShadow: scrolled
            ? '0 14px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.08), inset 0 1px 0 rgba(245,166,35,0.1)'
            : '0 4px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(245,166,35,0.07)',
          borderColor: scrolled ? 'rgba(245,166,35,0.28)' : 'rgba(245,166,35,0.16)',
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '6px',
          border: '1px solid rgba(245,166,35,0.16)',
          borderRadius: 99,
          backdropFilter: 'blur(32px) saturate(1.9)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.9)',
          whiteSpace: 'nowrap',
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      >
        {/* Planet orb + brand name */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.92 }}
            transition={SPRING}
            style={{
              display: 'flex', alignItems: 'center', gap: 0,
              padding: '3px', borderRadius: 99, cursor: 'pointer',
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

            {/* Brand — animated by anime.js */}
            <span
              ref={brandRef}
              style={{
                marginLeft: 8,
                fontSize: '0.9rem', fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                background: 'linear-gradient(118deg, #F5EDD6 15%, #F5A623 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                display: 'inline-block',
                willChange: 'transform, opacity',
              }}
            >
              StudyNest
            </span>
          </motion.div>
        </Link>

        {/* Divider — animated by anime.js */}
        <div
          ref={dividerRef}
          style={{
            width: 1, height: 16, flexShrink: 0,
            background: 'rgba(245,166,35,0.22)',
            margin: '0 4px',
            transformOrigin: 'center',
            willChange: 'transform, opacity',
          }}
        />

        {/* Nav items — animated by anime.js, hover by framer-motion */}
        {NAV_ITEMS.map((item, idx) => {
          const isActive  = pathname === item.href;
          const isHovered = hovered === item.href;
          const lit = isActive || isHovered;

          return (
            <div
              key={item.href}
              ref={el => { itemRefs.current[idx] = el; }}
              style={{ willChange: 'transform, opacity' }}
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
            </div>
          );
        })}
      </motion.div>
    </header>
  );
}
