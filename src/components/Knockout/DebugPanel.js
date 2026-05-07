import React, { useState } from "react";
import "./DebugPanel.css";

export default function DebugPanel({ advancedTeams, slotAssignment }) {
  const [isOpen, setIsOpen] = useState(false);
  const { thirdRankings } = advancedTeams;

  if (!thirdRankings || thirdRankings.length === 0) {
    return null;
  }

  // Create a mapping of team to bracket slot
  const slotAssignmentReverse = {};
  Object.entries(slotAssignment).forEach(([slotNum, team]) => {
    slotAssignmentReverse[team] = parseInt(slotNum);
  });

  return (
    <div className="debug-panel">
      <button className="debug-toggle" onClick={() => setIsOpen(!isOpen)}>
        🔍 {isOpen ? "Hide" : "Show"} Annexe C Debug Info
      </button>

      {isOpen && (
        <div className="debug-content">
          <h3>Third-Place Teams & Bracket Assignment</h3>

          <div className="debug-section">
            <h4>Qualified Third-Place Teams (Top 8)</h4>
            <table className="debug-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Group</th>
                  <th>Team</th>
                  <th>Points</th>
                  <th>Bracket Slot</th>
                </tr>
              </thead>
              <tbody>
                {thirdRankings.slice(0, 8).map((row, idx) => {
                  const slotNum = slotAssignmentReverse[row.team];
                  return (
                    <tr key={row.team} className="qualified">
                      <td>{idx + 1}</td>
                      <td className="group-badge">{row.group}</td>
                      <td className="team-name">{row.team}</td>
                      <td>{row.points}</td>
                      <td className="slot-match">
                        {slotNum ? `M${slotNum}` : "TBD"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="debug-section">
            <h4>Eliminated Third-Place Teams (Ranked 9-12)</h4>
            <table className="debug-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Group</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {thirdRankings.slice(8, 12).map((row, idx) => (
                  <tr key={row.team} className="eliminated">
                    <td>{idx + 9}</td>
                    <td className="group-badge">{row.group}</td>
                    <td className="team-name">{row.team}</td>
                    <td>{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="debug-legend">
            <p>
              <strong>Annexe C Assignment:</strong> The 8 qualified third-place teams are assigned to R32 slots (M74, M77, M79, M80, M81, M82, M85, M87) using the official FIFA Annexe C lookup table. This direct mapping ensures exact compliance with World Cup regulations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
