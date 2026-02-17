import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { ThemeProvider } from "../utils/ThemeContext";

function LoginInner({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await axios.post("/auth/login", { username, password });
      onLogin(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-notif">
          <div className="auth-notif-dot"></div>
          <span className="auth-notif-text">SYSTEM NOTIFICATION</span>
        </div>
        <div className="auth-panel">
          <h1 className="auth-title">HUNTER LOGIN</h1>
          <p className="auth-subtitle">ENTER CREDENTIALS TO ACCESS THE SYSTEM</p>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="field-label">HUNTER ID</label>
              <input type="text" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required autoComplete="off"/>
            </div>
            <div className="field">
              <label className="field-label">PASSKEY</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "VERIFYING..." : "ACCESS SYSTEM"}
            </button>
          </form>
          {error && <div className="auth-error">⚠ {error}</div>}
          <div className="auth-sep"></div>
          <p className="auth-link-row" onClick={()=>navigate("/register")}>＋ REGISTER NEW HUNTER</p>
        </div>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  return <ThemeProvider rank="C"><LoginInner onLogin={onLogin} /></ThemeProvider>;
}
export default Login;