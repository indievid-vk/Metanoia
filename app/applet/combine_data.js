const fs = require('fs');
const { execSync } = require('child_process');

// Run all build_partX.js scripts
for (let i = 1; i <= 11; i++) {
  try {
    execSync(`node build_part${i}.js`);
    console.log(`Ran build_part${i}.js`);
  } catch (err) {
    console.error(`Error running build_part${i}.js:`, err);
  }
}

// Combine the JSON files
let combinedData = [];

for (let i = 1; i <= 11; i++) {
  try {
    const data = fs.readFileSync(`data_part${i}.json`, 'utf8');
    const parsed = JSON.parse(data);
    combinedData = combinedData.concat(parsed);
    console.log(`Loaded data_part${i}.json`);
  } catch (err) {
    console.error(`Error reading data_part${i}.json:`, err);
  }
}

// Write the combined data to the source directory
fs.writeFileSync('../src/data/catechesisQuestions.json', JSON.stringify(combinedData, null, 2));
console.log('Successfully wrote combined data to ../src/data/catechesisQuestions.json');
