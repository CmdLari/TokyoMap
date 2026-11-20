
import { useState } from 'react';
import { lines } from '../data/lines';
import { getStationPhotos } from '../utils/getStationPhotos';
import StationMarker from './StationMarker';
import type { Station } from '../types/railway';

interface StationLayerProps {
  onHover: (ward: string | null) => void;
  onLineHover: (line: string | null) => void;
  onStationClick: (station: Station) => void;
  selectedStation: Station | null;
}

function StationLayer({
  onHover,
  onLineHover,
  onStationClick,
  selectedStation,
}: StationLayerProps) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const stations = Object.values(lines).flatMap(line =>
    line.stations
      .filter(station => getStationPhotos(station).length > 0)
      .map(station => ({
        station,
        colour: line.colour,
        lineId: line.id,
        key: `${line.id}-${station.id}`,
      }))
  );

  // Match the selected station using both ID and number.
  const selectedKey = selectedStation
    ? stations.find(item =>
        item.station.id === selectedStation.id &&
        item.station.number === selectedStation.number
      )?.key ?? null
    : null;

  // Hover takes priority over selection.
  const activeKey = hoveredStation ?? selectedKey;

  // Draw the active station last so it appears on top.
  const orderedStations = [
    ...stations.filter(item => item.key !== activeKey),
    ...stations.filter(item => item.key === activeKey),
  ];

  function handleHover(
    key: string | null,
    ward: string | null,
    lineId: string | null
  ) {
    setHoveredStation(key);
    onHover(ward);
    onLineHover(lineId);
  }

  return (
    <g className="station-layer">
      {orderedStations.map(({ station, colour, lineId, key }) => (
        <StationMarker
          key={key}
          station={station}
          colour={colour}
          onClick={onStationClick}
          isSelected={key === activeKey}
          onHover={ward =>
            handleHover(
              ward ? key : null,
              ward,
              ward ? lineId : null
            )
          }
        />
      ))}
    </g>
  );
}

export default StationLayer;
