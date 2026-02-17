import { useState } from "react";

function HunterLicense({ profile }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="license-wrap" onClick={() => setFlipped(f => !f)}>
      {!flipped ? (
        <div className="license-face">
          <div className="license-photo">
            {profile.photo
              ? <img src={profile.photo} alt="Hunter" />
              : "◈"}
          </div>
          <div className="license-info">
            <div className="license-name">{profile.fullName || profile.username}</div>
            {[
              ["RANK",    profile.rank],
              ["LICENSE", profile.licenseNumber || "E-" + profile.username?.slice(0,6).toUpperCase()],
              ["CLASS",   profile.classification],
            ].map(([k,v]) => (
              <div key={k} className="license-row">
                <span className="license-row-k">{k}</span>
                <span className="license-row-v">{v}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{fontSize:8,letterSpacing:4,color:"var(--blue)",marginBottom:10}}>COMBAT DATA</div>
          {[
            ["STR", profile.str],
            ["AGI", profile.agi],
            ["STA", profile.sta],
            ["CP",  profile.cp],
          ].map(([k,v]) => (
            <div key={k} className="license-row">
              <span className="license-row-k">{k}</span>
              <span className="license-row-v">{v}</span>
            </div>
          ))}
        </div>
      )}
      <p className="license-flip-hint">TAP TO {flipped ? "FRONT" : "FLIP"}</p>
    </div>
  );
}
export default HunterLicense;