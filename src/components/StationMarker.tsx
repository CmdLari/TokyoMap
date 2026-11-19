
import type { Station } from '../types/railway';

interface StationMarkerProps {
  station: Station;
  colour: string;
  onHover: (ward: string | null) => void;
  onClick: (station: Station) => void;
  isSelected: boolean;
}

function StationMarker({
  station,
  colour,
  onHover,
  onClick,
  isSelected,
}: StationMarkerProps) {
  const label = station.number.split(' ');

  return (
    <g
      className={`station-marker ${isSelected ? 'is-selected' : ''}`}
      transform={`translate(${station.x}, ${station.y})`}
      onMouseEnter={() => onHover(station.ward)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(station)}
    >
    <foreignObject
        className="station-tooltip-container"
        x={25}
        y={-15}
        width={220}
        height={65}
        pointerEvents="none"
        style={{ overflow: 'visible' }}
        >
        <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="station-tooltip"
        >
            {station.name.toUpperCase()} | {station.nameJa}
        </div>
        </foreignObject>

      <g className="station-visual">
        <circle
          r={13}
          fill="#ffffff"
          stroke={colour}
          strokeWidth={3}
        />

        <text
            textAnchor="middle"
            fill={colour}
            fontSize={10}
            fontWeight={700}
            pointerEvents="none"
            >
            <tspan x="0" dy="-0.7">
                {label[0]}
            </tspan>
            <tspan x="0" dy="9">
                {label[1]}
            </tspan>
        </text>
      </g>
      
    </g>
  );
}

export default StationMarker;
