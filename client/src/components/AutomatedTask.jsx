import React, { useState } from "react";

/**
 * AutomatedTask — High-priority mission with red border
 * 30% daily chance. Shows until completed or dismissed.
 */
export default function AutomatedTask({ task, completed, onComplete }) {
  const [loading,   setLoading]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!task || dismissed) return null;

  async function handleComplete() {
    if (completed || loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("/api/workout/complete-automated", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && onComplete) onComplete(data);
    } catch (err) {
      console.error("Automated task error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auto-task ${completed ? "done" : "active"}`}>
      <div className="auto-task-header">
        <span className="auto-task-badge">⚠ AUTOMATED TASK</span>
        {!completed && (
          <button className="auto-dismiss" onClick={() => setDismissed(true)} title="Dismiss">✕</button>
        )}
      </div>

      <div className="auto-task-tag">[{task.tag}]</div>
      <p className="auto-task-desc">{task.desc}</p>

      <div className="auto-task-footer">
        <span className="auto-task-reward">+{task.xp} XP &nbsp;|&nbsp; +2 {task.stat?.toUpperCase()}</span>
        {completed ? (
          <span className="auto-task-done">✓ COMPLETED</span>
        ) : (
          <button
            className="auto-task-btn"
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? "REPORTING..." : "MARK COMPLETE"}
          </button>
        )}
      </div>

      <style>{`
        .auto-task {
          border: 2px solid #ff2222;
          border-radius: 8px;
          background: rgba(255, 30, 30, 0.08);
          padding: 14px 16px;
          font-family: 'Orbitron', monospace;
          position: relative;
          animation: pulseBorder 2s ease-in-out infinite;
        }
        .auto-task.done {
          border-color: #44ff88;
          background: rgba(68,255,136,0.06);
          animation: none;
        }
        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 6px rgba(255,34,34,0.4); }
          50%       { box-shadow: 0 0 18px rgba(255,34,34,0.8); }
        }
        .auto-task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .auto-task-badge {
          font-size: 9px;
          letter-spacing: 3px;
          color: #ff4444;
          font-weight: 700;
        }
        .auto-task.done .auto-task-badge { color: #44ff88; }
        .auto-dismiss {
          background: none;
          border: none;
          color: #ff4444;
          cursor: pointer;
          font-size: 14px;
          padding: 0 4px;
          line-height: 1;
        }
        .auto-task-tag {
          font-size: 10px;
          letter-spacing: 2px;
          color: #ff8888;
          margin-bottom: 4px;
        }
        .auto-task-desc {
          font-size: 13px;
          color: #eee;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }
        .auto-task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .auto-task-reward {
          font-size: 10px;
          color: #ffcc44;
          letter-spacing: 1px;
        }
        .auto-task-done {
          font-size: 11px;
          color: #44ff88;
          letter-spacing: 2px;
        }
        .auto-task-btn {
          background: #ff2222;
          border: none;
          color: #fff;
          font-family: 'Orbitron', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          padding: 7px 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .auto-task-btn:hover:not(:disabled) { background: #ff5555; }
        .auto-task-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
