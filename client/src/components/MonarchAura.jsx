function MonarchAura({ monarch }) {
  if (!monarch) return null;

  return (
    <div className={`aura aura-${monarch}`}>
      {[...Array(40)].map((_, i) => (
        <span key={i}></span>
      ))}
    </div>
  );
}

export default MonarchAura;
