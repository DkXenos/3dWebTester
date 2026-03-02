'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STUDY_SESSIONS = [
  { name: 'Rina S.', subject: 'Kalkulus II', duration: '47 mnt', avatar: '👩‍💻' },
  { name: 'Budi H.', subject: 'Pemrograman Web', duration: '1j 12m', avatar: '👨‍🎓' },
  { name: 'Citra A.', subject: 'Struktur Data', duration: '23 mnt', avatar: '👩‍🔬' },
  { name: 'Dani P.', subject: 'Fisika Modern', duration: '36 mnt', avatar: '🧑‍🏫' },
];

const MODES = [
  { label: '🍅 Pomodoro', work: 25, break: 5 },
  { label: '⚡ Sprint', work: 50, break: 10 },
  { label: '🌿 Deep', work: 90, break: 20 },
];

interface CircularProgressProps {
  progress: number; // 0–1
  isActive: boolean;
  timeDisplay: string;
  size?: number;
}

function CircularProgress({ progress, isActive, timeDisplay, size = 160 }: CircularProgressProps) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(245,237,214,0.08)"
          strokeWidth={8}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#timerGrad)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <defs>
          <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD27D" />
            <stop offset="100%" stopColor="#F5A623" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--cream)',
          letterSpacing: '-0.03em',
          ...(isActive ? { textShadow: '0 0 20px rgba(245,166,35,0.7)' } : {}),
        }}>
          {timeDisplay}
        </span>
      </div>
      {/* Glow effect when active */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.2) 0%, transparent 70%)',
          animation: 'pulse-glow 2.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

export default function PomodoroTimer({ onStudyMode, studyMode }: {
  onStudyMode: (active: boolean) => void;
  studyMode: boolean;
}) {
  const [modeIdx, setModeIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [seconds, setSeconds] = useState(MODES[0].work * 60);
  const [showSessions, setShowSessions] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSeconds = (isBreak ? MODES[modeIdx].break : MODES[modeIdx].work) * 60;

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(MODES[modeIdx].work * 60);
  }, [modeIdx]);

  useEffect(() => {
    reset();
  }, [modeIdx, reset]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setIsBreak(b => !b);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const progress = 1 - seconds / totalSeconds;

  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--cream)' }}>
          {isBreak ? '☕ Break Time' : '🍅 Focus Timer'}
        </h3>
        <motion.button
          className="btn btn-ghost"
          style={{ padding: '5px 10px', fontSize: '0.7rem', borderColor: studyMode ? 'var(--amber)' : undefined, color: studyMode ? 'var(--amber)' : undefined }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStudyMode(!studyMode)}
        >
          {studyMode ? '🔍 Focus ON' : '🔍 Focus Mode'}
        </motion.button>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {MODES.map((m, i) => (
          <button
            key={i}
            onClick={() => { setModeIdx(i); setIsRunning(false); }}
            className="btn"
            style={{
              flex: 1,
              padding: '5px 4px',
              fontSize: '0.65rem',
              background: modeIdx === i ? 'rgba(245,166,35,0.2)' : 'rgba(245,237,214,0.05)',
              border: modeIdx === i ? '1px solid var(--amber)' : '1px solid var(--glass-border)',
              color: modeIdx === i ? 'var(--amber)' : 'var(--text-secondary)',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Circle Timer */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress
          progress={progress}
          isActive={isRunning}
          timeDisplay={`${mins}:${secs}`}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <motion.button
          className="btn btn-amber"
          style={{ flex: 1, maxWidth: 120 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(r => !r)}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </motion.button>
        <motion.button
          className="btn btn-ghost"
          style={{ width: 42 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
        >
          ↺
        </motion.button>
      </div>

      {/* Public Sessions toggle */}
      <button
        className="btn btn-ghost"
        style={{ fontSize: '0.75rem', gap: 6 }}
        onClick={() => setShowSessions(s => !s)}
      >
        👥 Sesi Publik ({STUDY_SESSIONS.length} aktif) {showSessions ? '▲' : '▼'}
      </button>

      <AnimatePresence>
        {showSessions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STUDY_SESSIONS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    background: 'rgba(245,237,214,0.04)',
                    borderRadius: 8,
                    border: '1px solid rgba(245,166,35,0.1)',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{s.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream)' }}>{s.name}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.subject}</p>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--amber)', fontFamily: 'Outfit, sans-serif' }}>{s.duration}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
