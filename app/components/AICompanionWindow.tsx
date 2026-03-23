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

function AnimeAvatar() {
  return (
    <svg width="90" height="90" viewBox="0 0 120 120" fill="none">
      <defs>
        <radialGradient id="sA" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#FDDBB4"/><stop offset="100%" stopColor="#F5C190"/></radialGradient>
        <radialGradient id="hA" cx="50%" cy="0%" r="100%"><stop offset="0%" stopColor="#3D2B14"/><stop offset="100%" stopColor="#1A0E05"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="108" rx="28" ry="18" fill="#2D4A3E"/>
      <rect x="53" y="86" width="14" height="14" rx="4" fill="url(#sA)"/>
      <ellipse cx="60" cy="72" rx="28" ry="30" fill="url(#sA)"/>
      <path d="M32 65 Q28 38 60 33 Q92 38 88 65 Q85 42 60 38 Q35 42 32 65Z" fill="url(#hA)"/>
      <ellipse cx="48" cy="73" rx="6" ry="7" fill="#1A0E05"/><ellipse cx="72" cy="73" rx="6" ry="7" fill="#1A0E05"/>
      <ellipse cx="48" cy="74" rx="4" ry="5" fill="#2D4A3E"/><ellipse cx="72" cy="74" rx="4" ry="5" fill="#2D4A3E"/>
      <circle cx="50" cy="72" r="1.5" fill="white" opacity={0.9}/><circle cx="74" cy="72" r="1.5" fill="white" opacity={0.9}/>
      <ellipse cx="41" cy="80" rx="6" ry="3" fill="#F5A623" opacity={0.3}/><ellipse cx="79" cy="80" rx="6" ry="3" fill="#F5A623" opacity={0.3}/>
      <path d="M52 88 Q60 94 68 88" stroke="#C49060" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function RealisticAvatar() {
  return (
    <svg width="90" height="90" viewBox="0 0 120 120" fill="none">
      <defs>
        <radialGradient id="sR" cx="45%" cy="35%" r="55%"><stop offset="0%" stopColor="#E8B898"/><stop offset="100%" stopColor="#C07840"/></radialGradient>
        <radialGradient id="hR" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#5C3D1E"/><stop offset="100%" stopColor="#2C1A05"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="32" ry="20" fill="#2D4A3E"/>
      <rect x="53" y="84" width="14" height="15" rx="6" fill="url(#sR)"/>
      <ellipse cx="60" cy="70" rx="27" ry="30" fill="url(#sR)"/>
      <path d="M33 58 Q33 30 60 28 Q87 30 87 58 Q85 38 60 36 Q35 38 33 58Z" fill="url(#hR)"/>
      <ellipse cx="48" cy="71" rx="6.5" ry="5.5" fill="white"/><ellipse cx="72" cy="71" rx="6.5" ry="5.5" fill="white"/>
      <ellipse cx="48" cy="71" rx="4" ry="4.5" fill="#5C3D1E"/><ellipse cx="72" cy="71" rx="4" ry="4.5" fill="#5C3D1E"/>
      <circle cx="50" cy="69.5" r="1.4" fill="white" opacity={0.85}/><circle cx="74" cy="69.5" r="1.4" fill="white" opacity={0.85}/>
      <path d="M51 88 Q60 92 69 88" stroke="#C07860" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div key={i}
          style={{ width: 2.5, borderRadius: 2, background: active ? `hsl(${38+i*3},90%,${55+Math.sin(i)*15}%)` : 'rgba(245,166,35,0.15)' }}
          animate={active ? { height: ['3px', `${8+Math.random()*20}px`, '3px'] } : { height: '3px' }}
          transition={active ? { duration: 0.6+Math.random()*0.4, repeat: Infinity, ease: 'easeInOut', delay: i*0.04 } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

const PERSONALITIES = [
  { id: 'tutor', name: 'Supportive Tutor', emoji: '🧑‍🏫', desc: 'Sabar, detail, penuh semangat' },
  { id: 'sensei', name: 'Strict Sensei', emoji: '🥋', desc: 'Tegas, to the point' },
  { id: 'chill', name: 'Chill Friend', emoji: '😎', desc: 'Santai dan relatable' },
  { id: 'anime', name: 'Anime Senpai', emoji: '✨', desc: 'Kawaii dan encouraging~' },
];

const INIT_CHAT = [
  { role: 'ai', text: 'Halo! Aku siap membantu belajar hari ini 📚 Mau mulai dari mana?' },
  { role: 'user', text: 'Aku ga ngerti integral parsial, bisa jelasin?' },
  { role: 'ai', text: 'Tentu! Integral parsial itu rumusnya ∫u dv = uv - ∫v du. Pilih u yang mudah didiferensialkan!' },
  { role: 'user', text: 'Ohh, terus contohnya gimana?' },
];

const AI_RESP = [
  'Contohnya ∫ x·eˣ dx. Pilih u = x, dv = eˣ dx. Jadinya: x·eˣ - eˣ + C ✨',
  'Gampang kan? Inget LIATE rule — Log, Inverse trig, Aljabar, Trig, Exponential! 💪',
  'Mau coba latihan soal? Aku buatkan 5 soal dari mudah ke sulit!',
];

export default function AICompanionWindow({ onClose }: { onClose: () => void }) {
  const [isAnime, setIsAnime] = useState(true);
  const [pers, setPers] = useState('tutor');
  const [listening, setListening] = useState(false);
  const [msgs, setMsgs] = useState(INIT_CHAT);
  const [rIdx, setRIdx] = useState(0);
  const [showCust, setShowCust] = useState(false);

  const gen = () => {
    setMsgs(p => [...p, { role: 'ai', text: AI_RESP[rIdx % AI_RESP.length] }]);
    setRIdx(i => i + 1);
  };

  const curP = PERSONALITIES.find(p => p.id === pers)!;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} style={{ ...wb, width: 420, height: 520, top: 40, left: 340 }}>
      <div style={{ height: 36, background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>🤖 AI Companion</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(245,166,35,0.08)' }}>
            <motion.div key={isAnime?'a':'r'} initial={{ rotateY: -90 }} animate={{ rotateY: 0 }}
              style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,166,35,0.08)' }}>
              <div style={{ transform: 'scale(0.42)', transformOrigin: 'center' }}>{isAnime ? <AnimeAvatar/> : <RealisticAvatar/>}</div>
            </motion.div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--cream)' }}>Nestly {curP.emoji}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{curP.desc}</div>
            </div>
            <Waveform active={listening}/>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {msgs.map((m, i) => (
              <motion.div key={i} initial={i >= INIT_CHAT.length ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%',
                  padding: '7px 11px', borderRadius: m.role === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                  background: m.role === 'user' ? 'rgba(45,74,62,0.25)' : 'rgba(245,166,35,0.1)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(45,74,62,0.4)' : 'rgba(245,166,35,0.2)'}`,
                  fontSize: '0.73rem', color: 'var(--cream)', lineHeight: 1.5,
                }}>{m.text}</motion.div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '7px 10px', borderTop: '1px solid rgba(245,166,35,0.08)', display: 'flex', gap: 5, alignItems: 'center' }}>
            <button onClick={() => setListening(l => !l)} style={{
              width: 30, height: 30, borderRadius: '50%',
              background: listening ? 'rgba(255,95,87,0.2)' : 'rgba(245,166,35,0.1)',
              border: `1px solid ${listening ? 'rgba(255,95,87,0.4)' : 'rgba(245,166,35,0.2)'}`,
              color: listening ? '#FF5F57' : '#F5A623', fontSize: '0.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>🎙️</button>
            <input placeholder="Ketik pertanyaan..." style={{
              flex: 1, background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)',
              borderRadius: 8, color: 'var(--cream)', padding: '6px 9px', fontSize: '0.7rem', outline: 'none',
            }}/>
            <button onClick={gen} style={{
              padding: '6px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#F5A623,#E8921C)',
              border: 'none', color: '#1A1208', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer',
            }}>Generate</button>
          </div>
        </div>

        {/* Customize panel */}
        <AnimatePresence>
          {showCust && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 150, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              style={{ borderLeft: '1px solid rgba(245,166,35,0.1)', padding: 8, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.63rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customize</div>
              <button onClick={() => setIsAnime(a => !a)} style={{
                padding: '5px 7px', borderRadius: 6, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)',
                color: '#F5A623', fontSize: '0.63rem', fontWeight: 600, cursor: 'pointer',
              }}>{isAnime ? '🎨 Anime' : '📷 Realistic'}</button>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>Personality</div>
              {PERSONALITIES.map(p => (
                <button key={p.id} onClick={() => setPers(p.id)} style={{
                  padding: '4px 7px', borderRadius: 5, textAlign: 'left',
                  background: pers === p.id ? 'rgba(245,166,35,0.15)' : 'transparent',
                  border: pers === p.id ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
                  color: pers === p.id ? '#F5A623' : 'var(--text-secondary)', fontSize: '0.6rem', cursor: 'pointer',
                }}>{p.emoji} {p.name}</button>
              ))}
              <textarea placeholder="Custom instructions..." style={{
                background: 'rgba(245,237,214,0.04)', border: '1px solid rgba(245,166,35,0.12)',
                borderRadius: 6, color: 'var(--cream)', padding: '5px 7px', fontSize: '0.6rem', resize: 'none', height: 55, outline: 'none',
              }}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      <button onClick={() => setShowCust(s => !s)} style={{
        position: 'absolute', top: 38, right: 0, background: 'rgba(245,166,35,0.1)',
        border: '1px solid rgba(245,166,35,0.15)', borderRight: 'none', borderRadius: '6px 0 0 6px',
        color: '#F5A623', fontSize: '0.58rem', padding: '3px 5px', cursor: 'pointer', fontWeight: 600,
      }}>{showCust ? '→' : '⚙️'}</button>
    </motion.div>
  );
}
