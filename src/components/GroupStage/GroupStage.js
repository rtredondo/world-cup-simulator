import React from "react";
import { GROUPS } from "../../data/teams.js";
import GroupPanel from "./GroupPanel.js";
import ThirdPlaceRankings from "./ThirdPlaceRankings.js";
import "./GroupStage.css";

export default function GroupStage({
  groupResults,
  groupStandings,
  thirdRankings,
  qualifiedThirds,
  onScoreChange,
  onSimulateMatch,
  onSimulateAll,
  onReset,
}) {
  const groupLetters = Object.keys(GROUPS).sort();

  return (
    <div className="group-stage">
      <div className="group-stage-header">
        <h1>2026 FIFA World Cup - Group Stage</h1>
        <div className="header-buttons">
          <button className="simulate-btn" onClick={onSimulateAll}>
            Simulate All Groups
          </button>
          <button className="reset-button" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="groups-grid">
        {groupLetters.map((group) => {
          const matches = Object.values(groupResults).filter((m) => m.group === group);
          const standings = groupStandings[group] || [];
          return (
            <GroupPanel
              key={group}
              groupLetter={group}
              matches={matches}
              standings={standings}
              onScoreChange={onScoreChange}
              onSimulate={onSimulateMatch}
              qualifiedThirds={qualifiedThirds}
            />
          );
        })}
      </div>

      <ThirdPlaceRankings thirdRankings={thirdRankings} qualifiedThirds={qualifiedThirds} />
    </div>
  );
}
