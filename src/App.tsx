
import { useEffect, useRef, useState } from 'react';
import { lines } from './data/lines';
import TokyoMap from './components/TokyoMap';
import StationGallery from './components/StationGallery';
import { getStationPhotos } from './utils/getStationPhotos';
import stationSounds from './data/stationSounds.json';
import type { Station } from './types/railway';
import './App.css';



function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const stationAudioRef = useRef<HTMLAudioElement | null>(null);
  const stationAudio2Ref = useRef<HTMLAudioElement | null>(null);
  const lineChangeAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambienceAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambienceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Find the railway line containing the selected station
  const currentLine = selectedStation
    ? Object.values(lines).find(line =>
        line.stations.some(
          station =>
            station.id === selectedStation.id &&
            station.number === selectedStation.number
        )
      )
    : null;

  const transferLines = selectedStation
    ? Object.values(lines).filter(line =>
        line.id !== currentLine?.id &&
        line.stations.some(
          station => station.id === selectedStation.id
        ) &&
        line.stations.some(
          station => getStationPhotos(station).length > 0
        )
      )
    : [];

  const activeStations = currentLine
    ? currentLine.stations.filter(
        station => getStationPhotos(station).length > 0
      )
    : [];

  const currentIndex = selectedStation
    ? activeStations.findIndex(
        station =>
          station.id === selectedStation.id &&
          station.number === selectedStation.number
      )
    : -1;

  const previousStation =
    currentIndex >= 0 && activeStations.length > 1
      ? activeStations[
          (currentIndex - 1 + activeStations.length) %
            activeStations.length
        ]
      : null;

  const nextStation =
    currentIndex >= 0 && activeStations.length > 1
      ? activeStations[
          (currentIndex + 1) % activeStations.length
        ]
      : null;


  const stationPhotos = selectedStation
    ? getStationPhotos(selectedStation)
    : [];

    function playLineChangeSound() {
      lineChangeAudioRef.current?.pause();

      const audio = new Audio(
        `${import.meta.env.BASE_URL}audio/stationchange.mp3`
      );

      audio.volume = 0.5;
      audio.currentTime = 0;
      lineChangeAudioRef.current = audio;

      void audio.play().catch(console.warn);
    }

  function navigateToStation(station: Station) {
    // Cancel any pending ambience
    if (ambienceTimerRef.current !== null) {
      clearTimeout(ambienceTimerRef.current);
      ambienceTimerRef.current = null;
  }

  // Stop previous station sounds
  stationAudioRef.current?.pause();
  stationAudio2Ref.current?.pause();
  ambienceAudioRef.current?.pause();

  stationAudioRef.current = null;
  stationAudio2Ref.current = null;
  ambienceAudioRef.current = null;

  setSelectedStation(station);

  // Play train sound immediately
  const stationAudio = new Audio(
    `${import.meta.env.BASE_URL}audio/subway_station.mp3`
  );
  stationAudio.volume = 0.4;
  stationAudioRef.current = stationAudio;

  const stationAudio2 = new Audio(
    `${import.meta.env.BASE_URL}audio/doors.mp3`
  );
  stationAudio2.volume = 0.6;
  stationAudio2Ref.current = stationAudio2;

  void stationAudio.play().catch(console.warn);
  void stationAudio2.play().catch(console.warn);

  // Look for station-specific ambience
  const sounds = stationSounds as Record<string, string>;
  const ambiencePath = sounds[station.id.toLowerCase()];

  if (!ambiencePath) return;

  // Start ambience after 5 seconds
  ambienceTimerRef.current = setTimeout(() => {
    if (stationAudioRef.current !== stationAudio) return;

  const ambience = new Audio(
    `${import.meta.env.BASE_URL}${ambiencePath.replace(/^\//, '')}`
  );
    ambience.volume = 0.25;
    ambience.loop = true;

    ambienceAudioRef.current = ambience;
    void ambience.play().catch(console.warn);

    ambienceTimerRef.current = null;
  }, 5000);
}


function closeStation() {
  if (ambienceTimerRef.current !== null) {
    clearTimeout(ambienceTimerRef.current);
    ambienceTimerRef.current = null;
  }

  stationAudioRef.current?.pause();
  stationAudio2Ref.current?.pause();
  ambienceAudioRef.current?.pause();

  stationAudioRef.current = null;
  stationAudio2Ref.current = null;
  ambienceAudioRef.current = null;

  setSelectedStation(null);
}

useEffect(() => {
  return () => {
    if (ambienceTimerRef.current !== null) {
      clearTimeout(ambienceTimerRef.current);
    }

    stationAudioRef.current?.pause();
    stationAudio2Ref.current?.pause();    
    ambienceAudioRef.current?.pause();
    lineChangeAudioRef.current?.pause();

  };
}, []);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error('Could not play music:', error);
      }
    } else {
      audio.pause();
    }
  }

  return (
    <main>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/low_atmos-zen-meditation-music.mp3`}
        loop
        onLoadedMetadata={(e) => {
          e.currentTarget.volume = 0.2;
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="music-control">
        <span className="music-label">better with music</span>

        <button
          className="music-toggle"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute music' : 'Play music'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '♫' : '♪'}
        </button>
      </div> 

      <div className={`explorer ${selectedStation ? 'explorer--open' : ''}`}>
      <div className="explorer-map">
        <TokyoMap
          onStationClick={navigateToStation}
          selectedStation={selectedStation}
        />
      </div>

      <section className="explorer-gallery">
        {selectedStation && (
          <div className="gallery-content">
            <button
              className="gallery-close"
              onClick={closeStation}
              aria-label="Close gallery"
            >
              ×
            </button>

            <nav className="station-navigation" aria-label="Station navigation">
              <button
                className="station-nav-button station-nav-previous"
                onClick={() =>
                  previousStation && navigateToStation(previousStation)
                }
                disabled={!previousStation}
              >
                <span className="station-nav-arrow">〈</span>
                <span className="station-nav-label">
                  <span>{previousStation?.name ?? ''}</span>
                  <small>{previousStation?.nameJa ?? ''}</small>
                </span>
              </button>

              <div className="station-nav-current">
                <span>{selectedStation.name}</span>
                <small>{selectedStation.nameJa}</small>

                <span
                  className="station-nav-number"
                  style={{
                    backgroundColor: currentLine?.colour ?? '#ffffff',
                  }}
                >
                  {selectedStation.number.replaceAll(' ', '')}
                </span>

                {transferLines.length > 0 && (
                  <div className="station-transfers">
                    <span className="station-transfers-label">
                      switch here for
                    </span>

                    <div className="station-transfers-list">
                      {transferLines.map(line => {
                        const transferStation = line.stations.find(
                          station => station.id === selectedStation.id
                        );

                        if (!transferStation) return null;

                        return (
                          <button
                            key={line.id}
                            className="station-transfer-button"
                            style={{ borderColor: line.colour }}
                            onClick={() => {
                              playLineChangeSound();
                              setSelectedStation(transferStation);
                            }}
                          >
                            <span
                              className="station-transfer-dot"
                              style={{ backgroundColor: line.colour }}
                            />

                            {line.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="station-nav-button station-nav-next"
                onClick={() =>
                  nextStation && navigateToStation(nextStation)
                }
                disabled={!nextStation}
              >
                <span className="station-nav-label">
                  <span>{nextStation?.name ?? ''}</span>
                  <small>{nextStation?.nameJa ?? ''}</small>
                </span>
                <span className="station-nav-arrow">〉</span>
              </button>
            </nav>

            <h2>
              {selectedStation.name} | {selectedStation.nameJa}
            </h2>

            <p>
              {selectedStation.ward} | {selectedStation.wardJa}
              {': '}
              {selectedStation.number.replaceAll(' ', '')}
            </p>
          </div>
        )}
        <StationGallery
          key={selectedStation?.id ?? 'none'}
          photos={stationPhotos}
          station={selectedStation}
        />
      </section>
    </div>

      <footer className="site-footer">
        art &amp; photography:{' '}
        <a
          href="https://pychlau.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-author"
        >
          Larissa Pychlau
        </a>
        {' | '}
        music: Low_Atmos - Zen Meditation Music
        {' | '}
        sounds:{' '}
        <a
          href="https://pixabay.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pixabay
        </a>
      </footer>
    </main>
  );
}

export default App;
