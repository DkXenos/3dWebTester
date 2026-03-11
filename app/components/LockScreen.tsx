'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LockScreenProps {
  onUnlock: () => void;
}

/* ── Hardcoded users for showcase ── */
const USERS = [
  { id: 1, name: 'Amina', username: 'aminacoder', avatar: '/asset/profiles/amina.png' },
  { id: 2, name: 'Rizki', username: 'rizkidev', avatar: '/asset/profiles/rizki.png' },
  { id: 3, name: 'Sarah', username: 'sarahstudy', avatar: '/asset/profiles/sarah.png' },
];

/* ── Placeholder avatar SVG ── */
function AvatarPlaceholder({ letter, size = 72 }: { letter: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(245,166,35,0.25), rgba(45,74,62,0.3))',
      border: '2px solid rgba(245,166,35,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontFamily: 'Outfit, sans-serif', fontWeight: 700,
      color: '#F5A623',
    }}>
      {letter}
    </div>
  );
}

/* ── Avatar that falls back to placeholder ── */
function UserAvatar({ src, name, size = 72 }: { src: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(true); // default to placeholder since images don't exist yet

  return failed ? (
    <AvatarPlaceholder letter={name.charAt(0).toUpperCase()} size={size} />
  ) : (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      style={{
        width: size, height: size, borderRadius: '50%', objectFit: 'cover',
        border: '2px solid rgba(245,166,35,0.3)',
      }}
    />
  );
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [view, setView] = useState<'lock' | 'login' | 'register'>('lock');
  const [selectedUser, setSelectedUser] = useState(0);
  const [password, setPassword] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [unlocking, setUnlocking] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState<string | null>(null);

  const handleLogin = () => {
    // Showcase: any non-empty password works
    if (password.length > 0) {
      setUnlocking(true);
      setTimeout(onUnlock, 800);
    } else {
      setShakeKey(k => k + 1);
    }
  };

  const handleRegister = () => {
    if (regName && regUsername && regPassword) {
      setUnlocking(true);
      setTimeout(onUnlock, 800);
    }
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AnimatePresence>
      {!unlocking ? (
        <motion.div
          key="lockscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 45,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
            overflow: 'hidden',
          }}
        >
          {/* Background */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: -1,
            background: `
              radial-gradient(ellipse 120% 80% at 30% 20%, rgba(45,74,62,0.6) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 70% 80%, rgba(245,166,35,0.12) 0%, transparent 50%),
              radial-gradient(ellipse 60% 60% at 50% 50%, rgba(61,43,20,0.2) 0%, transparent 60%),
              linear-gradient(160deg, #060503 0%, #0C0906 35%, #0A0804 70%, #060503 100%)
            `,
          }} />
          {/* Noise overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: -1,
            opacity: 0.03, mixBlendMode: 'overlay',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} />

          <AnimatePresence mode="wait">
            {/* ── LOCK VIEW ── */}
            {view === 'lock' && (
              <motion.div
                key="lock-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
              >
                {/* Clock */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '5rem', fontWeight: 200,
                    color: '#F5EDD6', letterSpacing: '-0.02em', lineHeight: 1,
                  }}
                >
                  {currentTime}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  style={{
                    fontSize: '1.1rem', fontWeight: 400, color: 'rgba(245,237,214,0.5)',
                    letterSpacing: '0.04em', marginBottom: 40,
                  }}
                >
                  {currentDate}
                </motion.div>

                {/* User avatars */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{ display: 'flex', gap: 24, marginBottom: 20 }}
                >
                  {USERS.map((user, i) => (
                    <motion.button
                      key={user.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedUser(i); setView('login'); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        background: 'none', border: 'none', cursor: 'pointer', padding: 8,
                      }}
                    >
                      <UserAvatar src={user.avatar} name={user.name} size={72} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--cream)' }}>
                        {user.name}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Other user / Register */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{ display: 'flex', gap: 16, marginTop: 8 }}
                >
                  <button
                    onClick={() => setView('login')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.72rem', color: 'rgba(245,237,214,0.35)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                  >
                    Other User
                  </button>
                  <span style={{ color: 'rgba(245,237,214,0.15)' }}>|</span>
                  <button
                    onClick={() => setView('register')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.72rem', color: 'rgba(245,237,214,0.35)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                  >
                    Create Account
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ── LOGIN VIEW ── */}
            {view === 'login' && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 300 }}
              >
                {/* Avatar */}
                <UserAvatar
                  src={USERS[selectedUser].avatar}
                  name={USERS[selectedUser].name}
                  size={88}
                />
                <div style={{ textAlign: 'center', marginBottom: 4 }}>
                  <div style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 700,
                    color: '#F5EDD6',
                  }}>
                    {USERS[selectedUser].name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(245,237,214,0.4)' }}>
                    @{USERS[selectedUser].username}
                  </div>
                </div>

                {/* Password field */}
                <motion.div key={shakeKey} animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%' }}
                >
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                    autoFocus
                    style={{
                      width: '100%', padding: '11px 16px',
                      background: 'rgba(245,237,214,0.06)',
                      border: '1px solid rgba(245,166,35,0.15)',
                      borderRadius: 10, fontSize: '0.8rem',
                      color: 'var(--cream)', outline: 'none',
                      textAlign: 'center', letterSpacing: '0.2em',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                  />
                </motion.div>

                {/* Login button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  style={{
                    width: '100%', padding: '10px 0', borderRadius: 10,
                    background: 'linear-gradient(135deg, #F5A623, #E8921C)',
                    border: 'none', color: '#1A1208',
                    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(245,166,35,0.2)',
                  }}
                >
                  Sign In
                </motion.button>

                {/* Back + actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <button
                    onClick={() => { setView('lock'); setPassword(''); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.68rem', color: 'rgba(245,237,214,0.35)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setView('register')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.68rem', color: 'rgba(245,237,214,0.35)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                  >
                    Create Account →
                  </button>
                </div>

                <p style={{ fontSize: '0.58rem', color: 'rgba(245,237,214,0.2)', marginTop: 4 }}>
                  Hint: any password works for this demo
                </p>
              </motion.div>
            )}

            {/* ── REGISTER VIEW ── */}
            {view === 'register' && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 320 }}
              >
                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700,
                  color: '#F5EDD6', marginBottom: 4,
                }}>
                  Create Account
                </div>

                {/* Avatar upload */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: regAvatar ? 'none' : 'rgba(245,166,35,0.08)',
                    border: '2px dashed rgba(245,166,35,0.25)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {regAvatar ? (
                    <img src={regAvatar} alt="avatar" style={{
                      width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%',
                    }} />
                  ) : (
                    <>
                      <span style={{ fontSize: '1.2rem' }}>📷</span>
                      <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>Upload</span>
                    </>
                  )}
                </motion.button>

                {/* Form fields */}
                <input
                  placeholder="Full Name"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'rgba(245,237,214,0.06)',
                    border: '1px solid rgba(245,166,35,0.15)',
                    borderRadius: 10, fontSize: '0.78rem',
                    color: 'var(--cream)', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                />
                <input
                  placeholder="Username"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'rgba(245,237,214,0.06)',
                    border: '1px solid rgba(245,166,35,0.15)',
                    borderRadius: 10, fontSize: '0.78rem',
                    color: 'var(--cream)', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'rgba(245,237,214,0.06)',
                    border: '1px solid rgba(245,166,35,0.15)',
                    borderRadius: 10, fontSize: '0.78rem',
                    color: 'var(--cream)', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                />

                {/* Register button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegister}
                  style={{
                    width: '100%', padding: '10px 0', borderRadius: 10,
                    background: regName && regUsername && regPassword
                      ? 'linear-gradient(135deg, #F5A623, #E8921C)'
                      : 'rgba(245,166,35,0.15)',
                    border: 'none',
                    color: regName && regUsername && regPassword ? '#1A1208' : 'rgba(245,237,214,0.3)',
                    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: regName && regUsername && regPassword ? '0 4px 20px rgba(245,166,35,0.2)' : 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  Create Account
                </motion.button>

                {/* Back */}
                <button
                  onClick={() => setView('lock')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.68rem', color: 'rgba(245,237,214,0.35)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                >
                  ← Back to Login
                </button>

                <p style={{ fontSize: '0.58rem', color: 'rgba(245,237,214,0.2)' }}>
                  Profile pictures: place images in /public/asset/profiles/
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              position: 'absolute', bottom: 28,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}
          >
            <span style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.8rem',
              color: 'rgba(245,166,35,0.35)',
            }}>
              ✦ StudyNest
            </span>
            <span style={{ fontSize: '0.58rem', color: 'rgba(245,237,214,0.15)' }}>
              Your digital sanctuary
            </span>
          </motion.div>
        </motion.div>
      ) : (
        /* Unlock animation — fade up + scale */
        <motion.div
          key="unlock-anim"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 45,
            background: '#060503',
          }}
        />
      )}
    </AnimatePresence>
  );
}
