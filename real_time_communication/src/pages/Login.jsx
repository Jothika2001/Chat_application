import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/users/login", { name });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
     
      navigate("/chat");
       window.location.reload();

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  const setDemoUser = () => {
    setName("Demo");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Please enter your name to sign in</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <div style={styles.demoHint}>
          <span style={styles.demoHintIcon}>💡</span>
          <span>Demo user: <strong>Demo</strong> — no password required</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
    padding: "20px",
  },
  
  card: {
    width: "100%",
    maxWidth: "380px",
  },
  
  header: {
    marginBottom: "32px",
  },
  
  title: {
    fontSize: "28px",
    fontWeight: "500",
    color: "#111111",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  
  subtitle: {
    fontSize: "15px",
    color: "#666666",
    lineHeight: "1.4",
  },
  
  error: {
    backgroundColor: "#fff5f5",
    color: "#e53e3e",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
    border: "1px solid #fed7d7",
  },
  
  field: {
    marginBottom: "20px",
  },
  
  input: {
    width: "100%",
    padding: "12px 0",
    border: "none",
    borderBottom: "1px solid #e2e2e2",
    fontSize: "16px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    transition: "border-color 0.2s ease",
  },
  
  button: {
    width: "100%",
    backgroundColor: "#111111",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
  },
  
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0 20px",
  },
  
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e5e7eb",
  },
  
  dividerText: {
    fontSize: "12px",
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  
  demoButton: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#111111",
    padding: "12px 20px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "16px",
  },
  
  demoHint: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#6b7280",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  
  demoHintIcon: {
    fontSize: "14px",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:hover {
    border-bottom-color: #999999;
  }
  
  input:focus {
    border-bottom-color: #111111;
  }
  
  button:hover {
    background-color: #333333;
  }
  
  button:active {
    transform: scale(0.98);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .demoButton:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
`;
document.head.appendChild(styleSheet);