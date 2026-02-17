import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1); // 1 = secret code, 2 = register form
  const [secretCode, setSecretCode] = useState("");
  const [codeError,  setCodeError]  = useState("");
  const [form, setForm] = useState({ username:"", password:"", confirmPassword:"", fullName:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Step 1: Verify secret code ──────────────────────────────
  function handleCodeSubmit(e) {
    e.preventDefault();
    setCodeError("");
    if (!secretCode.trim()) { setCodeError("Enter the admin access code"); return; }
    setLoading(true);
    // Small delay for dramatic effect
    setTimeout(() => {
      setLoading(false);
      // Code is verified server-side on register — just move to step 2
      setStep(2);
    }, 800);
  }

  // ── Step 2: Register admin account ──────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters"); return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/admin-register", {
        username:   form.username,
        password:   form.password,
        fullName:   form.fullName,
        adminCode:  secretCode,
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>

      {/* Background grid effect */}
      <div style={styles.grid} />

      {/* Corner decorations */}
      <div style={{ ...styles.corner, top:20, left:20, borderTop:"1px solid #ff444488", borderLeft:"1px solid #ff444488" }} />
      <div style={{ ...styles.corner, top:20, right:20, borderTop:"1px solid #ff444488", borderRight:"1px solid #ff444488" }} />
      <div style={{ ...styles.corner, bottom:20, left:20, borderBottom:"1px solid #ff444488", borderLeft:"1px solid #ff444488" }} />
      <div style={{ ...styles.corner, bottom:20, right:20, borderBottom:"1px solid #ff444488", borderRight:"1px solid #ff444488" }} />

      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>⚠ RESTRICTED ACCESS</div>
          <div style={styles.skull}>☠</div>
          <h1 style={styles.title}>ADMIN PORTAL</h1>
          <p style={styles.subtitle}>SHADOW MONARCH SYSTEM — AUTHORIZED PERSONNEL ONLY</p>
        </div>

        {/* Success screen */}
        {success && (
          <div style={styles.successBox}>
            <div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>✓</div>
            <div style={{ fontSize:"13px", letterSpacing:"3px", color:"#44ff88" }}>ADMIN ACCOUNT CREATED</div>
            <div style={{ fontSize:"9px", color:"#555", marginTop:"8px", letterSpacing:"1px" }}>Redirecting to login...</div>
          </div>
        )}

        {/* Step 1 — Secret Code */}
        {!success && step === 1 && (
          <form onSubmit={handleCodeSubmit} style={styles.form}>
            <div style={styles.stepLabel}>
              <span style={styles.stepDot}>1</span>
              ENTER ADMIN ACCESS CODE
            </div>
            <p style={styles.hint}>
              This code is required to create an admin account. Contact the system owner if you don't have it.
            </p>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>SECRET CODE</label>
              <input
                type="password"
                style={styles.input}
                placeholder="••••••••••••"
                value={secretCode}
                onChange={e => setSecretCode(e.target.value)}
                autoComplete="off"
              />
            </div>
            {codeError && <div style={styles.errorBox}>⚠ {codeError}</div>}
            <button style={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? "VERIFYING..." : "VERIFY CODE →"}
            </button>
            <div style={styles.backLink} onClick={() => navigate("/")}>
              ← BACK TO LOGIN
            </div>
          </form>
        )}

        {/* Step 2 — Register Form */}
        {!success && step === 2 && (
          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.stepLabel}>
              <span style={styles.stepDot}>2</span>
              CREATE ADMIN ACCOUNT
            </div>
            <div style={styles.codeVerified}>✓ Access code verified</div>

            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>USERNAME *</label>
                <input
                  style={styles.input}
                  placeholder="admin_username"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  required
                  autoComplete="off"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>FULL NAME</label>
                <input
                  style={styles.input}
                  placeholder="Your Name"
                  value={form.fullName}
                  onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>PASSWORD *</label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>CONFIRM PASSWORD *</label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>

            {error && <div style={styles.errorBox}>⚠ {error}</div>}

            <button style={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? "CREATING ACCOUNT..." : "☠ CREATE ADMIN ACCOUNT"}
            </button>

            <div style={styles.backLink} onClick={() => setStep(1)}>
              ← CHANGE ACCESS CODE
            </div>
          </form>
        )}

        {/* Warning footer */}
        <div style={styles.footer}>
          <div style={styles.footerLine} />
          <p style={styles.footerText}>
            UNAUTHORIZED ACCESS IS PROHIBITED. ALL ACTIVITY IS LOGGED.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes flicker {
          0%,100% { opacity:1; }
          92% { opacity:1; }
          93% { opacity:0.7; }
          94% { opacity:1; }
          96% { opacity:0.8; }
          97% { opacity:1; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        input::placeholder { color: #333; }
        input:focus { outline: none; border-color: #ff4444 !important; box-shadow: 0 0 12px #ff444433 !important; }
        button:hover:not(:disabled) { opacity: 0.85 !important; transform: translateY(-1px); }
        button:disabled { opacity: 0.45 !important; cursor: not-allowed !important; }
        button { transition: all 0.15s ease !important; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Orbitron', monospace",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    animation: "flicker 8s infinite",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,68,68,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,68,68,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  corner: {
    position: "fixed",
    width: "30px",
    height: "30px",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(8,8,8,0.95)",
    border: "1px solid rgba(255,68,68,0.25)",
    borderRadius: "4px",
    boxShadow: "0 0 60px rgba(255,68,68,0.08), inset 0 0 60px rgba(0,0,0,0.5)",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    padding: "32px 32px 20px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,68,68,0.1)",
  },
  badge: {
    display: "inline-block",
    fontSize: "8px",
    letterSpacing: "3px",
    color: "#ff4444",
    background: "rgba(255,68,68,0.08)",
    border: "1px solid rgba(255,68,68,0.2)",
    padding: "4px 12px",
    borderRadius: "2px",
    marginBottom: "16px",
  },
  skull: {
    fontSize: "28px",
    color: "#ff4444",
    display: "block",
    marginBottom: "8px",
    filter: "drop-shadow(0 0 8px #ff444466)",
  },
  title: {
    fontSize: "22px",
    letterSpacing: "6px",
    color: "#ff4444",
    margin: "0 0 6px 0",
    textShadow: "0 0 20px #ff444455",
  },
  subtitle: {
    fontSize: "7px",
    letterSpacing: "2px",
    color: "#333",
    margin: 0,
  },
  form: {
    padding: "24px 32px",
  },
  stepLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "9px",
    letterSpacing: "3px",
    color: "#ff6666",
    marginBottom: "12px",
  },
  stepDot: {
    width: "20px",
    height: "20px",
    background: "rgba(255,68,68,0.15)",
    border: "1px solid #ff444466",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "8px",
    color: "#ff4444",
    flexShrink: 0,
  },
  hint: {
    fontSize: "9px",
    color: "#444",
    letterSpacing: "0.5px",
    lineHeight: "1.6",
    marginBottom: "18px",
  },
  field: {
    marginBottom: "14px",
  },
  fieldLabel: {
    display: "block",
    fontSize: "7px",
    letterSpacing: "2px",
    color: "#555",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,68,68,0.15)",
    borderRadius: "3px",
    padding: "10px 12px",
    color: "#ddd",
    fontFamily: "'Orbitron', monospace",
    fontSize: "11px",
    letterSpacing: "1px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 14px",
  },
  errorBox: {
    background: "rgba(255,68,68,0.08)",
    border: "1px solid rgba(255,68,68,0.25)",
    borderRadius: "3px",
    padding: "8px 12px",
    fontSize: "9px",
    color: "#ff6666",
    letterSpacing: "1px",
    marginBottom: "14px",
  },
  codeVerified: {
    fontSize: "8px",
    color: "#44ff88",
    letterSpacing: "2px",
    marginBottom: "16px",
    padding: "6px 10px",
    background: "rgba(68,255,136,0.06)",
    border: "1px solid rgba(68,255,136,0.15)",
    borderRadius: "3px",
    display: "inline-block",
  },
  btnPrimary: {
    width: "100%",
    background: "rgba(255,68,68,0.1)",
    border: "1px solid rgba(255,68,68,0.4)",
    color: "#ff4444",
    fontFamily: "'Orbitron', monospace",
    fontSize: "10px",
    letterSpacing: "3px",
    padding: "12px",
    borderRadius: "3px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "4px",
  },
  backLink: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "8px",
    color: "#333",
    letterSpacing: "2px",
    cursor: "pointer",
  },
  successBox: {
    padding: "40px 32px",
    textAlign: "center",
  },
  footer: {
    padding: "16px 32px 20px",
  },
  footerLine: {
    height: "1px",
    background: "rgba(255,68,68,0.08)",
    marginBottom: "12px",
  },
  footerText: {
    fontSize: "7px",
    letterSpacing: "1px",
    color: "#222",
    textAlign: "center",
    margin: 0,
  },
};