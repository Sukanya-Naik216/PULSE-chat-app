import { useState } from "react";
import axios from "axios";

export default function SignupScreen({ onLogin, onSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!username || !email || !password) { setError("All fields are required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { username, email, password });
      alert("Account created successfully! Please login.");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Is the server running?");
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
        <div style={{ fontSize: 40, marginBottom: 10 }}>✨</div>
        <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 4, letterSpacing: -0.5 }}>PULSE</h1>
        <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 32 }}>Create your account</p>

        {error && (
          <div style={{
            background: "#450a0a", border: "1px solid #ef444440", color: "#fca5a5",
            padding: "12px 16px", borderRadius: 10, fontSize: 13, marginBottom: 20, textAlign: "left",
          }}>⚠️ {error}</div>
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%", padding: "14px 16px", marginBottom: 12,
            borderRadius: 12, background: "var(--bg3)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: 14,
          }}
        />

        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%", padding: "14px 16px", marginBottom: 12,
            borderRadius: 12, background: "var(--bg3)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: 14,
          }}
        />

        <input
          placeholder="Password (min 6 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
          style={{
            width: "100%", padding: "14px 16px", marginBottom: 24,
            borderRadius: 12, background: "var(--bg3)",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: 14,
          }}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", background: "#8b5cf6",
            borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15,
            opacity: loading ? 0.7 : 1, transition: "opacity 0.15s",
            boxShadow: "0 4px 20px #8b5cf640",
          }}
        >
          {loading ? "Creating account..." : "Sign Up →"}
        </button>

        <p style={{ marginTop: 24, color: "var(--text3)", fontSize: 14 }}>
          Already have an account?{" "}
          <span
            onClick={onLogin}
            style={{ color: "var(--accent2)", cursor: "pointer", fontWeight: 600 }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}