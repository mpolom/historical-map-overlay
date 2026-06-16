const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const rootDir = path.join(__dirname, '..');
const baseDir = path.join(rootDir, 'gpx');
const outputFile = path.join(rootDir, 'gpx-index.json');

const colors = [
  '#e41a1c', '#377eb8', '#4daf4a',
  '#984ea3', '#ff7f00', '#ffff33',
  '#a65628', '#f781bf'
];

function generateManifest() {
  const folders = fs.readdirSync(baseDir)
    .filter(f => fs.statSync(path.join(baseDir, f)).isDirectory())
    .map((folder, index) => {

      const folderPath = path.join(baseDir, folder);

      const files = fs.readdirSync(folderPath)
        .filter(f => f.endsWith('.gpx'))
        .map(f => `gpx/${folder}/${f}`);

      return {
        name: folder
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase()),
        color: colors[index % colors.length],
        files
      };
    });

  fs.writeFileSync(outputFile, JSON.stringify({ folders }, null, 2));

  console.log(`✅ Manifest updated (${new Date().toLocaleTimeString()})`);
}

// Run once immediately
generateManifest();

// Watch mode
if (process.argv.includes('--watch')) {
  console.log('👀 Watching GPX folder for changes...');

  chokidar.watch(baseDir, { ignoreInitial: true })
    .on('add', generateManifest)
    .on('unlink', generateManifest)
    .on('addDir', generateManifest)
    .on('unlinkDir', generateManifest);
}
