import React from "react";
import { TEAMS } from "../../data/teams.js";
import "./KnockoutMatch.css";

export default function KnockoutMatch({ match, result, onScoreChange, onSimulate, matchNum }) {

  const homeTeamName = match.homeTeam || "TBD";
  const awayTeamName = match.awayTeam || "TBD";
  const homeFlag = match.homeTeam ? TEAMS[match.homeTeam]?.flag : "";
  const awayFlag = match.awayTeam ? TEAMS[match.awayTeam]?.flag : "";

  const handleHomeChange = (e) => {
    onScoreChange(matchNum, e.target.value, result.awayGoals, result.penaltyWinner);
  };

  const handleAwayChange = (e) => {
    onScoreChange(matchNum, result.homeGoals, e.target.value, result.penaltyWinner);
  };

  const handlePenaltyWinner = (winner) => {
    onScoreChange(matchNum, result.homeGoals, result.awayGoals, winner);
  };

  const isScoresEntered = result.homeGoals !== null && result.awayGoals !== null;
  const isTied = isScoresEntered && result.homeGoals === result.awayGoals;
  const isTBD = !match.homeTeam || !match.awayTeam;

  return (
    <div className="knockout-match">
      <div className="match-container">
        <div className="team-block">
          <div className={`team-name ${isTBD ? "tbd" : ""}`}>{homeFlag} {homeTeamName}</div>
          <input
            type="number"
            min="0"
            max="20"
            value={result.homeGoals ?? ""}
            onChange={handleHomeChange}
            disabled={isTBD}
            placeholder="-"
            className="score-input"
          />
        </div>

        <div className="vs-label">vs</div>

        <div className="team-block">
          <input
            type="number"
            min="0"
            max="20"
            value={result.awayGoals ?? ""}
            onChange={handleAwayChange}
            disabled={isTBD}
            placeholder="-"
            className="score-input"
          />
          <div className={`team-name ${isTBD ? "tbd" : ""}`}>{awayFlag} {awayTeamName}</div>
        </div>

        {isScoresEntered && (
          <button
            className="simulate-btn"
            onClick={() => onSimulate(matchNum)}
            title="Re-simulate this match"
          >
            🔄
          </button>
        )}
        {!isScoresEntered && !isTBD && (
          <button className="simulate-btn" onClick={() => onSimulate(matchNum)} title="Simulate match">
            🎲
          </button>
        )}
      </div>

      {isTied && isScoresEntered && (
        <div className="penalties-section">
          <label>Penalties:</label>
          <div className="penalty-buttons">
            <button
              className={`penalty-btn ${result.penaltyWinner === "home" ? "selected" : ""}`}
              onClick={() => handlePenaltyWinner("home")}
            >
              {homeFlag} {homeTeamName} Wins
            </button>
            <button
              className={`penalty-btn ${result.penaltyWinner === "away" ? "selected" : ""}`}
              onClick={() => handlePenaltyWinner("away")}
            >
              {awayFlag} {awayTeamName} Wins
            </button>
            <button className="penalty-btn simulate-penalty" onClick={() => onSimulate(matchNum)}>
              🎲 Simulate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
