// Validation script for ANNEXE_C_LOOKUP
import { ANNEXE_C_LOOKUP } from './src/utils/bracketAssignment.js';

const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

let failures = 0;
const failedKeys = [];

console.log("Validating ANNEXE_C_LOOKUP...\n");

Object.entries(ANNEXE_C_LOOKUP).forEach(([binaryKey, slotMappings]) => {
  // Decode binary key to get which groups should be present
  const expectedGroups = new Set();
  for (let i = 0; i < groupLetters.length; i++) {
    if (binaryKey[i] === '1') {
      expectedGroups.add(groupLetters[i]);
    }
  }

  // Get actual groups from the slot mappings values
  const actualGroups = Object.values(slotMappings);
  const actualSet = new Set(actualGroups);

  // Check 1: All values must be from the expected groups
  let isValid = true;
  const invalidGroups = [];
  actualGroups.forEach(g => {
    if (!expectedGroups.has(g)) {
      invalidGroups.push(g);
      isValid = false;
    }
  });

  // Check 2: No duplicates
  let hasDuplicates = false;
  const duplicates = {};
  actualGroups.forEach(g => {
    duplicates[g] = (duplicates[g] || 0) + 1;
  });
  Object.entries(duplicates).forEach(([g, count]) => {
    if (count > 1) {
      hasDuplicates = true;
      isValid = false;
    }
  });

  // Check 3: Must have exactly 8 unique groups
  if (actualSet.size !== 8) {
    isValid = false;
  }

  // Check 4: Must match expected groups exactly
  if (actualSet.size !== expectedGroups.size) {
    isValid = false;
  } else {
    for (const g of actualSet) {
      if (!expectedGroups.has(g)) {
        isValid = false;
        break;
      }
    }
  }

  if (!isValid) {
    failures++;
    failedKeys.push(binaryKey);

    const missingGroups = [...expectedGroups].filter(g => !actualSet.has(g));
    const duplicateInfo = Object.entries(duplicates)
      .filter(([_, count]) => count > 1)
      .map(([g, count]) => `${g}(×${count})`)
      .join(', ');

    console.log(`❌ Key: ${binaryKey}`);
    console.log(`   Expected groups: ${[...expectedGroups].sort().join(',')}`);
    console.log(`   Actual groups:   ${[...actualSet].sort().join(',')}`);
    if (invalidGroups.length > 0) {
      console.log(`   Invalid groups (not in expected): ${invalidGroups.join(',')}`);
    }
    if (missingGroups.length > 0) {
      console.log(`   Missing groups: ${missingGroups.join(',')}`);
    }
    if (duplicateInfo) {
      console.log(`   Duplicates: ${duplicateInfo}`);
    }
    console.log(`   Values: ${JSON.stringify(slotMappings)}`);
    console.log();
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`VALIDATION COMPLETE`);
console.log(`Total entries: ${Object.keys(ANNEXE_C_LOOKUP).length}`);
console.log(`Failed entries: ${failures}`);
if (failures > 0) {
  console.log(`\nFailed keys: ${failedKeys.join(', ')}`);
}
console.log(`${'='.repeat(60)}`);
