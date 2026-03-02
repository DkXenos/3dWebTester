'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      paddingTop: 80,
    }}>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', padding: '32px 0 0' }}
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

      <Dashboard visible={mounted} />
    </div>
  );
}
