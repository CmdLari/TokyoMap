
import { lines } from '../data/lines';
import TrainLine from './TrainLine';

interface TrainLineLayerProps {
  hoveredLine: string | null;
}

function TrainLineLayer({ hoveredLine }: TrainLineLayerProps) {
  return (
    <g className="train-line-layer">
      {Object.values(lines).map(line => (
        <TrainLine
          key={line.id}
          line={line}
          active={hoveredLine === line.id}
        />
      ))}
    </g>
  );
}

export default TrainLineLayer;
