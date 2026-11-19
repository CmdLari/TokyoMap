
const photoFiles = import.meta.glob(
  '/public/images/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
);

export interface Photo {
  year: number;
  ward: string;
  station: string;
  number: number;
  src: string;
}

export const photos: Photo[] = Object.entries(photoFiles)
  .map(([path]) => {
    const filename = path.split('/').pop();

    if (!filename) return null;

    // YEAR_WARD_STATION_NUMBER.jpg
    const match = filename.match(
      /^(\d{4})_([^_]+)_(.+)_(\d+)\.(jpg|jpeg|png|webp)$/i
    );

    if (!match) return null;

    const [, year, ward, station, number] = match;

    return {
      year: Number(year),
      ward,
      station,
      number: Number(number),
      src: path.replace('/public', ''),
    };
  })
  .filter((photo): photo is Photo => photo !== null);

export function getPhotosForStation(stationName: string): Photo[] {
  const normalise = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]/g, '');

  return photos.filter(
    photo => normalise(photo.station) === normalise(stationName)
  );
}
