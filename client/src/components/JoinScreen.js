import React, { useState } from "react";

const ROOMS = ["General", "Tech Talk", "Random"];

const JoinScreen = ({ onJoin, onLogout }) => {
  const [username, setUsername] = useState(
    localStorage.getItem("chat_username") || ""
  );
  const [room, setRoom] = useState("General");

  const loggedInUser = localStorage.getItem("chat_logged_in");

  const handleJoin = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }
    onJoin(username.trim(), room);
  };

  return (
    <div style={{
      height: "100vh", background: "var(--bg)",
      display: "flex", justifyContent: "center", alignItems: "center",
      color: "var(--text)", position: "relative",
    }}>
      {/* Top-right: logged in user + logout */}
      <div style={{
        position: "absolute", top: 20, right: 20,
        display: "flex", gap: 12, alignItems: "center",
      }}>
        {loggedInUser && (
          <>
            <span style={{ fontSize: 13, color: "var(--text2)" }}>
              👤 {loggedInUser}
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: "8px 16px", background: "#ef444420",
                border: "1px solid #ef444440", borderRadius: 8,
                color: "#fca5a5", fontSize: 13, fontWeight: 600,
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Main card */}
      <div style={{
        background: "var(--bg2)", padding: "40px 36px", borderRadius: 20,
        width: 360, textAlign: "center", border: "1px solid var(--border)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
        <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 4 }}>PULSE</h1>
        <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 28 }}>
          Real-time group chat
        </p>

        <input
          type="text"
          placeholder="Enter your display name..."
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            localStorage.setItem("chat_username", e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          style={{
            width: "100%", padding: "13px 16px", marginBottom: 16,
            borderRadius: 12, background: "var(--bg3)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: 14,
          }}
        />

        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10, textAlign: "left" }}>
          Choose a room:
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" }}>
          {ROOMS.map((r) => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              style={{
                padding: "9px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: room === r ? "var(--accent)" : "var(--bg3)",
                border: `1px solid ${room === r ? "var(--accent)" : "var(--border)"}`,
                color: room === r ? "white" : "var(--text2)",
                transition: "all 0.15s",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          onClick={handleJoin}
          style={{
            width: "100%", padding: "14px", background: "var(--accent)",
            borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15,
            boxShadow: "0 4px 20px #7c6aff40", transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.target.style.opacity = 0.85}
          onMouseLeave={e => e.target.style.opacity = 1}
        >
          Join {room} →
        </button>
      </div>
    </div>
  );
};

export default JoinScreen;