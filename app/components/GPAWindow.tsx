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

type Course = { name: string; sks: number; grade: string; };

const SEMESTERS: { label: string; courses: Course[] }[] = [
  { label: 'Semester 1', courses: [
    { name: 'Kalkulus I', sks: 3, grade: 'A' },
    { name: 'Fisika Dasar', sks: 3, grade: 'B+' },
    { name: 'Algoritma & Pemrograman', sks: 4, grade: 'A' },
    { name: 'Bahasa Inggris', sks: 2, grade: 'A-' },
    { name: 'Pengantar Teknologi Informasi', sks: 3, grade: 'B+' },
  ]},
  { label: 'Semester 2', courses: [
    { name: 'Kalkulus II', sks: 3, grade: 'B' },
    { name: 'Struktur Data', sks: 4, grade: 'A-' },
    { name: 'Sistem Digital', sks: 3, grade: 'B+' },
    { name: 'Statistika', sks: 3, grade: 'A' },
    { name: 'Aljabar Linear', sks: 3, grade: 'B' },
  ]},
  { label: 'Semester 3', courses: [
    { name: 'Basis Data', sks: 4, grade: 'A' },
    { name: 'Sistem Operasi', sks: 3, grade: 'B+' },
    { name: 'Jaringan Komputer', sks: 3, grade: 'A-' },
    { name: 'Metode Numerik', sks: 3, grade: 'B' },
    { name: 'Pemrograman Web', sks: 3, grade: 'A' },
  ]},
  { label: 'Semester 4', courses: [
    { name: 'Rekayasa Perangkat Lunak', sks: 4, grade: 'A-' },
    { name: 'Kecerdasan Buatan', sks: 3, grade: 'A' },
    { name: 'Teori Bahasa & Otomata', sks: 3, grade: 'B+' },
    { name: 'Interaksi Manusia Komputer', sks: 3, grade: 'A' },
  ]},
];

const GRADE_MAP: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'E': 0,
};

const AI_SUGGESTION = `📊 **Analisis AI — Saran Peningkatan IPK**

Berdasarkan data akademikmu, berikut saran untuk meningkatkan IPK:

1. **Kalkulus II (B)** → Fokuskan review pada bab Integral dan Deret. Rekomendasi: buat kelompok belajar untuk latihan soal bersama.

2. **Aljabar Linear (B)** → Gunakan visualisasi 3D untuk memahami ruang vektor. Channel YouTube: 3Blue1Brown sangat membantu.

3. **Metode Numerik (B)** → Latihan coding implementasi metode numerik. Practice makes perfect!

💡 **Target realistis**: Dengan perbaikan di 3 mata kuliah di atas, IPK kumulatif bisa naik dari **3.42** menjadi **3.55-3.60**.

🎯 **Prioritas**: Fokus pada mata kuliah ber-SKS tinggi terlebih dahulu, karena dampaknya lebih besar ke IPK.`;

function calcIPK(courses: Course[]) {
  let totalPoints = 0, totalSKS = 0;
  courses.forEach(c => { totalPoints += (GRADE_MAP[c.grade] || 0) * c.sks; totalSKS += c.sks; });
  return totalSKS > 0 ? (totalPoints / totalSKS) : 0;
}

export default function GPAWindow({ onClose }: { onClose: () => void }) {
  const [semIdx, setSemIdx] = useState(0);
  const [showAI, setShowAI] = useState(false);

  const sem = SEMESTERS[semIdx];
  const semIPK = calcIPK(sem.courses);
  const allCourses = SEMESTERS.slice(0, semIdx + 1).flatMap(s => s.courses);
  const cumIPK = calcIPK(allCourses);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} style={{ ...wb, width: 480, height: 490, top: 40, right: 80, left: 'auto' }}>
      <div style={{ height: 36, background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>🎓 GPA Calculator</span>
      </div>

      {/* Semester tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(245,166,35,0.08)', flexShrink: 0 }}>
        {SEMESTERS.map((s, i) => (
          <button key={i} onClick={() => { setSemIdx(i); setShowAI(false); }} style={{
            flex: 1, padding: '7px 0', background: 'none', border: 'none',
            fontSize: '0.63rem', fontWeight: 600, cursor: 'pointer',
            color: semIdx === i ? '#F5A623' : 'var(--text-muted)',
            borderBottom: semIdx === i ? '2px solid #F5A623' : '2px solid transparent',
          }}>Sem {i+1}</button>
        ))}
      </div>

      {/* IPK display */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '12px 0', flexShrink: 0, borderBottom: '1px solid rgba(245,166,35,0.06)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>IPK Semester</div>
          <motion.div key={`s-${semIdx}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#F5A623' }}>
            {semIPK.toFixed(2)}
          </motion.div>
        </div>
        <div style={{ width: 1, background: 'var(--glass-border)' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>IPK Kumulatif</div>
          <motion.div key={`c-${semIdx}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--forest-light)' }}>
            {cumIPK.toFixed(2)}
          </motion.div>
        </div>
      </div>

      {/* Course table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
        {/* Header */}
        <div style={{ display: 'flex', padding: '8px 0', fontSize: '0.58rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(245,166,35,0.06)' }}>
          <span style={{ flex: 1 }}>Mata Kuliah</span>
          <span style={{ width: 40, textAlign: 'center' }}>SKS</span>
          <span style={{ width: 50, textAlign: 'center' }}>Nilai</span>
          <span style={{ width: 50, textAlign: 'right' }}>Bobot</span>
        </div>
        {sem.courses.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(245,237,214,0.03)' }}>
            <span style={{ flex: 1, fontSize: '0.72rem', color: 'var(--cream)' }}>{c.name}</span>
            <span style={{ width: 40, textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.sks}</span>
            <span style={{
              width: 50, textAlign: 'center', fontSize: '0.7rem', fontWeight: 700,
              color: (GRADE_MAP[c.grade] || 0) >= 3.7 ? '#4ADE80' : (GRADE_MAP[c.grade] || 0) >= 3.0 ? '#F5A623' : '#FF5F57',
            }}>{c.grade}</span>
            <span style={{ width: 50, textAlign: 'right', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {(GRADE_MAP[c.grade] || 0).toFixed(1)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* AI suggestion */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(245,166,35,0.08)', flexShrink: 0 }}>
        <button onClick={() => setShowAI(s => !s)} style={{
          width: '100%', padding: '7px 0', borderRadius: 8,
          background: showAI ? 'rgba(245,166,35,0.15)' : 'rgba(245,166,35,0.08)',
          border: '1px solid rgba(245,166,35,0.2)', color: '#F5A623',
          fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
        }}>✨ {showAI ? 'Hide' : 'Generate'} AI Improvement Plan</button>
      </div>

      <AnimatePresence>
        {showAI && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 180, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflowY: 'auto', padding: '0 14px 12px', flexShrink: 0 }}>
            <pre style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.68rem', color: 'var(--cream)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
              {AI_SUGGESTION}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
