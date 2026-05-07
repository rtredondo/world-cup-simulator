import React, { useMemo } from "react";
import { R32_MATCHES, R16_MATCHES, QF_MATCHES, SF_MATCHES, FINAL_MATCHES } from "../../data/bracketSlots.js";
import BracketRound from "./BracketRound.js";
import "./KnockoutBracket.css";

export default function KnockoutBracket({
  populatedBracket,
  knockoutResults,
  onScoreChange,
  onSimulate,
  onReset,
  advancedTeams,
  slotAssignment,
  champion,
  onShowChampion,
}) {
  // Organize bracket by round
  const rounds = useMemo(() => {
    return [
      {
        name: "Round of 32",
        matchNums: R32_MATCHES.map((m) => m.matchNum),
      },
      {
        name: "Round of 16",
        matchNums: R16_MATCHES.map((m) => m.matchNum),
      },
      {
        name: "Quarter-Finals",
        matchNums: QF_MATCHES.map((m) => m.matchNum),
      },
      {
        name: "Semi-Finals",
        matchNums: SF_MATCHES.map((m) => m.matchNum),
      },
      {
        name: "Final 🏆",
        matchNums: [...FINAL_MATCHES.map((m) => m.matchNum)],
      },
    ];
  }, []);

  return (
    <div className="knockout-bracket-container">
      <div className="knockout-header">
        <h1>2026 FIFA World Cup - Knockout Bracket</h1>
        <div className="header-buttons">
          {champion && (
            <button className="champion-button" onClick={onShowChampion}>
              🏆 View Champion
            </button>
          )}
          <button className="reset-button" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="bracket-scroll">
        <div className="bracket-content">
          {rounds.map((round, idx) => {
            const matches = round.matchNums.map((matchNum) => ({
              matchNum,
              ...populatedBracket[matchNum],
            }));

            return (
              <BracketRound
                key={round.name}
                roundName={round.name}
                matches={matches}
                results={knockoutResults}
                onScoreChange={onScoreChange}
                onSimulate={onSimulate}
              />
            );
          })}
        </div>
      </div>

      <div className="bracket-legend">
        <p>💡 Enter scores for group stage matches to populate the bracket</p>
        <p>🎲 Use the simulate button to generate random scores</p>
        <p>⚽ Once group stage is complete, all 32 R32 matches will be populated</p>
      </div>
    </div>
  );
}
