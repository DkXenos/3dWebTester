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

const QUIZZES = [
  {
    title: 'Kalkulus — Integral',
    questions: [
      { q: 'Apa hasil dari ∫ 2x dx?', opts: ['x + C', 'x² + C', '2x² + C', '2 + C'], correct: 1 },
      { q: 'Rumus integral parsial adalah...', opts: ['∫u dv = uv - ∫v du', '∫u dv = u + v', 'd/dx ∫f = f', 'Tidak ada'], correct: 0 },
      { q: 'Apa turunan dari sin(x)?', opts: ['-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)'], correct: 1 },
    ],
  },
  {
    title: 'Struktur Data — Tree',
    questions: [
      { q: 'Binary Search Tree memiliki property...', opts: ['Left < Root < Right', 'Left > Root', 'Random order', 'Sorted array'], correct: 0 },
      { q: 'Traversal In-Order menghasilkan...', opts: ['Random order', 'Sorted ascending', 'Reverse order', 'Level order'], correct: 1 },
      { q: 'Worst case lookup BST yang tidak balanced?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2 },
    ],
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'AminaCoder', score: 290, emoji: '🥇' },
  { rank: 2, name: 'RizkiDev', score: 275, emoji: '🥈' },
  { rank: 3, name: 'SarahStudy', score: 260, emoji: '🥉' },
  { rank: 4, name: 'You', score: 250, emoji: '⭐' },
  { rank: 5, name: 'DwiPratama', score: 230, emoji: '' },
];

export default function QuizWindow({ onClose }: { onClose: () => void }) {
  const [quizIdx, setQuizIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showBoard, setShowBoard] = useState(false);

  const quiz = QUIZZES[quizIdx];
  const question = quiz.questions[qIdx];

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    setAnswered(a => a + 1);
    if (optIdx === question.correct) setScore(s => s + 1);
  };

  const nextQ = () => {
    if (qIdx < quiz.questions.length - 1) {
      setQIdx(i => i + 1);
      setSelected(null);
    }
  };

  const resetQuiz = () => { setQIdx(0); setSelected(null); setScore(0); setAnswered(0); };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} style={{ ...wb, width: 440, height: 460, top: 50, left: 260 }}>
      <div style={{ height: 36, background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>📊 Quiz</span>
      </div>

      {/* Quiz tabs + leaderboard toggle */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(245,166,35,0.08)', flexShrink: 0 }}>
        {QUIZZES.map((q, i) => (
          <button key={i} onClick={() => { setQuizIdx(i); resetQuiz(); }} style={{
            flex: 1, padding: '7px 0', background: 'none', border: 'none',
            fontSize: '0.63rem', fontWeight: 600, cursor: 'pointer',
            color: quizIdx === i && !showBoard ? '#F5A623' : 'var(--text-muted)',
            borderBottom: quizIdx === i && !showBoard ? '2px solid #F5A623' : '2px solid transparent',
          }}>{q.title}</button>
        ))}
        <button onClick={() => setShowBoard(b => !b)} style={{
          padding: '7px 12px', background: 'none', border: 'none',
          fontSize: '0.63rem', fontWeight: 600, cursor: 'pointer',
          color: showBoard ? '#F5A623' : 'var(--text-muted)',
          borderBottom: showBoard ? '2px solid #F5A623' : '2px solid transparent',
        }}>🏆 Board</button>
      </div>

      <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
        {showBoard ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cream)', marginBottom: 8 }}>🏆 Quiz Leaderboard</div>
            {LEADERBOARD.map(e => (
              <div key={e.rank} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8,
                background: e.name === 'You' ? 'rgba(245,166,35,0.12)' : 'rgba(245,237,214,0.03)',
                border: e.name === 'You' ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
              }}>
                <span style={{ fontSize: '0.85rem', width: 24, textAlign: 'center' }}>{e.emoji || `#${e.rank}`}</span>
                <span style={{ flex: 1, fontSize: '0.74rem', fontWeight: e.name === 'You' ? 700 : 500, color: e.name === 'You' ? '#F5A623' : 'var(--cream)' }}>{e.name}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--amber-light)' }}>{e.score} pts</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Question {qIdx+1}/{quiz.questions.length}</span>
              <span style={{ fontSize: '0.65rem', color: '#FFD27D', fontWeight: 600 }}>Score: {score}/{answered}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(245,237,214,0.06)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${((qIdx+1)/quiz.questions.length)*100}%` }}
                style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,var(--forest-light),var(--amber))' }}/>
            </div>

            {/* Question */}
            <motion.div key={`${quizIdx}-${qIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              style={{ padding: 14, borderRadius: 10, background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--cream)', lineHeight: 1.5 }}>{question.q}</div>
            </motion.div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {question.opts.map((opt, i) => {
                let bg = 'rgba(245,237,214,0.04)';
                let border = 'rgba(245,166,35,0.1)';
                let col = 'var(--cream)';
                if (selected !== null) {
                  if (i === question.correct) { bg = 'rgba(45,180,80,0.15)'; border = 'rgba(45,180,80,0.5)'; col = '#4ADE80'; }
                  else if (i === selected) { bg = 'rgba(255,95,87,0.15)'; border = 'rgba(255,95,87,0.5)'; col = '#FF5F57'; }
                }
                return (
                  <motion.button key={i} onClick={() => handleSelect(i)} whileHover={selected === null ? { scale: 1.01 } : {}}
                    style={{
                      padding: '10px 14px', borderRadius: 8, background: bg,
                      border: `1px solid ${border}`, color: col,
                      fontSize: '0.75rem', fontWeight: 500, cursor: selected === null ? 'pointer' : 'default',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}>
                    <span style={{ fontWeight: 600, marginRight: 8, color: 'var(--text-muted)' }}>{String.fromCharCode(65+i)}.</span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Next / Result */}
            {selected !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: selected === question.correct ? '#4ADE80' : '#FF5F57', fontWeight: 600 }}>
                  {selected === question.correct ? '✓ Benar! +50 EXP' : '✗ Salah'}
                </span>
                {qIdx < quiz.questions.length - 1 ? (
                  <button onClick={nextQ} style={{
                    padding: '6px 16px', borderRadius: 8, background: 'rgba(245,166,35,0.12)',
                    border: '1px solid rgba(245,166,35,0.3)', color: '#F5A623', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                  }}>Next →</button>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: '#FFD27D', fontWeight: 700 }}>
                    Final: {score}/{quiz.questions.length} — +{score*50} EXP
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
