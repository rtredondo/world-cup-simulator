import React, { useState, useMemo } from "react";
import { GROUPS, GROUP_FIXTURE_PAIRS } from "./data/teams.js";
import { R32_MATCHES, R16_MATCHES, QF_MATCHES, SF_MATCHES, FINAL_MATCHES } from "./data/bracketSlots.js";
import { computeAllGroupStandings } from "./utils/standings.js";
import { getAdvancedTeams } from "./utils/advancement.js";
import { assignThirdPlaceSlots, populateBracket } from "./utils/bracketAssignment.js";
import { simulateScore, simulatePenalties } from "./utils/simulation.js";
import TabNav from "./components/TabNav.js";
import GroupStage from "./components/GroupStage/GroupStage.js";
import KnockoutBracket from "./components/Knockout/KnockoutBracket.js";
import ChampionCelebration from "./components/Champion/ChampionCelebration.js";
import "./App.css";

function App() {
  // Initialize group results (72 matches total: 12 groups × 6 matches)
  const [groupResults, setGroupResults] = useState(() => {
    const results = {};
    Object.entries(GROUPS).forEach(([group, teams]) => {
      GROUP_FIXTURE_PAIRS.forEach(([i, j], fixtureIdx) => {
        const matchId = `${group}_${fixtureIdx}`;
        results[matchId] = {
          matchId,
          group,
          homeTeam: teams[i],
          awayTeam: teams[j],
          homeGoals: null,
          awayGoals: null,
        };
      });
    });
    return results;
  });

  // Initialize knockout results (30 matches: R32 through Final)
  const [knockoutResults, setKnockoutResults] = useState(() => {
    const results = {};
    const allMatches = [...R32_MATCHES, ...R16_MATCHES, ...QF_MATCHES, ...SF_MATCHES, ...FINAL_MATCHES];
    allMatches.forEach(({matchNum}) => {
      results[matchNum] = {
        matchNum,
        homeTeam: null,
        awayTeam: null,
        homeGoals: null,
        awayGoals: null,
        penaltyWinner: null,
      };
    });
    return results;
  });

  const [activeTab, setActiveTab] = useState("groups");
  const [showChampionCelebration, setShowChampionCelebration] = useState(false);

  // Derived state: group standings
  const groupStandings = useMemo(() => computeAllGroupStandings(groupResults), [groupResults]);

  // Derived state: advanced teams (firsts, seconds, qualified thirds)
  const advancedTeams = useMemo(() => getAdvancedTeams(groupStandings), [groupStandings]);

  // Derived state: third-place slot assignments
  const slotAssignment = useMemo(() => assignThirdPlaceSlots(advancedTeams), [advancedTeams]);

  // Derived state: fully populated bracket
  const populatedBracket = useMemo(() => populateBracket(advancedTeams, slotAssignment, knockoutResults), [advancedTeams, slotAssignment, knockoutResults]);

  // Derived state: determine champion (winner of Final match 104)
  const champion = useMemo(() => {
    const finalMatch = populatedBracket[104];
    const finalResult = knockoutResults[104];
    if (!finalMatch || !finalResult || finalResult.homeGoals === null || finalResult.awayGoals === null) {
      return null;
    }
    if (finalResult.homeGoals > finalResult.awayGoals) {
      return finalMatch.homeTeam;
    } else if (finalResult.awayGoals > finalResult.homeGoals) {
      return finalMatch.awayTeam;
    } else if (finalResult.penaltyWinner === "home") {
      return finalMatch.homeTeam;
    } else if (finalResult.penaltyWinner === "away") {
      return finalMatch.awayTeam;
    }
    return null;
  }, [populatedBracket, knockoutResults]);

  // Handler: update group match score
  const handleGroupScore = (matchId, homeGoals, awayGoals) => {
    setGroupResults((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        homeGoals: homeGoals === "" ? null : parseInt(homeGoals),
        awayGoals: awayGoals === "" ? null : parseInt(awayGoals),
      },
    }));
  };

  // Handler: simulate group match
  const handleSimulateMatch = (matchId) => {
    const match = groupResults[matchId];
    const {homeGoals, awayGoals} = simulateScore(match.homeTeam, match.awayTeam);
    setGroupResults((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        homeGoals,
        awayGoals,
      },
    }));
  };

  // Handler: simulate all group matches
  const handleSimulateAllGroups = () => {
    const newResults = {...groupResults};
    Object.keys(newResults).forEach((matchId) => {
      const match = newResults[matchId];
      if (match.homeGoals === null || match.awayGoals === null) {
        const {homeGoals, awayGoals} = simulateScore(match.homeTeam, match.awayTeam);
        newResults[matchId] = {...match, homeGoals, awayGoals};
      }
    });
    setGroupResults(newResults);
  };

  // Handler: update knockout match score
  const handleKnockoutScore = (matchNum, homeGoals, awayGoals, penaltyWinner) => {
    setKnockoutResults((prev) => ({
      ...prev,
      [matchNum]: {
        ...prev[matchNum],
        homeGoals: homeGoals === "" ? null : parseInt(homeGoals),
        awayGoals: awayGoals === "" ? null : parseInt(awayGoals),
        penaltyWinner,
      },
    }));
  };

  // Handler: simulate knockout match
  const handleSimulateKnockout = (matchNum) => {
    const bracketMatch = populatedBracket[matchNum];
    if (!bracketMatch || !bracketMatch.homeTeam || !bracketMatch.awayTeam) return;

    const {homeGoals, awayGoals} = simulateScore(bracketMatch.homeTeam, bracketMatch.awayTeam);
    let penaltyWinner = null;
    if (homeGoals === awayGoals) {
      penaltyWinner = simulatePenalties();
    }

    setKnockoutResults((prev) => ({
      ...prev,
      [matchNum]: {
        ...prev[matchNum],
        homeGoals,
        awayGoals,
        penaltyWinner,
      },
    }));
  };

  // Handler: reset tournament
  const handleReset = () => {
    if (window.confirm("Reset all match results?")) {
      setGroupResults((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, match]) => [
            key,
            {...match, homeGoals: null, awayGoals: null},
          ])
        )
      );
      setKnockoutResults((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, match]) => [
            key,
            {...match, homeGoals: null, awayGoals: null, penaltyWinner: null},
          ])
        )
      );
    }
  };

  return (
    <div className="App">
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="app-container">
        {activeTab === "groups" ? (
          <GroupStage
            groupResults={groupResults}
            groupStandings={groupStandings}
            thirdRankings={advancedTeams.thirdRankings}
            qualifiedThirds={advancedTeams.qualifiedThirds}
            onScoreChange={handleGroupScore}
            onSimulateMatch={handleSimulateMatch}
            onSimulateAll={handleSimulateAllGroups}
            onReset={handleReset}
          />
        ) : (
          <KnockoutBracket
            populatedBracket={populatedBracket}
            knockoutResults={knockoutResults}
            onScoreChange={handleKnockoutScore}
            onSimulate={handleSimulateKnockout}
            onReset={handleReset}
            advancedTeams={advancedTeams}
            slotAssignment={slotAssignment}
            champion={champion}
            onShowChampion={() => setShowChampionCelebration(true)}
          />
        )}
      </div>

      {showChampionCelebration && champion && (
        <ChampionCelebration
          winner={champion}
          onDismiss={() => setShowChampionCelebration(false)}
        />
      )}
    </div>
  );
}

export default App;
