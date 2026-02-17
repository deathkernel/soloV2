import { useEffect, useRef, useState } from "react";
import axios   from "../api/axios";
import NavBar  from "../components/NavBar";
import CPMeter from "../components/CPMeter";
import XPBar   from "../components/XPBar";
import RankUpOverlay from "../components/RankUpOverlay";
import { ThemeProvider, useTheme } from "../utils/ThemeContext";

function DashboardContent({ onLogout }) {
  const theme = useTheme();
  const [profile,    setProfile]    = useState(null);
  const [error,      setError]      = useState("");
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

  const xp = profile ? (profile.exp ?? 0) : 0;

  return (
    <div className="page">
      <div className="scanline" />
      <header className="sys-header">
        <div className="sys-header-logo">
          <div className="sys-header-logo-icon">◈</div>
          <div>
            <div className="sys-header-logo-text">STATUS WINDOW</div>
            <div className="sys-header-logo-sub">{theme.label || "HUNTER SYSTEM"}</div>
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

            {/* Rank showcase panel */}
            <div className="sys-panel sys-panel-inner" style={{textAlign:"center", padding:"24px 18px"}}>
              <div className="rank-badge-lg">{profile.rank}</div>
              <div className="rank-label">{theme.label}</div>
              <div className="rank-quote">&ldquo;{theme.quote}&rdquo;</div>
            </div>

            <div className="dash-row">
              <div className="sys-panel sys-panel-inner">
                <div className="sys-label">COMBAT POWER</div>
                <CPMeter cp={profile.cp} />
              </div>
              <div className="sys-panel">
                <div className="sys-label">EXPERIENCE</div>
                <XPBar xp={xp} rank={profile.rank} />
              </div>
            </div>

            <div className="dash-row">
              <div className="sys-panel sys-panel-inner">
                <div className="sys-label">STATS</div>
                {[["STRENGTH",profile.str],["AGILITY",profile.agi],["STAMINA",profile.sta]].map(([k,v])=>(
                  <div key={k} className="stat-row">
                    <span className="stat-row-name">{k}</span>
                    <span className="stat-row-value">{v}</span>
                  </div>
                ))}
              </div>
              <div className="sys-panel">
                <div className="sys-label">OVERVIEW</div>
                <div className="status-list">
                  {[
                    ["RANK",    profile.rank,           "highlight"],
                    ["CLASS",   profile.classification, "highlight"],
                    ["STREAK",  `${profile.streak??0} DAYS`, ""],
                    ["LICENSE", profile.licenseUnlocked?"ACTIVE":"LOCKED",
                                profile.licenseUnlocked?"active":"locked"],
                  ].map(([k,v,cls])=>(
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
      {showRankUp && <RankUpOverlay rank={newRank} onClose={()=>setShowRankUp(false)} />}
    </div>
  );
}

function DashboardPage({ onLogout }) {
  const [rank, setRank] = useState("F");
  useEffect(() => {
    axios.get("/auth/profile").then(r => setRank(r.data.rank)).catch(()=>{});
  }, []);
  return (
    <ThemeProvider rank={rank}>
      <DashboardContent onLogout={onLogout} />
    </ThemeProvider>
  );
}

export default DashboardPage;