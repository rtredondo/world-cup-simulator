# FIFA World Cup 2026 Simulator — Handover Document

## Project Overview
A React web app that simulates the full 2026 FIFA World Cup tournament. Built with Create React App, no external dependencies. Runs at `http://localhost:3000`.

## Project Location
`~/Desktop/world-cup-simulator`

## How to Run
```bash
cd ~/Desktop/world-cup-simulator
npm start
```

## What's Built and Working
- ✅ 12 groups (A–L), 4 teams each, all 48 official qualified teams with correct FIFA rankings and emoji flags
- ✅ Group stage standings with full FIFA tiebreaker logic (H2H points → H2H GD → H2H GF → overall GD → overall GF → fair play → FIFA ranking)
- ✅ Third-place ranking table showing all 12 third-placed teams, top 8 highlighted
- ✅ Manual score entry AND random simulate button for every match
- ✅ "Simulate All Groups" button
- ✅ Round of 32, Round of 16, Quarter-finals, Semi-finals, 3rd place playoff, Final — all auto-populate as results are entered
- ✅ Penalty shootout support for knockout draws
- ✅ Champion celebration screen with confetti and animations when Final is won
- ✅ Emoji flags next to team names throughout
- ✅ Annexe C debug panel (collapsible) showing third-place slot assignments

## Current Bug Being Fixed
**Annexe C third-place slot assignment is broken.**

### What Annexe C Does
After the group stage, the 8 best third-placed teams qualify for the Round of 32. They face the winners of groups A, B, D, E, G, I, K, L. Which group winner faces which third-placed team is determined by a lookup table (495 combinations) based on which 8 groups had qualifying third-place teams.

### The Bug
The binary key used to look up the correct Annexe C row is being built incorrectly. The `assignThirdPlaceSlots` function in `src/utils/bracketAssignment.js` builds the key from `thirdRankings.slice(0,8).map(t => t.group)` — but this may not correctly reflect the actual qualifying groups, causing the lookup to return group letters that didn't qualify (resulting in `team=undefined` and TBD in the bracket).

### Debug Evidence
From console logs, example broken run:
- Qualified groups: D, H, A, E, C, F, J, L
- Binary key generated: `101111010101`
- Lookup returned group "I" for one slot — but I was NOT a qualified group → team=undefined → TBD
- Group E appeared in two slots (duplicate assignment)

### Root Cause Hypothesis
`qualifiedThirds` is an array of team name strings (not objects), while `thirdRankings` is an array of objects with `.group` property. These two arrays may not be in sync — `thirdRankings` might not be sorted/filtered the same way as `qualifiedThirds`. The binary key should be built from the groups of whichever 8 teams are in `qualifiedThirds`, not from `thirdRankings.slice(0,8)`.

### Files to Look At
- `src/utils/advancement.js` — builds `qualifiedThirds` and `thirdRankings`
- `src/utils/bracketAssignment.js` — `assignThirdPlaceSlots` function (around line 391)

### The Fix Needed
In `assignThirdPlaceSlots`, the binary key must be built from the groups of the actual qualified teams. The correct approach:
1. `qualifiedThirds` contains the 8 qualifying team names
2. Find each team's group from the `thirds` object (which maps group letter → team stats)
3. Build the Set of qualifying groups from those 8 teams
4. Generate the binary key from that Set

### Prompt to Use in New Chat
```
In our React World Cup 2026 simulator at ~/Desktop/world-cup-simulator, 
the Annexe C third-place slot assignment has a bug. 

The function assignThirdPlaceSlots in src/utils/bracketAssignment.js 
builds the 12-character binary key (used to look up the correct row in 
the 495-combination ANNEXE_C_LOOKUP table) incorrectly.

The bug: the binary key is built from thirdRankings.slice(0,8).map(t => t.group)
but qualifiedThirds (the actual list of 8 qualifying team names) may not 
correspond to the same 8 teams as thirdRankings.slice(0,8). This causes 
the lookup to return group letters not in the qualifying set, giving 
team=undefined and TBD slots in the bracket.

Please:
1. Read advancement.js to understand the exact structure of qualifiedThirds 
   and thirdRankings — specifically what fields each object has and how 
   they are sorted/filtered
2. Read assignThirdPlaceSlots in bracketAssignment.js
3. Fix the binary key generation so it is built from the groups of whichever 
   8 teams are actually in qualifiedThirds, using the thirds object to look 
   up each team's group letter
4. Also fix populateBracket if needed — verify that when resolving a "3rd" 
   type team in R32 matches, it looks up slotAssignment[matchNum] correctly 
   (check for string vs number key mismatch)
5. Do not hardcode any team names or group combinations
```

## Official Teams (All 48)
```
Group A: Mexico (#15), South Africa (#60), South Korea (#25), Czech Republic (#41)
Group B: Canada (#30), Bosnia and Herzegovina (#65), Qatar (#55), Switzerland (#19)
Group C: Brazil (#6), Morocco (#8), Haiti (#83), Scotland (#43)
Group D: United States (#16), Paraguay (#40), Australia (#27), Turkey (#22)
Group E: Germany (#10), Curaçao (#82), Ivory Coast (#34), Ecuador (#23)
Group F: Netherlands (#7), Japan (#18), Sweden (#38), Tunisia (#44)
Group G: Belgium (#9), Egypt (#29), Iran (#21), New Zealand (#85)
Group H: Spain (#2), Cape Verde (#69), Saudi Arabia (#61), Uruguay (#17)
Group I: France (#1), Senegal (#14), Iraq (#57), Norway (#31)
Group J: Argentina (#3), Algeria (#28), Austria (#24), Jordan (#63)
Group K: Portugal (#5), DR Congo (#46), Uzbekistan (#50), Colombia (#13)
Group L: England (#4), Croatia (#11), Ghana (#74), Panama (#33)
```

## Round of 32 Structure (Article 12.6)
```
M73: 2A vs 2B
M74: 1E vs 3rd(ABCDF)    ← third-place slot
M75: 1F vs 2C
M76: 1C vs 2F
M77: 1I vs 3rd(CDFGH)    ← third-place slot
M78: 2E vs 2I
M79: 1A vs 3rd(CEFHI)    ← third-place slot
M80: 1L vs 3rd(EHIJK)    ← third-place slot
M81: 1D vs 3rd(BEFIJ)    ← third-place slot
M82: 1G vs 3rd(AEHIJ)    ← third-place slot
M83: 2K vs 2L
M84: 1H vs 2J
M85: 1B vs 3rd(EFGIJ)    ← third-place slot
M86: 1J vs 2H
M87: 1K vs 3rd(DEIJL)    ← third-place slot
M88: 2D vs 2G
```

## Annexe C Lookup
The ANNEXE_C_LOOKUP object in bracketAssignment.js contains all 495 combinations.
Key format: 12-char binary string, position 0=A through 11=L, "1" if that group's third qualified.
Value format: `{ "1A": "X", "1B": "X", "1D": "X", "1E": "X", "1G": "X", "1I": "X", "1K": "X", "1L": "X" }`
where X is the group letter of the third-place team that slot faces.

The slot-to-match-number mapping:
- 1A → M79, 1B → M85, 1D → M81, 1E → M74, 1G → M82, 1I → M77, 1K → M87, 1L → M80

## File Structure
```
src/
├── App.js                     ← root state, handlers, tab switching
├── App.css                    ← global styles
├── data/
│   ├── teams.js               ← TEAMS map, GROUPS map, GROUP_FIXTURE_PAIRS
│   └── bracketSlots.js        ← R32/R16/QF/SF/Final match defs
├── utils/
│   ├── standings.js           ← group standings with tiebreakers
│   ├── advancement.js         ← getAdvancedTeams, third-place ranking
│   ├── bracketAssignment.js   ← ANNEXE_C_LOOKUP (495 rows), assignThirdPlaceSlots, populateBracket
│   └── simulation.js          ← Poisson score simulation
└── components/
    ├── TabNav.js
    ├── Champion/
    │   └── ChampionCelebration.js  ← winner celebration overlay
    ├── GroupStage/
    │   ├── GroupStage.js
    │   ├── GroupPanel.js
    │   ├── StandingsTable.js
    │   ├── MatchRow.js
    │   └── ThirdPlaceRankings.js
    └── Knockout/
        ├── KnockoutBracket.js
        ├── BracketRound.js
        ├── KnockoutMatch.js
        └── DebugPanel.js       ← Annexe C debug info panel
```

## Things Still To Do (Nice to Have)
- Fix the Annexe C bug (priority — see above)
- Verify group stage match schedule matches official FIFA Article 12.4 order
- Mobile responsive polish
