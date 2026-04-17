import { useState } from "react";
import axios from "axios";

export default function LoginScreen({ onSignup, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("All fields are required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("chat_token", res.data.token);
      localStorage.setItem("chat_logged_in", res.data.user.username);
      localStorage.setItem("chat_username", res.data.user.username);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh", background: "var(--bg)",
      display: "flex", justifyContent: "center", alignItems: "center",
      color: "var(--text)",
    }}>
      <div style={{
        background: "var(--bg2)", padding: "48px 40px", borderRadius: 20,
        width: 380, textAlign: "center", border: "1px solid var(--border)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Logo */}
        <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
        <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 4, letterSpacing: -0.5 }}>PULSE</h1>
        <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 32 }}>Sign in to your account</p>

        {error && (
          <div style={{
            background: "#450a0a", border: "1px solid #ef444440", color: "#fca5a5",
            padding: "12px 16px", borderRadius: 10, fontSize: 13, marginBottom: 20, textAlign: "left",
          }}>⚠️ {error}</div>
        )}

        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: "14px 16px", marginBottom: 12,
            borderRadius: 12, background: "var(--bg3)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: 14,
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: "14px 16px", marginBottom: 24,
            borderRadius: 12, background: "var(--bg3)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: 14,
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", background: "#6366f1",
            borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15,
            opacity: loading ? 0.7 : 1, transition: "opacity 0.15s",
            boxShadow: "0 4px 20px #6366f140",
          }}
        >
          {loading ? "Signing in..." : "Login →"}
        </button>

        <p style={{ marginTop: 24, color: "var(--text3)", fontSize: 14 }}>
          Don't have an account?{" "}
          <span
            onClick={onSignup}
            style={{ color: "var(--accent2)", cursor: "pointer", fontWeight: 600 }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}