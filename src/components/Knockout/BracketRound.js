import React from "react";
import KnockoutMatch from "./KnockoutMatch.js";
import "./BracketRound.css";

export default function BracketRound({ roundName, matches, results, onScoreChange, onSimulate }) {
  const handleSimulateRound = () => {
    matches.forEach((match) => {
      const result = results[match.matchNum];
      // Only simulate if match hasn't been played yet
      if (result.homeGoals === null || result.awayGoals === null) {
        onSimulate(match.matchNum);
      }
    });
  };

  const unplayedCount = matches.filter(
    (m) => results[m.matchNum].homeGoals === null || results[m.matchNum].awayGoals === null
  ).length;

  return (
    <div className="bracket-round">
      <div className="round-header">
        <div className="round-label">{roundName}</div>
        {unplayedCount > 0 && (
          <button className="simulate-round-btn" onClick={handleSimulateRound}>
            🎲 Simulate Round
          </button>
        )}
      </div>
      <div className="matches-column">
        {matches.map((match) => (
          <div key={match.matchNum} className="match-wrapper">
            <KnockoutMatch
              match={match}
              result={results[match.matchNum]}
              onScoreChange={onScoreChange}
              onSimulate={onSimulate}
              matchNum={match.matchNum}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
