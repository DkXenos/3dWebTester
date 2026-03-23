'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wb: React.CSSProperties = {
  position: 'absolute', borderRadius: 16,
  background: 'rgba(14,10,5,0.92)',
  backdropFilter: 'blur(28px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
  border: '1px solid rgba(245,166,35,0.18)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  display: 'flex', flexDirection: 'column', overflow: 'hidden',
};

const WEEK = [
  { day: 'Sen', done: true, reward: '+10 🪙' },
  { day: 'Sel', done: true, reward: '+10 🪙' },
  { day: 'Rab', done: true, reward: '+10 🪙' },
  { day: 'Kam', done: true, reward: '+15 🪙' },
  { day: 'Jum', done: true, reward: '+15 🪙' },
  { day: 'Sab', done: true, reward: '+20 🪙' },
  { day: 'Min', done: false, reward: '+100 🪙 🎁' },
];

const ACTIVITY = [
  { icon: '📝', text: 'Took notes on Kalkulus Bab 3', exp: 10, time: '2 jam lalu' },
  { icon: '💬', text: 'Answered question on Forum', exp: 25, time: '3 jam lalu' },
  { icon: '⏱️', text: 'Completed 2 Pomodoro sessions', coins: 100, time: '5 jam lalu' },
  { icon: '📊', text: 'Scored 4/5 on Struktur Data Quiz', exp: 200, time: 'Kemarin' },
  { icon: '🤖', text: 'AI generated video summary', exp: 5, time: 'Kemarin' },
];

export default function DailyRewardsWindow({ onClose }: { onClose: () => void }) {
  const [claimed, setClaimed] = useState(false);

  const streakDays = WEEK.filter(d => d.done).length;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} style={{ ...wb, width: 360, height: 440, top: 50, left: 320 }}>
      <div style={{ height: 36, background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>🎁 Daily Rewards</span>
      </div>

      <div style={{ flex: 1, padding: 14, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Streak header */}
        <div style={{ textAlign: 'center' }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <span style={{ fontSize: '2rem' }}>🔥</span>
          </motion.div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#FF8A1E' }}>
            {streakDays} Hari Streak!
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Login setiap hari untuk bonus!</div>
        </div>

        {/* Calendar */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {WEEK.map((d, i) => (
            <motion.div key={i}
              whileHover={{ scale: 1.1 }}
              style={{
                width: 40, height: 52, borderRadius: 8,
                background: d.done ? 'rgba(245,166,35,0.12)' : 'rgba(245,237,214,0.04)',
                border: `1px solid ${d.done ? 'rgba(245,166,35,0.3)' : 'rgba(245,237,214,0.08)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              }}>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.day}</span>
              <span style={{ fontSize: '1rem' }}>{d.done ? '✅' : (i === streakDays ? '📦' : '⬜')}</span>
            </motion.div>
          ))}
        </div>

        {/* Today's reward */}
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(45,74,62,0.12))',
          border: '1px solid rgba(245,166,35,0.25)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 6 }}>
            🎁 Day {streakDays + 1} Reward
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFD27D', marginBottom: 8 }}>
            {WEEK[streakDays]?.reward || '+100 🪙 🎁'}
          </div>
          <AnimatePresence mode="wait">
            {!claimed ? (
              <motion.button key="claim" onClick={() => setClaimed(true)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 24px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #F5A623, #E8921C)',
                  border: 'none', color: '#1A1208', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                }}>Claim Reward!</motion.button>
            ) : (
              <motion.div key="claimed" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 600 }}>
                ✓ Claimed! +50 EXP, +100 🪙
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Activity log */}
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Recent Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ACTIVITY.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6,
                  background: 'rgba(245,237,214,0.03)',
                }}>
                <span style={{ fontSize: '0.85rem' }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--cream)' }}>{a.text}</div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{a.time}</div>
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: 600, color: a.exp ? '#F5A623' : '#FFD27D' }}>
                  +{a.exp || a.coins} {a.exp ? 'EXP' : '🪙'}
                </span>
              </motion.div>
            ))}

            
          </div>
        </div>
      </div>
    </motion.div>
  );
}
