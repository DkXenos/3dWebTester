'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import NotesAIWindow from './NotesAIWindow';
import AICompanionWindow from './AICompanionWindow';
import StudyModeWindow from './StudyModeWindow';
import QuizWindow from './QuizWindow';
import ForumWindow from './ForumWindow';
import LeaderboardWindow from './LeaderboardWindow';
import GPAWindow from './GPAWindow';
import DailyRewardsWindow from './DailyRewardsWindow';

interface DesktopOverlayProps {
  visible: boolean;
}

const dockApps = [
  { id: 'notes',       name: 'StudyNotes',    icon: '📝' },
  { id: 'ai',          name: 'AI Companion',  icon: '🤖' },
  { id: 'study',       name: 'Study Mode',    icon: '⏱️' },
  { id: 'quiz',        name: 'Quiz',          icon: '📊' },
  { id: 'forum',       name: 'Forum',         icon: '💬' },
  { id: 'leaderboard', name: 'Leaderboard',   icon: '🏆' },
  { id: 'gpa',         name: 'GPA Calc',      icon: '🎓' },
  { id: 'rewards',     name: 'Daily Rewards', icon: '🎁' },
];

/* ── Dropdown item types ── */
type MenuItem = { label: string; icon: string; shortcut?: string; action?: string; divider?: false }
  | { divider: true };

const fileMenu: MenuItem[] = [
  { label: 'New Note', icon: '📝', shortcut: '⌘N', action: 'notes' },
  { label: 'Upload File to AI', icon: '📁', shortcut: '⌘U', action: 'notes' },
  { label: 'Import Audio / Video', icon: '🎙️', shortcut: '⌘I', action: 'notes' },
  { divider: true },
  { label: 'Open AI Companion', icon: '🤖', shortcut: '⌘A', action: 'ai' },
  { label: 'Start Study Session', icon: '⏱️', shortcut: '⌘S', action: 'study' },
  { divider: true },
  { label: 'Open GPA Calculator', icon: '🎓', action: 'gpa' },
  { label: 'Open Forum', icon: '💬', action: 'forum' },
  { divider: true },
  { label: 'Export Notes as PDF', icon: '📄', action: 'toast:Exporting notes...' },
  { label: 'Print', icon: '🖨️', shortcut: '⌘P', action: 'toast:Print dialog opened' },
];

const editMenu: MenuItem[] = [
  { label: 'Undo', icon: '↩️', shortcut: '⌘Z', action: 'toast:Undo' },
  { label: 'Redo', icon: '↪️', shortcut: '⌘⇧Z', action: 'toast:Redo' },
  { divider: true },
  { label: 'Cut', icon: '✂️', shortcut: '⌘X', action: 'toast:Cut to clipboard' },
  { label: 'Copy', icon: '📋', shortcut: '⌘C', action: 'toast:Copied' },
  { label: 'Paste', icon: '📌', shortcut: '⌘V', action: 'toast:Pasted' },
  { divider: true },
  { label: 'AI Personality Settings', icon: '🎭', action: 'ai' },
  { label: 'Study Timer Preferences', icon: '⚙️', action: 'study' },
  { divider: true },
  { label: 'Clear All Notes', icon: '🗑️', action: 'toast:Notes cleared' },
];

const viewMenu: MenuItem[] = [
  { label: 'Show All Windows', icon: '🪟', action: 'openAll' },
  { label: 'Close All Windows', icon: '✕', shortcut: '⌘⇧W', action: 'closeAll' },
  { divider: true },
  { label: 'Leaderboard', icon: '🏆', shortcut: '⌘L', action: 'leaderboard' },
  { label: 'Daily Rewards', icon: '🎁', shortcut: '⌘D', action: 'rewards' },
  { label: 'Quiz Mode', icon: '📊', shortcut: '⌘Q', action: 'quiz' },
  { divider: true },
  { label: 'Toggle Full Screen', icon: '⛶', shortcut: '⌘F', action: 'toast:Fullscreen toggled' },
  { label: 'Zoom In', icon: '🔍', shortcut: '⌘+', action: 'toast:Zoomed in' },
  { label: 'Zoom Out', icon: '🔎', shortcut: '⌘-', action: 'toast:Zoomed out' },
];

const MENUS = { File: fileMenu, Edit: editMenu, View: viewMenu } as const;
type MenuKey = keyof typeof MENUS;

/* ── Dropdown component ── */
function MenuDropdown({ items, onAction, onClose }: {
  items: MenuItem[];
  onAction: (action: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
      transition={{ duration: 0.12 }}
      style={{
        position: 'absolute', top: 32, left: 0,
        minWidth: 220, padding: '4px 0',
        background: 'rgba(18,13,6,0.96)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        border: '1px solid rgba(245,166,35,0.18)',
        borderRadius: 10,
        boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.06)',
        zIndex: 999,
        transformOrigin: 'top left',
      }}
      onMouseLeave={onClose}
    >
      {items.map((item, i) => {
        if ('divider' in item && item.divider) {
          return <div key={`d-${i}`} style={{ height: 1, background: 'rgba(245,166,35,0.1)', margin: '4px 8px' }} />;
        }
        const m = item as Exclude<MenuItem, { divider: true }>;
        return (
          <button
            key={m.label}
            onClick={() => { if (m.action) onAction(m.action); onClose(); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '0.72rem', color: 'var(--cream)',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >
            <span style={{ width: 18, textAlign: 'center', fontSize: '0.75rem' }}>{m.icon}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{m.label}</span>
            {m.shortcut && (
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em' }}>{m.shortcut}</span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}

export default function DesktopOverlay({ visible }: DesktopOverlayProps) {
  const [time, setTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [openWindows, setOpenWindows] = useState<Set<string>>(new Set());
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toggleWindow = (id: string) => {
    setOpenWindows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMenuAction = useCallback((action: string) => {
    if (action.startsWith('toast:')) {
      setToast(action.slice(6));
      setTimeout(() => setToast(null), 2000);
    } else if (action === 'openAll') {
      setOpenWindows(new Set(dockApps.map(a => a.id)));
    } else if (action === 'closeAll') {
      setOpenWindows(new Set());
    } else {
      // Open the app window
      setOpenWindows(prev => new Set(prev).add(action));
    }
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShowWelcome(false), 2500);
      return () => clearTimeout(t);
    } else { setShowWelcome(true); }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="desktop-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column',
            fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden',
          }}
          onClick={() => setActiveMenu(null)}
        >
          {/* Wallpaper */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 120% 80% at 30% 20%, rgba(45,74,62,0.5) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 70% 80%, rgba(245,166,35,0.15) 0%, transparent 50%),
              radial-gradient(ellipse 80% 80% at 50% 50%, rgba(61,43,20,0.3) 0%, transparent 60%),
              linear-gradient(160deg, #0A0802 0%, #120D06 35%, #0E0A05 70%, #0A0802 100%)
            `,
            zIndex: -1,
          }} />

          {/* ── Toast notification ── */}
          <AnimatePresence>
            {toast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'fixed', top: 44, left: '50%', transform: 'translateX(-50%)',
                  padding: '6px 18px', borderRadius: 8,
                  background: 'rgba(14,10,5,0.92)',
                  border: '1px solid rgba(245,166,35,0.25)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  fontSize: '0.7rem', color: '#F5A623', fontWeight: 600,
                  zIndex: 9999,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Top Menu Bar ── */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 32,
              background: 'rgba(14,10,5,0.85)',
              backdropFilter: 'blur(24px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
              borderBottom: '1px solid rgba(245,166,35,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', fontSize: '0.75rem', fontWeight: 600,
              color: 'var(--cream)', flexShrink: 0,
              position: 'relative', zIndex: 100,
            }}
          >
            {/* Left: brand + menus */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ color: '#F5A623', fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginRight: 14 }}>✦ StudyNest</span>
              {(Object.keys(MENUS) as MenuKey[]).map((menuKey) => (
                <div key={menuKey} style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(prev => prev === menuKey ? null : menuKey); }}
                    onMouseEnter={() => { if (activeMenu !== null) setActiveMenu(menuKey); }}
                    style={{
                      background: activeMenu === menuKey ? 'rgba(245,166,35,0.15)' : 'none',
                      border: 'none', borderRadius: 5,
                      padding: '3px 10px', cursor: 'pointer',
                      color: activeMenu === menuKey ? '#F5A623' : 'var(--text-muted)',
                      fontWeight: activeMenu === menuKey ? 600 : 400,
                      fontSize: '0.75rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    {menuKey}
                  </button>
                  <AnimatePresence>
                    {activeMenu === menuKey && (
                      <MenuDropdown
                        items={MENUS[menuKey]}
                        onAction={handleMenuAction}
                        onClose={() => setActiveMenu(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Center: HUD stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Streak */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <motion.span style={{ fontSize: '0.8rem', display: 'inline-block' }}
                  animate={{ scale: [1, 1.15, 1], rotate: [-2, 2, -2] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>🔥</motion.span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#FF8A1E', fontFamily: 'Outfit,sans-serif' }}>7 Hari</span>
              </div>
              <div style={{ width: 1, height: 16, background: 'rgba(245,166,35,0.15)' }} />
              {/* EXP */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.7rem' }}>⚡</span>
                <div style={{ width: 80, height: 5, borderRadius: 3, background: 'rgba(245,237,214,0.08)', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: '78%' }}
                    style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #FFD27D, #F5A623)' }}
                  />
                </div>
                <span style={{ fontSize: '0.58rem', fontWeight: 600, color: '#F5A623', fontFamily: 'Outfit,sans-serif' }}>2,340</span>
              </div>
              <div style={{ width: 1, height: 16, background: 'rgba(245,166,35,0.15)' }} />
              {/* Coins */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.7rem' }}>🪙</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FFD27D', fontFamily: 'Outfit,sans-serif' }}>1,280</span>
              </div>
            </div>

            {/* Right: system */}
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
                    <h1 style={{
                      fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 700,
                      background: 'linear-gradient(135deg, #FFD27D, #F5A623, #E8921C)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text', marginBottom: 8,
                    }}>Welcome to StudyNest</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your digital sanctuary is ready</p>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Hint */}
            <AnimatePresence>
              {!showWelcome && openWindows.size === 0 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ color: 'rgba(245,237,214,0.12)', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                    Open apps from the dock below
                  </motion.p>
                </div>
              )}
            </AnimatePresence>

            {/* ── App Windows ── */}
            <AnimatePresence>{openWindows.has('notes') && <NotesAIWindow key="notes" onClose={() => toggleWindow('notes')} />}</AnimatePresence>
            <AnimatePresence>{openWindows.has('ai') && <AICompanionWindow key="ai" onClose={() => toggleWindow('ai')} />}</AnimatePresence>
            <AnimatePresence>{openWindows.has('study') && <StudyModeWindow key="study" onClose={() => toggleWindow('study')} />}</AnimatePresence>
            <AnimatePresence>{openWindows.has('quiz') && <QuizWindow key="quiz" onClose={() => toggleWindow('quiz')} />}</AnimatePresence>
            <AnimatePresence>{openWindows.has('forum') && <ForumWindow key="forum" onClose={() => toggleWindow('forum')} />}</AnimatePresence>
            <AnimatePresence>{openWindows.has('leaderboard') && <LeaderboardWindow key="lb" onClose={() => toggleWindow('leaderboard')} />}</AnimatePresence>
            <AnimatePresence>{openWindows.has('gpa') && <GPAWindow key="gpa" onClose={() => toggleWindow('gpa')} />}</AnimatePresence>
            <AnimatePresence>{openWindows.has('rewards') && <DailyRewardsWindow key="rewards" onClose={() => toggleWindow('rewards')} />}</AnimatePresence>
          </div>

          {/* ── Dock ── */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12, flexShrink: 0 }}
          >
            <div style={{
              display: 'flex', gap: 6, padding: '8px 16px', borderRadius: 20,
              background: 'rgba(14,10,5,0.7)',
              backdropFilter: 'blur(24px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
              border: '1px solid rgba(245,166,35,0.12)',
              alignItems: 'flex-end',
            }}>
              {dockApps.map((app) => {
                const isOpen = openWindows.has(app.id);
                return (
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
                        width: 48, height: 48, borderRadius: 13,
                        background: isOpen ? 'rgba(245,166,35,0.18)' : 'rgba(245,237,214,0.06)',
                        border: isOpen ? '1px solid rgba(245,166,35,0.45)' : '1px solid rgba(245,166,35,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.35rem',
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
                    <span style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: isOpen ? '#F5A623' : 'transparent',
                      transition: 'background 0.2s',
                    }} />
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
