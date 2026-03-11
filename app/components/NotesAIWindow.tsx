'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const windowBase: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 16,
  background: 'rgba(14,10,5,0.92)',
  backdropFilter: 'blur(28px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
  border: '1px solid rgba(245,166,35,0.18)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const NOTES = [
  { id: 1, title: 'Kalkulus Bab 3 — Integral', tag: 'Matematika', shared: false },
  { id: 2, title: 'Struktur Data — Tree & Graph', tag: 'Informatika', shared: true, sharedBy: '@rizkidev' },
  { id: 3, title: 'Fisika Dasar — Kinematika', tag: 'Fisika', shared: false },
  { id: 4, title: 'Basis Data — Normalisasi', tag: 'Informatika', shared: true, sharedBy: '@sarahAI' },
];

const NOTE_CONTENT = `# Integral — Kalkulus Bab 3

## Definisi Integral
Integral adalah operasi invers dari diferensiasi. Jika F'(x) = f(x), maka:

∫ f(x) dx = F(x) + C

## Integral Tentu
∫[a,b] f(x) dx = F(b) - F(a)

## Teknik Integrasi
1. **Substitusi** — Ganti variabel untuk menyederhanakan
2. **Parsial** — ∫u dv = uv - ∫v du
3. **Trigonometri** — Gunakan identitas trigonometri

## Contoh Soal
∫ 2x·cos(x²) dx = sin(x²) + C`;

const AI_SUMMARY = `📋 **Ringkasan AI — Integral Kalkulus Bab 3**

Bab ini membahas konsep integral sebagai operasi invers diferensiasi. Tiga teknik utama yang dibahas:

1. **Substitusi** — Teknik paling dasar, efektif untuk fungsi komposisi
2. **Integral Parsial** — Digunakan untuk perkalian dua fungsi berbeda
3. **Substitusi Trigonometri** — Untuk integral yang mengandung bentuk akar

> 💡 **Fokus utama ujian**: Teknik substitusi dan parsial paling sering muncul di UTS. Pastikan hafal formula integral parsial.

Estimasi waktu belajar: **45 menit**`;

const AI_TRANSCRIPTION = `🎙️ **Transkripsi dari Audio — Kuliah Kalkulus 12 Maret**

"...jadi integral tentu itu sebenarnya adalah menghitung luas daerah di bawah kurva. Kalau kita punya fungsi f(x) = x², dan kita mau hitung dari 0 sampai 2, maka kita pakai rumus F(b) minus F(a)..."

"...teknik substitusi ini yang paling penting ya, jadi misalnya kalau ada ∫ 2x·cos(x²) dx, kita substitusi u = x², du = 2x dx, jadinya tinggal ∫ cos(u) du = sin(u) + C..."

⏱️ Durasi: 48:32 | 📝 Confidence: 94%`;

const AI_VIDEO_SUMMARY = `🎬 **Video Summary Generated**

"Ringkasan Visual — Kalkulus Integral Bab 3"

📊 Slides yang di-generate:
1. Definisi Integral & Notasi (0:00-0:45)
2. Integral Tentu vs Tak Tentu (0:45-1:30)  
3. Teknik Substitusi — Step by Step (1:30-2:45)
4. Teknik Parsial dengan Contoh (2:45-3:30)
5. Latihan Soal Interaktif (3:30-4:00)

⏱️ Total: 4 menit | 🎨 Style: Animated Whiteboard`;

export default function NotesAIWindow({ onClose }: { onClose: () => void }) {
  const [selectedNote, setSelectedNote] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [showVideoSummary, setShowVideoSummary] = useState(false);
  const [aiTab, setAiTab] = useState<'tools' | 'share'>('tools');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      style={{ ...windowBase, width: 820, height: 520, top: 40, left: 60 }}
    >
      {/* Title bar */}
      <div style={{
        height: 36, background: 'rgba(245,166,35,0.07)',
        borderBottom: '1px solid rgba(245,166,35,0.12)',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          width: 12, height: 12, borderRadius: '50%', background: '#FF5F57',
          border: 'none', cursor: 'pointer', flexShrink: 0,
        }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>
          📝 StudyNotes AI
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar — note list */}
        <div style={{
          width: 200, borderRight: '1px solid rgba(245,166,35,0.1)',
          padding: 8, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto',
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, padding: '4px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            My Notes
          </div>
          {NOTES.map((note, i) => (
            <button
              key={note.id}
              onClick={() => { setSelectedNote(i); setShowSummary(false); setShowTranscription(false); setShowVideoSummary(false); }}
              style={{
                background: selectedNote === i ? 'rgba(245,166,35,0.12)' : 'transparent',
                border: selectedNote === i ? '1px solid rgba(245,166,35,0.25)' : '1px solid transparent',
                borderRadius: 8, padding: '8px 10px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: selectedNote === i ? '#F5A623' : 'var(--cream)', lineHeight: 1.3 }}>
                {note.title}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.6rem', padding: '1px 6px', borderRadius: 4,
                  background: 'rgba(45,74,62,0.3)', color: 'var(--forest-light)',
                }}>{note.tag}</span>
                {note.shared && (
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                    📤 {note.sharedBy}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Note content */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            <pre style={{
              fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: 'var(--cream)',
              lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0,
            }}>
              {NOTE_CONTENT}
            </pre>

            {/* AI generated sections */}
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: 16, padding: 14, borderRadius: 10,
                    background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)',
                  }}
                >
                  <pre style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--cream)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {AI_SUMMARY}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showTranscription && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: 16, padding: 14, borderRadius: 10,
                    background: 'rgba(45,74,62,0.15)', border: '1px solid rgba(45,74,62,0.3)',
                  }}
                >
                  <pre style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--cream)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {AI_TRANSCRIPTION}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showVideoSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: 16, padding: 14, borderRadius: 10,
                    background: 'rgba(100,60,180,0.1)', border: '1px solid rgba(100,60,180,0.25)',
                  }}
                >
                  <pre style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--cream)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {AI_VIDEO_SUMMARY}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel — AI tools */}
        <div style={{
          width: 210, borderLeft: '1px solid rgba(245,166,35,0.1)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Panel tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(245,166,35,0.1)' }}>
            {(['tools', 'share'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setAiTab(tab)}
                style={{
                  flex: 1, padding: '8px 0', background: 'none', border: 'none',
                  fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                  color: aiTab === tab ? '#F5A623' : 'var(--text-muted)',
                  borderBottom: aiTab === tab ? '2px solid #F5A623' : '2px solid transparent',
                }}
              >
                {tab === 'tools' ? '🤖 AI Tools' : '📤 Share'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
            {aiTab === 'tools' ? (
              <>
                <button
                  onClick={() => setShowSummary(s => !s)}
                  style={{
                    padding: '8px 10px', borderRadius: 8,
                    background: showSummary ? 'rgba(245,166,35,0.2)' : 'rgba(245,166,35,0.08)',
                    border: '1px solid rgba(245,166,35,0.2)',
                    color: '#F5A623', fontSize: '0.7rem', fontWeight: 600,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  ✨ {showSummary ? 'Hide Summary' : 'Generate Summary'}
                </button>
                <button
                  onClick={() => setShowTranscription(t => !t)}
                  style={{
                    padding: '8px 10px', borderRadius: 8,
                    background: showTranscription ? 'rgba(45,74,62,0.25)' : 'rgba(45,74,62,0.1)',
                    border: '1px solid rgba(45,74,62,0.25)',
                    color: 'var(--forest-light)', fontSize: '0.7rem', fontWeight: 600,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  🎙️ {showTranscription ? 'Hide Transcription' : 'Generate from Audio'}
                </button>
                <button
                  onClick={() => setShowVideoSummary(v => !v)}
                  style={{
                    padding: '8px 10px', borderRadius: 8,
                    background: showVideoSummary ? 'rgba(100,60,180,0.15)' : 'rgba(100,60,180,0.06)',
                    border: '1px solid rgba(100,60,180,0.2)',
                    color: '#B088E0', fontSize: '0.7rem', fontWeight: 600,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  🎬 {showVideoSummary ? 'Hide Video' : 'Generate Video Summary'}
                </button>

                {/* Upload zone */}
                <div style={{
                  marginTop: 8, padding: 14, borderRadius: 8,
                  border: '1px dashed rgba(245,166,35,0.2)',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: '1.4rem' }}>📁</span>
                  <p style={{ fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Drop PDF, image, audio, or video to generate notes
                  </p>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 4 }}>
                  📤 Share This Note
                </div>
                <input
                  placeholder="Username or email..."
                  style={{
                    background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)',
                    borderRadius: 6, color: 'var(--cream)', padding: '6px 8px',
                    fontSize: '0.7rem', outline: 'none',
                  }}
                />
                <button style={{
                  padding: '6px 10px', borderRadius: 6,
                  background: 'rgba(45,74,62,0.2)', border: '1px solid rgba(45,74,62,0.4)',
                  color: 'var(--forest-light)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
                }}>
                  Share Note
                </button>
                <div style={{ marginTop: 12, fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Currently shared with:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['@rizkidev', '@aminaStudy'].map(u => (
                    <div key={u} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '4px 8px', borderRadius: 6,
                      background: 'rgba(245,237,214,0.04)',
                    }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--cream)' }}>{u}</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>✕</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
