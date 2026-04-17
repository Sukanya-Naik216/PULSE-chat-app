import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import JoinScreen from './components/JoinScreen';
import ChatScreen from './components/ChatScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';

const SOCKET_URL = 'http://localhost:5000';

export default function App() {
  // Check if user is already logged in, skip to join screen if so
  const initialScreen = localStorage.getItem('chat_token') ? 'join' : 'login';

  const [screen, setScreen] = useState(initialScreen); // 'login' | 'signup' | 'join' | 'chat'
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);

  const setupSocketListeners = (socket) => {
    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('message_history', (history) => setMessages(history));
    socket.on('online_users', (users) => setOnlineUsers(users));
    socket.on('notification', (notif) => {
      setNotifications((prev) => [...prev, { ...notif, id: Date.now() }]);
      setTimeout(() => setNotifications((prev) => prev.slice(1)), 3500);
    });
    socket.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping ? [...new Set([...prev, username])] : prev.filter((u) => u !== username)
      );
    });
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    setupSocketListeners(socketRef.current);
    return () => socketRef.current.disconnect();
  }, []);

  const handleJoin = (name, roomName) => {
    setUsername(name);
    setRoom(roomName);
    socketRef.current.emit('join', { username: name, room: roomName });
    setScreen('chat');
  };

  const handleSendMessage = (message) => {
    socketRef.current.emit('send_message', { message, room });
  };

  const handleTyping = (isTyping) => {
    socketRef.current.emit('typing', { room, isTyping });
  };

  const handleLeave = () => {
    socketRef.current.disconnect();
    socketRef.current = io(SOCKET_URL);
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers([]);
    setScreen('join');
    setupSocketListeners(socketRef.current);
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_token');
    localStorage.removeItem('chat_logged_in');
    localStorage.removeItem('chat_username');
    setScreen('login');
  };

  return (
    <>
      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            background: n.type === 'join' ? '#14532d' : '#450a0a',
            border: `1px solid ${n.type === 'join' ? '#22c55e40' : '#ef444440'}`,
            color: n.type === 'join' ? '#86efac' : '#fca5a5',
            padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            animation: 'slideIn 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {n.type === 'join' ? '🟢' : '🔴'} {n.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; margin: 0; padding: 0; border: none; outline: none; }
        body { font-family: 'Inter', sans-serif; }
        :root {
          --bg: #0f172a; --bg2: #1e293b; --bg3: #334155;
          --border: #334155; --text: #f1f5f9; --text2: #94a3b8; --text3: #64748b;
          --accent: #7c6aff; --accent2: #a78bfa; --green: #22c55e;
          --bubble-me: #3730a360; --bubble-other: #1e293b;
        }
        button { cursor: pointer; background: none; color: inherit; }
        input { background: none; color: inherit; }
      `}</style>

      {screen === 'login' && (
        <LoginScreen
          onSignup={() => setScreen('signup')}
          onSuccess={() => setScreen('join')}
        />
      )}
      {screen === 'signup' && (
        <SignupScreen
          onLogin={() => setScreen('login')}
          onSuccess={() => setScreen('login')}
        />
      )}
      {screen === 'join' && (
        <JoinScreen
          onJoin={handleJoin}
          onLogout={handleLogout}
        />
      )}
      {screen === 'chat' && (
        <ChatScreen
          username={username}
          room={room}
          messages={messages}
          onlineUsers={onlineUsers}
          typingUsers={typingUsers}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onLeave={handleLeave}
          socketId={socketRef.current?.id}
        />
      )}
    </>
  );
}