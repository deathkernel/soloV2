import axios from "../api/axios";

function WorkoutCard({ refresh }) {
  const completeWorkout = async () => {
    await api.post
("/workout/complete");
    refresh();
  };

  return (
    <div className="panel">
      <h3 className="glow-text">Daily Training</h3>
      <button className="button-hud" onClick={completeWorkout}>
        Complete Workout
      </button>
    </div>
  );
}

export default WorkoutCard;
