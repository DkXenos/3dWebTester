'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HUDProps {
  onCoinsChange?: (coins: number) => void;
}

export default function GamifiedHUD({ onCoinsChange }: HUDProps) {
  const [exp, setExp] = useState(2340);
  const [maxExp] = useState(3000);
  const [coins, setCoins] = useState(1280);
  const [streak, setStreak] = useState(7);
  const [coinAnim, setCoinAnim] = useState(false);
  const [expAnim, setExpAnim] = useState(false);

  // Simulate exp gain
  useEffect(() => {
    const iv = setInterval(() => {
      setExp(e => {
        const newVal = Math.min(e + Math.floor(Math.random() * 8 + 2), maxExp);
        setExpAnim(true);
        setTimeout(() => setExpAnim(false), 600);
        return newVal;
      });
    }, 8000);
    return () => clearInterval(iv);
  }, [maxExp]);

  const earnCoins = () => {
    setCoins(c => c + 25);
    setCoinAnim(true);
    setTimeout(() => setCoinAnim(false), 700);
    onCoinsChange?.(coins + 25);
  };

  const expPct = (exp / maxExp) * 100;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 20px',
      background: 'var(--glass-dark)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(245,166,35,0.15)',
      borderRadius: 999,
      flexWrap: 'wrap',
    }}>
      {/* Logo / Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--amber) 0%, var(--forest) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: '0 0 12px rgba(245,166,35,0.4)',
        }}>📚</div>
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          fontSize: '0.9rem',
          color: 'var(--cream)',
          letterSpacing: '-0.01em',
        }}>StudyNest</span>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--glass-border)' }} />

      {/* 🔥 Streak */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          style={{ fontSize: '1.2rem', display: 'inline-block' }}
          animate={{ scale: [1, 1.2, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔥
        </motion.span>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FF8A1E', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
            {streak} Hari
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1 }}>Streak</div>
        </div>
      </motion.div>

      <div style={{ width: 1, height: 24, background: 'var(--glass-border)' }} />

      {/* ⚡ EXP */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 150 }}>
        <span style={{ fontSize: '1rem' }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXP</span>
            <motion.span
              style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--amber)', fontFamily: 'Outfit, sans-serif' }}
              animate={expAnim ? { scale: [1, 1.3, 1], color: ['#F5A623', '#FFD27D', '#F5A623'] } : {}}
              transition={{ duration: 0.5 }}
            >
              {exp.toLocaleString()} / {maxExp.toLocaleString()}
            </motion.span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(245,237,214,0.08)', overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(90deg, #FFD27D, var(--amber))',
                boxShadow: '0 0 8px rgba(245,166,35,0.5)',
              }}
              animate={{ width: `${expPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--glass-border)' }} />

      {/* 🪙 Coins */}
      <motion.button
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(245,166,35,0.10)',
          border: '1px solid rgba(245,166,35,0.25)',
          borderRadius: 99, padding: '5px 12px',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.04, background: 'rgba(245,166,35,0.18)' }}
        whileTap={{ scale: 0.96 }}
        onClick={earnCoins}
        title="Klik untuk klaim bonus harian"
      >
        <motion.span
          style={{ fontSize: '1rem', display: 'inline-block' }}
          animate={coinAnim ? { rotateY: [0, 180, 360], scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          🪙
        </motion.span>
        <AnimatePresence mode="wait">
          <motion.span
            key={coins}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFD27D', fontFamily: 'Outfit, sans-serif' }}
          >
            {coins.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
