function CPMeter({ cp }) {
  const pct = Math.min((cp / 1000) * 100, 100);
  return (
    <>
      <div className="cp-number">{cp.toLocaleString()}</div>
      <div className="cp-unit">COMBAT POWER</div>
      <div className="cp-track">
        <div className="cp-fill" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:8, letterSpacing:2, color:"var(--white-dim)" }}>
        <span>0</span><span>{pct.toFixed(1)}%</span><span>1000</span>
      </div>
    </>
  );
}
export default CPMeter;