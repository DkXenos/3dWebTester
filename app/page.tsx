'use client';

import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import HeroSection from './components/HeroSection';
import DashboardSection from './components/DashboardSection';

const OpeningScreen = lazy(() => import('./components/OpeningScreen'));

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [showOpening, setShowOpening] = useState(true);

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
    <>
      {mounted && (
        <Suspense fallback={null}>
          {showOpening && (
            <OpeningScreen onComplete={() => setShowOpening(false)} />
          )}
        </Suspense>
      )}
      <div ref={containerRef} style={{ background: 'var(--background)' }}>
        <HeroSection
          heroOpacity={heroOpacity}
          scrollProgress={scrollProgress}
          dashboardVisible={dashboardVisible}
          mounted={mounted}
        />

        {/* ═══ SCROLL SPACER ═══ */}
        <div style={{ height: '80vh' }} />

        <DashboardSection visible={dashboardVisible} />
      </div>
    </>
  );
}
