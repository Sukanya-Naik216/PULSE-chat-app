import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });

      alert("Signup successful");
    } catch (err) {
  console.log(err);
  console.log(err.response?.data);
  alert(err.response?.data?.error || "Signup failed");
}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Signup</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSignup} style={styles.button}>
          Signup
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#8b5cf6",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};