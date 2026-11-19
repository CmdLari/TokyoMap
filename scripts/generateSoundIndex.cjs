
const fs = require('node:fs');
const path = require('node:path');

const directory = path.join(
  process.cwd(), 'public', 'audio', 'stations'
);

const output = path.join(
  process.cwd(), 'src', 'data', 'stationSounds.json'
);

const sounds = {};

if (fs.existsSync(directory)) {
  for (const file of fs.readdirSync(directory)) {
    if (!file.toLowerCase().endsWith('.mp3')) continue;

    const audioPath = `/audio/stations/${encodeURIComponent(file)}`;

    // Each underscore-separated name is a station ID
    const stations = path.parse(file).name
      .toLowerCase()
      .split('_');

    for (const station of stations) {
      if (sounds[station]) {
        console.warn(`Duplicate sound assignment: ${station}`);
      }

      sounds[station] = audioPath;
    }
  }
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(sounds, null, 2));

console.log(`Indexed sounds for ${Object.keys(sounds).length} stations.`);
