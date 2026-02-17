function RankUpOverlay({ rank, onClose }) {
  return (
    <div className="ru-overlay" onClick={onClose}>
      <div className="ru-box" onClick={e => e.stopPropagation()}>
        <div className="ru-system">▸ SYSTEM NOTIFICATION ◂</div>
        <div className="ru-title">RANK UP</div>
        <div className="ru-rank">RANK {rank}</div>
        <button className="btn btn-primary" style={{maxWidth:200,margin:"0 auto"}} onClick={onClose}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}
export default RankUpOverlay;