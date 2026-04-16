import React, { useState } from 'react';

const ROOMS = ['General', 'Tech Talk', 'Random', 'Design', 'Gaming'];

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('General');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) { setError('Please enter a username'); return; }
    onJoin(username.trim(), room);
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, #7c6aff18 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #a78bfa12 0%, transparent 50%)',
    }}>
      {/* Grid lines decoration */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '60px 60px', opacity: 0.3,
      }} />

      <div style={{
        width: '100%', maxWidth: 440, padding: '0 24px',
        animation: 'fadeUp 0.5s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px', boxShadow: '0 0 40px #7c6aff40',
          }}>💬</div>
          <h1 style={{ fontFamily: 'Space Mono, monospace', fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>LiveChat</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 6 }}>Real-time messaging, no delays</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Username
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '12px 16px',
                transition: 'border-color 0.2s',
              }}
                onFocus={() => {}} // handled by input
              >
                <span style={{ fontSize: 16 }}>👤</span>
                <input
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter your name..."
                  maxLength={20}
                  style={{ flex: 1, background: 'none', color: 'var(--text)', fontSize: 15 }}
                  autoFocus
                />
              </div>
              {error && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 6 }}>{error}</p>}
            </div>

            {/* Room Selection */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Choose Room
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {ROOMS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoom(r)}
                    style={{
                      padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                      background: room === r ? 'var(--accent)' : 'var(--bg3)',
                      color: room === r ? '#fff' : 'var(--text2)',
                      border: `1px solid ${room === r ? 'var(--accent)' : 'var(--border)'}`,
                      transition: 'all 0.15s',
                      transform: room === r ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                color: '#fff', fontSize: 15, fontWeight: 600,
                boxShadow: '0 4px 20px #7c6aff40',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 30px #7c6aff60'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px #7c6aff40'; }}
            >
              Join {room} →
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 12, marginTop: 20 }}>
          No account needed · Just jump in
        </p>
      </div>
    </div>
  );
}