const fs = require('fs');
const path = require('path');

// Move up one level from /js → project root
const rootDir = path.join(__dirname, '..');

// Base GPX directory
const baseDir = path.join(rootDir, 'gpx');

// Output file
const outputFile = path.join(rootDir, 'gpx-index.json');

// Colour palette
const colors = [
  '#e41a1c', '#377eb8', '#4daf4a',
  '#984ea3', '#ff7f00', '#ffff33',
  '#a65628', '#f781bf'
];

const folders = fs.readdirSync(baseDir)
  .filter(f => fs.statSync(path.join(baseDir, f)).isDirectory())
  .map((folder, index) => {

    const folderPath = path.join(baseDir, folder);

    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.gpx'))
      .map(f => `gpx/${folder}/${f}`); // path relative to index.html

    return {
      name: folder,
      color: colors[index % colors.length],
      files
    };
  });

// Write JSON to project root
fs.writeFileSync(outputFile, JSON.stringify({ folders }, null, 2));

console.log('✅ gpx-index.json generated');