'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LockScreenProps {
  onUnlock: () => void;
}

/* ── Generic user icon (person silhouette) ── */
function UserIcon({ size = 88 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(245,166,35,0.18), rgba(45,74,62,0.25))',
      border: '2px solid rgba(245,166,35,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="rgba(245,166,35,0.6)" />
        <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" fill="rgba(245,166,35,0.6)" />
      </svg>
    </div>
  );
}

/* ── Avatar with initial letter ── */
function AvatarLetter({ letter, size = 88 }: { letter: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(245,166,35,0.25), rgba(45,74,62,0.3))',
      border: '2px solid rgba(245,166,35,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontFamily: 'Outfit, sans-serif', fontWeight: 700,
      color: '#F5A623',
    }}>
      {letter}
    </div>
  );
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [step, setStep] = useState<'username' | 'password' | 'register'>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  /* auto-focus the password field when transitioning */
  useEffect(() => {
    if (step === 'password') {
      setTimeout(() => passwordRef.current?.focus(), 100);
    }
  }, [step]);

  const handleUsernameSubmit = () => {
    if (username.trim().length > 0) {
      setStep('password');
    } else {
      setShakeKey(k => k + 1);
    }
  };

  const handleLogin = () => {
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

  /* ── Shared input style ── */
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 16px',
    background: 'rgba(245,237,214,0.06)',
    border: '1px solid rgba(245,166,35,0.15)',
    borderRadius: 10, fontSize: '0.8rem',
    color: 'var(--cream)', outline: 'none',
    textAlign: 'center', letterSpacing: '0.04em',
    transition: 'border-color 0.2s',
    fontFamily: "'Inter', system-ui, sans-serif",
  };

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

          {/* Clock — always visible */}
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

          <AnimatePresence mode="wait">
            {/* ── USERNAME STEP ── */}
            {step === 'username' && (
              <motion.div
                key="username-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 16, width: 280,
                }}
              >
                {/* Generic user icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <UserIcon size={88} />
                </motion.div>

                {/* Username input */}
                <motion.div
                  key={`u-${shakeKey}`}
                  animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%' }}
                >
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleUsernameSubmit(); }}
                    autoFocus
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                  />
                </motion.div>

                {/* Arrow / next button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUsernameSubmit}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: username.trim()
                      ? 'linear-gradient(135deg, #F5A623, #E8921C)'
                      : 'rgba(245,166,35,0.12)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: username.trim() ? '0 4px 16px rgba(245,166,35,0.25)' : 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 3l5 5-5 5"
                      stroke={username.trim() ? '#1A1208' : 'rgba(245,237,214,0.3)'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>

                {/* Create Account link */}
                <button
                  onClick={() => setStep('register')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.68rem', color: 'rgba(245,237,214,0.35)',
                    transition: 'color 0.2s', marginTop: 4,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                >
                  Create Account
                </button>
              </motion.div>
            )}

            {/* ── PASSWORD STEP ── */}
            {step === 'password' && (
              <motion.div
                key="password-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 14, width: 280,
                }}
              >
                {/* Avatar with initial */}
                <AvatarLetter letter={username.trim().charAt(0).toUpperCase()} size={88} />

                {/* Display name */}
                <div style={{ textAlign: 'center', marginBottom: 2 }}>
                  <div style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 700,
                    color: '#F5EDD6',
                  }}>
                    {username.trim()}
                  </div>
                </div>

                {/* Password input */}
                <motion.div
                  key={`p-${shakeKey}`}
                  animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%' }}
                >
                  <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                    style={{ ...inputStyle, letterSpacing: '0.2em' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                  />
                </motion.div>

                {/* Sign In button */}
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

                {/* "Not you?" link to go back */}
                <button
                  onClick={() => { setStep('username'); setPassword(''); setShakeKey(0); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.68rem', color: 'rgba(245,237,214,0.35)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                >
                  Not {username.trim()}? Switch User
                </button>

                <p style={{ fontSize: '0.58rem', color: 'rgba(245,237,214,0.2)', marginTop: 2 }}>
                  Hint: any password works for this demo
                </p>
              </motion.div>
            )}

            {/* ── REGISTER STEP ── */}
            {step === 'register' && (
              <motion.div
                key="register-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 300 }}
              >
                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700,
                  color: '#F5EDD6', marginBottom: 4,
                }}>
                  Create Account
                </div>

                <input
                  placeholder="Full Name"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                />
                <input
                  placeholder="Username"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRegister(); }}
                  style={{ ...inputStyle, letterSpacing: '0.2em' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)'; }}
                />

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

                <button
                  onClick={() => setStep('username')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.68rem', color: 'rgba(245,237,214,0.35)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5A623'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,237,214,0.35)'; }}
                >
                  ← Back to Login
                </button>
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
