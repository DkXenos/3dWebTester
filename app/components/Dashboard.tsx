'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassSurface from '../../components/GlassSurface';
import GamifiedHUD from './GamifiedHUD';
import AICompanionPortal from './AICompanionPortal';
import PomodoroTimer from './PomodoroTimer';
import GradeCalculator from './GradeCalculator';
import Launchpad from './Launchpad';

interface DashboardProps {
  visible: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
} as const;

const widgetVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
} as const;

export default function Dashboard({ visible }: DashboardProps) {
  const [studyMode, setStudyMode] = useState(false);

  const blurStyle = (isBlurred: boolean) => ({
    transition: 'filter 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s',
    filter: studyMode && isBlurred ? 'blur(4px) brightness(0.45)' : 'none',
    pointerEvents: (studyMode && isBlurred ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
  });

  return (
    <motion.div
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={containerVariants}
      style={{
        minHeight: '100vh',
        padding: '0 16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,74,62,0.35) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 70%, rgba(245,166,35,0.12) 0%, transparent 50%),
          radial-gradient(ellipse 50% 50% at 20% 80%, rgba(45,74,62,0.15) 0%, transparent 50%),
          linear-gradient(180deg, #0A0802 0%, #120D06 40%, #0E0A05 100%)
        `,
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      {/* HUD */}
      <motion.div variants={widgetVariants} style={blurStyle(false)}>
        <GamifiedHUD />
      </motion.div>

      {/* Main grid */}
      <motion.div
        variants={widgetVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 14,
          flex: 1,
        }}
      >
        {/* AI Companion — left panel, 4 cols */}
        <motion.div
          variants={widgetVariants}
          style={{
            gridColumn: 'span 4',
            minHeight: 520,
            ...blurStyle(!studyMode ? false : false),
          }}
        >
          <div style={{ height: '100%', ...blurStyle(false) }}>
            <AICompanionPortal studyMode={studyMode} />
          </div>
        </motion.div>

        {/* Center col: Pomodoro + Grade — 4 cols */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <motion.div variants={widgetVariants} style={{ flex: '0 0 auto', ...blurStyle(false) }}>
            <PomodoroTimer
              studyMode={studyMode}
              onStudyMode={setStudyMode}
            />
          </motion.div>
          <motion.div variants={widgetVariants} style={{ flex: 1, ...blurStyle(studyMode) }}>
            <GradeCalculator />
          </motion.div>
        </div>

        {/* Right col: Notes / Focus area — 4 cols */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Focus Note Area */}
          <motion.div
            variants={widgetVariants}
            style={{ flex: 1, ...blurStyle(studyMode) }}
          >
          <GlassSurface width="100%" height="100%" borderRadius={16}>
          <div style={{
            width: '100%', height: '100%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--cream)' }}>
                📓 Catatan Cepat
              </h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Markdown supported</span>
            </div>
            <textarea
              placeholder="Tulis catatan, ide, atau ringkasan di sini..."
              style={{
                flex: 1,
                background: 'rgba(245,237,214,0.04)',
                border: '1px solid rgba(245,166,35,0.15)',
                borderRadius: 10,
                color: 'var(--cream)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                lineHeight: 1.7,
                padding: '12px',
                resize: 'none',
                outline: 'none',
                minHeight: 180,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
            />
          </div>
          </GlassSurface>
          </motion.div>

          {/* Daily Goals */}
          <motion.div
            variants={widgetVariants}
            style={{ ...blurStyle(studyMode) }}
          >
          <GlassSurface width="100%" borderRadius={16}>
          <div style={{ width: '100%', padding: '18px 20px' }}>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem',
              color: 'var(--cream)', marginBottom: 12,
            }}>
              ✅ Target Harian
            </h3>
            <DailyGoals />
          </div>
          </GlassSurface>
          </motion.div>
        </div>
      </motion.div>

      {/* Launchpad */}
      <motion.div variants={widgetVariants} style={blurStyle(studyMode)}>
        <Launchpad />
      </motion.div>
    </motion.div>
  );
}

function DailyGoals() {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Selesaikan 2 sesi Pomodoro', done: true },
    { id: 2, text: 'Review catatan Kalkulus', done: false },
    { id: 3, text: 'Practice soal Struktur Data', done: false },
    { id: 4, text: 'Baca 10 halaman jurnal', done: false },
  ]);

  const toggle = (id: number) => setGoals(gs => gs.map(g => g.id === id ? { ...g, done: !g.done } : g));
  const doneCount = goals.filter(g => g.done).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{doneCount}/{goals.length} selesai</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--amber)' }}>+{doneCount * 50} EXP</span>
      </div>
      {/* mini progress */}
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(245,237,214,0.06)', marginBottom: 8, overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, var(--forest-light), var(--amber))' }}
          animate={{ width: `${(doneCount / goals.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {goals.map(g => (
        <motion.button
          key={g.id}
          onClick={() => toggle(g.id)}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '5px 0', textAlign: 'left',
          }}
        >
          <motion.div
            animate={{
              background: g.done ? 'linear-gradient(135deg, var(--forest), var(--forest-light))' : 'rgba(245,237,214,0.06)',
              borderColor: g.done ? 'var(--forest-light)' : 'rgba(245,237,214,0.2)',
            }}
            style={{
              width: 18, height: 18, borderRadius: 5,
              border: '1.5px solid',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {g.done && <span style={{ fontSize: '0.6rem', color: 'var(--cream)' }}>✓</span>}
          </motion.div>
          <span style={{
            fontSize: '0.78rem',
            color: g.done ? 'var(--text-muted)' : 'var(--text-secondary)',
            textDecoration: g.done ? 'line-through' : 'none',
            transition: 'all 0.2s',
          }}>
            {g.text}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
