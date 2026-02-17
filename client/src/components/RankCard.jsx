function RankCard({ user }) {
  return (
    <div className="panel">
      <h2 className="glow-text">Rank: {user.rank}</h2>
      <p>XP: {user.xp}</p>
    </div>
  );
}

export default RankCard;
