import React, { useState, useMemo, useEffect } from "react";
import { GROUPS, GROUP_FIXTURE_PAIRS } from "./data/teams.js";
import { R32_MATCHES, R16_MATCHES, QF_MATCHES, SF_MATCHES, FINAL_MATCHES } from "./data/bracketSlots.js";
import { computeAllGroupStandings } from "./utils/standings.js";
import { getAdvancedTeams } from "./utils/advancement.js";
import { assignThirdPlaceSlots, populateBracket } from "./utils/bracketAssignment.js";
import { simulateScore, simulatePenalties } from "./utils/simulation.js";
import { logSimulation } from "./utils/logger.js";
import Hero from "./components/Hero.js";
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

  // Check if at least one match has been played in every group
  const hasGroupMatchesBeenPlayed = useMemo(() => {
    const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    return groups.every((group) => {
      return Object.values(groupResults).some(
        (match) =>
          match.group === group &&
          match.homeGoals !== null &&
          match.awayGoals !== null
      );
    });
  }, [groupResults]);

  // Derived state: fully populated bracket (only if at least one match has been played in each group)
  const populatedBracket = useMemo(() => {
    if (!hasGroupMatchesBeenPlayed) {
      return {};
    }
    return populateBracket(advancedTeams, slotAssignment, knockoutResults);
  }, [advancedTeams, slotAssignment, knockoutResults, hasGroupMatchesBeenPlayed]);

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

  // Auto-trigger champion celebration when a winner is determined
  useEffect(() => {
    if (champion) {
      setShowChampionCelebration(true);

      // Log simulation to Google Sheets silently
      try {
        const finalMatch = populatedBracket[104];

        // Determine runner-up
        let runnerUp = null;
        if (finalMatch) {
          runnerUp = champion === finalMatch.homeTeam ? finalMatch.awayTeam : finalMatch.homeTeam;
        }

        // Get semi-finalists
        const sf1Match = populatedBracket[101];
        const sf2Match = populatedBracket[102];
        const sf1Result = knockoutResults[101];
        const sf2Result = knockoutResults[102];

        let sf1 = null;
        let sf2 = null;

        if (sf1Match && sf1Result) {
          sf1 = sf1Result.homeGoals > sf1Result.awayGoals || sf1Result.penaltyWinner === "home"
            ? sf1Match.awayTeam
            : sf1Match.homeTeam;
        }

        if (sf2Match && sf2Result) {
          sf2 = sf2Result.homeGoals > sf2Result.awayGoals || sf2Result.penaltyWinner === "home"
            ? sf2Match.awayTeam
            : sf2Match.homeTeam;
        }

        // Log the simulation
        logSimulation({
          champion,
          runnerUp,
          sf1,
          sf2,
          groups: advancedTeams.firsts || {}
        });
      } catch (e) {
        // Fail silently
      }
    }
  }, [champion, populatedBracket, knockoutResults, advancedTeams]);

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
      <Hero />
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
