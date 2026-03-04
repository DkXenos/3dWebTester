'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import MonitorScene from './MonitorScene';
import DesktopOverlay from './DesktopOverlay';

gsap.registerPlugin(ScrollTrigger);

export default function HeroPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [isInsideOS, setIsInsideOS] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // ── Lenis smooth scroll ──
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Sync Lenis → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Plug Lenis into GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ── GSAP ScrollTrigger ──
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;

        // Portal gate at 75%
        if (self.progress >= 0.75 && !isInsideOS) {
          setIsInsideOS(true);
        } else if (self.progress < 0.72 && isInsideOS) {
          setIsInsideOS(false);
        }
      },
    });

    return () => {
      trigger.kill();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ── Scrollable Track (400vh) ── */}
      <div
        ref={containerRef}
        style={{
          height: '400vh',
          position: 'relative',
          background: '#000000',
        }}
      >
        {/* ── Fixed 3D Viewport ── */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            pointerEvents: isInsideOS ? 'none' : 'auto',
          }}
        >
          <AnimatePresence>
            {!isInsideOS && (
              <motion.div
                key="canvas-wrapper"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%' }}
              >
                <Canvas
                  shadows
                  gl={{
                    antialias: true,
                    alpha: false,
                    toneMapping: 4, // ACESFilmic
                    toneMappingExposure: 0.9,
                  }}
                  camera={{ fov: 50, near: 0.1, far: 100, position: [0, 1.2, 8] }}
                  style={{ background: '#000000' }}
                >
                  <MonitorScene scrollProgress={scrollProgress} />
                </Canvas>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── "Scroll to Enter" Prompt ── */}
        <AnimatePresence>
          {!isInsideOS && (
            <motion.div
              key="scroll-prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'fixed',
                bottom: 48,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Scroll to Enter
              </span>

              {/* Animated scroll arrow */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </motion.div>

              {/* Progress indicator */}
              <div
                style={{
                  width: 60,
                  height: 3,
                  borderRadius: 2,
                  background: 'rgba(245,237,214,0.1)',
                  overflow: 'hidden',
                  marginTop: 4,
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #F5A623, #FFD27D)',
                    borderRadius: 2,
                    transformOrigin: 'left',
                  }}
                  animate={{
                    scaleX: isInsideOS ? 1 : 0,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Desktop Overlay (2D OS) ── */}
      <DesktopOverlay visible={isInsideOS} />
    </>
  );
}
