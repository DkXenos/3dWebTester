'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRADE_SCALE: Record<string, number> = {
  A: 4.0, 'A-': 3.7,
  'B+': 3.3, B: 3.0, 'B-': 2.7,
  'C+': 2.3, C: 2.0, 'C-': 1.7,
  D: 1.0, E: 0.0,
};
const GRADE_COLORS: Record<string, string> = {
  A: '#2D4A3E', 'A-': '#3D6B5A',
  'B+': '#F5A623', B: '#F5A623', 'B-': '#E8921C',
  'C+': '#D4814A', C: '#C0703A',
  'C-': '#A05028', D: '#803820', E: '#602010',
};

interface Course {
  id: number;
  name: string;
  sks: number;
  grade: string;
}

let nextId = 4;

function GradeBar({ ipk }: { ipk: number }) {
  const pct = (ipk / 4.0) * 100;
  const color = ipk >= 3.5 ? 'var(--forest-light)' : ipk >= 3.0 ? 'var(--amber)' : ipk >= 2.0 ? '#D4814A' : '#C04030';
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {ipk >= 3.5 ? '🏆 Cum Laude' : ipk >= 3.0 ? '🥇 Sangat Memuaskan' : ipk >= 2.0 ? '🥈 Memuaskan' : '⚠️ Butuh Usaha'}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>4.00</span>
      </div>
      <div style={{
        height: 8, borderRadius: 4,
        background: 'rgba(245,237,214,0.08)',
        overflow: 'hidden',
      }}>
        <motion.div
          style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}dd)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
    </div>
  );
}

export default function GradeCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Kalkulus II', sks: 3, grade: 'A' },
    { id: 2, name: 'Pemrograman Web', sks: 3, grade: 'B+' },
    { id: 3, name: 'Basis Data', sks: 3, grade: 'A-' },
  ]);

  const { ipk, totalSks } = useMemo(() => {
    const valid = courses.filter(c => c.name && c.sks > 0 && c.grade in GRADE_SCALE);
    const totalSks = valid.reduce((s, c) => s + c.sks, 0);
    const weightedSum = valid.reduce((s, c) => s + (GRADE_SCALE[c.grade] * c.sks), 0);
    const ipk = totalSks > 0 ? weightedSum / totalSks : 0;
    return { ipk, totalSks };
  }, [courses]);

  const addCourse = () => setCourses(cs => [...cs, { id: nextId++, name: '', sks: 3, grade: 'B' }]);
  const removeCourse = (id: number) => setCourses(cs => cs.filter(c => c.id !== id));
  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(cs => cs.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--cream)' }}>
            🎓 Kalkulator IPK
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {totalSks} SKS total
          </p>
        </div>
        {/* IPK Badge */}
        <div style={{
          textAlign: 'center',
          background: 'rgba(245,166,35,0.12)',
          border: '1px solid rgba(245,166,35,0.3)',
          borderRadius: 12,
          padding: '6px 14px',
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--amber)',
            lineHeight: 1,
            textShadow: '0 0 16px rgba(245,166,35,0.4)',
          }}>
            {ipk.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 2 }}>IPK</div>
        </div>
      </div>

      <GradeBar ipk={ipk} />

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 70px 28px', gap: 6, alignItems: 'center' }}>
        {['Mata Kuliah', 'SKS', 'Nilai', ''].map((h, i) => (
          <span key={i} style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
        ))}
      </div>

      {/* Courses */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 220 }}>
        <AnimatePresence>
          {courses.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 48px 70px 28px', gap: 6, alignItems: 'center' }}
            >
              <input
                className="input"
                value={c.name}
                onChange={e => updateCourse(c.id, 'name', e.target.value)}
                placeholder="Nama Matkul"
                style={{ fontSize: '0.78rem', padding: '6px 8px' }}
              />
              <input
                className="input"
                type="number"
                min={1} max={6}
                value={c.sks}
                onChange={e => updateCourse(c.id, 'sks', parseInt(e.target.value) || 0)}
                style={{ fontSize: '0.78rem', padding: '6px 6px', textAlign: 'center' }}
              />
              <select
                className="input select"
                value={c.grade}
                onChange={e => updateCourse(c.id, 'grade', e.target.value)}
                style={{
                  fontSize: '0.78rem',
                  padding: '6px 4px',
                  color: GRADE_COLORS[c.grade] || 'var(--cream)',
                  fontWeight: 700,
                }}
              >
                {Object.keys(GRADE_SCALE).map(g => (
                  <option key={g} value={g} style={{ background: '#1A1208', color: GRADE_COLORS[g] }}>{g}</option>
                ))}
              </select>
              <button
                onClick={() => removeCourse(c.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.85rem',
                  transition: 'color 0.2s',
                  padding: 4, borderRadius: 4,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C04030')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button className="btn btn-ghost" onClick={addCourse} style={{ fontSize: '0.78rem', gap: 6 }}>
        + Tambah Mata Kuliah
      </button>
    </div>
  );
}
