import React from "react";
import { TEAMS } from "../../data/teams.js";
import "./MatchRow.css";

const TEAM_CODES = {
  "Mexico": "MEX", "South Africa": "ZAF", "South Korea": "KOR",
  "Czech Republic": "CZE", "Canada": "CAN", "Bosnia and Herzegovina": "BIH",
  "Qatar": "QAT", "Switzerland": "CHE", "Brazil": "BRA", "Morocco": "MAR",
  "Haiti": "HTI", "Scotland": "SCO", "United States": "USA", "Paraguay": "PRY",
  "Australia": "AUS", "Turkey": "TUR", "Germany": "DEU", "Curaçao": "CUW",
  "Ivory Coast": "CIV", "Ecuador": "ECU", "Netherlands": "NLD", "Japan": "JPN",
  "Sweden": "SWE", "Tunisia": "TUN", "Belgium": "BEL", "Egypt": "EGY",
  "Iran": "IRN", "New Zealand": "NZL", "Spain": "ESP", "Cape Verde": "CPV",
  "Saudi Arabia": "SAU", "Uruguay": "URY", "France": "FRA", "Senegal": "SEN",
  "Iraq": "IRQ", "Norway": "NOR", "Argentina": "ARG", "Algeria": "DZA",
  "Austria": "AUT", "Jordan": "JOR", "Portugal": "PRT", "DR Congo": "COD",
  "Uzbekistan": "UZB", "Colombia": "COL", "England": "ENG", "Croatia": "HRV",
  "Ghana": "GHA", "Panama": "PAN"
};

export default function MatchRow({ match, onScoreChange, onSimulate }) {
  const handleHomeChange = (e) => {
    onScoreChange(match.matchId, e.target.value, match.awayGoals);
  };

  const handleAwayChange = (e) => {
    onScoreChange(match.matchId, match.homeGoals, e.target.value);
  };

  return (
    <div className="match-row">
      <span className="flag" title={match.homeTeam}>{TEAMS[match.homeTeam]?.flag}</span>
      <span className="team-code" title={match.homeTeam}>{TEAM_CODES[match.homeTeam]}</span>

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

      <span className="team-code" title={match.awayTeam}>{TEAM_CODES[match.awayTeam]}</span>
      <span className="flag" title={match.awayTeam}>{TEAMS[match.awayTeam]?.flag}</span>

      <button className="simulate-btn" onClick={() => onSimulate(match.matchId)} title="Simulate score">
        🎲
      </button>
    </div>
  );
}
