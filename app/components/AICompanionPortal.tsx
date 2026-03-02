'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Waveform Animation ── */
function AudioWaveform({ isListening }: { isListening: boolean }) {
  const bars = 20;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 36 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            background: isListening
              ? `hsl(${38 + i * 3}, 90%, ${55 + Math.sin(i) * 15}%)`
              : 'var(--glass-border)',
          }}
          animate={isListening ? {
            scaleY: [0.2, 0.5 + Math.random() * 0.8, 0.3, 1, 0.2],
            height: ['4px', '28px', '8px', '36px', '4px'],
          } : { height: '4px', scaleY: 0.3 }}
          transition={isListening ? {
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.05,
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/* ── Anime Avatar (SVG Illustrated) ── */
function AnimeAvatar() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FDDBB4" />
          <stop offset="100%" stopColor="#F5C190" />
        </radialGradient>
        <radialGradient id="hairGrad" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#3D2B14" />
          <stop offset="100%" stopColor="#1A0E05" />
        </radialGradient>
      </defs>
      {/* Body / shirt */}
      <ellipse cx="60" cy="108" rx="28" ry="18" fill="#2D4A3E" />
      {/* Neck */}
      <rect x="53" y="86" width="14" height="14" rx="4" fill="url(#skinGrad)" />
      {/* Head */}
      <ellipse cx="60" cy="72" rx="28" ry="30" fill="url(#skinGrad)" />
      {/* Hair */}
      <path d="M32 65 Q28 38 60 33 Q92 38 88 65 Q85 42 60 38 Q35 42 32 65Z" fill="url(#hairGrad)" />
      <path d="M32 65 Q29 75 31 80 Q33 69 35 67Z" fill="url(#hairGrad)" />
      <path d="M88 65 Q91 75 89 80 Q87 69 85 67Z" fill="url(#hairGrad)" />
      {/* Side bangs */}
      <path d="M32 60 Q28 72 34 80 Q30 70 33 60Z" fill="url(#hairGrad)" />
      {/* Eyes */}
      <ellipse cx="48" cy="73" rx="6" ry="7" fill="#1A0E05" />
      <ellipse cx="72" cy="73" rx="6" ry="7" fill="#1A0E05" />
      {/* Iris */}
      <ellipse cx="48" cy="74" rx="4" ry="5" fill="#2D4A3E" />
      <ellipse cx="72" cy="74" rx="4" ry="5" fill="#2D4A3E" />
      {/* Pupils */}
      <ellipse cx="49" cy="74" rx="2" ry="3" fill="#0A0A0A" />
      <ellipse cx="73" cy="74" rx="2" ry="3" fill="#0A0A0A" />
      {/* Eye shine */}
      <circle cx="50" cy="72" r="1.5" fill="white" opacity={0.9} />
      <circle cx="74" cy="72" r="1.5" fill="white" opacity={0.9} />
      {/* Blush */}
      <ellipse cx="41" cy="80" rx="6" ry="3" fill="#F5A623" opacity={0.3} />
      <ellipse cx="79" cy="80" rx="6" ry="3" fill="#F5A623" opacity={0.3} />
      {/* Nose */}
      <path d="M58 82 Q60 84 62 82" stroke="#D4A574" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d="M52 88 Q60 94 68 88" stroke="#C49060" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Accessories - small star clip */}
      <polygon points="86,52 88,58 94,58 89,62 91,68 86,64 81,68 83,62 78,58 84,58" fill="#F5A623" opacity={0.9} transform="scale(0.5) translate(86,48)" />
    </svg>
  );
}

/* ── Realistic Avatar ── */
function RealisticAvatar() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinR" cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#E8B898" />
          <stop offset="60%" stopColor="#D4956A" />
          <stop offset="100%" stopColor="#C07840" />
        </radialGradient>
        <radialGradient id="hairR" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#5C3D1E" />
          <stop offset="100%" stopColor="#2C1A05" />
        </radialGradient>
        <linearGradient id="shirtR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A2E" />
          <stop offset="100%" stopColor="#2D4A3E" />
        </linearGradient>
      </defs>
      {/* Shirt/shoulders */}
      <ellipse cx="60" cy="112" rx="32" ry="20" fill="url(#shirtR)" />
      {/* Neck shadow */}
      <ellipse cx="60" cy="94" rx="10" ry="5" fill="#C07840" opacity={0.4} />
      {/* Neck */}
      <rect x="53" y="84" width="14" height="15" rx="6" fill="url(#skinR)" />
      {/* Head shape */}
      <ellipse cx="60" cy="70" rx="27" ry="30" fill="url(#skinR)" />
      {/* Cheek depth */}
      <ellipse cx="36" cy="75" rx="8" ry="10" fill="#C07840" opacity={0.12} />
      <ellipse cx="84" cy="75" rx="8" ry="10" fill="#C07840" opacity={0.12} />
      {/* Hair */}
      <path d="M33 58 Q33 30 60 28 Q87 30 87 58 Q85 38 60 36 Q35 38 33 58Z" fill="url(#hairR)" />
      <path d="M33 58 Q30 67 31 75 Q32 63 35 60Z" fill="url(#hairR)" />
      <path d="M87 58 Q90 67 89 75 Q88 63 85 60Z" fill="url(#hairR)" />
      {/* Eyebrows */}
      <path d="M42 63 Q48 60 54 63" stroke="#3D200A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M66 63 Q72 60 78 63" stroke="#3D200A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="48" cy="71" rx="6.5" ry="5.5" fill="white" />
      <ellipse cx="72" cy="71" rx="6.5" ry="5.5" fill="white" />
      {/* Iris */}
      <ellipse cx="48" cy="71" rx="4" ry="4.5" fill="#5C3D1E" />
      <ellipse cx="72" cy="71" rx="4" ry="4.5" fill="#5C3D1E" />
      {/* Pupils */}
      <ellipse cx="48.5" cy="71" rx="2.2" ry="2.8" fill="#100800" />
      <ellipse cx="72.5" cy="71" rx="2.2" ry="2.8" fill="#100800" />
      {/* Catchlights */}
      <circle cx="50" cy="69.5" r="1.4" fill="white" opacity={0.85} />
      <circle cx="74" cy="69.5" r="1.4" fill="white" opacity={0.85} />
      {/* Eyelash lines */}
      <path d="M41.5 67.5 Q48 64 54.5 67.5" stroke="#2A1505" strokeWidth="1.2" fill="none" />
      <path d="M65.5 67.5 Q72 64 78.5 67.5" stroke="#2A1505" strokeWidth="1.2" fill="none" />
      {/* Nose */}
      <path d="M57 79 Q58 82 60 83 Q62 82 63 79" stroke="#B07050" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Lips */}
      <path d="M51 88 Q60 92 69 88" stroke="#C07860" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M53 88 Q60 86 67 88" stroke="#C07860" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const chatMessages = [
  "Halo! Saya siap membantu belajar hari ini 📚",
  "Sesi Pomodoro berikutnya dimulai dalam 2 menit!",
  "IPK kamu naik 0.1 minggu ini, bagus sekali! 🎉",
  "Sudah istirahat? Mata perlu dijaga juga lho~",
];

export default function AICompanionPortal({ studyMode }: { studyMode: boolean }) {
  const [isAnime, setIsAnime] = useState(true);
  const [isListening, setIsListening] = useState(true);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setMsgIdx(i => (i + 1) % chatMessages.length);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="glass-card" style={{
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow orb behind avatar */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 160, height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--cream)' }}>
            AI Companion
          </h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {isListening ? '● Mendengarkan...' : '○ Standby'}
          </p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => setIsAnime(a => !a)}
          style={{ padding: '6px 12px', fontSize: '0.72rem' }}
          title="Toggle avatar style"
        >
          {isAnime ? '🎨 Anime' : '📷 Realistis'}
        </button>
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          key={isAnime ? 'anime' : 'real'}
          initial={{ opacity: 0, scale: 0.85, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.14) 0%, rgba(45,74,62,0.12) 100%)',
            borderRadius: '50%',
            padding: 10,
            border: '2px solid var(--glass-border)',
            boxShadow: isListening ? '0 0 20px rgba(245,166,35,0.3)' : 'none',
            transition: 'box-shadow 0.6s',
          }}
        >
          {isAnime ? <AnimeAvatar /> : <RealisticAvatar />}
        </motion.div>
      </div>

      {/* Waveform */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <AudioWaveform isListening={isListening} />
        <button
          className="btn btn-ghost"
          onClick={() => setIsListening(l => !l)}
          style={{ padding: '4px 12px', fontSize: '0.72rem' }}
        >
          {isListening ? '🎙️ Matikan Mic' : '🎙️ Aktifkan Mic'}
        </button>
      </div>

      {/* Chat bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={msgIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          style={{
            background: 'rgba(245,166,35,0.1)',
            border: '1px solid rgba(245,166,35,0.2)',
            borderRadius: '12px 12px 12px 4px',
            padding: '10px 14px',
            fontSize: '0.82rem',
            color: 'var(--cream)',
            lineHeight: 1.5,
          }}
        >
          {chatMessages[msgIdx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
