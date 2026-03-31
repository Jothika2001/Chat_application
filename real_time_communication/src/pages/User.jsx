import { useEffect, useState } from "react";
import API from "../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!name.trim()) return;

    setAdding(true);
    try {
      await API.post("/users", { name: name.trim(), role: "user" });
      setName("");
      await fetchUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createUser();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Users</h1>
          <p style={styles.subtitle}>Manage your team members</p>
        </div>
        <div style={styles.userCount}>
          {users.length} {users.length === 1 ? 'user' : 'users'}
        </div>
      </div>

      <div style={styles.addSection}>
        <div style={styles.addForm}>
          <input
            type="text"
            placeholder="Enter user name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={adding}
            style={styles.input}
          />
          <button 
            onClick={createUser} 
            disabled={adding || !name.trim()}
            style={styles.addButton}
          >
            {adding ? 'Adding...' : 'Add user'}
          </button>
        </div>
      </div>

      <div style={styles.userList}>
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h3 style={styles.emptyTitle}>No users yet</h3>
            <p style={styles.emptyText}>Add your first user to get started</p>
          </div>
        ) : (
          users.map((u) => (
            <div key={u._id} style={styles.userCard}>
              <div style={styles.userAvatar}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{u.name}</div>
                <div style={styles.userRole}>
                  {u.role === 'admin' ? 'Administrator' : 'Team member'}
                </div>
              </div>
              <div style={styles.userBadge}>
                {u.role === 'admin' && <span style={styles.adminBadge}>Admin</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 20px",
  },
  
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
  },
  
  title: {
    fontSize: "24px",
    fontWeight: "500",
    color: "#111827",
    margin: "0 0 4px 0",
    letterSpacing: "-0.01em",
  },
  
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  
  userCount: {
    fontSize: "13px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  
  addSection: {
    marginBottom: "32px",
  },
  
  addForm: {
    display: "flex",
    gap: "12px",
  },
  
  input: {
    flex: 1,
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  },
  
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  },
  
  userList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  
  userCard: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    transition: "all 0.15s ease",
  },
  
  userAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "500",
    marginRight: "16px",
    flexShrink: 0,
  },
  
  userInfo: {
    flex: 1,
  },
  
  userName: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#111827",
    marginBottom: "4px",
  },
  
  userRole: {
    fontSize: "12px",
    color: "#6b7280",
  },
  
  userBadge: {
    flexShrink: 0,
  },
  
  adminBadge: {
    fontSize: "11px",
    padding: "2px 8px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    borderRadius: "12px",
    fontWeight: "500",
  },
  
  loadingState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
  },
  
  spinner: {
    width: "32px",
    height: "32px",
    border: "2px solid #f3f4f6",
    borderTop: "2px solid #111827",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 16px",
  },
  
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#fafafa",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.5,
  },
  
  emptyTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#374151",
    margin: "0 0 8px 0",
  },
  
  emptyText: {
    fontSize: "13px",
    color: "#9ca3af",
    margin: 0,
  },
};

// Add global styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:hover {
    border-color: #9ca3af;
  }
  
  input:focus {
    border-color: #111827;
    box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
  }
  
  button:hover:not(:disabled) {
    background-color: #374151;
  }
  
  button:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .userCard:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);