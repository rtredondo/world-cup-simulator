import React from "react";
import "./StandingsTable.css";

export default function StandingsTable({ standings, groupLetter, qualifiedThirds }) {
  return (
    <div className="standings-table">
      <h3>Group {groupLetter}</h3>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
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
          {standings.map((row) => (
            <tr
              key={row.team}
              className={
                row.position <= 2 ? "qualified-1" : qualifiedThirds?.includes(row.team) ? "qualified-3" : ""
              }
            >
              <td>{row.position}</td>
              <td className="team-cell">{row.team}</td>
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
  );
}
