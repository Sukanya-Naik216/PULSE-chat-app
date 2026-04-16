import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import JoinScreen from './components/JoinScreen';
import ChatScreen from './components/ChatScreen';

const SOCKET_URL = 'http://localhost:5000';

export default function App() {
  const [screen, setScreen] = useState('join'); // 'join' | 'chat'
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    const socket = socketRef.current;

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('message_history', (history) => {
      setMessages(history);
    });

    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    socket.on('notification', (notif) => {
      setNotifications((prev) => [...prev, { ...notif, id: Date.now() }]);
      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 3500);
    });

    socket.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping ? [...new Set([...prev, username])] : prev.filter((u) => u !== username)
      );
    });

    return () => socket.disconnect();
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

    socketRef.current.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
    socketRef.current.on('message_history', (history) => setMessages(history));
    socketRef.current.on('online_users', (users) => setOnlineUsers(users));
    socketRef.current.on('notification', (notif) => {
      setNotifications((prev) => [...prev, { ...notif, id: Date.now() }]);
      setTimeout(() => setNotifications((prev) => prev.slice(1)), 3500);
    });
    socketRef.current.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping ? [...new Set([...prev, username])] : prev.filter((u) => u !== username)
      );
    });
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
            padding: '10px 16px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            animation: 'slideIn 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {n.type === 'join' ? '🟢' : '🔴'} {n.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {screen === 'join' ? (
        <JoinScreen onJoin={handleJoin} />
      ) : (
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