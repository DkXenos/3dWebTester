'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AppItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  href: string;
}

const APPS: AppItem[] = [
  { id: 'gmail',   label: 'Gmail',   icon: '✉️',  color: '#EA4335', bg: 'rgba(234,67,53,0.15)',  href: 'https://mail.google.com' },
  { id: 'youtube', label: 'YouTube', icon: '▶️',  color: '#FF0000', bg: 'rgba(255,0,0,0.12)',     href: 'https://youtube.com' },
  { id: 'gemini',  label: 'Gemini',  icon: '✦',   color: '#8A94F0', bg: 'rgba(138,148,240,0.15)', href: 'https://gemini.google.com' },
  { id: 'maps',    label: 'Maps',    icon: '🗺️',  color: '#34A853', bg: 'rgba(52,168,83,0.15)',   href: 'https://maps.google.com' },
  { id: 'scholar', label: 'Scholar', icon: '🎓',  color: '#4285F4', bg: 'rgba(66,133,244,0.15)', href: 'https://scholar.google.com' },
  { id: 'notion',  label: 'Notion',  icon: '📝',  color: '#F5EDD6', bg: 'rgba(245,237,214,0.1)',  href: 'https://notion.so' },
  { id: 'custom',  label: 'Custom',  icon: '⭐',  color: '#F5A623', bg: 'rgba(245,166,35,0.15)',  href: '#' },
];

function DockItem({ app, index }: { app: AppItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      title={app.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.08 * index, type: 'spring', stiffness: 350, damping: 25 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        textDecoration: 'none',
        position: 'relative',
      }}
    >
      <motion.div
        animate={{
          scale: hovered ? 1.35 : 1,
          y: hovered ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        style={{
          width: 50, height: 50,
          borderRadius: 14,
          background: app.bg,
          border: `1px solid ${app.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: hovered
            ? `0 8px 24px ${app.color}40, 0 2px 8px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          borderColor: hovered ? app.color + '66' : app.color + '33',
        }}
      >
        <span style={{ lineHeight: 1 }}>{app.icon}</span>
      </motion.div>

      {/* Tooltip */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          top: -28,
          background: 'var(--glass-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 6,
          padding: '2px 8px',
          fontSize: '0.65rem',
          fontWeight: 600,
          color: 'var(--cream)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
        }}
      >
        {app.label}
      </motion.span>

      {/* Active dot indicator */}
      <div style={{
        width: 4, height: 4,
        borderRadius: '50%',
        background: hovered ? app.color : 'rgba(245,237,214,0.2)',
        transition: 'background 0.2s',
        marginTop: -2,
      }} />
    </motion.a>
  );
}

export default function Launchpad() {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0 4px',
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: 10,
        padding: '12px 20px',
        background: 'rgba(26, 18, 8, 0.72)',
        backdropFilter: 'blur(32px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
        border: '1px solid rgba(245,166,35,0.15)',
        borderRadius: 22,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset',
      }}>
        {APPS.map((app, i) => (
          <DockItem key={app.id} app={app} index={i} />
        ))}

        {/* Separator */}
        <div style={{
          width: 1, height: 48,
          background: 'linear-gradient(to bottom, transparent, rgba(245,166,35,0.25), transparent)',
          margin: '0 4px',
          alignSelf: 'center',
        }} />

        {/* Add Custom */}
        <motion.button
          whileHover={{ scale: 1.12, y: -6 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          style={{
            width: 50, height: 50,
            borderRadius: 14,
            background: 'rgba(245,237,214,0.05)',
            border: '1px dashed rgba(245,166,35,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: 'var(--amber)',
            transition: 'border-color 0.2s',
          }}
          title="Add custom link"
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
}
