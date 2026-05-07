// 48 teams for the 2026 FIFA World Cup - Official Draw

export const TEAMS = {
  // Group A
  "Mexico":           { group: "A", fifaRanking: 15, flag: "🇲🇽" },
  "South Africa":     { group: "A", fifaRanking: 60, flag: "🇿🇦" },
  "South Korea":      { group: "A", fifaRanking: 25, flag: "🇰🇷" },
  "Czech Republic":   { group: "A", fifaRanking: 41, flag: "🇨🇿" },

  // Group B
  "Canada":           { group: "B", fifaRanking: 30, flag: "🇨🇦" },
  "Bosnia and Herzegovina": { group: "B", fifaRanking: 65, flag: "🇧🇦" },
  "Qatar":            { group: "B", fifaRanking: 55, flag: "🇶🇦" },
  "Switzerland":      { group: "B", fifaRanking: 19, flag: "🇨🇭" },

  // Group C
  "Brazil":           { group: "C", fifaRanking: 6,  flag: "🇧🇷" },
  "Morocco":          { group: "C", fifaRanking: 8,  flag: "🇲🇦" },
  "Haiti":            { group: "C", fifaRanking: 83, flag: "🇭🇹" },
  "Scotland":         { group: "C", fifaRanking: 43, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },

  // Group D
  "United States":    { group: "D", fifaRanking: 16, flag: "🇺🇸" },
  "Paraguay":         { group: "D", fifaRanking: 40, flag: "🇵🇾" },
  "Australia":        { group: "D", fifaRanking: 27, flag: "🇦🇺" },
  "Turkey":           { group: "D", fifaRanking: 22, flag: "🇹🇷" },

  // Group E
  "Germany":          { group: "E", fifaRanking: 10, flag: "🇩🇪" },
  "Curaçao":          { group: "E", fifaRanking: 82, flag: "🇨🇼" },
  "Ivory Coast":      { group: "E", fifaRanking: 34, flag: "🇨🇮" },
  "Ecuador":          { group: "E", fifaRanking: 23, flag: "🇪🇨" },

  // Group F
  "Netherlands":      { group: "F", fifaRanking: 7,  flag: "🇳🇱" },
  "Japan":            { group: "F", fifaRanking: 18, flag: "🇯🇵" },
  "Sweden":           { group: "F", fifaRanking: 38, flag: "🇸🇪" },
  "Tunisia":          { group: "F", fifaRanking: 44, flag: "🇹🇳" },

  // Group G
  "Belgium":          { group: "G", fifaRanking: 9,  flag: "🇧🇪" },
  "Egypt":            { group: "G", fifaRanking: 29, flag: "🇪🇬" },
  "Iran":             { group: "G", fifaRanking: 21, flag: "🇮🇷" },
  "New Zealand":      { group: "G", fifaRanking: 85, flag: "🇳🇿" },

  // Group H
  "Spain":            { group: "H", fifaRanking: 2,  flag: "🇪🇸" },
  "Cape Verde":       { group: "H", fifaRanking: 69, flag: "🇨🇻" },
  "Saudi Arabia":     { group: "H", fifaRanking: 61, flag: "🇸🇦" },
  "Uruguay":          { group: "H", fifaRanking: 17, flag: "🇺🇾" },

  // Group I
  "France":           { group: "I", fifaRanking: 1,  flag: "🇫🇷" },
  "Senegal":          { group: "I", fifaRanking: 14, flag: "🇸🇳" },
  "Iraq":             { group: "I", fifaRanking: 57, flag: "🇮🇶" },
  "Norway":           { group: "I", fifaRanking: 31, flag: "🇳🇴" },

  // Group J
  "Argentina":        { group: "J", fifaRanking: 3,  flag: "🇦🇷" },
  "Algeria":          { group: "J", fifaRanking: 28, flag: "🇩🇿" },
  "Austria":          { group: "J", fifaRanking: 24, flag: "🇦🇹" },
  "Jordan":           { group: "J", fifaRanking: 63, flag: "🇯🇴" },

  // Group K
  "Portugal":         { group: "K", fifaRanking: 5,  flag: "🇵🇹" },
  "DR Congo":         { group: "K", fifaRanking: 46, flag: "🇨🇩" },
  "Uzbekistan":       { group: "K", fifaRanking: 50, flag: "🇺🇿" },
  "Colombia":         { group: "K", fifaRanking: 13, flag: "🇨🇴" },

  // Group L
  "England":          { group: "L", fifaRanking: 4,  flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  "Croatia":          { group: "L", fifaRanking: 11, flag: "🇭🇷" },
  "Ghana":            { group: "L", fifaRanking: 74, flag: "🇬🇭" },
  "Panama":           { group: "L", fifaRanking: 33, flag: "🇵🇦" },
};

export const GROUPS = {
  A: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

// Match fixture pairs for each group (4 teams, round-robin = 6 matches)
// Indices into the group array: [0,1],[2,3],[0,2],[1,3],[0,3],[1,2]
export const GROUP_FIXTURE_PAIRS = [
  [0, 1], // Matchday 1
  [2, 3],
  [0, 2], // Matchday 2
  [1, 3],
  [0, 3], // Matchday 3
  [1, 2],
];
