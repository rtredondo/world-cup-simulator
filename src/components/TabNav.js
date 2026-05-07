import React from "react";
import "./TabNav.css";

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="tab-nav">
      <button
        className={`tab-button ${activeTab === "groups" ? "active" : ""}`}
        onClick={() => onTabChange("groups")}
      >
        Group Stage ⚽
      </button>
      <button
        className={`tab-button ${activeTab === "knockout" ? "active" : ""}`}
        onClick={() => onTabChange("knockout")}
      >
        Knockout Bracket 🏆
      </button>
    </div>
  );
}
