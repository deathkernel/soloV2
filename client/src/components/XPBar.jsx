import { RANK_THRESHOLDS, getNextRankThreshold } from "../utils/rankTheme";

function XPBar({ xp, rank }) {
  const next    = getNextRankThreshold(rank);
  const current = RANK_THRESHOLDS.find(r => r.rank === rank);
  const curXP   = current?.xp ?? 0;
  const nextXP  = next?.xp ?? curXP;
  const pct     = nextXP > curXP
    ? Math.min(((xp - curXP) / (nextXP - curXP)) * 100, 100)
    : 100;
  const toNext  = next ? Math.max(0, nextXP - xp) : 0;

  return (
    <>
      <div className="xp-row">
        <span className="xp-value">
          {xp.toLocaleString()}
          <span style={{fontSize:9,color:"var(--white-dim)",letterSpacing:2,marginLeft:6}}>XP</span>
        </span>
        {next && <span className="xp-next">NEXT: {next.rank}</span>}
      </div>
      <div className="xp-track">
        <div className="xp-fill" style={{width:`${pct}%`}} />
      </div>
      <div className="xp-caption">
        {next
          ? `${toNext.toLocaleString()} XP TO RANK ${next.rank}`
          : "MAX RANK — SHADOW MONARCH"}
      </div>
    </>
  );
}
export default XPBar;