import { useEffect, useState } from "react";
import API from "../api/api";

export default function Payments() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await API.get("/payments/with-user");
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const createPayment = async () => {
    if (!userId || !amount) {
      alert("Please fill all fields");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setProcessing(true);
    try {
      await API.post("/payments", {
        userId,
        amount: Number(amount),
        paymentMethod: "UPI",
        transactionId: "TXN_" + Date.now()
      });

      setAmount("");
      setUserId("");
      await fetchPayments();
    } catch (error) {
      console.error("Failed to create payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUsers();
  }, []);

  const totalAmount = data.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Payments</h1>
          <p style={styles.subtitle}>Manage transactions and payments</p>
        </div>
      </div>

      <div style={styles.formSection}>
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>New Payment</h3>
          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select User</label>
              <select 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
                disabled={processing}
                style={styles.select}
              >
                <option value="">Choose a user...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={processing}
                style={styles.input}
              />
            </div>

            <button 
              onClick={createPayment} 
              disabled={processing || !userId || !amount}
              style={styles.submitButton}
            >
              {processing ? 'Processing...' : 'Process Payment →'}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.paymentsSection}>
        <div style={styles.paymentsHeader}>
          <h3 style={styles.paymentsTitle}>Transaction History</h3>
          <span style={styles.paymentsCount}>{data.length} transactions</span>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading transactions...</p>
          </div>
        ) : data.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💰</div>
            <h3 style={styles.emptyTitle}>No transactions yet</h3>
            <p style={styles.emptyText}>Create your first payment to get started</p>
          </div>
        ) : (
          <div style={styles.paymentsList}>
            {data.map((p) => (
              <div key={p._id} style={styles.paymentItem}>
                <div style={styles.paymentLeft}>
                  <div style={styles.paymentAvatar}>
                    {p.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div style={styles.paymentInfo}>
                    <div style={styles.paymentUser}>{p.user?.name || 'Unknown User'}</div>
                    <div style={styles.paymentMethod}>
                      {p.paymentMethod} • {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={styles.paymentRight}>
                  <div style={styles.paymentAmount}>₹{p.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 20px",
  },
  
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  
  totalCard: {
    textAlign: "right",
  },
  
  totalLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  
  totalAmount: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
  },
  
  formSection: {
    marginBottom: "40px",
  },
  
  formCard: {
    backgroundColor: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
  },
  
  formTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#111827",
    margin: "0 0 20px 0",
  },
  
  form: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-end",
  },
  
  formGroup: {
    flex: 1,
  },
  
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
    outline: "none",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  },
  
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  },
  
  submitButton: {
    padding: "10px 24px",
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    height: "42px",
  },
  
  paymentsSection: {
    marginTop: "8px",
  },
  
  paymentsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  
  paymentsTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#111827",
    margin: 0,
  },
  
  paymentsCount: {
    fontSize: "13px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  
  paymentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  
  paymentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    transition: "all 0.15s ease",
  },
  
  paymentLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  
  paymentAvatar: {
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
  },
  
  paymentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  
  paymentUser: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#111827",
  },
  
  paymentMethod: {
    fontSize: "12px",
    color: "#6b7280",
  },
  
  paymentRight: {
    textAlign: "right",
  },
  
  paymentAmount: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px",
  },
  
  paymentId: {
    fontSize: "11px",
    color: "#9ca3af",
    fontFamily: "monospace",
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
  select:hover, input:hover {
    border-color: #9ca3af;
  }
  
  select:focus, input:focus {
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
  
  .paymentItem:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);