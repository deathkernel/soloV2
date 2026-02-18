import { useEffect, useState } from "react";
import axios from "../api/axios";

const TAG_CLASS = { STR:"str", AGI:"agi", STA:"sta", BOXING:"box" };

function WorkoutPanel({ refreshProfile }) {
  const [workout,    setWorkout]    = useState(null);
  const [error,      setError]      = useState("");
  const [done,       setDone]       = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    axios.get("/workout/daily")
      .then(r => setWorkout(r.data))
      .catch(() => setError("Mission data unavailable"));
  }, []);

  const complete = async () => {
    setCompleting(true);
    try {
      await api.post
("/workout/complete");
    } catch { /* endpoint may not exist yet */ }
    finally {
      setDone(true);
      setCompleting(false);
      if (refreshProfile) refreshProfile();
    }
  };

  return (
    <div className="sys-panel sys-panel-inner">
      <div className="sys-label">DAILY MISSION</div>

      {error   && <p style={{fontSize:10,color:"var(--red)",letterSpacing:1}}>{error}</p>}
      {!workout && !error && <p style={{fontSize:9,letterSpacing:4,color:"var(--white-dim)"}}>GENERATING...</p>}

      {workout?.rest && (
        <div className="workout-rest">
          <span className="workout-rest-icon">🌙</span>
          <span className="workout-rest-text">REST DAY — RECOVERY PROTOCOL ACTIVE</span>
        </div>
      )}

      {workout && !workout.rest && (
        <>
          <div className="workout-list">
            {workout.advancedBoxing ? (
              <div className="workout-item">
                <span className="workout-type box">BOXING</span>
                <span className="workout-text">{workout.advancedBoxing}</span>
              </div>
            ) : (
              [["STR", workout.STR],["AGI", workout.AGI],["STA", workout.STA],["BOXING", workout.BOXING]]
                .filter(([,v]) => v)
                .map(([tag, desc]) => (
                  <div key={tag} className="workout-item">
                    <span className={`workout-type ${TAG_CLASS[tag]}`}>{tag}</span>
                    <span className="workout-text">{desc}</span>
                  </div>
                ))
            )}
          </div>

          {!done && (
            <button
              className="btn btn-primary"
              style={{ marginTop:16 }}
              onClick={complete}
              disabled={completing}
            >
              {completing ? "PROCESSING..." : "COMPLETE MISSION"}
            </button>
          )}
          {done && (
            <div style={{marginTop:14,textAlign:"center",fontSize:10,letterSpacing:3,color:"var(--green)"}}>
              ✓ MISSION COMPLETE — XP AWARDED
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default WorkoutPanel;