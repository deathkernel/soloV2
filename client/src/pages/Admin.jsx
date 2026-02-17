import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";

// ─── Constants ────────────────────────────────────────────────────────────────
const RANKS = ["F","E","D","C","B","A","S","SS","SSS","Shadow Monarch"];

const ALL_MOVES = [
  // PUNCHES
  { id:"p1",  number:"1",           name:"JAB",               category:"PUNCHES",   color:"#ff4444" },
  { id:"p2",  number:"2",           name:"CROSS",             category:"PUNCHES",   color:"#ff4444" },
  { id:"p3",  number:"3",           name:"LEFT HOOK",         category:"PUNCHES",   color:"#ff4444" },
  { id:"p4",  number:"4",           name:"RIGHT HOOK",        category:"PUNCHES",   color:"#ff4444" },
  { id:"p5",  number:"5",           name:"LEFT UPPERCUT",     category:"PUNCHES",   color:"#ff4444" },
  { id:"p6",  number:"6",           name:"RIGHT UPPERCUT",    category:"PUNCHES",   color:"#ff4444" },
  { id:"p7",  number:"7",           name:"LEAD BODY HOOK",    category:"PUNCHES",   color:"#ff4444" },
  { id:"p8",  number:"8",           name:"REAR BODY HOOK",    category:"PUNCHES",   color:"#ff4444" },
  { id:"p9",  number:"OVERHAND",    name:"OVERHAND RIGHT",    category:"PUNCHES",   color:"#ff4444" },
  { id:"p10", number:"SUPERMAN",    name:"SUPERMAN PUNCH",    category:"PUNCHES",   color:"#ff4444" },
  // DEFENSE
  { id:"d1",  number:"SLIP",        name:"SLIP",              category:"DEFENSE",   color:"#00ffcc" },
  { id:"d2",  number:"BOB",         name:"BOB & WEAVE",       category:"DEFENSE",   color:"#00ffcc" },
  { id:"d3",  number:"PARRY",       name:"PARRY",             category:"DEFENSE",   color:"#00ffcc" },
  { id:"d4",  number:"BLOCK",       name:"HIGH GUARD BLOCK",  category:"DEFENSE",   color:"#00ffcc" },
  { id:"d5",  number:"ROLL",        name:"SHOULDER ROLL",     category:"DEFENSE",   color:"#00ffcc" },
  { id:"d6",  number:"CLINCH",      name:"CLINCH",            category:"DEFENSE",   color:"#00ffcc" },
  { id:"d7",  number:"PULL BACK",   name:"PULL BACK",         category:"DEFENSE",   color:"#00ffcc" },
  { id:"d8",  number:"DUCK",        name:"DUCK",              category:"DEFENSE",   color:"#00ffcc" },
  // FOOTWORK
  { id:"f1",  number:"STEP IN",     name:"STEP IN",           category:"FOOTWORK",  color:"#ffaa00" },
  { id:"f2",  number:"STEP BACK",   name:"STEP BACK",         category:"FOOTWORK",  color:"#ffaa00" },
  { id:"f3",  number:"PIVOT",       name:"PIVOT",             category:"FOOTWORK",  color:"#ffaa00" },
  { id:"f4",  number:"LATERAL",     name:"LATERAL MOVEMENT",  category:"FOOTWORK",  color:"#ffaa00" },
  { id:"f5",  number:"CIRCLE OUT",  name:"CIRCLE OUT",        category:"FOOTWORK",  color:"#ffaa00" },
  { id:"f6",  number:"SWITCH",      name:"STANCE SWITCH",     category:"FOOTWORK",  color:"#ffaa00" },
  // ADVANCED
  { id:"a1",  number:"FEINT",       name:"FEINT",             category:"ADVANCED",  color:"#cc44ff" },
  { id:"a2",  number:"COUNTER",     name:"COUNTER PUNCHING",  category:"ADVANCED",  color:"#cc44ff" },
  { id:"a3",  number:"LEVEL CHANGE",name:"LEVEL CHANGE",      category:"ADVANCED",  color:"#cc44ff" },
  { id:"a4",  number:"PRESSURE",    name:"PRESSURE FIGHTING", category:"ADVANCED",  color:"#cc44ff" },
  { id:"a5",  number:"INFIGHTING",  name:"INSIDE/INFIGHTING", category:"ADVANCED",  color:"#cc44ff" },
  { id:"a6",  number:"BAIT",        name:"BAIT & DRAW",       category:"ADVANCED",  color:"#cc44ff" },
  { id:"a7",  number:"SOUTHPAW",    name:"SOUTHPAW STANCE",   category:"ADVANCED",  color:"#cc44ff" },
  { id:"a8",  number:"RING CUTTING",name:"RING CUTTING",      category:"ADVANCED",  color:"#cc44ff" },
  // COMBOS
  { id:"c1",  number:"1-2",         name:"JAB-CROSS",                     category:"COMBOS", color:"#ff6600" },
  { id:"c2",  number:"1-2-3",       name:"JAB-CROSS-HOOK",                category:"COMBOS", color:"#ff6600" },
  { id:"c3",  number:"1-2-slip-2",  name:"JAB-CROSS-SLIP-CROSS",          category:"COMBOS", color:"#ff6600" },
  { id:"c4",  number:"3-2-3",       name:"HOOK-CROSS-HOOK (Body-Head)",   category:"COMBOS", color:"#ff6600" },
  { id:"c5",  number:"1-2-3-2",     name:"JAB-CROSS-HOOK-CROSS",          category:"COMBOS", color:"#ff6600" },
  { id:"c6",  number:"1-1-2",       name:"DOUBLE JAB-CROSS",              category:"COMBOS", color:"#ff6600" },
  { id:"c7",  number:"1-6-3-2",     name:"JAB-UPPERCUT-HOOK-CROSS",       category:"COMBOS", color:"#ff6600" },
  { id:"c8",  number:"2-3-2",       name:"CROSS-HOOK-CROSS",              category:"COMBOS", color:"#ff6600" },
  { id:"c9",  number:"5-2-3",       name:"UPPERCUT-CROSS-HOOK",           category:"COMBOS", color:"#ff6600" },
  { id:"c10", number:"1-2-5-2",     name:"JAB-CROSS-UPPERCUT-CROSS",      category:"COMBOS", color:"#ff6600" },
];

// ─── API helper ───────────────────────────────────────────────────────────────
function useApi() {
  const token = () => localStorage.getItem("token");
  const headers = () => ({ "Content-Type": "application/json", "Authorization": `Bearer ${token()}` });

  const get    = (url) => fetch(url, { headers: headers() }).then(r => r.json());
  const post   = (url, body) => fetch(url, { method:"POST",   headers: headers(), body: JSON.stringify(body) }).then(r => r.json());
  const del    = (url, body) => fetch(url, { method:"DELETE", headers: headers(), body: JSON.stringify(body) }).then(r => r.json());

  const upload = (url, file) => {
    const fd = new FormData();
    fd.append("image", file);
    return fetch(url, { method:"POST", headers: { "Authorization": `Bearer ${token()}` }, body: fd }).then(r => r.json());
  };

  return { get, post, del, upload };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatRow({ label, field, value, onChange }) {
  return (
    <div className="a-stat-row">
      <label className="a-stat-label">{label}</label>
      <input
        type="number"
        className="a-stat-input"
        value={value ?? ""}
        onChange={e => onChange(field, e.target.value)}
        min={0}
      />
    </div>
  );
}

// ─── USER CARD ────────────────────────────────────────────────────────────────
function UserCard({ user, onRefresh }) {
  const { post, del } = useApi();
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab]           = useState("stats"); // stats | penalty | password | danger
  const [editStats, setEditStats] = useState({
    str: user.str, agi: user.agi, sta: user.sta, sen: user.sen,
    exp: user.exp, rank: user.rank,
  });
  const [xpAmount,  setXpAmount]  = useState("");
  const [newPass,   setNewPass]   = useState("");
  const [msg,       setMsg]       = useState({ text:"", ok:true });
  const [saving,    setSaving]    = useState(false);

  const isLocked = user.penaltyLockUntil && new Date() < new Date(user.penaltyLockUntil);
  const cp = Math.round((user.str||0)*2.5+(user.agi||0)*2.2+(user.sta||0)*1.8+(user.sen||0)*1.5);

  const flash = (text, ok=true) => {
    setMsg({ text, ok });
    setTimeout(() => { setMsg({ text:"", ok:true }); onRefresh(); }, 1600);
  };

  const statChange = (field, val) =>
    setEditStats(prev => ({ ...prev, [field]: val === "" ? "" : Number(val) }));

  async function saveStats() {
    setSaving(true);
    const d = await post("/api/admin/adjust-stats", { userId: user._id, ...editStats });
    setSaving(false);
    flash(d.message || "Stats saved successfully");
  }

  async function addXp() {
    if (!xpAmount) return;
    const d = await post("/api/admin/add-xp", { userId: user._id, amount: Number(xpAmount) });
    flash(d.message || "XP updated successfully");
    setXpAmount("");
  }

  async function resetUser() {
    if (!confirm(`Reset ALL stats for ${user.username}? This cannot be undone.`)) return;
    await post("/api/admin/reset-exp", { userId: user._id });
    flash("User has been reset");
  }

  async function removePenalty() {
    await post("/api/admin/remove-penalty", { userId: user._id });
    flash("Penalty lock cleared");
  }

  async function deleteUser() {
    if (!confirm(`Permanently delete ${user.username}? This cannot be undone.`)) return;
    await del("/api/admin/delete-user", { userId: user._id });
    onRefresh();
  }

  async function resetPassword() {
    if (!newPass || newPass.length < 4) { flash("Min 4 characters", false); return; }
    const d = await post("/api/admin/reset-password", { userId: user._id, newPassword: newPass });
    setNewPass("");
    flash(d.message || "Password updated successfully");
  }

  async function toggleRole() {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Set ${user.username} as ${newRole}?`)) return;
    await post("/api/admin/set-role", { userId: user._id, role: newRole });
    flash(`Role updated → ${newRole}`);
  }

  const rankColor = {
    "F":"#888","E":"#55bbff","D":"#44ff88","C":"#ffcc00",
    "B":"#ff8800","A":"#ff4444","S":"#ff44cc","SS":"#cc44ff",
    "SSS":"#ffffff","Shadow Monarch":"#4af"
  }[user.rank] || "#4af";

  return (
    <div className={`a-user-card ${isLocked?"locked":""} ${user.role==="admin"?"is-admin":""}`}>
      {/* Header */}
      <div className="a-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="a-card-left">
          <span className="a-username">{user.username}</span>
          {user.role === "admin" && <span className="a-admin-badge">ADMIN</span>}
          {isLocked && <span className="a-lock-badge">🔒</span>}
          <span className="a-rank-badge" style={{ color: rankColor, borderColor: rankColor + "55", background: rankColor + "11" }}>
            {user.rank}
          </span>
        </div>
        <div className="a-card-right">
          <span className="a-meta">XP {user.exp?.toLocaleString()}</span>
          <span className="a-meta">CP {cp.toLocaleString()}</span>
          <span className="a-chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="a-card-body">
          {/* Tab nav */}
          <div className="a-tab-nav">
            {["stats","penalty","password","danger"].map(t => (
              <button key={t} className={`a-tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>
                {t === "stats" && "📊 STATS"}
                {t === "penalty" && "⚠️ PENALTY"}
                {t === "password" && "🔑 PASSWORD"}
                {t === "danger" && "☠️ DANGER"}
              </button>
            ))}
          </div>

          {/* Msg */}
          {msg.text && (
            <div className={`a-flash ${msg.ok?"ok":"err"}`}>{msg.text}</div>
          )}

          {/* STATS TAB */}
          {tab === "stats" && (
            <div className="a-tab-content">
              <div className="a-section-title">EDIT STATS</div>
              <div className="a-stats-grid">
                <StatRow label="STR" field="str" value={editStats.str} onChange={statChange} />
                <StatRow label="AGI" field="agi" value={editStats.agi} onChange={statChange} />
                <StatRow label="STA" field="sta" value={editStats.sta} onChange={statChange} />
                <StatRow label="SEN" field="sen" value={editStats.sen} onChange={statChange} />
                <StatRow label="EXP" field="exp" value={editStats.exp} onChange={statChange} />
              </div>
              <div className="a-rank-row">
                <label className="a-stat-label">RANK</label>
                <select className="a-rank-select" value={editStats.rank}
                  onChange={e => statChange("rank", e.target.value)}>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button className="a-btn primary" onClick={saveStats} disabled={saving}>
                {saving ? "SAVING..." : "SAVE STATS"}
              </button>

              <div className="a-divider" />

              <div className="a-section-title">QUICK XP ADJUST</div>
              <div className="a-xp-row">
                <input
                  type="number"
                  className="a-stat-input"
                  placeholder="Amount (+/-)"
                  value={xpAmount}
                  onChange={e => setXpAmount(e.target.value)}
                  style={{ width:"130px" }}
                />
                <button className="a-btn outline" onClick={addXp}>ADD XP</button>
              </div>
              <p className="a-hint">Positive = add, negative = subtract (e.g. -500)</p>

              <div className="a-divider" />
              <div className="a-section-title">ROLE</div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <span className="a-hint" style={{ marginBottom:0 }}>Current role: <b style={{ color:"#fff" }}>{user.role}</b></span>
                <button className="a-btn outline" onClick={toggleRole}>
                  {user.role === "admin" ? "DEMOTE TO USER" : "PROMOTE TO ADMIN"}
                </button>
              </div>
            </div>
          )}

          {/* PENALTY TAB */}
          {tab === "penalty" && (
            <div className="a-tab-content">
              <div className="a-section-title">PENALTY STATUS</div>
              <div className="a-penalty-grid">
                <div className="a-penalty-item">
                  <div className="a-penalty-val">{user.missedDaysTotal || 0}</div>
                  <div className="a-penalty-lbl">TOTAL MISSED</div>
                </div>
                <div className="a-penalty-item">
                  <div className="a-penalty-val">{user.missedDays30 || 0}</div>
                  <div className="a-penalty-lbl">MISSED (30d)</div>
                </div>
                <div className="a-penalty-item">
                  <div className="a-penalty-val">{user.missedDays7 || 0}</div>
                  <div className="a-penalty-lbl">MISSED (7d)</div>
                </div>
                <div className="a-penalty-item">
                  <div className="a-penalty-val">{user.streak || 0}</div>
                  <div className="a-penalty-lbl">STREAK</div>
                </div>
              </div>
              {isLocked && (
                <div className="a-lock-info">
                  🔒 Locked until: <b>{new Date(user.penaltyLockUntil).toLocaleDateString()}</b>
                </div>
              )}
              {isLocked ? (
                <button className="a-btn danger-outline" onClick={removePenalty}>
                  CLEAR PENALTY LOCK
                </button>
              ) : (
                <p className="a-hint" style={{ color:"#44ff88" }}>✓ No active penalty lock</p>
              )}
            </div>
          )}

          {/* PASSWORD TAB */}
          {tab === "password" && (
            <div className="a-tab-content">
              <div className="a-section-title">RESET PASSWORD</div>
              <p className="a-hint">Set a new password for this user. No old password required.</p>
              <div className="a-xp-row">
                <input
                  type="password"
                  className="a-stat-input"
                  placeholder="New password..."
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  style={{ width:"200px" }}
                />
                <button className="a-btn primary" onClick={resetPassword}>SET PASSWORD</button>
              </div>
            </div>
          )}

          {/* DANGER TAB */}
          {tab === "danger" && (
            <div className="a-tab-content">
              <div className="a-section-title" style={{ color:"#ff4444" }}>⚠️ DANGER ZONE</div>
              <p className="a-hint">These actions cannot be undone. Proceed with caution.</p>
              <div className="a-danger-row">
                <button className="a-btn warn" onClick={resetUser}>
                  🔄 RESET ALL STATS
                </button>
                <button className="a-btn danger" onClick={deleteUser}>
                  🗑️ DELETE USER
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CREATE USER FORM ─────────────────────────────────────────────────────────
function CreateUserPanel({ onRefresh }) {
  const { post } = useApi();
  const [form, setForm] = useState({ username:"", password:"", fullName:"", email:"", role:"user" });
  const [msg,  setMsg]  = useState({ text:"", ok:true });
  const [busy, setBusy] = useState(false);

  const set = (k,v) => setForm(p => ({ ...p, [k]:v }));

  async function submit() {
    if (!form.username || !form.password) {
      setMsg({ text:"Username & password required", ok:false }); return;
    }
    setBusy(true);
    const d = await post("/api/admin/create-user", form);
    setBusy(false);
    if (d.message === "User created") {
      setMsg({ text:`✓ ${form.username} created successfully as ${d.role}`, ok:true });
      setForm({ username:"", password:"", fullName:"", email:"", role:"user" });
      setTimeout(() => { setMsg({ text:"", ok:true }); onRefresh(); }, 1800);
    } else {
      setMsg({ text: d.message || "Failed to create user", ok:false });
    }
  }

  return (
    <div className="a-create-panel">
      <div className="a-create-title">CREATE NEW HUNTER</div>
      <div className="a-create-grid">
        <div className="a-field">
          <label className="a-field-label">USERNAME *</label>
          <input className="a-text-input" value={form.username} onChange={e => set("username",e.target.value)} placeholder="hunter_name" />
        </div>
        <div className="a-field">
          <label className="a-field-label">PASSWORD *</label>
          <input className="a-text-input" type="password" value={form.password} onChange={e => set("password",e.target.value)} placeholder="••••••••" />
        </div>
        <div className="a-field">
          <label className="a-field-label">FULL NAME</label>
          <input className="a-text-input" value={form.fullName} onChange={e => set("fullName",e.target.value)} placeholder="Sung Jinwoo" />
        </div>
        <div className="a-field">
          <label className="a-field-label">EMAIL</label>
          <input className="a-text-input" value={form.email} onChange={e => set("email",e.target.value)} placeholder="hunter@solo.com" />
        </div>
        <div className="a-field">
          <label className="a-field-label">ROLE</label>
          <select className="a-rank-select" value={form.role} onChange={e => set("role",e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      {msg.text && <div className={`a-flash ${msg.ok?"ok":"err"}`}>{msg.text}</div>}
      <button className="a-btn primary" onClick={submit} disabled={busy}>
        {busy ? "CREATING..." : "+ CREATE HUNTER"}
      </button>
    </div>
  );
}

// ─── COMBAT MOVE IMAGE MANAGER ────────────────────────────────────────────────
function MoveImageRow({ move, uploadedImages, onUpload, onDelete, uploading }) {
  const fileRef = useRef();
  const imageUrl = uploadedImages[move.id];

  return (
    <div className="a-move-row">
      <div className="a-move-info">
        <span className="a-move-num" style={{ background: move.color }}>{move.number}</span>
        <div>
          <div className="a-move-name">{move.name}</div>
          <div className="a-move-cat" style={{ color: move.color }}>{move.category}</div>
        </div>
      </div>
      <div className="a-move-right">
        {imageUrl ? (
          <div className="a-move-preview">
            <img src={imageUrl} alt={move.name} className="a-move-thumb" />
            <div className="a-move-actions">
              <button className="a-btn-sm primary" onClick={() => fileRef.current.click()}
                disabled={uploading === move.id}>
                {uploading === move.id ? "..." : "CHANGE"}
              </button>
              <button className="a-btn-sm danger" onClick={() => onDelete(move.id)}>
                REMOVE
              </button>
            </div>
          </div>
        ) : (
          <button
            className="a-upload-btn"
            onClick={() => fileRef.current.click()}
            disabled={uploading === move.id}
          >
            {uploading === move.id ? "UPLOADING..." : "📷 UPLOAD"}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display:"none" }}
          onChange={e => {
            const f = e.target.files[0];
            if (f) onUpload(move.id, f);
          }}
        />
      </div>
    </div>
  );
}

function CombatImagesPanel() {
  const { get, upload, del } = useApi();
  const [uploadedImages, setUploadedImages] = useState({});
  const [uploading, setUploading] = useState(null);
  const [filterCat, setFilterCat] = useState("ALL");
  const [filterSearch, setFilterSearch] = useState("");
  const [msg, setMsg] = useState("");

  const categories = ["ALL","PUNCHES","DEFENSE","FOOTWORK","ADVANCED","COMBOS"];

  const loadImages = async () => {
    const d = await get("/api/admin/combat-images");
    if (d.images) {
      const map = {};
      d.images.forEach(img => { map[img.moveId] = img.url + "?t=" + Date.now(); });
      setUploadedImages(map);
    }
  };

  useEffect(() => { loadImages(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(moveId, file) {
    setUploading(moveId);
    const d = await upload(`/api/admin/combat-images/${moveId}`, file);
    setUploading(null);
    if (d.url) {
      setUploadedImages(prev => ({ ...prev, [moveId]: d.url + "?t=" + Date.now() }));
      setMsg("✓ Image uploaded");
    } else {
      setMsg("✗ Upload failed");
    }
    setTimeout(() => setMsg(""), 2000);
  }

  async function handleDelete(moveId) {
    if (!confirm("Remove this image? This cannot be undone.")) return;
    await del(`/api/admin/combat-images/${moveId}`, {});
    setUploadedImages(prev => { const n = { ...prev }; delete n[moveId]; return n; });
    setMsg("✓ Image removed");
    setTimeout(() => setMsg(""), 2000);
  }

  const visibleMoves = ALL_MOVES.filter(m => {
    if (filterCat !== "ALL" && m.category !== filterCat) return false;
    if (filterSearch && !m.name.toLowerCase().includes(filterSearch.toLowerCase()) &&
        !m.number.toLowerCase().includes(filterSearch.toLowerCase())) return false;
    return true;
  });

  const uploadedCount = Object.keys(uploadedImages).length;

  return (
    <div>
      <div className="a-combat-header">
        <div>
          <div className="a-combat-title">COMBAT MOVE IMAGES</div>
          <div className="a-combat-sub">{uploadedCount} / {ALL_MOVES.length} images uploaded</div>
        </div>
        {msg && <div className="a-flash ok" style={{ marginBottom:0 }}>{msg}</div>}
      </div>

      {/* Progress bar */}
      <div className="a-progress-bar">
        <div className="a-progress-fill" style={{ width: `${(uploadedCount/ALL_MOVES.length)*100}%` }} />
      </div>

      {/* Filters */}
      <div className="a-combat-filters">
        <input
          className="a-search-input"
          placeholder="Search move..."
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
          style={{ maxWidth:"200px" }}
        />
        <div className="a-cat-tabs">
          {categories.map(c => (
            <button
              key={c}
              className={`a-cat-tab ${filterCat===c?"active":""}`}
              onClick={() => setFilterCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Move list */}
      <div className="a-move-list">
        {visibleMoves.map(move => (
          <MoveImageRow
            key={move.id}
            move={move}
            uploadedImages={uploadedImages}
            onUpload={handleUpload}
            onDelete={handleDelete}
            uploading={uploading}
          />
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────
function SettingsPanel() {
  const { get, post } = useApi();
  const RANKS = ["F","E","D","C","B","A","S","SS","SSS","Shadow Monarch"];

  const [xpRewards,      setXpRewards]      = useState({ STR:20, AGI:20, STA:20, SEN:20, BOXING:25, REST:10 });
  const [cpWeights,      setCpWeights]      = useState({ str:2.5, agi:2.2, sta:1.8, sen:1.5 });
  const [rankThresholds, setRankThresholds] = useState([]);
  const [statCaps,       setStatCaps]       = useState({});
  const [msg,            setMsg]            = useState({ text:"", ok:true });
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [activeTab,      setActiveTab]      = useState("xp");

  useEffect(() => { loadSettings(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSettings = async () => {
    setLoading(true);
    const d = await get("/api/admin/settings");
    if (d.xpRewards)      setXpRewards(d.xpRewards);
    if (d.cpWeights)      setCpWeights(d.cpWeights);
    if (d.rankThresholds) setRankThresholds(d.rankThresholds);
    if (d.statCaps)       setStatCaps(d.statCaps);
    setLoading(false);
  };

  const flash = (text, ok=true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg({ text:"", ok:true }), 2500);
  };

  async function saveAll() {
    setSaving(true);
    const d = await post("/api/admin/settings", { xpRewards, cpWeights, rankThresholds, statCaps });
    setSaving(false);
    flash(d.message || "Saved");
  }

  if (loading) return <div className="a-empty" style={{ padding:"40px" }}>Loading settings...</div>;

  return (
    <div className="a-settings-wrap">
      <div className="a-settings-header">
        <div className="a-combat-title">⚙️ GAME SETTINGS</div>
        <button className="a-btn primary" onClick={saveAll} disabled={saving}>
          {saving ? "SAVING..." : "💾 SAVE ALL"}
        </button>
      </div>
      {msg.text && <div className={`a-flash ${msg.ok?"ok":"err"}`} style={{ marginBottom:"14px" }}>{msg.text}</div>}

      {/* Sub-tabs */}
      <div className="a-tab-nav" style={{ marginBottom:"18px" }}>
        {[
          { id:"xp",    label:"⚡ XP REWARDS" },
          { id:"cp",    label:"💪 CP FORMULA" },
          { id:"ranks", label:"🏆 RANK XP" },
          { id:"caps",  label:"📊 STAT CAPS" },
        ].map(t => (
          <button key={t.id} className={`a-tab-btn ${activeTab===t.id?"active":""}`}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* XP REWARDS */}
      {activeTab === "xp" && (
        <div>
          <div className="a-section-title">XP EARNED PER TASK TYPE</div>
          <p className="a-hint">How much XP a user gets when completing each task in their daily workout.</p>
          <div className="a-settings-grid">
            {Object.entries(xpRewards).map(([key, val]) => (
              <div key={key} className="a-settings-row">
                <label className="a-settings-label">{key}</label>
                <input
                  type="number" min={0} max={999}
                  className="a-stat-input"
                  value={val}
                  onChange={e => setXpRewards(p => ({ ...p, [key]: Number(e.target.value) }))}
                />
                <span className="a-settings-unit">XP</span>
              </div>
            ))}
          </div>
          <div className="a-settings-info">
            Daily max XP = {Object.values(xpRewards).reduce((a,b) => a+b, 0) - xpRewards.REST} (excluding rest day)
          </div>
        </div>
      )}

      {/* CP FORMULA */}
      {activeTab === "cp" && (
        <div>
          <div className="a-section-title">COMBAT POWER FORMULA WEIGHTS</div>
          <p className="a-hint">CP = (STR × {cpWeights.str}) + (AGI × {cpWeights.agi}) + (STA × {cpWeights.sta}) + (SEN × {cpWeights.sen})</p>
          <div className="a-settings-grid">
            {Object.entries(cpWeights).map(([key, val]) => (
              <div key={key} className="a-settings-row">
                <label className="a-settings-label">{key.toUpperCase()} ×</label>
                <input
                  type="number" min={0} max={10} step={0.1}
                  className="a-stat-input"
                  value={val}
                  onChange={e => setCpWeights(p => ({ ...p, [key]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>
          <div className="a-settings-info">
            Example: A user with STR 100, AGI 80, STA 90, SEN 70 would have CP = {
              Math.round(100*cpWeights.str + 80*cpWeights.agi + 90*cpWeights.sta + 70*cpWeights.sen)
            }
          </div>
        </div>
      )}

      {/* RANK THRESHOLDS */}
      {activeTab === "ranks" && (
        <div>
          <div className="a-section-title">XP REQUIRED PER RANK</div>
          <p className="a-hint">Minimum XP needed to achieve each rank.</p>
          <div className="a-settings-grid">
            {rankThresholds.map((r, i) => (
              <div key={r.rank} className="a-settings-row">
                <label className="a-settings-label" style={{ minWidth:"110px" }}>{r.rank}</label>
                <input
                  type="number" min={0}
                  className="a-stat-input"
                  style={{ width:"100px" }}
                  value={r.xp}
                  disabled={i === 0}
                  onChange={e => setRankThresholds(prev =>
                    prev.map((t, idx) => idx === i ? { ...t, xp: Number(e.target.value) } : t)
                  )}
                />
                <span className="a-settings-unit">XP</span>
              </div>
            ))}
          </div>
          <div className="a-settings-info">Rank F is always 0 XP (starting rank).</div>
        </div>
      )}

      {/* STAT CAPS */}
      {activeTab === "caps" && (
        <div>
          <div className="a-section-title">MAX STAT VALUES PER RANK</div>
          <p className="a-hint">Maximum STR/AGI/STA a user can reach at each rank.</p>
          {["F","E","D","C","B","A","S"].map(rank => (
            <div key={rank} className="a-caps-rank-row">
              <div className="a-caps-rank-label"
                style={{ color: {F:"#888",E:"#55bbff",D:"#44ff88",C:"#ffcc00",B:"#ff8800",A:"#ff4444",S:"#ff44cc"}[rank] }}>
                RANK {rank}
              </div>
              <div className="a-caps-fields">
                {["str","agi","sta"].map(stat => (
                  <div key={stat} className="a-settings-row">
                    <label className="a-settings-label">{stat.toUpperCase()}</label>
                    <input
                      type="number" min={0}
                      className="a-stat-input"
                      value={statCaps[rank]?.[stat] ?? ""}
                      onChange={e => setStatCaps(prev => ({
                        ...prev,
                        [rank]: { ...(prev[rank]||{}), [stat]: Number(e.target.value) }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .a-settings-wrap { }
        .a-settings-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 16px;
        }
        .a-settings-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
        .a-settings-row  { display: flex; align-items: center; gap: 10px; }
        .a-settings-label {
          font-size: 9px; color: #888; letter-spacing: 2px;
          min-width: 70px; font-family: 'Orbitron', monospace;
        }
        .a-settings-unit { font-size: 9px; color: #444; letter-spacing: 1px; }
        .a-settings-info {
          font-size: 9px; color: #4af; letter-spacing: 1px;
          background: rgba(68,170,255,0.06);
          border: 1px solid rgba(68,170,255,0.12);
          padding: 8px 12px; border-radius: 5px; margin-top: 4px;
        }
        .a-caps-rank-row {
          display: flex; align-items: flex-start;
          gap: 14px; margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .a-caps-rank-label {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          min-width: 60px; padding-top: 4px;
          font-family: 'Orbitron', monospace;
        }
        .a-caps-fields { display: flex; gap: 10px; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}


// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function AdminPage({ onLogout }) {
  const { get } = useApi();
  const [users,    setUsers]    = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [mainTab,  setMainTab]  = useState("users"); // users | create | combat | overview
  const [apiError, setApiError] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    setApiError("");

    // Quick local check first
    const role = localStorage.getItem("role");
    if (role && role !== "admin") {
      setApiError("Your account is not an admin. Login with an admin account.");
      setLoading(false);
      return;
    }

    try {
      const [usersData, overviewData] = await Promise.all([
        get("/api/admin/users"),
        get("/api/admin/stats-overview"),
      ]);

      // API returned an error object (e.g. not admin, no token)
      if (usersData?.message) {
        setApiError("API Error: " + usersData.message + " → Login with an admin account.");
        setLoading(false);
        return;
      }

      if (Array.isArray(usersData)) setUsers(usersData);
      else setApiError("Users data invalid — check server logs");

      if (overviewData?.total !== undefined) setOverview(overviewData);
    } catch {
      setApiError("Network error — is the server running on port 5000?");
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <NavBar onLogout={onLogout} />

      {/* Title */}
      <div className="admin-header">
        <div className="admin-title-block">
          <div className="admin-eyebrow">SHADOW MONARCH SYSTEM</div>
          <h1 className="admin-title">ADMIN PANEL</h1>
        </div>
        {overview && (
          <div className="admin-quick-stats">
            <div className="aq-stat"><b>{overview.total}</b><span>HUNTERS</span></div>
            <div className="aq-stat warn"><b>{overview.locked}</b><span>LOCKED</span></div>
            <div className="aq-stat dim"><b>{overview.admins}</b><span>ADMINS</span></div>
          </div>
        )}
      </div>

      {/* Main nav tabs */}
      <div className="admin-nav">
        {[
          { id:"users",    label:"👥 USERS" },
          { id:"create",   label:"➕ CREATE USER" },
          { id:"combat",   label:"🥊 COMBAT IMAGES" },
          { id:"overview", label:"📈 OVERVIEW" },
          { id:"settings", label:"⚙️ SETTINGS" },
        ].map(t => (
          <button
            key={t.id}
            className={`admin-nav-btn ${mainTab===t.id?"active":""}`}
            onClick={() => setMainTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="loading-pulse">LOADING SYSTEM DATA</div>
        </div>
      ) : apiError ? (
        <div className="a-api-error">
          <div className="a-api-error-icon">⚠️</div>
          <div className="a-api-error-title">CONNECTION ERROR</div>
          <div className="a-api-error-msg">{apiError}</div>
          <div className="a-api-error-steps">
            <div>1. Is the server running? → <code>cd server &amp;&amp; node server.js</code></div>
            <div>2. Is your account set as admin? → Set <code>role: "admin"</code> in MongoDB</div>
            <div>3. Log out and log back in — the token needs to refresh with the new role.</div>
          </div>
          <button className="a-btn primary" onClick={fetchAll} style={{ marginTop:"16px" }}>
            🔄 RETRY
          </button>
        </div>
      ) : (
        <>
          {/* ── USERS TAB ─────────────────────────────────── */}
          {mainTab === "users" && (
            <div>
              <input
                className="a-search-input"
                placeholder="SEARCH HUNTER..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="a-results-count">
                {filtered.length} hunter{filtered.length !== 1 ? "s" : ""} found
              </div>
              <div className="a-user-list">
                {filtered.map(u => (
                  <UserCard key={u._id} user={u} onRefresh={fetchAll} />
                ))}
                {filtered.length === 0 && (
                  <div className="a-empty">NO HUNTERS FOUND</div>
                )}
              </div>
            </div>
          )}

          {/* ── CREATE TAB ────────────────────────────────── */}
          {mainTab === "create" && (
            <CreateUserPanel onRefresh={fetchAll} />
          )}

          {/* ── COMBAT IMAGES TAB ─────────────────────────── */}
          {mainTab === "combat" && (
            <CombatImagesPanel />
          )}

          {/* ── SETTINGS TAB ──────────────────────────────── */}
          {mainTab === "settings" && (
            <SettingsPanel />
          )}

          {/* ── OVERVIEW TAB ──────────────────────────────── */}
          {mainTab === "overview" && overview && (
            <div>
              {/* Rank distribution */}
              <div className="a-section-title" style={{ marginBottom:"16px" }}>RANK DISTRIBUTION</div>
              <div className="a-rank-dist">
                {(overview.byRank || []).map(r => {
                  const rankColor = {
                    "F":"#888","E":"#55bbff","D":"#44ff88","C":"#ffcc00",
                    "B":"#ff8800","A":"#ff4444","S":"#ff44cc","SS":"#cc44ff",
                    "SSS":"#ffffff","Shadow Monarch":"#4af"
                  }[r._id] || "#4af";
                  const pct = overview.total ? ((r.count / overview.total) * 100).toFixed(0) : 0;
                  return (
                    <div key={r._id} className="a-rank-row-stat">
                      <span className="a-rank-nm" style={{ color: rankColor }}>RANK {r._id}</span>
                      <div className="a-rank-bar-wrap">
                        <div className="a-rank-bar-fill" style={{ width:`${pct}%`, background: rankColor }} />
                      </div>
                      <span className="a-rank-count">{r.count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Top hunters */}
              {overview.topUsers && overview.topUsers.length > 0 && (
                <>
                  <div className="a-section-title" style={{ margin:"24px 0 16px" }}>TOP HUNTERS (BY XP)</div>
                  <div className="a-top-list">
                    {overview.topUsers.map((u, i) => {
                      const cp = Math.round((u.str||0)*2.5+(u.agi||0)*2.2+(u.sta||0)*1.8+(u.sen||0)*1.5);
                      return (
                        <div key={u._id} className="a-top-row">
                          <span className="a-top-rank">#{i+1}</span>
                          <span className="a-top-name">{u.username}</span>
                          <span className="a-top-rank-badge">{u.rank}</span>
                          <span className="a-top-xp">XP {u.exp?.toLocaleString()}</span>
                          <span className="a-top-cp">CP {cp.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* ─── CSS ──────────────────────────────────────────── */}
      <style>{`
        :root {
          --c-bg: #0a0a0c;
          --c-card: rgba(255,255,255,0.03);
          --c-border: rgba(255,255,255,0.08);
          --c-accent: #4af;
          --c-text: #fff;
          --c-muted: #555;
          --c-danger: #ff4444;
          --c-warn: #ff8800;
          --c-ok: #44ff88;
          --font: 'Orbitron', monospace;
        }

        .admin-page {
          padding: 20px 16px 100px;
          max-width: 720px;
          margin: 0 auto;
          font-family: var(--font);
          color: var(--c-text);
          background: var(--c-bg);
          min-height: 100vh;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .admin-eyebrow { font-size: 8px; letter-spacing: 4px; color: var(--c-muted); margin-bottom: 4px; }
        .admin-title { font-size: 20px; letter-spacing: 5px; color: var(--c-accent); margin: 0; }

        .admin-quick-stats { display: flex; gap: 10px; flex-wrap: wrap; }
        .aq-stat {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 8px;
          padding: 8px 14px;
          text-align: center;
        }
        .aq-stat.warn { border-color: rgba(255,68,68,0.3); }
        .aq-stat.dim { border-color: rgba(255,255,255,0.04); }
        .aq-stat b { display: block; font-size: 18px; color: var(--c-text); }
        .aq-stat span { font-size: 7px; color: var(--c-muted); letter-spacing: 2px; }

        /* Main nav */
        .admin-nav {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .admin-nav-btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--c-muted);
          font-family: var(--font);
          font-size: 9px;
          letter-spacing: 1px;
          border-radius: 6px;
          cursor: pointer;
          transition: all .15s;
        }
        .admin-nav-btn:hover { border-color: rgba(255,255,255,0.15); color: #aaa; }
        .admin-nav-btn.active {
          border-color: var(--c-accent);
          color: var(--c-accent);
          background: rgba(68,170,255,0.08);
        }

        /* Loading */
        .admin-loading { text-align: center; padding: 60px 20px; }
        .loading-pulse {
          font-size: 11px; letter-spacing: 4px; color: var(--c-accent);
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }

        /* Search */
        .a-search-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--c-border);
          border-radius: 6px;
          padding: 10px 14px;
          color: #fff;
          font-family: var(--font);
          font-size: 10px;
          letter-spacing: 2px;
          outline: none;
          margin-bottom: 12px;
        }
        .a-search-input:focus { border-color: var(--c-accent); }
        .a-results-count { font-size: 8px; color: var(--c-muted); letter-spacing: 2px; margin-bottom: 12px; }

        /* API Error panel */
        .a-api-error {
          background: rgba(255,68,68,0.05);
          border: 1px solid rgba(255,68,68,0.2);
          border-radius: 10px;
          padding: 28px 24px;
          text-align: center;
        }
        .a-api-error-icon { font-size: 32px; margin-bottom: 10px; }
        .a-api-error-title {
          font-size: 13px; letter-spacing: 4px;
          color: var(--c-danger); margin-bottom: 8px;
        }
        .a-api-error-msg {
          font-size: 10px; color: #ff8888;
          letter-spacing: 1px; margin-bottom: 18px;
        }
        .a-api-error-steps {
          text-align: left;
          background: rgba(0,0,0,0.3);
          border-radius: 7px;
          padding: 14px 16px;
          display: flex; flex-direction: column; gap: 8px;
          margin-bottom: 4px;
        }
        .a-api-error-steps div { font-size: 9px; color: #888; letter-spacing: 1px; line-height: 1.6; }
        .a-api-error-steps code {
          background: rgba(255,255,255,0.08);
          padding: 1px 6px; border-radius: 3px;
          color: var(--c-accent); font-size: 9px;
        }

        /* User list */
        .a-user-list { display: flex; flex-direction: column; gap: 8px; }
        .a-empty { font-size: 10px; color: #333; text-align: center; letter-spacing: 3px; padding: 30px; }

        /* User card */
        .a-user-card {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color .2s;
        }
        .a-user-card.locked { border-color: rgba(255,68,68,0.3); }
        .a-user-card.is-admin { border-color: rgba(68,170,255,0.25); }

        .a-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          cursor: pointer;
          gap: 10px;
        }
        .a-card-header:hover { background: rgba(255,255,255,0.02); }
        .a-card-left  { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .a-card-right { display: flex; gap: 14px; align-items: center; flex-shrink: 0; }

        .a-username { font-size: 12px; color: #fff; letter-spacing: 1px; }
        .a-admin-badge {
          font-size: 7px; color: var(--c-accent); border: 1px solid var(--c-accent);
          padding: 1px 6px; border-radius: 3px; letter-spacing: 1px;
        }
        .a-lock-badge { font-size: 11px; }
        .a-rank-badge {
          font-size: 9px; padding: 2px 7px; border-radius: 3px;
          border: 1px solid; letter-spacing: 1px;
        }
        .a-meta { font-size: 9px; color: var(--c-muted); letter-spacing: 1px; }
        .a-chevron { color: #333; font-size: 10px; }

        .a-card-body { border-top: 1px solid rgba(255,255,255,0.05); padding: 12px 14px 14px; }

        /* Tab nav inside card */
        .a-tab-nav {
          display: flex;
          gap: 4px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .a-tab-btn {
          padding: 5px 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          color: #444;
          font-family: var(--font);
          font-size: 8px;
          letter-spacing: 1px;
          border-radius: 5px;
          cursor: pointer;
        }
        .a-tab-btn.active {
          border-color: var(--c-accent);
          color: var(--c-accent);
          background: rgba(68,170,255,0.07);
        }

        .a-tab-content { animation: fadeIn .15s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }

        /* Flash message */
        .a-flash {
          font-size: 9px; letter-spacing: 1px; padding: 6px 12px;
          border-radius: 5px; margin-bottom: 10px;
        }
        .a-flash.ok  { background: rgba(68,255,136,0.1); color: var(--c-ok); border: 1px solid rgba(68,255,136,0.2); }
        .a-flash.err { background: rgba(255,68,68,0.1);  color: var(--c-danger); border: 1px solid rgba(255,68,68,0.2); }

        /* Section titles */
        .a-section-title {
          font-size: 8px; letter-spacing: 3px; color: var(--c-accent);
          opacity: 0.7; margin-bottom: 10px;
        }
        .a-divider { border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 14px 0; }
        .a-hint { font-size: 8px; color: var(--c-muted); letter-spacing: 1px; margin: 4px 0 10px; }

        /* Stat rows */
        .a-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
        .a-stat-row   { display: flex; align-items: center; gap: 8px; }
        .a-stat-label { font-size: 9px; color: #555; letter-spacing: 2px; min-width: 34px; }
        .a-stat-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 5px 8px;
          color: #fff;
          font-family: var(--font);
          font-size: 11px;
          width: 70px;
          outline: none;
        }
        .a-stat-input:focus { border-color: var(--c-accent); }

        .a-rank-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .a-rank-select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 5px 8px;
          color: #fff;
          font-family: var(--font);
          font-size: 10px;
          outline: none;
        }

        .a-xp-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }

        /* Buttons */
        .a-btn {
          padding: 8px 16px;
          font-family: var(--font);
          font-size: 9px;
          letter-spacing: 2px;
          border-radius: 5px;
          cursor: pointer;
          border: 1px solid;
          font-weight: 700;
          transition: all .15s;
        }
        .a-btn.primary {
          background: var(--c-accent);
          border-color: var(--c-accent);
          color: #000;
        }
        .a-btn.primary:hover { opacity: .85; }
        .a-btn.primary:disabled { opacity: .4; cursor: not-allowed; }
        .a-btn.outline {
          background: transparent;
          border-color: rgba(255,255,255,0.15);
          color: #aaa;
        }
        .a-btn.outline:hover { border-color: #fff; color: #fff; }
        .a-btn.warn {
          background: rgba(255,136,0,0.1);
          border-color: var(--c-warn);
          color: var(--c-warn);
        }
        .a-btn.warn:hover { background: rgba(255,136,0,0.2); }
        .a-btn.danger {
          background: rgba(255,68,68,0.1);
          border-color: var(--c-danger);
          color: var(--c-danger);
        }
        .a-btn.danger:hover { background: rgba(255,68,68,0.2); }
        .a-btn.danger-outline {
          background: rgba(255,68,68,0.06);
          border-color: rgba(255,68,68,0.4);
          color: #ff6666;
        }

        /* Penalty */
        .a-penalty-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
        .a-penalty-item { background: rgba(255,255,255,0.03); border: 1px solid var(--c-border); border-radius: 6px; padding: 10px 6px; text-align: center; }
        .a-penalty-val { font-size: 18px; color: #fff; }
        .a-penalty-lbl { font-size: 6px; color: var(--c-muted); letter-spacing: 1px; margin-top: 3px; }
        .a-lock-info { font-size: 9px; color: var(--c-danger); letter-spacing: 1px; margin-bottom: 10px; }

        /* Danger row */
        .a-danger-row { display: flex; gap: 10px; flex-wrap: wrap; }

        /* Create panel */
        .a-create-panel {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 10px;
          padding: 20px;
        }
        .a-create-title { font-size: 11px; letter-spacing: 4px; color: var(--c-accent); margin-bottom: 18px; }
        .a-create-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
        .a-field        { display: flex; flex-direction: column; gap: 5px; }
        .a-field-label  { font-size: 7px; letter-spacing: 2px; color: var(--c-muted); }
        .a-text-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 5px;
          padding: 8px 10px;
          color: #fff;
          font-family: var(--font);
          font-size: 11px;
          outline: none;
        }
        .a-text-input:focus { border-color: var(--c-accent); }

        /* Combat images */
        .a-combat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .a-combat-title { font-size: 12px; letter-spacing: 4px; color: var(--c-accent); }
        .a-combat-sub   { font-size: 8px; color: var(--c-muted); letter-spacing: 1px; margin-top: 3px; }

        .a-progress-bar {
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .a-progress-fill {
          height: 100%;
          background: var(--c-accent);
          border-radius: 2px;
          transition: width .4s ease;
        }

        .a-combat-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
          align-items: center;
          flex-wrap: wrap;
        }
        .a-cat-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
        .a-cat-tab {
          padding: 5px 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.07);
          color: #444;
          font-family: var(--font);
          font-size: 7px;
          letter-spacing: 1px;
          border-radius: 4px;
          cursor: pointer;
        }
        .a-cat-tab.active {
          border-color: rgba(255,255,255,0.25);
          color: #bbb;
          background: rgba(255,255,255,0.04);
        }

        .a-move-list { display: flex; flex-direction: column; gap: 4px; }
        .a-move-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 7px;
          gap: 10px;
          flex-wrap: wrap;
        }
        .a-move-info { display: flex; align-items: center; gap: 10px; }
        .a-move-num {
          color: #000; font-weight: 900;
          font-size: 8px; padding: 3px 8px;
          border-radius: 12px; letter-spacing: 1px;
          white-space: nowrap;
        }
        .a-move-name { font-size: 10px; color: #ccc; letter-spacing: 1px; }
        .a-move-cat  { font-size: 7px; letter-spacing: 1px; margin-top: 2px; }
        .a-move-right { display: flex; align-items: center; gap: 8px; }

        .a-upload-btn {
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.12);
          color: #555;
          font-family: var(--font);
          font-size: 8px;
          letter-spacing: 1px;
          padding: 6px 12px;
          border-radius: 5px;
          cursor: pointer;
          white-space: nowrap;
        }
        .a-upload-btn:hover { border-color: rgba(255,255,255,0.25); color: #888; }
        .a-upload-btn:disabled { opacity: .5; cursor: not-allowed; }

        .a-move-preview { display: flex; align-items: center; gap: 8px; }
        .a-move-thumb {
          width: 48px; height: 36px;
          object-fit: cover; border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .a-move-actions { display: flex; gap: 4px; }
        .a-btn-sm {
          padding: 4px 8px;
          font-family: var(--font);
          font-size: 7px;
          letter-spacing: 1px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid;
        }
        .a-btn-sm.primary {
          background: rgba(68,170,255,0.15);
          border-color: rgba(68,170,255,0.35);
          color: var(--c-accent);
        }
        .a-btn-sm.danger {
          background: rgba(255,68,68,0.1);
          border-color: rgba(255,68,68,0.3);
          color: #ff6666;
        }

        /* Overview */
        .a-rank-dist { display: flex; flex-direction: column; gap: 8px; }
        .a-rank-row-stat {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .a-rank-nm { font-size: 9px; letter-spacing: 1px; min-width: 90px; }
        .a-rank-bar-wrap {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }
        .a-rank-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width .5s ease;
        }
        .a-rank-count { font-size: 10px; color: #aaa; min-width: 20px; text-align: right; }

        .a-top-list { display: flex; flex-direction: column; gap: 6px; }
        .a-top-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 7px;
        }
        .a-top-rank  { font-size: 10px; color: var(--c-muted); min-width: 24px; }
        .a-top-name  { font-size: 12px; color: #fff; flex: 1; }
        .a-top-rank-badge {
          font-size: 9px; color: var(--c-accent);
          background: rgba(68,170,255,0.1);
          padding: 2px 7px; border-radius: 3px;
        }
        .a-top-xp { font-size: 9px; color: var(--c-muted); }
        .a-top-cp { font-size: 9px; color: var(--c-muted); }
      `}</style>
    </div>
  );
}