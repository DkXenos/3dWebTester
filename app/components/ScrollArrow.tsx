'use client';

import { motion } from 'framer-motion';

export default function ScrollArrow() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        color: 'var(--text-muted)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'default',
      }}
    >
      <span>Scroll</span>
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <rect x="1" y="1" width="18" height="18" rx="9" stroke="currentColor" strokeWidth="1.5" />
        <motion.circle
          cx="10" cy="7" r="2.5" fill="currentColor"
          animate={{ cy: [7, 12, 7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path d="M6 23l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}
