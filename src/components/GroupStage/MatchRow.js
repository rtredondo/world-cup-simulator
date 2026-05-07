import React from "react";
import { TEAMS } from "../../data/teams.js";
import "./MatchRow.css";

export default function MatchRow({ match, onScoreChange, onSimulate }) {
  const handleHomeChange = (e) => {
    onScoreChange(match.matchId, e.target.value, match.awayGoals);
  };

  const handleAwayChange = (e) => {
    onScoreChange(match.matchId, match.homeGoals, e.target.value);
  };

  const getShortName = (fullName) => {
    // Return first 8 characters or full name if shorter
    return fullName.length > 8 ? fullName.substring(0, 8) : fullName;
  };

  return (
    <div className="match-row">
      <div className="team-box home">
        <span className="flag">{TEAMS[match.homeTeam]?.flag}</span>
        <span className="short-name" title={match.homeTeam}>{getShortName(match.homeTeam)}</span>
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

      <div className="team-box away">
        <span className="short-name" title={match.awayTeam}>{getShortName(match.awayTeam)}</span>
        <span className="flag">{TEAMS[match.awayTeam]?.flag}</span>
      </div>

      <button className="simulate-btn" onClick={() => onSimulate(match.matchId)} title="Simulate score">
        🎲
      </button>
    </div>
  );
}
