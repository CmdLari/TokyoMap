
import type { TrainLine as TrainLineData } from '../types/railway';

interface TrainLineProps {
  line: TrainLineData;
  active?: boolean;
}

function TrainLine({ line, active = false }: TrainLineProps) {
  const isActive = active;

  const path = line.stations
    .map((station, index) =>
      `${index === 0 ? 'M' : 'L'} ${station.x} ${station.y}`
    )
    .join(' ');

  return (
    <g className="train-line-group">
      {/* Coloured glow */}
      <path
        d={path}
        stroke={line.colour}
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isActive ? 0.9 : 0}
        className="train-line-glow"
        pointerEvents="none"
      />
      
      {/* Main railway line */}
      <path
        d={path}
        stroke={line.colour}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="none"
      />

    </g>
  );
}

export default TrainLine;
