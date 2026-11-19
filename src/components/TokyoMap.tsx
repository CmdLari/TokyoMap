
import { useState } from 'react';
import { lines } from '../data/lines';
import WardLayer from './WardLayer';
import TrainLineLayer from './TrainLineLayer';
import StationLayer from './StationLayer';
import type { Station } from '../types/railway';

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 1250;

interface TokyoMapProps {
  onStationClick: (station: Station) => void;
  selectedStation: Station | null;
}

function TokyoMap({
  onStationClick,
  selectedStation,
}: TokyoMapProps) {
  const [hoveredWard, setHoveredWard] = useState<string | null>(null);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  // Find the line containing the selected station.
  const selectedLine = selectedStation
    ? Object.values(lines).find(line =>
        line.stations.some(station =>
          station.id === selectedStation.id &&
          station.number === selectedStation.number
        )
      )
    : null;

  // Hover takes priority over selection.
  const activeWard = hoveredWard ?? selectedStation?.ward ?? null;
  const activeLine = hoveredLine ?? selectedLine?.id ?? null;

  return (
    <div className="map-container">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <image
          href="/images/tokyo-base.png"
          x={0}
          y={0}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          pointerEvents="none"
        />

        <WardLayer
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          hoveredWard={activeWard}
        />

        <TrainLineLayer hoveredLine={activeLine} />

        <StationLayer
          onHover={setHoveredWard}
          onLineHover={setHoveredLine}
          onStationClick={onStationClick}
          selectedStation={selectedStation}
        />

        <image
          href="/images/overlay.png"
          x={0}
          y={0}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}

export default TokyoMap;
