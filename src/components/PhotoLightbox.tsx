
import { useEffect } from 'react';
import type { Photo } from '../utils/getStationPhotos';
import type { Station } from '../types/railway';
import './PhotoLightbox.css';

interface PhotoLightboxProps {
  photos: Photo[];
  index: number;
  station: Station;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function PhotoLightbox({
  photos,
  index,
  station,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const photo = photos[index];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();

      if (event.key === 'ArrowLeft') {
        onNavigate((index - 1 + photos.length) % photos.length);
      }

      if (event.key === 'ArrowRight') {
        onNavigate((index + 1) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, photos.length, onClose, onNavigate]);

  if (!photo) return null;

  const previous = () =>
    onNavigate((index - 1 + photos.length) % photos.length);

  const next = () =>
    onNavigate((index + 1) % photos.length);

  return (
    <div
      className="photo-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      onClick={onClose}
    >
      <div className="photo-lightbox-header">
        <div className="photo-lightbox-info">
          <span className="photo-lightbox-divider">+</span>
          <span>{photo.year}</span>

          <span className="photo-lightbox-break" />

          <span className="photo-lightbox-divider">+</span>
          <span>{station.ward} | {station.wardJa}</span>

          <span className="photo-lightbox-break" />

          <span className="photo-lightbox-divider">+</span>
          <span>{station.name} | {station.nameJa}</span>
        </div>

        <button
          className="photo-lightbox-close"
          onClick={onClose}
          aria-label="Close photograph"
        >
          ×
        </button>
      </div>

      <div
        className="photo-lightbox-content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="photo-lightbox-arrow photo-lightbox-prev"
          onClick={previous}
          aria-label="Previous photograph"
        >
          ‹
        </button>

        <img
          key={photo.filename}
          src={photo.src}
          alt={`${station.name}, ${photo.year}`}
          className="photo-lightbox-image"
        />

        <button
          className="photo-lightbox-arrow photo-lightbox-next"
          onClick={next}
          aria-label="Next photograph"
        >
          ›
        </button>
      </div>

      <div className="photo-lightbox-counter">
        {String(index + 1).padStart(2, '0')}
        {' / '}
        {String(photos.length).padStart(2, '0')}
      </div>
    </div>
  );
}
