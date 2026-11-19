
import { useState } from 'react';
import type { Photo } from '../utils/getStationPhotos';
import type { Station } from '../types/railway';
import PhotoLightbox from './PhotoLightbox';
import './StationGallery.css';

interface StationGalleryProps {
  photos: Photo[];
  station: Station | null;
}

export default function StationGallery({
  photos,
  station,
}: StationGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  return (
    <div className="station-gallery">
      <div className="station-gallery-grid">
        {photos.map((photo, index) => (
          <div
            className="station-gallery-item"
            key={photo.filename}
            onClick={() => setActivePhoto(index)}
          >
            <img
              src={photo.src}
              alt={`${photo.station}, ${photo.year}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {activePhoto !== null && station && (
        <PhotoLightbox
          photos={photos}
          index={activePhoto}
          station={station}
          onClose={() => setActivePhoto(null)}
          onNavigate={setActivePhoto}
        />
      )}
    </div>
  );
}
