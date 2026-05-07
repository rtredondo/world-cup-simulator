import React from "react";
import KnockoutMatch from "./KnockoutMatch.js";
import "./BracketRound.css";

export default function BracketRound({ roundName, matches, results, onScoreChange, onSimulate }) {
  return (
    <div className="bracket-round">
      <div className="round-label">{roundName}</div>
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
