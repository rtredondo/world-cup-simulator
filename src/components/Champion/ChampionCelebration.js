import React, { useState } from "react";
import { TEAMS } from "../../data/teams.js";
import "./ChampionCelebration.css";

const CHAMPION_EXTRA_IMAGES = {
  "Argentina": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQENlx6vdYsfx-NuTTbcv08qQw-KD40K9tISg&s",
  "Brazil": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyCczKnn_MuqxH4b-aQWNtYLHDadG_z3EPYw&s",
  "Portugal": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9EijjpibhwN9wfPHb59wkOezoOzGIf-8vwQ&s"
};

export default function ChampionCelebration({ winner, onDismiss }) {
  const [isShowing, setIsShowing] = useState(true);

  if (!isShowing || !winner) {
    return null;
  }

  const handleDismiss = () => {
    setIsShowing(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const winnerFlag = TEAMS[winner]?.flag || "🏆";

  const confettiPieces = Array.from({ length: 50 }, (_, i) => (
    <div key={`confetti-${i}`} className="confetti" style={{
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
      duration: `${2 + Math.random() * 2}s`,
    }} />
  ));

  const fireworks = Array.from({ length: 8 }, (_, i) => (
    <div key={`firework-${i}`} className="firework" style={{
      '--angle': `${(i * 45)}deg`,
    }} />
  ));

  return (
    <div className="champion-overlay">
      <button className="close-btn" onClick={handleDismiss} title="Close">
        ✕
      </button>

      <div className="confetti-container">
        {confettiPieces}
      </div>

      <div className="champion-content">
        <div className="fireworks-container">
          {fireworks}
        </div>

        <div className="trophy-flag-row">
          <div className="trophy-bounce">
            🏆
          </div>
          <div className="winner-flag">
            {winnerFlag}
          </div>
        </div>

        <h1 className="winner-name">{winner}</h1>

        <h2 className="champion-text">FIFA World Cup 2026 Champions!</h2>

        {CHAMPION_EXTRA_IMAGES[winner] && (
          <img
            src={CHAMPION_EXTRA_IMAGES[winner]}
            alt={winner}
            className="champion-extra-img"
          />
        )}
      </div>
    </div>
  );
}
