import React, { useState } from "react";

/**
 * PenaltyAlert — Shows when user missed workout days
 * Pass in penaltyData from /api/workout/session response
 */
export default function PenaltyAlert({ penaltyData, onDismiss }) {
  const [visible, setVisible] = useState(true);

  if (!penaltyData?.penaltyApplied || !visible) return null;

  const { missedDays, details = [], expLoss } = penaltyData;
  const isLocked  = !!penaltyData.locked;
  const lockUntil = penaltyData.lockUntil;

  function handleDismiss() {
    setVisible(false);
    if (onDismiss) onDismiss();
  }

  function formatLockDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="penalty-overlay">
      <div className="penalty-modal">
        <div className="penalty-icon">☠</div>
        <h2 className="penalty-title">SYSTEM ALERT</h2>
        <p className="penalty-subtitle">
          VIOLATION DETECTED — {missedDays} DAY{missedDays > 1 ? "S" : ""} MISSED
        </p>

        <div className="penalty-list">
          {details.map((d, i) => (
            <div key={i} className="penalty-item">
              <span className="penalty-bullet">▸</span>
              <span>{d}</span>
            </div>
          ))}
        </div>

        {isLocked && (
          <div className="penalty-lock-warning">
            ⛔ SYSTEM LOCK ACTIVE UNTIL<br />
            <span className="lock-date">{formatLockDate(lockUntil)}</span><br />
            <small>Training suspended. Reflect on your failure.</small>
          </div>
        )}

        <div className="penalty-quote">
          "The weak do not choose their path. Only those who rise from defeat earn the right to grow."
        </div>

        <button className="penalty-close-btn" onClick={handleDismiss}>
          ACKNOWLEDGE
        </button>
      </div>

      <style>{`
        .penalty-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.88);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .penalty-modal {
          background: #0a0a0f;
          border: 2px solid #ff2222;
          border-radius: 12px;
          padding: 32px 28px;
          max-width: 420px;
          width: calc(100vw - 48px);
          text-align: center;
          font-family: 'Orbitron', monospace;
          box-shadow: 0 0 60px rgba(255,34,34,0.3);
          animation: popIn 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes popIn {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .penalty-icon {
          font-size: 52px;
          margin-bottom: 12px;
          animation: shake 0.6s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-6px); }
          40%,80%  { transform: translateX(6px); }
        }
        .penalty-title {
          font-size: 18px;
          letter-spacing: 5px;
          color: #ff2222;
          margin: 0 0 6px 0;
        }
        .penalty-subtitle {
          font-size: 11px;
          letter-spacing: 2px;
          color: #ff8888;
          margin: 0 0 20px 0;
        }
        .penalty-list {
          text-align: left;
          background: rgba(255,34,34,0.08);
          border: 1px solid rgba(255,34,34,0.25);
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 16px;
        }
        .penalty-item {
          display: flex;
          gap: 8px;
          font-size: 11px;
          color: #ffaaaa;
          margin-bottom: 6px;
          letter-spacing: 1px;
          line-height: 1.4;
        }
        .penalty-item:last-child { margin-bottom: 0; }
        .penalty-bullet { color: #ff4444; flex-shrink: 0; }
        .penalty-lock-warning {
          background: rgba(255,0,0,0.15);
          border: 1px solid #ff4444;
          border-radius: 6px;
          padding: 12px;
          font-size: 11px;
          color: #ff6666;
          letter-spacing: 1px;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .lock-date {
          color: #ff2222;
          font-size: 13px;
          font-weight: 700;
        }
        .penalty-quote {
          font-size: 10px;
          color: #555;
          font-style: italic;
          font-family: serif;
          letter-spacing: 0.5px;
          line-height: 1.6;
          margin-bottom: 22px;
          padding: 0 8px;
        }
        .penalty-close-btn {
          background: #ff2222;
          border: none;
          color: #fff;
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          letter-spacing: 3px;
          padding: 12px 28px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
          font-weight: 700;
        }
        .penalty-close-btn:hover { background: #ff5555; }
      `}</style>
    </div>
  );
}
