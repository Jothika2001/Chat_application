import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../api/api";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token")
  }
});

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (!currentUser) return <h3>Please login first</h3>;

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data.filter(u => u._id !== currentUser._id));
  };

  const fetchMessages = async (otherUserId) => {
    const res = await API.get(
      `/messages/chat?user1=${currentUser._id}&user2=${otherUserId}`
    );
    setMessages(res.data);
  };

  useEffect(() => {
    socket.emit("join", currentUser._id);

socket.on("receiveMessage", (data) => {
  setMessages((prev) => {
    // avoid duplicate
    const exists = prev.some(
      (m) =>
        m.message === data.message &&
        m.fromUserId === data.fromUserId &&
        m.createdAt === data.createdAt
    );

    return exists ? prev : [...prev, data];
  });
});

    fetchUsers();

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (!msg.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      fromUserId: currentUser._id,
      toUserId: selectedUser._id,
      message: msg
    });

    setMsg("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      {/* Users Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>Messages</h3>
          <span style={styles.userCount}>{users.length}</span>
        </div>
        
        <div style={styles.userList}>
          {users.length === 0 ? (
            <p style={styles.emptyState}>No other users found</p>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  setSelectedUser(u);
                  fetchMessages(u._id);
                }}
                style={{
                  ...styles.userItem,
                  ...(selectedUser?._id === u._id && styles.userItemActive)
                }}
              >
                <div style={styles.userAvatar}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{u.name}</div>
                  <div style={styles.userStatus}>Online</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        {!selectedUser ? (
          <div style={styles.noChat}>
            <div style={styles.noChatIcon}>💬</div>
            <h3 style={styles.noChatTitle}>No conversation selected</h3>
            <p style={styles.noChatText}>Choose a user from the sidebar to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={styles.chatHeader}>
              <div style={styles.chatUserInfo}>
                <div style={styles.chatAvatar}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={styles.chatUserName}>{selectedUser.name}</div>
                  <div style={styles.chatUserStatus}>Online</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={styles.messagesContainer}>
              {messages.length === 0 ? (
                <div style={styles.noMessages}>
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.message,
                      ...(m.fromUserId === currentUser._id 
                        ? styles.messageSent 
                        : styles.messageReceived)
                    }}
                  >
                    <div style={styles.messageText}>{m.message}</div>
                    <div style={styles.messageTime}>
  {new Date(m.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                style={styles.input}
              />
              <button 
                onClick={sendMessage} 
                disabled={!msg.trim()}
                style={styles.sendButton}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 64px)",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  
  sidebar: {
    width: "320px",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafafa",
  },
  
  sidebarHeader: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  sidebarTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#111827",
    margin: 0,
  },
  
  userCount: {
    fontSize: "12px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  
  userList: {
    flex: 1,
    overflowY: "auto",
  },
  
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    borderBottom: "1px solid #f0f0f0",
  },
  
  userItemActive: {
    backgroundColor: "#f3f4f6",
  },
  
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "500",
    marginRight: "12px",
    flexShrink: 0,
  },
  
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  
  userName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111827",
    marginBottom: "2px",
  },
  
  userStatus: {
    fontSize: "12px",
    color: "#10b981",
  },
  
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
  
  noChat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },
  
  noChatIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.5,
  },
  
  noChatTitle: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
  },
  
  noChatText: {
    fontSize: "14px",
    color: "#9ca3af",
  },
  
  chatHeader: {
    padding: "16px 24px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
  
  chatUserInfo: {
    display: "flex",
    alignItems: "center",
  },
  
  chatAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "500",
    marginRight: "12px",
  },
  
  chatUserName: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#111827",
  },
  
  chatUserStatus: {
    fontSize: "12px",
    color: "#10b981",
    marginTop: "2px",
  },
  
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#ffffff",
  },
  
  noMessages: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "13px",
    marginTop: "40px",
  },
  
  message: {
    maxWidth: "60%",
    padding: "8px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: "1.4",
    wordWrap: "break-word",
  },
  
  messageSent: {
    backgroundColor: "#111827",
    color: "white",
    alignSelf: "flex-end",
    borderBottomRightRadius: "4px",
  },
  
  messageReceived: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
    alignSelf: "flex-start",
    borderBottomLeftRadius: "4px",
  },
  
  messageText: {
    marginBottom: "4px",
  },
  
  messageTime: {
    fontSize: "10px",
    opacity: 0.7,
    textAlign: "right",
  },
  
  inputContainer: {
    padding: "20px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "12px",
    backgroundColor: "#ffffff",
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
  
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
};

// Add global styles for hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .userItem:hover {
    background-color: #f9fafb;
  }
  
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
  
  .messagesContainer::-webkit-scrollbar {
    width: 6px;
  }
  
  .messagesContainer::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .messagesContainer::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .messagesContainer::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;
document.head.appendChild(styleSheet);