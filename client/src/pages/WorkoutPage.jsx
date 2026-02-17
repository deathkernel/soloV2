import { useEffect, useState } from "react";
import axios   from "../api/axios";
import NavBar  from "../components/NavBar";
import { ThemeProvider } from "../utils/ThemeContext";
import RankUpOverlay from "../components/RankUpOverlay";

const TAG_CLASS  = { STR:"str", AGI:"agi", STA:"sta", BOXING:"box", REST:"rest" };
const TAG_REWARD = { STR:"+1 STR  +20 XP", AGI:"+1 AGI  +20 XP", STA:"+1 STA  +20 XP", BOXING:"+25 XP", REST:"+10 XP" };

function WorkoutContent({ onLogout }) {
  const [session,    setSession]    = useState(null);
  const [completing, setCompleting] = useState(false);
  const [justDone,   setJustDone]   = useState(null);
  const [error,      setError]      = useState("");
  const [showRankUp, setShowRankUp] = useState(false);
  const [newRank,    setNewRank]    = useState(null);

  const loadSession = async () => {
    try {
      const { data } = await axios.get("/workout/session");
      setSession(data);
    } catch { setError("Mission data unavailable. Is the server running?"); }
  };

  useEffect(() => {
    axios.get("/auth/profile").then(r => setUserRank(r.data.rank)).catch(()=>{});
    loadSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startMission = async () => {
    try {
      await axios.post("/workout/start");
      setSession(s => ({ ...s, started: true }));
    } catch { setError("Failed to start mission"); }
  };

  const completeTask = async () => {
    setCompleting(true);
    const tag = session.tasks[session.currentIndex]?.tag;
    try {
      const { data } = await axios.post("/workout/complete-task");
      setJustDone(tag);
      if (data.rankedUp) {
        setNewRank(data.newRank);
        setUserRank(data.newRank);
      }
      setTimeout(() => {
        setJustDone(null);
        setSession(s => ({ ...s, currentIndex: data.nextIndex, allDone: data.allDone }));
        setCompleting(false);
        if (data.rankedUp) setShowRankUp(true);
      }, 900);
    } catch {
      setError("Failed to complete task");
      setCompleting(false);
    }
  };

  const task      = session?.tasks[session.currentIndex];
  const doneTasks = session?.tasks.slice(0, session.currentIndex) ?? [];

  return (
    <div className="page">
      <div className="scanline" />
      <header className="sys-header">
        <div className="sys-header-logo">
          <div className="sys-header-logo-icon">⚔</div>
          <div>
            <div className="sys-header-logo-text">DAILY MISSION</div>
            <div className="sys-header-logo-sub">TRAINING PROTOCOL</div>
          </div>
        </div>
        {session && (
          <div className="mission-progress-header">
            <span className="mission-progress-text">
              {session.allDone ? "ALL COMPLETE" : `${session.currentIndex} / ${session.tasks.length} DONE`}
            </span>
            <div className="mission-progress-dots">
              {session.tasks.map((_, i) => (
                <span key={i} className={`mission-dot ${
                  i < session.currentIndex ? "mission-dot--done" :
                  i === session.currentIndex && session.started ? "mission-dot--active" : ""
                }`} />
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="page-body">
        {error && <div className="auth-error" style={{marginBottom:14}}>⚠ {error}</div>}

        {!session && !error && (
          <div className="sys-loading">
            <div className="sys-loading-ring" />
            <div className="sys-loading-text">GENERATING MISSION</div>
          </div>
        )}

        {session && (
          <div className="mission-layout">

            {/* NOT STARTED */}
            {!session.started && !session.allDone && (
              <div className="sys-panel">
                <div className="sys-label">MISSION BRIEFING</div>
                <p className="mission-brief-text">
                  {session.tasks.length} EXERCISES ASSIGNED. COMPLETE EACH IN ORDER TO EARN STATS AND XP.
                </p>
                <div className="mission-task-preview">
                  {session.tasks.map((t, i) => (
                    <div key={i} className="mission-preview-row">
                      <span className={`workout-type ${TAG_CLASS[t.tag]||"agi"}`}>{t.tag}</span>
                      <span className="locked-desc">CLASSIFIED</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{marginTop:20}} onClick={startMission}>
                  BEGIN MISSION
                </button>
              </div>
            )}

            {/* IN PROGRESS */}
            {session.started && !session.allDone && task && (
              <>
                {doneTasks.length > 0 && (
                  <div className="sys-panel mission-done-panel">
                    <div className="sys-label">COMPLETED</div>
                    {doneTasks.map((t, i) => (
                      <div key={i} className="workout-item">
                        <span className={`workout-type ${TAG_CLASS[t.tag]||"agi"}`}>{t.tag}</span>
                        <span className="workout-text">{t.desc}</span>
                        <span className="done-check">✓</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`sys-panel mission-active-panel ${justDone?"task-flash":""}`}>
                  <div className="sys-label">TASK {session.currentIndex + 1} OF {session.tasks.length}</div>
                  <div className="active-task-row">
                    <span className={`workout-type workout-type--lg ${TAG_CLASS[task.tag]||"agi"}`}>
                      {task.tag}
                    </span>
                    <div className="active-task-info">
                      <div className="active-task-desc">{task.desc}</div>
                      <div className="active-task-reward">{TAG_REWARD[task.tag]||"+XP"}</div>
                    </div>
                  </div>
                  {justDone ? (
                    <div className="task-complete-flash">✓ TASK COMPLETE — XP AWARDED</div>
                  ) : (
                    <button className="btn btn-primary" style={{marginTop:20}} onClick={completeTask} disabled={completing}>
                      {completing ? "PROCESSING..." : "MARK COMPLETE"}
                    </button>
                  )}
                </div>

                {session.tasks.slice(session.currentIndex + 1).map((t, i) => (
                  <div key={i} className="sys-panel mission-locked-panel">
                    <div className="workout-item">
                      <span className={`workout-type workout-type--dim ${TAG_CLASS[t.tag]||"agi"}`}>{t.tag}</span>
                      <span className="workout-text locked-desc">LOCKED — COMPLETE PREVIOUS TASK</span>
                      <span className="lock-icon-sm">🔒</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ALL DONE */}
            {session.allDone && (
              <div className="sys-panel mission-complete-panel">
                <div className="mission-complete-title">MISSION COMPLETE</div>
                <div className="mission-complete-sub">ALL EXERCISES FINISHED</div>
                <div className="mission-complete-tasks">
                  {session.tasks.map((t, i) => (
                    <div key={i} className="workout-item">
                      <span className={`workout-type ${TAG_CLASS[t.tag]||"agi"}`}>{t.tag}</span>
                      <span className="workout-text">{t.desc}</span>
                      <span className="done-check">✓</span>
                    </div>
                  ))}
                </div>
                <div className="mission-rest-msg">NEXT MISSION AVAILABLE TOMORROW</div>
              </div>
            )}

          </div>
        )}
      </div>

      <NavBar onLogout={onLogout} />
      {showRankUp && <RankUpOverlay rank={newRank} onClose={()=>setShowRankUp(false)} />}
    </div>
  );
}

function WorkoutPage({ onLogout }) {
  const [rank, setRank] = useState("F");
  useEffect(()=>{
    axios.get("/auth/profile").then(r=>setRank(r.data.rank)).catch(()=>{});
  },[]);
  return (
    <ThemeProvider rank={rank}>
      <WorkoutContent onLogout={onLogout} />
    </ThemeProvider>
  );
}

export default WorkoutPage;