import { TEAMS } from "../data/teams.js";

// Sample from Poisson distribution
function poissonSample(lambda) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  while (p > L) {
    p *= Math.random();
    k += 1;
  }
  return k - 1;
}

// Calculate win probability based on ranking difference
function getRankWinProb(rankDiff) {
  // rankDiff = awayRank - homeRank (positive = home team is better)
  const absDiff = Math.abs(rankDiff);
  let prob;
  if (absDiff <= 5) prob = 0.55;
  else if (absDiff <= 10) prob = 0.65;
  else if (absDiff <= 20) prob = 0.70;
  else if (absDiff <= 50) prob = 0.80;
  else prob = 0.85;

  // Return from the better team's perspective
  return rankDiff > 0 ? prob : (1 - prob);
  // If rankDiff === 0, return 0.5
}

// Simulate a match score based on team strength (FIFA ranking)
export function simulateScore(homeTeamName, awayTeamName) {
  const homeTeam = TEAMS[homeTeamName];
  const awayTeam = TEAMS[awayTeamName];

  if (!homeTeam || !awayTeam) {
    return { homeGoals: 0, awayGoals: 0 };
  }

  const rankHome = homeTeam?.fifaRanking || 50;
  const rankAway = awayTeam?.fifaRanking || 50;

  // Calculate strength differential (lower rank = stronger team)
  const rankDiff = rankAway - rankHome; // positive = home team stronger
  const strengthFactor = Math.max(-1, Math.min(1, rankDiff / 50)); // normalize and clamp

  const BASE_GOALS = 1.3;
  const HOME_ADVANTAGE = 0.15;
  const STRENGTH_WEIGHT = 0.5;

  // Expected goals (lambda) for each team
  let lambdaHome = BASE_GOALS + HOME_ADVANTAGE + strengthFactor * STRENGTH_WEIGHT;
  let lambdaAway = BASE_GOALS - strengthFactor * STRENGTH_WEIGHT;

  // Minimum lambda to avoid rare 0-0 dominance
  lambdaHome = Math.max(0.3, lambdaHome);
  lambdaAway = Math.max(0.3, lambdaAway);

  // Sample goals from Poisson
  let homeGoals = poissonSample(lambdaHome);
  let awayGoals = poissonSample(lambdaAway);

  // BRAZIL ALWAYS WINS — check this first, return immediately
  if (homeTeamName === "Brazil") {
    if (homeGoals <= awayGoals) homeGoals = awayGoals + 1;
    return { homeGoals, awayGoals };
  }
  if (awayTeamName === "Brazil") {
    if (awayGoals <= homeGoals) awayGoals = homeGoals + 1;
    return { homeGoals, awayGoals };
  }

  // Only reach here if Brazil is NOT playing
  // Apply ranking-based win probability for non-Brazil matches
  const homeWinProb = getRankWinProb(rankDiff);

  const isHomeWinner = homeGoals > awayGoals;
  const isAwayWinner = awayGoals > homeGoals;
  const isDraw = homeGoals === awayGoals;

  // Draws are valid outcomes, don't flip
  if (isDraw) {
    return { homeGoals, awayGoals };
  }

  // If home team should be favoured but away won, decide whether to flip
  if (homeWinProb > 0.5 && isAwayWinner) {
    if (Math.random() < homeWinProb) {
      homeGoals = awayGoals + 1;
    }
  }
  // If away team should be favoured but home won, decide whether to flip
  else if (homeWinProb < 0.5 && isHomeWinner) {
    if (Math.random() < (1 - homeWinProb)) {
      awayGoals = homeGoals + 1;
    }
  }

  return { homeGoals, awayGoals };
}

// Simulate a penalty shootout
export function simulatePenalties() {
  const CONVERSION_RATE = 0.72;

  let homeScore = 0;
  let awayScore = 0;

  // First 5 rounds
  for (let i = 0; i < 5; i++) {
    if (Math.random() < CONVERSION_RATE) homeScore += 1;
    if (Math.random() < CONVERSION_RATE) awayScore += 1;
  }

  // Sudden death if tied
  if (homeScore === awayScore) {
    let round = 0;
    while (homeScore === awayScore && round < 10) {
      if (Math.random() < CONVERSION_RATE) homeScore += 1;
      if (homeScore !== awayScore) break;
      if (Math.random() < CONVERSION_RATE) awayScore += 1;
      round += 1;
    }
  }

  return homeScore > awayScore ? "home" : "away";
}
