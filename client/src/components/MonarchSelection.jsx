import axios from "../api/axios";

const monarchs = [
  "Antares",
  "Ashborn",
  "Baran",
  "Sillad",
  "Rakan",
  "Querehsha",
  "Legia",
  "Tarnak",
  "Yogumunt"
];

function MonarchSelection({ refresh }) {

  const choose = async (name) => {
    await axios.post("/workout/choose-monarch", { monarch: name });
    refresh();
  };

  return (
    <div className="monarch-grid">
      {monarchs.map(name => (
        <div key={name} className="monarch-card" onClick={() => choose(name)}>
          {name}
        </div>
      ))}
    </div>
  );
}

export default MonarchSelection;
