'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const wb: React.CSSProperties = {
  position: 'absolute', borderRadius: 16,
  background: 'rgba(14,10,5,0.92)',
  backdropFilter: 'blur(28px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
  border: '1px solid rgba(245,166,35,0.18)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  display: 'flex', flexDirection: 'column', overflow: 'hidden',
};

const DATA = [
  { rank: 1, name: 'AminaCoder', exp: 12450, level: 24, streak: 31, emoji: '🥇' },
  { rank: 2, name: 'RizkiDev', exp: 11880, level: 23, streak: 28, emoji: '🥈' },
  { rank: 3, name: 'SarahStudy', exp: 10920, level: 21, streak: 22, emoji: '🥉' },
  { rank: 4, name: 'You', exp: 9840, level: 19, streak: 7, emoji: '⭐' },
  { rank: 5, name: 'DwiPratama', exp: 9200, level: 18, streak: 15, emoji: '' },
  { rank: 6, name: 'FitraNugraha', exp: 8750, level: 17, streak: 12, emoji: '' },
  { rank: 7, name: 'MegaChan', exp: 8100, level: 16, streak: 9, emoji: '' },
  { rank: 8, name: 'BayuKeren', exp: 7650, level: 15, streak: 6, emoji: '' },
  { rank: 9, name: 'NadiaIlmu', exp: 7200, level: 14, streak: 4, emoji: '' },
  { rank: 10, name: 'AgungBelajar', exp: 6800, level: 13, streak: 3, emoji: '' },
];

type Tab = 'global' | 'university' | 'friends';

export default function LeaderboardWindow({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('global');

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} style={{ ...wb, width: 440, height: 460, top: 45, right: 60, left: 'auto' }}>
      <div style={{ height: 36, background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>🏆 Leaderboard</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(245,166,35,0.08)', flexShrink: 0 }}>
        {(['global', 'university', 'friends'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '7px 0', background: 'none', border: 'none',
            fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            color: tab === t ? '#F5A623' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid #F5A623' : '2px solid transparent',
          }}>🌐 {t}</button>
        ))}
      </div>

      {/* Table header */}
      <div style={{ display: 'flex', padding: '8px 14px', fontSize: '0.58rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
        <span style={{ width: 36 }}>#</span>
        <span style={{ flex: 1 }}>Player</span>
        <span style={{ width: 70, textAlign: 'right' }}>EXP</span>
        <span style={{ width: 40, textAlign: 'right' }}>Lvl</span>
        <span style={{ width: 50, textAlign: 'right' }}>🔥</span>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {DATA.map((row, i) => (
          <motion.div key={row.rank}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              display: 'flex', alignItems: 'center', padding: '8px 14px',
              background: row.name === 'You' ? 'rgba(245,166,35,0.1)' : i % 2 === 0 ? 'rgba(245,237,214,0.02)' : 'transparent',
              border: row.name === 'You' ? '1px solid rgba(245,166,35,0.25)' : '1px solid transparent',
              borderRadius: row.name === 'You' ? 8 : 0,
              margin: row.name === 'You' ? '2px 4px' : 0,
            }}>
            <span style={{ width: 36, fontSize: '0.8rem', textAlign: 'center' }}>
              {row.emoji || <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{row.rank}</span>}
            </span>
            <span style={{ flex: 1, fontSize: '0.74rem', fontWeight: row.name === 'You' ? 700 : 500, color: row.name === 'You' ? '#F5A623' : 'var(--cream)' }}>
              {row.name}
              {row.name === 'You' && <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginLeft: 4 }}>(you)</span>}
            </span>
            <span style={{ width: 70, textAlign: 'right', fontSize: '0.7rem', fontWeight: 600, color: 'var(--amber-light)', fontFamily: 'Outfit,sans-serif' }}>
              {row.exp.toLocaleString()}
            </span>
            <span style={{ width: 40, textAlign: 'right', fontSize: '0.68rem', color: 'var(--forest-light)', fontWeight: 600 }}>
              {row.level}
            </span>
            <span style={{ width: 50, textAlign: 'right', fontSize: '0.68rem', color: row.streak >= 20 ? '#FF8A1E' : 'var(--text-muted)' }}>
              {row.streak}d
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
