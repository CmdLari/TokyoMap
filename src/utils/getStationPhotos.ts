
import photos from '../data/photos.json';
import type { Station } from '../types/railway';

export interface Photo {
  filename: string;
  year: number;
  ward: string;
  station: string;
  number: number;
  src: string;
}

export function getStationPhotos(station: Station): Photo[] {
  const normalise = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, '');

  return photos.filter(photo =>
    normalise(photo.ward) === normalise(station.ward) &&
    normalise(photo.station) === normalise(station.name)
  );
}
