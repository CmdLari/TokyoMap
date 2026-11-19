
import type { Ward as WardData } from '../types/map';

interface WardProps {
  ward: WardData;
  width: number;
  height: number;
  hovered: boolean;
}

function Ward({ ward, width, height, hovered }: WardProps) {
  return (
    <g
      className={`ward-piece ${hovered ? 'is-hovered' : ''}`}
      pointerEvents="none"
    >
      <image
        href={ward.image}
        x={0}
        y={0}
        width={width}
        height={height}
      />
    </g>
  );
}

export default Ward;
