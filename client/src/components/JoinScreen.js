import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinScreen = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("General");

  const navigate = useNavigate();

  const handleJoin = () => {
    if (!username) {
      alert("Please enter your name");
      return;
    }

    navigate("/chat", { state: { username, room } });
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        position: "relative",
      }}
    >
      {/* 🔥 LOGIN / SIGNUP BUTTONS */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "8px 16px",
            background: "#6366f1",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          style={{
            padding: "8px 16px",
            background: "#8b5cf6",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Signup
        </button>
      </div>

      {/* MAIN CARD */}
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>LiveChat</h1>

        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "none",
          }}
        />

        <div style={{ marginBottom: "15px" }}>
          <button onClick={() => setRoom("General")}>General</button>
          <button onClick={() => setRoom("Tech Talk")}>Tech Talk</button>
          <button onClick={() => setRoom("Random")}>Random</button>
        </div>

        <button
          onClick={handleJoin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#6366f1",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Join {room} →
        </button>
      </div>
    </div>
  );
};

export default JoinScreen;