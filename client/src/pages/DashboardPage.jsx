import { useEffect, useRef, useState } from "react";
import axios   from "../api/axios";
import NavBar  from "../components/NavBar";
import CPMeter from "../components/CPMeter";
import XPBar   from "../components/XPBar";
import RankUpOverlay from "../components/RankUpOverlay";

function DashboardPage({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [error,   setError]   = useState("");
  const [showRankUp, setShowRankUp] = useState(false);
  const [newRank,    setNewRank]    = useState(null);
  const prevRankRef = useRef(null);

  const loadProfile = async () => {
    try {
      const { data } = await axios.get("/auth/profile");
      if (prevRankRef.current && prevRankRef.current !== data.rank) {
        setNewRank(data.rank); setShowRankUp(true);
      }
      prevRankRef.current = data.rank;
      setProfile(data);
    } catch { setError("Connection failed."); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProfile(); }, []);

  const xp = profile ? (profile.xp ?? profile.exp ?? 0) : 0;

  return (
    <div className="page">
      <div className="scanline" />

      <header className="sys-header">
        <div className="sys-header-logo">
          <div className="sys-header-logo-icon">◈</div>
          <div>
            <div className="sys-header-logo-text">STATUS WINDOW</div>
            <div className="sys-header-logo-sub">HUNTER SYSTEM v1.0</div>
          </div>
        </div>
        {profile && (
          <div className="sys-header-rank">
            <span className="sys-header-rank-badge">{profile.rank}</span>
            <span className="sys-header-rank-name">{profile.username}</span>
          </div>
        )}
      </header>

      <div className="page-body">
        {error && <div className="auth-error">⚠ {error}</div>}

        {!profile && !error && (
          <div className="sys-loading">
            <div className="sys-loading-ring" />
            <div className="sys-loading-text">LOADING</div>
          </div>
        )}

        {profile && (
          <div className="dash-layout">

            {/* ── TOP ROW: CP + XP ── */}
            <div className="dash-row">
              <div className="sys-panel sys-panel-inner dash-card">
                <div className="sys-label">COMBAT POWER</div>
                <CPMeter cp={profile.cp} />
              </div>
              <div className="sys-panel dash-card">
                <div className="sys-label">EXPERIENCE</div>
                <XPBar xp={xp} rank={profile.rank} />
              </div>
            </div>

            {/* ── BOTTOM ROW: STATS + STATUS ── */}
            <div className="dash-row">
              <div className="sys-panel sys-panel-inner dash-card">
                <div className="sys-label">STATS</div>
                {[
                  ["STRENGTH", profile.str],
                  ["AGILITY",  profile.agi],
                  ["STAMINA",  profile.sta],
                ].map(([k, v]) => (
                  <div key={k} className="stat-row">
                    <span className="stat-row-name">{k}</span>
                    <span className="stat-row-value">{v}</span>
                  </div>
                ))}
              </div>

              <div className="sys-panel dash-card">
                <div className="sys-label">OVERVIEW</div>
                <div className="status-list">
                  {[
                    ["RANK",    profile.rank,           "highlight"],
                    ["CLASS",   profile.classification, "highlight"],
                    ["STREAK",  `${profile.streak ?? 0} DAYS`, ""],
                    ["LICENSE", profile.licenseUnlocked ? "ACTIVE" : "LOCKED",
                                profile.licenseUnlocked ? "active" : "locked"],
                  ].map(([k, v, cls]) => (
                    <div key={k} className="status-item">
                      <span className="status-key">{k}</span>
                      <span className={`status-val ${cls}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <NavBar onLogout={onLogout} />

      {showRankUp && <RankUpOverlay rank={newRank} onClose={() => setShowRankUp(false)} />}
    </div>
  );
}

export default DashboardPage;