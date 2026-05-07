import React from "react";
import { TEAMS } from "../../data/teams.js";
import "./ThirdPlaceRankings.css";

export default function ThirdPlaceRankings({ thirdRankings, qualifiedThirds }) {
  return (
    <div className="third-place-section">
      <h2>Third-Place Teams Ranking</h2>
      <div className="third-place-container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Group</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {thirdRankings.map((row, idx) => (
              <tr key={row.team} className={idx < 8 ? "qualified-3" : ""}>
                <td>{idx + 1}</td>
                <td className="group-cell">{row.group}</td>
                <td className="team-cell">{TEAMS[row.team]?.flag} {row.team}</td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td>{row.goalsFor - row.goalsAgainst}</td>
                <td className="points-cell">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="legend">
        <p>🟢 Teams ranked 1-8 qualify for the knockout bracket</p>
        <p>🔴 Teams ranked 9-12 are eliminated</p>
      </div>
    </div>
  );
}
