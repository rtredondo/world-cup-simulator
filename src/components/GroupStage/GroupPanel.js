import React from "react";
import StandingsTable from "./StandingsTable.js";
import MatchRow from "./MatchRow.js";
import "./GroupPanel.css";

export default function GroupPanel({
  groupLetter,
  matches,
  standings,
  onScoreChange,
  onSimulate,
  qualifiedThirds,
}) {
  return (
    <div className="group-panel">
      <StandingsTable standings={standings} groupLetter={groupLetter} qualifiedThirds={qualifiedThirds} />
      <div className="matches-section">
        <h4>Matches</h4>
        {matches.map((match) => (
          <MatchRow key={match.matchId} match={match} onScoreChange={onScoreChange} onSimulate={onSimulate} />
        ))}
      </div>
    </div>
  );
}
