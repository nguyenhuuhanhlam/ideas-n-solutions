import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Edges, Grid, OrbitControls } from '@react-three/drei';
import { buildingBounds, wallSegments } from '../model/geometry3d';
import { useBuildingStore } from '../store/useBuildingStore';

/**
 * View 3D dựng trực tiếp từ Building JSON trong store (cùng nguồn sự thật
 * với View2D). Quy ước tọa độ — xem model/geometry3d.ts:
 * 1 unit = 1 m; X = x (2D), Z = y (2D, dương về phía nam), Y thẳng đứng.
 */

const COLORS = {
  light: {
    bg: '#FCFCFC',
    floor: '#dcdcd8',
    gridCell: '#c9c9c4',
    gridSection: '#a8a8a2',
    wall: '#f4f4f2',
    edge: '#8a8a84',
    selected: '#2563eb',
  },
  dark: {
    bg: '#1c1c1f',
    floor: '#232326',
    gridCell: '#333338',
    gridSection: '#4a4a52',
    wall: '#3f3f46',
    edge: '#71717a',
    selected: '#60a5fa',
  },
} as const;

export default function View3D() {
  // Selector hẹp: chỉ re-render khi building/theme/selection đổi.
  const building = useBuildingStore((s) => s.building);
  const theme = useBuildingStore((s) => s.theme);
  const selectedWallIds = useBuildingStore((s) => s.selectedWallIds);
  const c = COLORS[theme];

  const bounds = useMemo(() => buildingBounds(building), [building]);

  const walls = useMemo(
    () =>
      building.levels.flatMap((level) =>
        level.walls.map((wall) => ({
          id: wall.id,
          boxes: wallSegments(
            wall,
            level.openings.filter((o) => o.wallId === wall.id),
            level.height,
            level.elevation,
          ),
        })),
      ),
    [building],
  );

  // Camera chéo isometric-ish từ bounding box; target = tâm building.
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cz = (bounds.minZ + bounds.maxZ) / 2;
  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ, bounds.maxY, 1);
  const camPos: [number, number, number] = [
    cx + span * 0.85,
    bounds.maxY + span * 0.75,
    cz + span * 0.85,
  ];
  const target: [number, number, number] = [cx, bounds.maxY / 2, cz];

  return (
    <div className="h-full w-full">
      <Canvas shadows dpr={[1, 2]} camera={{ position: camPos, fov: 45, near: 0.1, far: 500 }}>
        <color attach="background" args={[c.bg]} />
        <ambientLight intensity={0.55} />
        <hemisphereLight intensity={0.35} />
        <directionalLight
          castShadow
          position={[cx + span, bounds.maxY + span * 1.2, cz + span * 0.5]}
          intensity={1.4}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-span}
          shadow-camera-right={span}
          shadow-camera-top={span}
          shadow-camera-bottom={-span}
          shadow-camera-near={0.5}
          shadow-camera-far={span * 4}
          shadow-bias={-0.0002}
        />

        {/* Sàn nhận bóng + lưới 1m (vạch đậm mỗi 5m). */}
        <mesh rotation-x={-Math.PI / 2} position={[cx, 0, cz]} receiveShadow>
          <planeGeometry args={[span * 6, span * 6]} />
          <meshStandardMaterial color={c.floor} />
        </mesh>
        <Grid
          position={[cx, 0.01, cz]}
          args={[span * 6, span * 6]}
          cellSize={1}
          cellColor={c.gridCell}
          sectionSize={5}
          sectionColor={c.gridSection}
          fadeDistance={span * 3}
          fadeStrength={1}
        />

        {/* Tường: mỗi tường là các box quanh lỗ cửa (không CSG). */}
        {walls.map((wall) =>
          wall.boxes.map((box, i) => (
            <mesh
              key={`${wall.id}-${i}`}
              position={box.center}
              rotation-y={box.rotationY}
              castShadow
              receiveShadow
            >
              <boxGeometry args={box.size} />
              <meshStandardMaterial
                color={selectedWallIds.includes(wall.id) ? c.selected : c.wall}
                roughness={0.9}
              />
              <Edges color={c.edge} />
            </mesh>
          )),
        )}

        <OrbitControls makeDefault target={target} />
      </Canvas>
    </div>
  );
}
