import type Konva from 'konva';
import { Shape } from 'react-konva';
import type { MergedWallPolygon } from '../model/geometry';

interface WallFillProps {
  polygons: MergedWallPolygon[];
  fill: string;
  stroke: string;
  strokeWidth: number;
}

function traceRing(ctx: Konva.Context, flat: number[]) {
  if (flat.length < 6) return;
  ctx.moveTo(flat[0], flat[1]);
  for (let i = 2; i + 1 < flat.length; i += 2) ctx.lineTo(flat[i], flat[i + 1]);
  ctx.closePath();
}

/**
 * Tô thân tường đã union, GIỮ lỗ trong (phòng/sân kín) bằng fillRule
 * "evenodd". Konva `Line` closed không vẽ được lỗ: nó chỉ tô vòng ngoài
 * nên vòng tường khép kín bị tô đầy cả phòng thành một khối đặc.
 */
export default function WallFill({ polygons, fill, stroke, strokeWidth }: WallFillProps) {
  return (
    <Shape
      listening={false}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fillRule="evenodd"
      sceneFunc={(ctx, shape) => {
        ctx.beginPath();
        for (const poly of polygons) {
          traceRing(ctx, poly.outer);
          for (const hole of poly.holes) traceRing(ctx, hole);
        }
        ctx.fillStrokeShape(shape);
      }}
    />
  );
}
