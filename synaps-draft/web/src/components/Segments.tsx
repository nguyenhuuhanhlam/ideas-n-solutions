import type Konva from 'konva';
import { Shape } from 'react-konva';

/**
 * Vẽ nhiều đoạn thẳng RỜI NHAU trong 1 node duy nhất.
 *
 * Konva `Line` nối mọi điểm thành 1 đường liên tục, nên không dùng được
 * cho lưới/trục/dimension: nó sinh đoạn chéo nối cuối đoạn này tới đầu
 * đoạn sau (lỗi lưới chéo thấy trên demo 15-11). Component này vẽ mỗi
 * bộ 4 số thành 1 đoạn riêng bằng moveTo/lineTo.
 */
interface SegmentsProps {
  /** Mảng phẳng: mỗi 4 số là 1 đoạn (x1, y1, x2, y2). */
  points: number[];
  stroke: string;
  strokeWidth: number;
  dash?: number[];
}

export default function Segments({ points, stroke, strokeWidth, dash }: SegmentsProps) {
  return (
    <Shape
      listening={false}
      stroke={stroke}
      strokeWidth={strokeWidth}
      dash={dash}
      sceneFunc={(ctx: Konva.Context, shape: Konva.Shape) => {
        ctx.beginPath();
        for (let i = 0; i + 3 < points.length; i += 4) {
          ctx.moveTo(points[i], points[i + 1]);
          ctx.lineTo(points[i + 2], points[i + 3]);
        }
        ctx.strokeShape(shape);
      }}
    />
  );
}
