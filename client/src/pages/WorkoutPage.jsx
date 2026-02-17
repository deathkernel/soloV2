import React, { useState, useEffect } from "react";
import AutomatedTask from "../components/AutomatedTask";
import SurpriseQuest from "../components/SurpriseQuest";
import PenaltyAlert  from "../components/PenaltyAlert";

const TAG_COLORS = {
  STR:    { color: "#ff4444", icon: "⚔️" },
  AGI:    { color: "#44aaff", icon: "💨" },
  STA:    { color: "#44ff88", icon: "🛡️" },
  SEN:    { color: "#cc88ff", icon: "👁️" },
  BOXING: { color: "#ffcc00", icon: "🥊" },
  REST:   { color: "#888888", icon: "🌙" },
};

function TaskCard({ task, index, currentIndex, onComplete, loading }) {
  const isActive    = index === currentIndex;
  const isDone      = index < currentIndex;
  const isPending   = index > currentIndex;
  const cfg         = TAG_COLORS[task.tag] || { color: "#4af", icon: "●" };

  return (
    <div
      className={`task-card
        ${isActive  ? "task-active"  : ""}
        ${isDone    ? "task-done"    : ""}
        ${isPending ? "task-pending" : ""}
      `}
    >
      <div className="task-left">
        <span className="task-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="task-icon">{cfg.icon}</span>
        <div className="task-text">
          <span className="task-tag" style={{ color: cfg.color }}>[{task.tag}]</span>
          <span className="task-desc">{task.desc}</span>
        </div>
      </div>

      {isDone && <span className="task-check">✓</span>}

      {isActive && !task.isRest && (
        <button
          className="task-complete-btn"
          onClick={() => onComplete(index)}
          disabled={loading}
        >
          {loading ? "..." : "DONE"}
        </button>
      )}

      {isActive && task.isRest && (
        <button
          className="task-complete-btn rest-btn"
          onClick={() => onComplete(index)}
          disabled={loading}
        >
          REST
        </button>
      )}
    </div>
  );
}

export default function WorkoutPage() {
  const [session,      setSession]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [taskLoading,  setTaskLoading]  = useState(false);
  const [error,        setError]        = useState("");
  const [penaltyData,  setPenaltyData]  = useState(null);
  const [xpFeed,       setXpFeed]       = useState([]);
  const [rankUp,       setRankUp]       = useState(null);
  const [started,      setStarted]      = useState(false);

  useEffect(() => { fetchSession(); }, []);

  async function fetchSession() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("/api/workout/session", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load session");

      setSession(data);
      setStarted(data.started);

      // Show penalty alert if applicable
      if (data.penaltyApplied) setPenaltyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/workout/start", {
        method:  "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      setStarted(true);
    } catch (err) {
      console.error("Start error:", err);
    }
  }

  async function handleCompleteTask(index) {
    if (taskLoading) return;
    setTaskLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("/api/workout/complete-task", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // XP feed
      setXpFeed(prev => [
        { id: Date.now(), text: `+${data.xpGained} XP [${session.tasks[index]?.tag}]` },
        ...prev.slice(0, 4),
      ]);

      if (data.rankedUp) setRankUp(data.newRank);

      setSession(prev => ({
        ...prev,
        currentIndex: data.nextIndex,
        allDone:      data.allDone,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskLoading(false);
    }
  }

  function handleAutoComplete(data) {
    setXpFeed(prev => [
      { id: Date.now(), text: `+${data.xpGained} XP [MISSION]` },
      ...prev.slice(0, 4),
    ]);
    if (data.rankedUp) setRankUp(data.newRank);
    setSession(prev => ({ ...prev, automatedTaskCompleted: true }));
  }

  function handleQuestComplete(data) {
    setXpFeed(prev => [
      { id: Date.now(), text: `+${data.xpGained} XP [QUEST]` },
      ...prev.slice(0, 4),
    ]);
    if (data.rankedUp) setRankUp(data.newRank);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <div className="page-loading">LOADING MISSION DATA...</div>;
  if (error)   return <div className="page-error">ERROR: {error}</div>;
  if (!session) return null;

  const tasks        = session.tasks || [];
  const currentIndex = session.currentIndex || 0;
  const allDone      = session.allDone || currentIndex >= tasks.length;
  const isLocked     = session.locked;

  return (
    <div className="workout-page">

      {/* Penalty Alert */}
      {penaltyData && (
        <PenaltyAlert
          penaltyData={penaltyData}
          onDismiss={() => setPenaltyData(null)}
        />
      )}

      {/* Rank-up notification */}
      {rankUp && (
        <div className="rankup-toast" onClick={() => setRankUp(null)}>
          ⬆ RANK UP: {rankUp}
        </div>
      )}

      {/* XP feed */}
      <div className="xp-feed">
        {xpFeed.map(item => (
          <div key={item.id} className="xp-feed-item">{item.text}</div>
        ))}
      </div>

      {/* System Lock */}
      {isLocked && (
        <div className="system-lock-banner">
          ⛔ SYSTEM LOCK ACTIVE — Resume after {new Date(session.lockUntil).toLocaleDateString()}
        </div>
      )}

      {/* Header */}
      <div className="workout-header">
        <h1>DAILY TRAINING</h1>
        <span className="workout-date">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
      </div>

      {/* Automated Task (red border) */}
      {session.automatedTask && (
        <div className="section-block">
          <AutomatedTask
            task={session.automatedTask}
            completed={session.automatedTaskCompleted}
            onComplete={handleAutoComplete}
          />
        </div>
      )}

      {/* Task List */}
      <div className="tasks-section">
        {!started && !allDone && !isLocked && (
          <button className="start-btn" onClick={handleStart}>
            ▶ BEGIN TRAINING
          </button>
        )}

        {allDone ? (
          <div className="all-done">
            <div className="all-done-icon">⬛</div>
            <h2>TRAINING COMPLETE</h2>
            <p>Streak updated. Rest and prepare.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task, i) => (
              <TaskCard
                key={i}
                task={task}
                index={i}
                currentIndex={started ? currentIndex : -1}
                onComplete={started ? handleCompleteTask : () => {}}
                loading={taskLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Surprise Quest (floating bottom-right, polls automatically) */}
      <SurpriseQuest onComplete={handleQuestComplete} />

      <style>{`
        .workout-page {
          padding: 24px 20px 80px;
          max-width: 560px;
          margin: 0 auto;
          font-family: 'Orbitron', monospace;
        }
        .workout-header { margin-bottom: 20px; }
        .workout-header h1 {
          font-size: 20px;
          letter-spacing: 5px;
          color: var(--rank-color, #4af);
          margin: 0 0 4px 0;
        }
        .workout-date { font-size: 10px; color: #555; letter-spacing: 2px; }

        .section-block { margin-bottom: 20px; }

        .start-btn {
          width: 100%;
          background: var(--rank-color, #4af);
          border: none;
          color: #000;
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          letter-spacing: 4px;
          padding: 14px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
          margin-bottom: 16px;
          transition: opacity 0.2s;
        }
        .start-btn:hover { opacity: 0.85; }

        .task-list { display: flex; flex-direction: column; gap: 10px; }

        .task-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }
        .task-card.task-active {
          border-color: var(--rank-color, #4af);
          background: rgba(68,170,255,0.06);
          box-shadow: 0 0 12px rgba(68,170,255,0.15);
        }
        .task-card.task-done {
          opacity: 0.45;
          border-color: rgba(255,255,255,0.05);
        }
        .task-card.task-pending { opacity: 0.3; }

        .task-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
        .task-num  { font-size: 10px; color: #444; min-width: 22px; letter-spacing: 1px; }
        .task-icon { font-size: 20px; flex-shrink: 0; }
        .task-text { display: flex; flex-direction: column; min-width: 0; }
        .task-tag  { font-size: 9px; letter-spacing: 2px; margin-bottom: 2px; }
        .task-desc { font-size: 12px; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .task-check { color: #44ff88; font-size: 16px; flex-shrink: 0; }

        .task-complete-btn {
          background: var(--rank-color, #4af);
          border: none;
          color: #000;
          font-family: 'Orbitron', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          padding: 8px 14px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 700;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .task-complete-btn:hover:not(:disabled) { opacity: 0.8; }
        .task-complete-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .rest-btn { background: #555; color: #fff; }

        .all-done {
          text-align: center;
          padding: 48px 20px;
          color: var(--rank-color, #4af);
        }
        .all-done-icon { font-size: 64px; margin-bottom: 16px; }
        .all-done h2   { font-size: 18px; letter-spacing: 4px; margin: 0 0 8px; }
        .all-done p    { font-size: 11px; color: #555; letter-spacing: 2px; }

        .rankup-toast {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--rank-color, #4af);
          color: #000;
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          letter-spacing: 3px;
          padding: 12px 24px;
          border-radius: 6px;
          z-index: 9000;
          cursor: pointer;
          animation: rankUpPop 3s ease forwards;
        }
        @keyframes rankUpPop {
          0%   { opacity:0; transform: translateX(-50%) translateY(-10px); }
          10%  { opacity:1; transform: translateX(-50%) translateY(0); }
          80%  { opacity:1; }
          100% { opacity:0; }
        }

        .xp-feed {
          position: fixed;
          top: 140px;
          right: 16px;
          z-index: 8000;
          display: flex;
          flex-direction: column;
          gap: 6px;
          pointer-events: none;
        }
        .xp-feed-item {
          font-family: 'Orbitron', monospace;
          font-size: 11px;
          color: #ffcc44;
          letter-spacing: 1px;
          animation: xpFloat 2.5s ease forwards;
          text-shadow: 0 0 10px rgba(255,200,0,0.8);
        }
        @keyframes xpFloat {
          0%   { opacity:0; transform: translateY(10px); }
          20%  { opacity:1; transform: translateY(0); }
          70%  { opacity:1; }
          100% { opacity:0; transform: translateY(-20px); }
        }

        .system-lock-banner {
          background: rgba(255,34,34,0.1);
          border: 1px solid #ff2222;
          border-radius: 6px;
          padding: 12px 16px;
          font-size: 11px;
          color: #ff4444;
          letter-spacing: 2px;
          margin-bottom: 20px;
          text-align: center;
        }

        .page-loading, .page-error {
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          letter-spacing: 3px;
          color: var(--rank-color, #4af);
          padding: 60px 20px;
          text-align: center;
        }
        .page-error { color: #ff4444; }
      `}</style>
    </div>
  );
}
