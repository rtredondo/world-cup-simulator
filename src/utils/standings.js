import { TEAMS } from "../data/teams.js";

// Compute standings for a single group with full FIFA tiebreaker rules
export function computeGroupStandings(groupLetter, groupResults) {
  const groupMatches = Object.values(groupResults).filter((m) => m.group === groupLetter);
  const groupTeams = [...new Set(groupMatches.flatMap((m) => [m.homeTeam, m.awayTeam]))];

  // Build raw stats
  const stats = {};
  groupTeams.forEach((team) => {
    stats[team] = {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      yellowCards: 0,
      redCards: 0,
      fifaRanking: TEAMS[team]?.fifaRanking || 999,
    };
  });

  // Apply match results
  groupMatches.forEach((match) => {
    if (match.homeGoals === null || match.awayGoals === null) return; // Not played

    const home = stats[match.homeTeam];
    const away = stats[match.awayTeam];

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.awayGoals > match.homeGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      home.points += 1;
      away.drawn += 1;
      away.points += 1;
    }
  });

  // Build standings array
  let standing = Object.values(stats);

  // Sort with tiebreaker cascade, handling H2H for tied teams
  standing = breakTies(standing, groupMatches);

  // Add position
  standing = standing.map((row, idx) => ({...row, position: idx + 1}));

  return standing;
}

// Resolve multi-way ties using head-to-head
function breakTies(standing, groupMatches) {
  // Sort primarily by points
  let sorted = [...standing].sort((a, b) => b.points - a.points);

  // Find groups of tied teams and resolve with H2H
  const result = [];
  let i = 0;
  while (i < sorted.length) {
    const currentPoints = sorted[i].points;
    const tiedGroup = [sorted[i]];

    // Collect all teams with same points
    for (let j = i + 1; j < sorted.length && sorted[j].points === currentPoints; j++) {
      tiedGroup.push(sorted[j]);
    }

    if (tiedGroup.length === 1) {
      result.push(tiedGroup[0]);
      i += 1;
    } else {
      // Resolve this group with H2H
      const resolved = resolveH2H(tiedGroup, groupMatches);
      result.push(...resolved);
      i += tiedGroup.length;
    }
  }

  return result;
}

// Resolve a group of tied teams using H2H tiebreakers
function resolveH2H(tiedTeams, groupMatches) {
  const tiedTeamSet = new Set(tiedTeams.map((t) => t.team));

  // Build H2H table for only these teams
  const h2hStats = {};
  tiedTeams.forEach((team) => {
    h2hStats[team.team] = {
      team: team.team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      fifaRanking: team.fifaRanking,
    };
  });

  // Apply only matches between tied teams
  groupMatches.forEach((match) => {
    if (!tiedTeamSet.has(match.homeTeam) || !tiedTeamSet.has(match.awayTeam)) return;
    if (match.homeGoals === null || match.awayGoals === null) return;

    const home = h2hStats[match.homeTeam];
    const away = h2hStats[match.awayTeam];

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.awayGoals > match.homeGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      home.points += 1;
      away.drawn += 1;
      away.points += 1;
    }
  });

  // Sort by H2H, then overall GD/GF, then FIFA ranking
  const sorted = Object.values(h2hStats).sort((a, b) => {
    // H2H points
    if (a.points !== b.points) return b.points - a.points;
    // H2H goal diff
    const aGD = a.goalsFor - a.goalsAgainst;
    const bGD = b.goalsFor - b.goalsAgainst;
    if (aGD !== bGD) return bGD - aGD;
    // H2H goals for
    if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;

    // Fall back to overall goal diff
    const aOverallGD = tiedTeams.find((t) => t.team === a.team).goalsFor - tiedTeams.find((t) => t.team === a.team).goalsAgainst;
    const bOverallGD = tiedTeams.find((t) => t.team === b.team).goalsFor - tiedTeams.find((t) => t.team === b.team).goalsAgainst;
    if (aOverallGD !== bOverallGD) return bOverallGD - aOverallGD;

    // Overall goals for
    const aOverallGF = tiedTeams.find((t) => t.team === a.team).goalsFor;
    const bOverallGF = tiedTeams.find((t) => t.team === b.team).goalsFor;
    if (aOverallGF !== bOverallGF) return bOverallGF - aOverallGF;

    // Fair play (fewer cards = lower penalty)
    const aFairPlay = tiedTeams.find((t) => t.team === a.team).yellowCards + tiedTeams.find((t) => t.team === a.team).redCards * 3;
    const bFairPlay = tiedTeams.find((t) => t.team === b.team).yellowCards + tiedTeams.find((t) => t.team === b.team).redCards * 3;
    if (aFairPlay !== bFairPlay) return aFairPlay - bFairPlay;

    // FIFA ranking (lower = better)
    return a.fifaRanking - b.fifaRanking;
  });

  return sorted.map((s) => ({
    ...tiedTeams.find((t) => t.team === s.team),
  }));
}

// Compute standings for all 12 groups
export function computeAllGroupStandings(groupResults) {
  const standings = {};
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  groups.forEach((group) => {
    standings[group] = computeGroupStandings(group, groupResults);
  });
  return standings;
}
