import React from "react";

// Stat display names and icons
const STAT_CONFIG = [
  { key: "str", label: "STR", icon: "⚔️",  color: "#ff4444", title: "Strength" },
  { key: "agi", label: "AGI", icon: "💨",  color: "#44aaff", title: "Agility"  },
  { key: "sta", label: "STA", icon: "🛡️",  color: "#44ff88", title: "Stamina"  },
  { key: "sen", label: "SEN", icon: "👁️",  color: "#cc88ff", title: "Sensing"  },
];

export default function StatPanel({ stats = {} }) {
  return (
    <div className="stat-panel">
      <h3 className="panel-title">HUNTER STATS</h3>
      <div className="stat-grid">
        {STAT_CONFIG.map(({ key, label, icon, color, title }) => (
          <div className="stat-item" key={key} title={title}>
            <span className="stat-icon">{icon}</span>
            <div className="stat-info">
              <span className="stat-label" style={{ color }}>{label}</span>
              <span className="stat-value">{stats[key] ?? 0}</span>
            </div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill"
                style={{
                  width: `${Math.min(100, (stats[key] || 0) * 2)}%`,
                  background: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .stat-panel {
          background: rgba(0,0,0,0.6);
          border: 1px solid var(--rank-color, #4af);
          border-radius: 8px;
          padding: 16px;
          font-family: 'Orbitron', monospace;
        }
        .panel-title {
          font-size: 11px;
          letter-spacing: 3px;
          color: var(--rank-color, #4af);
          margin: 0 0 14px 0;
          opacity: 0.8;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .stat-icon { font-size: 18px; flex-shrink: 0; }
        .stat-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        .stat-label {
          font-size: 9px;
          letter-spacing: 2px;
          font-weight: 700;
        }
        .stat-value {
          font-size: 20px;
          color: #fff;
          line-height: 1.1;
        }
        .stat-bar-track {
          display: none; /* hidden by default, can enable */
        }
      `}</style>
    </div>
  );
}
