
import Ward from './Ward';
import { wards } from '../data/wards';

interface WardLayerProps {
  width: number;
  height: number;
  hoveredWard: string | null;
}

function WardLayer({
  width,
  height,
  hoveredWard,
}: WardLayerProps) {
  const ward = hoveredWard ? wards[hoveredWard.toLowerCase()] : null;

  if (!ward) return null;

  return (
    <g className="ward-layer" pointerEvents="none">
      <Ward
        ward={ward}
        width={width}
        height={height}
        hovered={true}
      />
    </g>
  );
}

export default WardLayer;
