import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Admin({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.status === 403 ? "Access denied." : "Failed to load users.");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadUsers(); }, []);

  const resetExp = async (id) => {
    await axios.post("/admin/reset-exp", { userId: id });
    loadUsers();
  };

  return (
    <div className="sys-dashboard">
      <div className="scanline"></div>

      <header className="sys-header">
        <div className="sys-header-logo">
          <div className="sys-header-logo-icon">◈</div>
          <div>
            <div className="sys-header-logo-text">ADMIN CONSOLE</div>
            <div className="sys-header-logo-sub">HUNTER REGISTRY</div>
          </div>
        </div>
        <div className="sys-header-right">
          <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>← DASHBOARD</button>
          <button className="btn btn-logout" onClick={onLogout}>LOGOUT</button>
        </div>
      </header>

      <main style={{padding:"24px 32px"}}>
        <div className="sys-panel">
          <div className="sys-label">ALL HUNTERS</div>

          {error && <div className="auth-error">⚠ {error}</div>}

          {!error && users.length === 0 && (
            <p style={{fontSize:9,letterSpacing:4,color:"var(--white-dim)"}}>LOADING...</p>
          )}

          <div className="admin-rows">
            {users.map(u => (
              <div key={u._id} className="admin-row">
                <div>
                  <div className="admin-cell-label">HUNTER</div>
                  <div className="admin-cell-val">{u.username}</div>
                </div>
                <div>
                  <div className="admin-cell-label">RANK</div>
                  <div className="admin-cell-val rank">{u.rank}</div>
                </div>
                <div>
                  <div className="admin-cell-label">CP</div>
                  <div className="admin-cell-val">{u.cp}</div>
                </div>
                <div>
                  <div className="admin-cell-label">STR / AGI / STA</div>
                  <div className="admin-cell-val">{u.str} / {u.agi} / {u.sta}</div>
                </div>
                <div>
                  <button className="btn btn-danger" onClick={() => resetExp(u._id)}>
                    RESET EXP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
export default Admin;