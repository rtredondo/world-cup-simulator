// FIFA World Cup 2026 bracket match definitions (Article 12.6, 12.7)
// Match numbers follow FIFA's official numbering (73-104)

// R32 matches (matches 73-88) — Article 12.6
export const R32_MATCHES = [
  { matchNum: 73,  round: "R32", home: {type: "2nd", group: "A"}, away: {type: "2nd", group: "B"} },
  { matchNum: 74,  round: "R32", home: {type: "1st", group: "E"}, away: {type: "3rd", slots: ["A", "B", "C", "D", "F"]} },
  { matchNum: 75,  round: "R32", home: {type: "1st", group: "F"}, away: {type: "2nd", group: "C"} },
  { matchNum: 76,  round: "R32", home: {type: "1st", group: "C"}, away: {type: "2nd", group: "F"} },
  { matchNum: 77,  round: "R32", home: {type: "1st", group: "I"}, away: {type: "3rd", slots: ["C", "D", "F", "G", "H"]} },
  { matchNum: 78,  round: "R32", home: {type: "2nd", group: "E"}, away: {type: "2nd", group: "I"} },
  { matchNum: 79,  round: "R32", home: {type: "1st", group: "A"}, away: {type: "3rd", slots: ["C", "E", "F", "H", "I"]} },
  { matchNum: 80,  round: "R32", home: {type: "1st", group: "L"}, away: {type: "3rd", slots: ["E", "H", "I", "J", "K"]} },
  { matchNum: 81,  round: "R32", home: {type: "1st", group: "D"}, away: {type: "3rd", slots: ["B", "E", "F", "I", "J"]} },
  { matchNum: 82,  round: "R32", home: {type: "1st", group: "G"}, away: {type: "3rd", slots: ["A", "E", "H", "I", "J"]} },
  { matchNum: 83,  round: "R32", home: {type: "2nd", group: "K"}, away: {type: "2nd", group: "L"} },
  { matchNum: 84,  round: "R32", home: {type: "1st", group: "H"}, away: {type: "2nd", group: "J"} },
  { matchNum: 85,  round: "R32", home: {type: "1st", group: "B"}, away: {type: "3rd", slots: ["E", "F", "G", "I", "J"]} },
  { matchNum: 86,  round: "R32", home: {type: "1st", group: "J"}, away: {type: "2nd", group: "H"} },
  { matchNum: 87,  round: "R32", home: {type: "1st", group: "K"}, away: {type: "3rd", slots: ["D", "E", "I", "J", "L"]} },
  { matchNum: 88,  round: "R32", home: {type: "2nd", group: "D"}, away: {type: "2nd", group: "G"} },
];

// R16 matches (matches 89-96) — Article 12.7
export const R16_MATCHES = [
  { matchNum: 89,  round: "R16", home: {type: "winner", matchNum: 74}, away: {type: "winner", matchNum: 77} },
  { matchNum: 90,  round: "R16", home: {type: "winner", matchNum: 73}, away: {type: "winner", matchNum: 75} },
  { matchNum: 91,  round: "R16", home: {type: "winner", matchNum: 76}, away: {type: "winner", matchNum: 78} },
  { matchNum: 92,  round: "R16", home: {type: "winner", matchNum: 79}, away: {type: "winner", matchNum: 80} },
  { matchNum: 93,  round: "R16", home: {type: "winner", matchNum: 83}, away: {type: "winner", matchNum: 84} },
  { matchNum: 94,  round: "R16", home: {type: "winner", matchNum: 81}, away: {type: "winner", matchNum: 82} },
  { matchNum: 95,  round: "R16", home: {type: "winner", matchNum: 86}, away: {type: "winner", matchNum: 88} },
  { matchNum: 96,  round: "R16", home: {type: "winner", matchNum: 85}, away: {type: "winner", matchNum: 87} },
];

// QF matches (matches 97-100)
export const QF_MATCHES = [
  { matchNum: 97,  round: "QF", home: {type: "winner", matchNum: 89}, away: {type: "winner", matchNum: 90} },
  { matchNum: 98,  round: "QF", home: {type: "winner", matchNum: 93}, away: {type: "winner", matchNum: 94} },
  { matchNum: 99,  round: "QF", home: {type: "winner", matchNum: 91}, away: {type: "winner", matchNum: 92} },
  { matchNum: 100, round: "QF", home: {type: "winner", matchNum: 95}, away: {type: "winner", matchNum: 96} },
];

// SF matches (matches 101-102)
export const SF_MATCHES = [
  { matchNum: 101, round: "SF", home: {type: "winner", matchNum: 97}, away: {type: "winner", matchNum: 98} },
  { matchNum: 102, round: "SF", home: {type: "winner", matchNum: 99}, away: {type: "winner", matchNum: 100} },
];

// Final and 3rd place (matches 103-104)
export const FINAL_MATCHES = [
  { matchNum: 103, round: "3rd", home: {type: "loser", matchNum: 101}, away: {type: "loser", matchNum: 102}, label: "3rd Place" },
  { matchNum: 104, round: "Final", home: {type: "winner", matchNum: 101}, away: {type: "winner", matchNum: 102}, label: "Final" },
];

// Annexe C constraints: which 3rd-place teams (by group) can fill each bracket slot
// M74, M77, M79, M80, M81, M82, M85, M87 are the 8 slots for 3rd-place teams
export const THIRD_PLACE_SLOT_CONSTRAINTS = {
  74: ["A", "B", "C", "D", "F"],
  77: ["C", "D", "F", "G", "H"],
  79: ["C", "E", "F", "H", "I"],
  80: ["E", "H", "I", "J", "K"],
  81: ["B", "E", "F", "I", "J"],
  82: ["A", "E", "H", "I", "J"],
  85: ["E", "F", "G", "I", "J"],
  87: ["D", "E", "I", "J", "L"],
};
