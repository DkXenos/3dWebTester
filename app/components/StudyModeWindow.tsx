'use client';

import { useState, useEffect, useRef } from 'react';
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

const FLASHCARDS = [
  { q: 'Apa rumus integral parsial?', a: '∫u dv = uv - ∫v du' },
  { q: 'Apa itu Big O Notation?', a: 'Notasi untuk menggambarkan kompleksitas waktu algoritma' },
  { q: 'Hukum Newton ke-2?', a: 'F = m × a (Gaya = massa × percepatan)' },
  { q: 'Apa itu normalisasi database?', a: 'Proses mengorganisasi data untuk mengurangi redundansi' },
];

const ROOMS = [
  { name: 'Kalkulus Study Group', topic: 'Integral & Diferensial', members: 4, max: 6, isPublic: true },
  { name: 'Private Room — Rizki', topic: 'Struktur Data', members: 2, max: 4, isPublic: false },
  { name: 'Fisika Bareng!', topic: 'Kinematika & Dinamika', members: 5, max: 8, isPublic: true },
];

const COMPANIONS = [
  { name: 'Lisa — BLACKPINK', emoji: '💜', type: 'K-Pop' },
  { name: 'Naruto', emoji: '🍥', type: 'Anime' },
  { name: 'IU — Singer', emoji: '🎵', type: 'K-Pop' },
  { name: 'Rem — Re:Zero', emoji: '💙', type: 'Anime' },
];

type Tab = 'timer' | 'flashcards' | 'rooms' | 'companions';

export default function StudyModeWindow({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('timer');
  const [studyMins, setStudyMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ivRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(ivRef.current!);
            setRunning(false);
            if (!isBreak) setEarnedCoins(c => c + 50);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else { clearInterval(ivRef.current!); }
    return () => clearInterval(ivRef.current!);
  }, [running, isBreak]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const total = (isBreak ? breakMins : studyMins) * 60;
  const pct = ((total - remaining) / total) * 100;

  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: 'timer', icon: '⏱️', label: 'Timer' },
    { key: 'flashcards', icon: '🃏', label: 'Flashcards' },
    { key: 'rooms', icon: '👥', label: 'Rooms' },
    { key: 'companions', icon: '✨', label: 'Study With' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} style={{ ...wb, width: 480, height: 460, top: 50, left: 200 }}>
      {/* Title bar */}
      <div style={{ height: 36, background: 'rgba(45,74,62,0.15)', borderBottom: '1px solid rgba(45,74,62,0.2)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>⏱️ Study Mode</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(245,166,35,0.08)', flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '8px 0', background: 'none', border: 'none',
            fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
            color: tab === t.key ? '#F5A623' : 'var(--text-muted)',
            borderBottom: tab === t.key ? '2px solid #F5A623' : '2px solid transparent',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {tab === 'timer' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {/* Custom time inputs */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Study: <input type="number" value={studyMins} onChange={e => { setStudyMins(+e.target.value); if (!running && !isBreak) setRemaining(+e.target.value*60); }}
                  style={{ width: 40, background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: 4, color: 'var(--cream)', padding: '2px 4px', fontSize: '0.7rem', textAlign: 'center' }}
                /> min
              </label>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Break: <input type="number" value={breakMins} onChange={e => { setBreakMins(+e.target.value); if (!running && isBreak) setRemaining(+e.target.value*60); }}
                  style={{ width: 40, background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: 4, color: 'var(--cream)', padding: '2px 4px', fontSize: '0.7rem', textAlign: 'center' }}
                /> min
              </label>
            </div>
            {/* Ring */}
            <div style={{ position: 'relative', width: 130, height: 130 }}>
              <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={65} cy={65} r={56} fill="none" stroke="rgba(245,166,35,0.1)" strokeWidth={7}/>
                <circle cx={65} cy={65} r={56} fill="none"
                  stroke={isBreak ? '#3D6B5A' : '#F5A623'} strokeWidth={7} strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*56}`} strokeDashoffset={`${2*Math.PI*56*(1-pct/100)}`}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: '2rem', fontWeight: 700, color: '#F5EDD6' }}>{mm}:{ss}</span>
                <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 500 }}>{isBreak ? 'BREAK' : 'FOCUS'}</span>
              </div>
            </div>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setRunning(r => !r)} style={{
                padding: '7px 24px', borderRadius: 8,
                background: running ? 'rgba(255,95,87,0.15)' : 'rgba(245,166,35,0.15)',
                border: running ? '1px solid rgba(255,95,87,0.4)' : '1px solid rgba(245,166,35,0.4)',
                color: running ? '#FF5F57' : '#F5A623', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
              }}>{running ? 'Pause' : 'Start'}</button>
              <button onClick={() => { setRunning(false); setIsBreak(b => !b); setRemaining((!isBreak ? breakMins : studyMins)*60); }} style={{
                padding: '7px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,237,214,0.4)',
                fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
              }}>{isBreak ? '→ Focus' : '→ Break'}</button>
            </div>
            {/* Coins earned */}
            {earnedCoins > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', fontSize: '0.72rem', color: '#FFD27D', fontWeight: 600 }}>
                🪙 +{earnedCoins} coins earned this session!
              </motion.div>
            )}
          </div>
        )}

        {tab === 'flashcards' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Card {cardIdx+1}/{FLASHCARDS.length}</div>
            <motion.div key={cardIdx} initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
              style={{
                width: '100%', maxWidth: 340, minHeight: 140, padding: 20, borderRadius: 12,
                background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center',
              }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--cream)' }}>{FLASHCARDS[cardIdx].q}</div>
              <AnimatePresence>
                {showAnswer && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(45,74,62,0.2)', border: '1px solid rgba(45,74,62,0.3)', fontSize: '0.76rem', color: 'var(--forest-light)', fontWeight: 600 }}>
                    {FLASHCARDS[cardIdx].a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowAnswer(a => !a)} style={{
                padding: '6px 16px', borderRadius: 8, background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)',
                color: '#F5A623', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
              }}>{showAnswer ? 'Hide' : 'Show'} Answer</button>
              <button onClick={() => { setCardIdx(i => (i+1)%FLASHCARDS.length); setShowAnswer(false); }} style={{
                padding: '6px 16px', borderRadius: 8, background: 'rgba(45,74,62,0.15)', border: '1px solid rgba(45,74,62,0.3)',
                color: 'var(--forest-light)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
              }}>Next →</button>
            </div>
          </div>
        )}

        {tab === 'rooms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ROOMS.map((r, i) => (
              <div key={i} style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(245,237,214,0.04)', border: '1px solid rgba(245,166,35,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.name}
                    <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: 4, background: r.isPublic ? 'rgba(45,74,62,0.25)' : 'rgba(245,166,35,0.15)', color: r.isPublic ? 'var(--forest-light)' : '#F5A623' }}>
                      {r.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 2 }}>📖 {r.topic}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{r.members}/{r.max} 👥</div>
                  <button style={{
                    marginTop: 4, padding: '3px 10px', borderRadius: 6, background: 'rgba(45,74,62,0.2)',
                    border: '1px solid rgba(45,74,62,0.4)', color: 'var(--forest-light)', fontSize: '0.6rem', fontWeight: 600, cursor: 'pointer',
                  }}>Join</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'companions' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {COMPANIONS.map((c, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} style={{
                padding: '14px', borderRadius: 10, background: 'rgba(245,237,214,0.04)',
                border: '1px solid rgba(245,166,35,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
              }}>
                <span style={{ fontSize: '2rem' }}>{c.emoji}</span>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--cream)', textAlign: 'center' }}>{c.name}</div>
                <span style={{ fontSize: '0.58rem', padding: '1px 6px', borderRadius: 4, background: c.type === 'K-Pop' ? 'rgba(180,60,200,0.2)' : 'rgba(245,166,35,0.15)', color: c.type === 'K-Pop' ? '#D080F0' : '#F5A623' }}>{c.type}</span>
                <button style={{
                  padding: '4px 12px', borderRadius: 6, background: 'rgba(45,74,62,0.2)', border: '1px solid rgba(45,74,62,0.3)',
                  color: 'var(--forest-light)', fontSize: '0.6rem', fontWeight: 600, cursor: 'pointer',
                }}>Study With</button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
