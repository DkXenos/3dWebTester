'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

interface DesktopOverlayProps {
  visible: boolean;
}

// ─── shared window chrome ────────────────────────────────────────────────────
const windowBase: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 16,
  background: 'rgba(14,10,5,0.88)',
  backdropFilter: 'blur(28px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
  border: '1px solid rgba(245,166,35,0.18)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const titleBar = (label: string, icon: string, onClose: () => void) => (
  <div
    style={{
      height: 36,
      background: 'rgba(245,166,35,0.07)',
      borderBottom: '1px solid rgba(245,166,35,0.12)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 8,
      flexShrink: 0,
    }}
  >
    <button
      onClick={onClose}
      style={{
        width: 12, height: 12, borderRadius: '50%',
        background: '#FF5F57', border: 'none', cursor: 'pointer', flexShrink: 0,
      }}
    />
    <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
    <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
    <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(245,237,214,0.7)', marginRight: 36 }}>
      {icon} {label}
    </span>
  </div>
);

// ─── Timer widget ─────────────────────────────────────────────────────────────
function TimerWindow({ onClose }: { onClose: () => void }) {
  const MODES = [
    { label: 'Focus', secs: 25 * 60 },
    { label: 'Short Break', secs: 5 * 60 },
    { label: 'Long Break', secs: 15 * 60 },
  ];
  const [modeIdx, setModeIdx] = useState(0);
  const [remaining, setRemaining] = useState(MODES[0].secs);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(MODES[modeIdx].secs);
    setRunning(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeIdx]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { clearInterval(intervalRef.current!); setRunning(false); return 0; }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const total = MODES[modeIdx].secs;
  const pct = ((total - remaining) / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      style={{ ...windowBase, width: 300, top: 60, left: 60 }}
    >
      {titleBar('Pomodoro Timer', '⏱️', onClose)}
      <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
          {MODES.map((m, i) => (
            <button
              key={m.label}
              onClick={() => setModeIdx(i)}
              style={{
                background: modeIdx === i ? 'rgba(245,166,35,0.2)' : 'none',
                border: modeIdx === i ? '1px solid rgba(245,166,35,0.35)' : '1px solid transparent',
                borderRadius: 7,
                color: modeIdx === i ? '#F5A623' : 'rgba(245,237,214,0.45)',
                fontSize: '0.65rem', fontWeight: 600,
                padding: '4px 10px', cursor: 'pointer',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        {/* Ring */}
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={70} cy={70} r={60} fill="none" stroke="rgba(245,166,35,0.1)" strokeWidth={8} />
            <circle
              cx={70} cy={70} r={60}
              fill="none"
              stroke="#F5A623"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - pct / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#F5EDD6', letterSpacing: '-1px' }}>
              {mm}:{ss}
            </span>
            <span style={{ fontSize: '0.6rem', color: 'rgba(245,237,214,0.4)', fontWeight: 500 }}>
              {MODES[modeIdx].label.toUpperCase()}
            </span>
          </div>
        </div>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setRunning((r) => !r)}
            style={{
              padding: '8px 28px', borderRadius: 10,
              background: running ? 'rgba(255,95,87,0.15)' : 'rgba(245,166,35,0.15)',
              border: running ? '1px solid rgba(255,95,87,0.4)' : '1px solid rgba(245,166,35,0.4)',
              color: running ? '#FF5F57' : '#F5A623',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => { setRunning(false); setRemaining(MODES[modeIdx].secs); }}
            style={{
              padding: '8px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(245,237,214,0.4)',
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Notes widget ─────────────────────────────────────────────────────────────
function NotesWindow({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('desktop-notes') ?? '' : ''
  );
  const save = useCallback((val: string) => {
    setText(val);
    localStorage.setItem('desktop-notes', val);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      style={{ ...windowBase, width: 340, height: 380, top: 60, left: 390 }}
    >
      {titleBar('Quick Notes', '📝', onClose)}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12, gap: 8 }}>
        <textarea
          value={text}
          onChange={(e) => save(e.target.value)}
          placeholder="Type your notes here…"
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(245,166,35,0.1)',
            borderRadius: 10,
            color: '#F5EDD6',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            padding: '10px 12px',
            resize: 'none',
            outline: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
          spellCheck={false}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(245,237,214,0.3)' }}>
            {text.length} chars · auto-saved
          </span>
          <button
            onClick={() => save('')}
            style={{
              background: 'none', border: '1px solid rgba(255,95,87,0.25)',
              color: 'rgba(255,95,87,0.6)', borderRadius: 7,
              fontSize: '0.65rem', padding: '3px 10px', cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PDF Reader widget ────────────────────────────────────────────────────────
function PDFWindow({ onClose }: { onClose: () => void }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      style={{ ...windowBase, width: 460, height: 560, top: 60, right: 60, left: 'auto' }}
    >
      {titleBar('PDF Reader', '📄', onClose)}
      {pdfUrl ? (
        <div style={{ flex: 1, position: 'relative' }}>
          <iframe
            src={pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="PDF Viewer"
          />
          <button
            onClick={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'rgba(14,10,5,0.8)', border: '1px solid rgba(245,166,35,0.2)',
              color: '#F5A623', borderRadius: 8,
              fontSize: '0.65rem', padding: '4px 10px', cursor: 'pointer',
            }}
          >
            ✕ Close PDF
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            margin: 16,
            borderRadius: 12,
            border: dragging
              ? '2px dashed rgba(245,166,35,0.7)'
              : '2px dashed rgba(245,166,35,0.2)',
            background: dragging ? 'rgba(245,166,35,0.06)' : 'transparent',
            transition: 'all 0.2s',
            cursor: 'default',
          }}
        >
          <span style={{ fontSize: '3rem' }}>📄</span>
          <p style={{ color: 'rgba(245,237,214,0.55)', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
            Drop a PDF here
          </p>
          <p style={{ color: 'rgba(245,237,214,0.3)', fontSize: '0.72rem', margin: 0 }}>
            or click below to browse
          </p>
          <label
            style={{
              padding: '8px 20px', borderRadius: 10,
              background: 'rgba(245,166,35,0.12)',
              border: '1px solid rgba(245,166,35,0.3)',
              color: '#F5A623', fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Browse File
            <input
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                  setPdfUrl(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>
      )}
    </motion.div>
  );
}

const dockApps = [
  { id: 'studynest', name: 'StudyNest', icon: '📚', href: '/dashboard' },
  { id: 'timer',     name: 'Timer',     icon: '⏱️', href: null },
  { id: 'notes',     name: 'Notes',     icon: '📝', href: null },
  { id: 'pdf',       name: 'PDF',       icon: '📄', href: null },
];

export default function DesktopOverlay({ visible }: DesktopOverlayProps) {
  const [time, setTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [openWindows, setOpenWindows] = useState<Set<string>>(new Set());

  const toggleWindow = (id: string) => {
    setOpenWindows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShowWelcome(false), 2500);
      return () => clearTimeout(t);
    } else {
      setShowWelcome(true);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="desktop-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', system-ui, sans-serif",
            overflow: 'hidden',
          }}
        >
          {/* Wallpaper */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 120% 80% at 30% 20%, rgba(45,74,62,0.5) 0%, transparent 50%),
                radial-gradient(ellipse 100% 60% at 70% 80%, rgba(245,166,35,0.15) 0%, transparent 50%),
                radial-gradient(ellipse 80% 80% at 50% 50%, rgba(61,43,20,0.3) 0%, transparent 60%),
                linear-gradient(160deg, #0A0802 0%, #120D06 35%, #0E0A05 70%, #0A0802 100%)
              `,
              zIndex: -1,
            }}
          />

          {/* ── Top Menu Bar ── */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 32,
              background: 'rgba(14, 10, 5, 0.85)',
              backdropFilter: 'blur(24px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
              borderBottom: '1px solid rgba(245,166,35,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--cream)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#F5A623', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                ✦ StudyNest
              </span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>File</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Edit</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>View</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.7rem' }}>🔋 100%</span>
              <span style={{ fontSize: '0.7rem' }}>Wi-Fi</span>
              <span style={{ fontWeight: 500 }}>{time}</span>
            </div>
          </motion.div>

          {/* ── Desktop Area ── */}
          <div style={{ flex: 1, position: 'relative' }}>

            {/* Welcome splash */}
            <AnimatePresence>
              {showWelcome && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center' }}
                  >
                    <h1
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #FFD27D, #F5A623, #E8921C)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: 8,
                      }}
                    >
                      Welcome to StudyNest
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Your digital sanctuary is ready
                    </p>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Hint after welcome */}
            <AnimatePresence>
              {!showWelcome && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ color: 'rgba(245,237,214,0.12)', fontSize: '0.78rem', letterSpacing: '0.08em' }}
                  >
                    Open apps from the dock below
                  </motion.p>
                </div>
              )}
            </AnimatePresence>

            {/* ── App Windows ── */}
            <AnimatePresence>
              {openWindows.has('timer') && (
                <TimerWindow key="timer" onClose={() => toggleWindow('timer')} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {openWindows.has('notes') && (
                <NotesWindow key="notes" onClose={() => toggleWindow('notes')} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {openWindows.has('pdf') && (
                <PDFWindow key="pdf" onClose={() => toggleWindow('pdf')} />
              )}
            </AnimatePresence>
          </div>

          {/* ── Dock ── */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 20,
                background: 'rgba(14, 10, 5, 0.7)',
                backdropFilter: 'blur(24px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
                border: '1px solid rgba(245,166,35,0.12)',
                alignItems: 'flex-end',
              }}
            >
              {dockApps.map((app) => {
                const isOpen = app.id !== 'studynest' && openWindows.has(app.id);
                return app.href ? (
                  <a
                    key={app.id}
                    href={app.href}
                    title={app.name}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: 'rgba(245,237,214,0.06)',
                        border: '1px solid rgba(245,166,35,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px) scale(1.15)';
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,166,35,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)';
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,237,214,0.06)';
                      }}
                    >
                      {app.icon}
                    </div>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'transparent' }} />
                  </a>
                ) : (
                  <button
                    key={app.id}
                    title={app.name}
                    onClick={() => toggleWindow(app.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: isOpen ? 'rgba(245,166,35,0.18)' : 'rgba(245,237,214,0.06)',
                        border: isOpen ? '1px solid rgba(245,166,35,0.45)' : '1px solid rgba(245,166,35,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: isOpen ? '0 0 16px rgba(245,166,35,0.15)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px) scale(1.15)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)';
                      }}
                    >
                      {app.icon}
                    </div>
                    {/* Active dot */}
                    <span
                      style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: isOpen ? '#F5A623' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
