import React, { useState, useEffect, useRef } from "react";

/**
 * SurpriseQuest — Random popup quest with countdown timer
 * Parent should call pollForQuest() periodically (e.g. every 60s)
 */
export default function SurpriseQuest({ onComplete }) {
  const [quest,     setQuest]     = useState(null);
  const [timeLeft,  setTimeLeft]  = useState(0);
  const [completed, setCompleted] = useState(false);
  const [expired,   setExpired]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const timerRef = useRef(null);
  const pollRef  = useRef(null);

  // ── Poll every 60s for a surprise quest ────────────────────────────────────
  useEffect(() => {
    pollForQuest(); // check immediately on mount
    pollRef.current = setInterval(pollForQuest, 60_000);
    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  async function pollForQuest() {
    if (quest) return; // already have one active
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("/api/workout/surprise-quest", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.quest) {
        setQuest(data.quest);
        setTimeLeft(data.quest.duration || 600);
        setCompleted(false);
        setExpired(false);
        startTimer(data.quest.duration || 600);
      }
    } catch (err) {
      console.error("Quest poll error:", err);
    }
  }

  function startTimer(seconds) {
    clearInterval(timerRef.current);
    let remaining = seconds;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setExpired(true);
      }
    }, 1000);
  }

  async function handleComplete() {
    if (!quest || completed || expired || loading) return;
    setLoading(true);
    clearInterval(timerRef.current);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("/api/workout/complete-surprise", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ quest }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompleted(true);
        if (onComplete) onComplete(data);
        // Auto-hide after 3s
        setTimeout(() => setQuest(null), 3000);
      }
    } catch (err) {
      console.error("Complete surprise error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    clearInterval(timerRef.current);
    setQuest(null);
  }

  if (!quest) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");
  const urgency = timeLeft < 60 ? "critical" : timeLeft < 180 ? "warning" : "normal";
  const isBoss  = quest.category === "Boss";

  return (
    <div className={`sq-overlay ${isBoss ? "boss" : ""}`}>
      <div className={`sq-card ${urgency} ${completed ? "sq-done" : ""} ${expired ? "sq-expired" : ""}`}>

        <div className="sq-header">
          <span className="sq-title">
            {isBoss ? "⚠⚠ BOSS QUEST ⚠⚠" : "⚡ SURPRISE QUEST"}
          </span>
          {!completed && !expired && (
            <button className="sq-close" onClick={handleDismiss}>✕</button>
          )}
        </div>

        <div className="sq-category">[{quest.category?.toUpperCase()}]</div>
        <p className="sq-desc">{quest.desc}</p>

        <div className="sq-footer">
          <div className="sq-rewards">
            <span className="sq-xp">+{quest.xp} XP</span>
            {quest.stat && <span className="sq-stat">+1 {quest.stat.toUpperCase()}</span>}
          </div>

          {completed ? (
            <span className="sq-complete-msg">✓ QUEST CLEARED</span>
          ) : expired ? (
            <span className="sq-expired-msg">✗ TIME EXPIRED</span>
          ) : (
            <div className="sq-actions">
              <div className={`sq-timer ${urgency}`}>
                {mins}:{secs}
              </div>
              <button
                className="sq-btn"
                onClick={handleComplete}
                disabled={loading}
              >
                {loading ? "..." : "COMPLETE"}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sq-overlay {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          max-width: 340px;
          width: calc(100vw - 48px);
          animation: slideInRight 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        .sq-card {
          background: rgba(0,0,0,0.92);
          border: 2px solid #ffcc00;
          border-radius: 10px;
          padding: 16px;
          font-family: 'Orbitron', monospace;
          box-shadow: 0 0 20px rgba(255,204,0,0.3);
        }
        .sq-card.warning { border-color: #ff8800; box-shadow: 0 0 20px rgba(255,136,0,0.4); }
        .sq-card.critical {
          border-color: #ff2222;
          box-shadow: 0 0 30px rgba(255,34,34,0.6);
          animation: criticalPulse 0.5s ease-in-out infinite alternate;
        }
        @keyframes criticalPulse {
          from { box-shadow: 0 0 10px rgba(255,34,34,0.4); }
          to   { box-shadow: 0 0 40px rgba(255,34,34,0.9); }
        }
        .sq-card.sq-done    { border-color: #44ff88; box-shadow: 0 0 20px rgba(68,255,136,0.4); }
        .sq-card.sq-expired { border-color: #555; box-shadow: none; opacity: 0.6; }
        .boss .sq-card      { border-color: #ff4444; }

        .sq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .sq-title {
          font-size: 10px;
          letter-spacing: 3px;
          color: #ffcc00;
          font-weight: 700;
        }
        .boss .sq-title { color: #ff4444; }
        .sq-close {
          background: none; border: none; color: #888;
          cursor: pointer; font-size: 14px; padding: 0 2px; line-height:1;
        }
        .sq-close:hover { color: #fff; }
        .sq-category {
          font-size: 9px; letter-spacing: 2px; color: #888; margin-bottom: 6px;
        }
        .sq-desc {
          font-size: 13px; color: #eee; margin: 0 0 14px 0; line-height: 1.5;
        }
        .sq-footer {
          display: flex; justify-content: space-between; align-items: center; gap: 8px;
        }
        .sq-rewards { display: flex; gap: 10px; align-items: center; }
        .sq-xp   { font-size: 11px; color: #ffcc44; letter-spacing: 1px; }
        .sq-stat { font-size: 11px; color: #88ff88; letter-spacing: 1px; }
        .sq-actions { display: flex; align-items: center; gap: 10px; }
        .sq-timer {
          font-size: 18px; font-weight: 700; letter-spacing: 2px;
          color: #ffcc00; min-width: 52px; text-align: center;
        }
        .sq-timer.warning  { color: #ff8800; }
        .sq-timer.critical { color: #ff2222; }
        .sq-btn {
          background: #ffcc00; border: none;
          font-family: 'Orbitron', monospace;
          font-size: 10px; letter-spacing: 2px;
          padding: 8px 14px; border-radius: 4px;
          cursor: pointer; color: #000; font-weight: 700;
          transition: background 0.2s;
        }
        .sq-btn:hover:not(:disabled) { background: #ffe066; }
        .sq-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .sq-complete-msg { font-size: 12px; color: #44ff88; letter-spacing: 2px; }
        .sq-expired-msg  { font-size: 12px; color: #ff4444; letter-spacing: 2px; }
      `}</style>
    </div>
  );
}
