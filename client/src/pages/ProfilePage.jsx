import { useEffect, useState } from "react";
import axios   from "../api/axios";
import NavBar  from "../components/NavBar";
import HunterLicense from "../components/HunterLicense";
import { ThemeProvider, useTheme } from "../utils/ThemeContext";

function ProfileContent({ onLogout }) {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [error,   setError]   = useState("");

  useEffect(() => {
    axios.get("/auth/profile")
      .then(r => setProfile(r.data))
      .catch(() => setError("Failed to load profile"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="scanline" />
      <header className="sys-header">
        <div className="sys-header-logo">
          <div className="sys-header-logo-icon">◉</div>
          <div>
            <div className="sys-header-logo-text">HUNTER FILE</div>
            <div className="sys-header-logo-sub">IDENTIFICATION & RECORD</div>
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
          <div className="profile-layout">

            {/* Rank identity */}
            <div className="sys-panel" style={{textAlign:"center"}}>
              <div className="rank-badge-lg">{profile.rank}</div>
              <div className="rank-label">{theme.label}</div>
              <div className="rank-quote">&ldquo;{theme.quote}&rdquo;</div>
            </div>

            {/* License */}
            <div className="sys-panel sys-panel-inner">
              <div className="sys-label">HUNTER LICENSE</div>
              {profile.licenseUnlocked
                ? <HunterLicense profile={profile} />
                : (
                  <div className="license-locked-box">
                    <span className="license-locked-icon">🔒</span>
                    RANK F — LICENSE LOCKED
                    <br/><span style={{fontSize:7,letterSpacing:2,opacity:0.4}}>RANK UP TO UNLOCK</span>
                  </div>
                )
              }
            </div>

            {/* Personal data */}
            <div className="sys-panel">
              <div className="sys-label">PERSONAL DATA</div>
              {[
                ["USERNAME",  profile.username],
                ["FULL NAME", profile.fullName  || "—"],
                ["EMAIL",     profile.email     || "—"],
                ["BIRTHDATE", profile.birthdate ? new Date(profile.birthdate).toLocaleDateString() : "—"],
              ].map(([k,v]) => (
                <div key={k} className="status-item">
                  <span className="status-key">{k}</span>
                  <span className="status-val">{v}</span>
                </div>
              ))}
            </div>

            {/* Combat record */}
            <div className="sys-panel sys-panel-inner">
              <div className="sys-label">COMBAT RECORD</div>
              {[
                ["RANK",            profile.rank,                          "highlight"],
                ["CLASSIFICATION",  profile.classification,                "highlight"],
                ["COMBAT POWER",    profile.cp,                            "highlight"],
                ["TOTAL EXP",       `${(profile.exp||0).toLocaleString()} XP`, ""],
                ["STREAK",          `${profile.streak??0} DAYS`,           ""],
                ["STR / AGI / STA", `${profile.str} / ${profile.agi} / ${profile.sta}`, ""],
              ].map(([k,v,cls]) => (
                <div key={k} className="status-item">
                  <span className="status-key">{k}</span>
                  <span className={`status-val ${cls||""}`}>{v}</span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      <NavBar onLogout={onLogout} />
    </div>
  );
}

function ProfilePage({ onLogout }) {
  const [rank, setRank] = useState("F");
  useEffect(()=>{
    axios.get("/auth/profile").then(r=>setRank(r.data.rank)).catch(()=>{});
  },[]);
  return (
    <ThemeProvider rank={rank}>
      <ProfileContent onLogout={onLogout} />
    </ThemeProvider>
  );
}

export default ProfilePage;