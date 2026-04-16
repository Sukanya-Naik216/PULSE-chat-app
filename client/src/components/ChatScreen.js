import React, { useState, useEffect, useRef } from 'react';

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Avatar({ name, size = 36 }) {
  const colors = ['#7c6aff','#06b6d4','#22c55e','#f59e0b','#ef4444','#a78bfa','#ec4899'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: '#fff', flexShrink: 0,
      fontFamily: 'Space Mono, monospace',
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}

export default function ChatScreen({ username, room, messages, onlineUsers, typingUsers, onSendMessage, onTyping, onLeave, socketId }) {
  const [input, setInput] = useState('');
  const [showUsers, setShowUsers] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
    onTyping(false);
    clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping(false), 1500);
  };

  const others = typingUsers.filter((u) => u !== username);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{
        width: showUsers ? 240 : 0, flexShrink: 0,
        background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'width 0.3s ease',
      }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 14 }}>LiveChat</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#7c6aff20', border: '1px solid #7c6aff40',
            borderRadius: 8, padding: '4px 10px', fontSize: 12, color: 'var(--accent2)',
          }}>
            <span style={{ fontSize: 10 }}>🏠</span> {room}
          </div>
        </div>

        {/* Online Users */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>
            Online · {onlineUsers.length}
          </p>
          {onlineUsers.map((u) => (
            <div key={u.socketId} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px', borderRadius: 10,
              background: u.socketId === socketId ? '#7c6aff15' : 'transparent',
              marginBottom: 2,
            }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={u.username} size={32} />
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 9, height: 9, borderRadius: '50%',
                  background: 'var(--green)', border: '2px solid var(--bg2)',
                }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: u.socketId === socketId ? 'var(--accent2)' : 'var(--text)' }}>
                {u.username} {u.socketId === socketId && <span style={{ color: 'var(--text3)', fontSize: 11 }}>(you)</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Leave button */}
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <button onClick={onLeave} style={{
            width: '100%', padding: '10px', borderRadius: 10,
            background: '#ef444415', border: '1px solid #ef444430',
            color: '#fca5a5', fontSize: 13, fontWeight: 600,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.target.style.background = '#ef444425'}
            onMouseLeave={e => e.target.style.background = '#ef444415'}
          >
            🚪 Leave Room
          </button>
        </div>
      </div>

      {/* Main Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setShowUsers(!showUsers)} style={{
              width: 34, height: 34, borderRadius: 8, background: 'var(--bg3)',
              border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 14,
            }}>☰</button>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}># {room}</div>
              <div style={{ fontSize: 12, color: 'var(--green)' }}>● {onlineUsers.length} online</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar name={username} size={32} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{username}</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text3)', marginTop: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
              <p style={{ fontSize: 15, fontWeight: 500 }}>You're in <strong style={{ color: 'var(--accent2)' }}>{room}</strong></p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Be the first to say something!</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.socketId === socketId;
            const prevMsg = messages[i - 1];
            const isSameUser = prevMsg && prevMsg.username === msg.username && prevMsg.socketId === msg.socketId;

            return (
              <div key={msg.id} style={{
                display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row',
                gap: 10, marginTop: isSameUser ? 2 : 12,
                animation: 'fadeUp 0.2s ease',
              }}>
                {!isSameUser ? <Avatar name={msg.username} size={36} /> : <div style={{ width: 36 }} />}
                <div style={{ maxWidth: '65%' }}>
                  {!isSameUser && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: isMe ? 'var(--accent2)' : 'var(--text)' }}>{msg.username}</span>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{formatTime(msg.timestamp)}</span>
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px', borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: isMe ? 'var(--bubble-me)' : 'var(--bubble-other)',
                    border: `1px solid ${isMe ? '#7c6aff30' : 'var(--border)'}`,
                    fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
                    color: 'var(--text)',
                  }}>
                    {msg.message}
                  </div>
                  {isSameUser && (
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {others.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 3, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 12 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)',
                    animation: 'pulse 1.2s ease infinite',
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                {others.join(', ')} {others.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '10px 16px',
          }}>
            <input
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${room}...`}
              style={{ flex: 1, color: 'var(--text)', fontSize: 14, background: 'none' }}
              maxLength={500}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: input.trim() ? 'var(--accent)' : 'var(--bg)',
                color: '#fff', fontSize: 16, flexShrink: 0,
                transition: 'all 0.15s',
                opacity: input.trim() ? 1 : 0.4,
              }}
            >
              ➤
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, textAlign: 'center' }}>
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}