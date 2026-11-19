
const fs = require('node:fs');
const path = require('node:path');

const photoDir = path.join(process.cwd(), 'public', 'images', 'photos');
const outputFile = path.join(process.cwd(), 'src', 'data', 'photos.json');

const photos = fs.readdirSync(photoDir)
  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
  .map(file => {
    const match = file.match(/^(\d{4})_(.+)_(\d+)\.(jpg|jpeg|png|webp)$/i);

    if (!match) {
      console.warn(`Skipping invalid filename: ${file}`);
      return null;
    }

    const [, year, location, number] = match;
    const separator = location.indexOf('_');

    if (separator === -1) {
      console.warn(`Skipping missing station: ${file}`);
      return null;
    }

    const ward = location.slice(0, separator);
    const station = location.slice(separator + 1);

    return {
      filename: file,
      year: Number(year),
      ward,
      station,
      number: Number(number),
      src: `/images/photos/${encodeURIComponent(file)}`
    };
  })
  .filter(Boolean)
  .sort((a, b) =>
    a.year - b.year ||
    a.ward.localeCompare(b.ward) ||
    a.station.localeCompare(b.station) ||
    a.number - b.number
  );

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));

console.log(`Indexed ${photos.length} photographs.`);
