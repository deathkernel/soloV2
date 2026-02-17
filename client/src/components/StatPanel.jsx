function StatPanel({ user }) {
  const stats = [
    { key: "STRENGTH",  val: user.str },
    { key: "AGILITY",   val: user.agi },
    { key: "STAMINA",   val: user.sta },
  ];
  return (
    <div className="sys-panel sys-panel-inner">
      <div className="sys-label">STATS</div>
      {stats.map(s => (
        <div key={s.key} className="stat-row">
          <span className="stat-row-name">{s.key}</span>
          <span className="stat-row-value">{s.val}</span>
        </div>
      ))}
    </div>
  );
}
export default StatPanel;