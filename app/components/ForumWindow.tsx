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

const POSTS = [
  {
    id: 1, title: 'Bagaimana cara menghitung integral lipat dua?',
    desc: 'Saya bingung menentukan batas integrasi untuk daerah yang tidak berbentuk persegi.',
    lecture: 'Kalkulus II', upvotes: 12, coins: 30, difficulty: 'Medium',
    aiAnswer: 'Untuk integral lipat dua pada daerah non-persegi, gunakan metode: 1) Gambar daerahnya, 2) Tentukan batas dalam (fungsi y) dan batas luar (konstanta x), 3) Integralkan dari dalam ke luar. Contoh: ∫∫_D f(x,y) dA dengan D dibatasi oleh y=x² dan y=2x.',
    humanAnswers: [
      { user: '@rizkidev', text: 'Coba gambar dulu daerahnya, terus tentuin mana yang jadi batas atas/bawah. Biasanya lebih gampang kalau di-slice horizontal.' },
    ],
  },
  {
    id: 2, title: 'Perbedaan Stack dan Queue dalam implementasi?',
    desc: 'Kapan sebaiknya pakai Stack vs Queue? Ada contoh real-world?',
    lecture: 'Struktur Data', upvotes: 8, coins: 20, difficulty: 'Easy',
    aiAnswer: 'Stack (LIFO): Undo/Redo, browser history, function call stack. Queue (FIFO): Print queue, BFS traversal, task scheduling. Pilih Stack jika urutan terakhir masuk harus pertama keluar, Queue jika first-come-first-served.',
    humanAnswers: [
      { user: '@sarahAI', text: 'Queue juga dipake buat message broker kayak RabbitMQ!' },
      { user: '@dwiPratama', text: 'Stack itu kayak tumpukan piring, Queue kayak antrian di kasir 😅' },
    ],
  },
  {
    id: 3, title: 'Rumus energi kinetik rotasi?',
    desc: 'Bagaimana menghitung energi kinetik untuk benda yang berotasi?',
    lecture: 'Fisika Dasar', upvotes: 5, coins: 0, difficulty: 'Hard',
    aiAnswer: 'Energi kinetik rotasi: Ek = ½·I·ω² dimana I = momen inersia dan ω = kecepatan sudut. Untuk benda yang bergerak translasi dan rotasi: Ek_total = ½mv² + ½Iω². Momen inersia bergantung pada bentuk benda (batang, bola, silinder, dll).',
    humanAnswers: [],
  },
];

export default function ForumWindow({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<'list' | 'detail' | 'ask'>('list');
  const [selectedPost, setSelectedPost] = useState(0);
  const [showAI, setShowAI] = useState<Record<number, boolean>>({});

  const post = POSTS[selectedPost];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} style={{ ...wb, width: 520, height: 480, top: 45, left: 180 }}>
      <div style={{ height: 36, background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>💬 Forum Q&A</span>
      </div>

      {/* Sub nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', borderBottom: '1px solid rgba(245,166,35,0.06)', flexShrink: 0 }}>
        {view !== 'list' && (
          <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#F5A623', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
        )}
        <div style={{ flex: 1 }}/>
        {view === 'list' && (
          <button onClick={() => setView('ask')} style={{
            padding: '4px 10px', borderRadius: 6, background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623', fontSize: '0.63rem', fontWeight: 600, cursor: 'pointer',
          }}>+ Ask Question</button>
        )}
      </div>

      <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {POSTS.map((p, i) => (
              <motion.button key={p.id} onClick={() => { setSelectedPost(i); setView('detail'); }}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: '12px 14px', borderRadius: 10, background: 'rgba(245,237,214,0.03)',
                  border: '1px solid rgba(245,166,35,0.1)', cursor: 'pointer', textAlign: 'left', width: '100%',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--cream)', lineHeight: 1.3, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{p.desc}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, background: 'rgba(45,74,62,0.25)', color: 'var(--forest-light)' }}>{p.lecture}</span>
                    {p.coins > 0 && <span style={{ fontSize: '0.6rem', color: '#FFD27D' }}>🪙 {p.coins}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>▲ {p.upvotes}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>💬 {p.humanAnswers.length + 1}</span>
                  <span style={{
                    fontSize: '0.55rem', padding: '1px 5px', borderRadius: 3,
                    background: p.difficulty === 'Easy' ? 'rgba(45,180,80,0.15)' :
                      p.difficulty === 'Medium' ? 'rgba(245,166,35,0.15)' : 'rgba(255,95,87,0.15)',
                    color: p.difficulty === 'Easy' ? '#4ADE80' :
                      p.difficulty === 'Medium' ? '#F5A623' : '#FF5F57',
                  }}>+{p.difficulty === 'Easy' ? 15 : p.difficulty === 'Medium' ? 30 : 50} EXP</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {view === 'detail' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cream)', marginBottom: 4 }}>{post.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{post.desc}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, background: 'rgba(45,74,62,0.25)', color: 'var(--forest-light)' }}>{post.lecture}</span>
                {post.coins > 0 && <span style={{ fontSize: '0.6rem', color: '#FFD27D' }}>🪙 {post.coins} bounty</span>}
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>▲ {post.upvotes}</span>
              </div>
            </div>

            {/* AI Answer */}
            <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: '0.6rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(245,166,35,0.2)', color: '#F5A623', fontWeight: 600 }}>🤖 AI Answer</span>
              </div>
              <AnimatePresence>
                {showAI[post.id] !== false ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontSize: '0.72rem', color: 'var(--cream)', lineHeight: 1.6 }}>
                    {post.aiAnswer}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Human answers */}
            {post.humanAnswers.map((ha, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(45,74,62,0.08)', border: '1px solid rgba(45,74,62,0.15)' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--forest-light)', marginBottom: 4 }}>{ha.user}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--cream)', lineHeight: 1.5 }}>{ha.text}</div>
              </div>
            ))}

            {/* Answer input */}
            <div style={{ display: 'flex', gap: 6 }}>
              <input placeholder="Write your answer..." style={{
                flex: 1, background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)',
                borderRadius: 8, color: 'var(--cream)', padding: '7px 10px', fontSize: '0.7rem', outline: 'none',
              }}/>
              <button style={{
                padding: '7px 14px', borderRadius: 8, background: 'rgba(45,74,62,0.2)',
                border: '1px solid rgba(45,74,62,0.4)', color: 'var(--forest-light)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
              }}>Post</button>
            </div>
          </div>
        )}

        {view === 'ask' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cream)' }}>Ask a Question</div>
            <input placeholder="Title..." style={{
              background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)',
              borderRadius: 8, color: 'var(--cream)', padding: '8px 10px', fontSize: '0.72rem', outline: 'none',
            }}/>
            <textarea placeholder="Description..." style={{
              background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)',
              borderRadius: 8, color: 'var(--cream)', padding: '8px 10px', fontSize: '0.72rem',
              resize: 'none', height: 80, outline: 'none',
            }}/>
            <select style={{
              background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,166,35,0.15)',
              borderRadius: 8, color: 'var(--cream)', padding: '8px 10px', fontSize: '0.72rem', outline: 'none',
            }}>
              <option value="">Select Lecture...</option>
              <option>Kalkulus II</option>
              <option>Struktur Data</option>
              <option>Fisika Dasar</option>
              <option>Basis Data</option>
            </select>

            {/* Coin bounty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>🪙 Coin Bounty:</span>
              <input type="range" min={0} max={100} step={10} defaultValue={20}
                style={{ flex: 1, accentColor: '#F5A623' }}/>
              <span style={{ fontSize: '0.68rem', color: '#FFD27D', fontWeight: 600 }}>20</span>
            </div>

            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.12)', fontSize: '0.63rem', color: 'var(--text-muted)' }}>
              💡 AI will review your question and assign EXP based on difficulty. The question will also be auto-answered by AI.
            </div>

            <button style={{
              padding: '8px 0', borderRadius: 8, background: 'linear-gradient(135deg,#F5A623,#E8921C)',
              border: 'none', color: '#1A1208', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
            }}>Post Question</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
