import React from "react";
import "./MatchRow.css";

export default function MatchRow({ match, onScoreChange, onSimulate }) {
  const handleHomeChange = (e) => {
    onScoreChange(match.matchId, e.target.value, match.awayGoals);
  };

  const handleAwayChange = (e) => {
    onScoreChange(match.matchId, match.homeGoals, e.target.value);
  };

  return (
    <div className="match-row">
      <div className="match-teams">
        <span className="team-name">{match.homeTeam}</span>
        <span className="vs">vs</span>
        <span className="team-name">{match.awayTeam}</span>
      </div>
      <div className="match-scores">
        <input
          type="number"
          min="0"
          max="20"
          value={match.homeGoals ?? ""}
          onChange={handleHomeChange}
          placeholder="-"
        />
        <span className="score-separator">-</span>
        <input
          type="number"
          min="0"
          max="20"
          value={match.awayGoals ?? ""}
          onChange={handleAwayChange}
          placeholder="-"
        />
      </div>
      <button className="simulate-btn" onClick={() => onSimulate(match.matchId)} title="Simulate score">
        🎲
      </button>
    </div>
  );
}
