'use client';

import { motion } from 'framer-motion';
import Dashboard from './Dashboard';

interface DashboardSectionProps {
  visible: boolean;
}

export default function DashboardSection({ visible }: DashboardSectionProps) {
  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      background: 'var(--background)',
      minHeight: '100vh',
      borderTop: '1px solid rgba(245,166,35,0.1)',
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', padding: '28px 0 0' }}
      >
        <span style={{
          display: 'inline-block',
          padding: '4px 16px',
          background: 'rgba(45,74,62,0.25)',
          border: '1px solid rgba(45,74,62,0.5)',
          borderRadius: 99,
          fontSize: '0.7rem',
          color: 'var(--forest-light)',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          ✦ Study Dashboard
        </span>
      </motion.div>

      <Dashboard visible={visible} />
    </div>
  );
}
