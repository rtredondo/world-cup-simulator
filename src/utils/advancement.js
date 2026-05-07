
// Get advanced teams: 1st/2nd from each group + top 8 thirds
export function getAdvancedTeams(groupStandings) {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  const firsts = {};
  const seconds = {};
  const thirds = {};

  // Extract 1st, 2nd, and 3rd place from each group
  groups.forEach((group) => {
    const standing = groupStandings[group] || [];
    firsts[group] = standing[0]?.team || null;
    seconds[group] = standing[1]?.team || null;
    thirds[group] = standing[2] || null;
  });

  // Rank all 12 third-place teams
  const thirdsList = groups
    .map((group) => ({
      ...thirds[group],
      group,
    }))
    .filter((t) => t.team); // Remove nulls if any group isn't complete

  // Sort by: points, goal diff, goals for, fair play, FIFA ranking
  const thirdRankings = [...thirdsList].sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    const aGD = a.goalsFor - a.goalsAgainst;
    const bGD = b.goalsFor - b.goalsAgainst;
    if (aGD !== bGD) return bGD - aGD;
    if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;
    const aFairPlay = (a.yellowCards || 0) + (a.redCards || 0) * 3;
    const bFairPlay = (b.yellowCards || 0) + (b.redCards || 0) * 3;
    if (aFairPlay !== bFairPlay) return aFairPlay - bFairPlay;
    return (a.fifaRanking || 999) - (b.fifaRanking || 999);
  });

  // Top 8 thirds qualify
  const qualifiedThirds = thirdRankings.slice(0, 8).map((t) => t.team);

  return {
    firsts,
    seconds,
    thirds,
    qualifiedThirds,
    thirdRankings,
  };
}
