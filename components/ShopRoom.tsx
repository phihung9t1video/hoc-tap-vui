"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { OL } from "@/lib/draw";
import { HOME_MAP } from "@/lib/home";
import { Box, FloorQuad, TH, TW, poly, pt, shade, type Proj } from "@/lib/iso";
import type { Look } from "@/lib/types";
import { Avatar } from "./Avatar";

/**
 * Bên trong một cửa hàng: phòng isometric có kệ hàng sát tường, bàn trưng bày,
 * quầy thu ngân và đồ trang trí. Hàng hoá được vẽ lên kệ; chạm vào món nào thì
 * nhân vật đi tới đứng trước món đó.
 */
export const SHOP_N = 8;
const WALL_H = 150;
const P: Proj = { ox: (SHOP_N * TW) / 2 + 12, oy: WALL_H + 16 };
const VIEW_W = SHOP_N * TW + 24;
const VIEW_H = P.oy + SHOP_N * TH + 22;
const S = 0.33;
/** Cửa ra phố trên tường trái */
const DOOR_Y = 6;
const ENTRY: [number, number] = [1, DOOR_Y];

/** Vị trí bày hàng: z là độ cao mặt kệ, stand là ô nhân vật đứng xem */
export interface ShelfSpot {
  x: number;
  y: number;
  z: number;
  size: number;
  stand: [number, number];
}

const BOARDS = [6, 46, 86];
export const SHELF_SPOTS: ShelfSpot[] = [
  // Kệ tường phải (dọc theo trục x)
  ...BOARDS.flatMap((z) => [1, 2, 3, 4, 5].map((i): ShelfSpot => ({ x: i + 0.5, y: 0.3, z, size: 30, stand: [i, 1] }))),
  // Kệ tường trái (dọc theo trục y)
  ...BOARDS.flatMap((z) => [1, 2, 3, 4].map((j): ShelfSpot => ({ x: 0.3, y: j + 0.5, z, size: 30, stand: [1, j] }))),
  // Hai bàn trưng bày hàng nổi bật giữa cửa hàng
  { x: 2.5, y: 3.5, z: 30, size: 44, stand: [2, 4] },
  { x: 3.5, y: 3.5, z: 30, size: 44, stand: [3, 4] },
  { x: 2.5, y: 5.5, z: 30, size: 44, stand: [2, 6] },
  { x: 3.5, y: 5.5, z: 30, size: 44, stand: [3, 6] },
];

const BLOCKED = new Set<string>([
  ...Array.from({ length: SHOP_N }, (_, i) => `${i},0`),
  ...Array.from({ length: SHOP_N }, (_, i) => `0,${i}`),
  "2,3", "3,3", "2,5", "3,5",
  // Quầy thu ngân và chỗ người bán
  "6,1", "7,1", "6,2", "7,2", "6,3", "7,3",
  // Cây cảnh, bóng bay
  "7,7", "5,7",
]);

function findPath(from: [number, number], to: [number, number]): [number, number][] {
  const key = (x: number, y: number) => `${x},${y}`;
  const free = (x: number, y: number) => x >= 0 && y >= 0 && x < SHOP_N && y < SHOP_N && !BLOCKED.has(key(x, y));
  const prev = new Map<string, string | null>([[key(...from), null]]);
  const queue: [number, number][] = [from];
  while (queue.length) {
    const [x, y] = queue.shift()!;
    if (x === to[0] && y === to[1]) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (free(nx, ny) && !prev.has(key(nx, ny))) {
        prev.set(key(nx, ny), key(x, y));
        queue.push([nx, ny]);
      }
    }
  }
  if (!prev.has(key(...to))) return [];
  const path: [number, number][] = [];
  for (let k: string | null = key(...to); k && k !== key(...from); k = prev.get(k) ?? null) {
    const [a, b] = k.split(",").map(Number);
    path.unshift([a, b]);
  }
  return path;
}

/** Chữ viết nghiêng theo mặt tường phải (y = 0) */
function WallText({ x, z, text, size, fill }: { x: number; z: number; text: string; size: number; fill: string }) {
  const [sx, sy] = pt(P, x, 0, z);
  return (
    <text transform={`matrix(1 0.5 0 1 ${sx.toFixed(1)} ${sy.toFixed(1)})`} fontSize={size} fontWeight={900} fill={fill} stroke="#fff" strokeWidth={3} paintOrder="stroke">
      {text}
    </text>
  );
}

export function ShopRoom({
  name,
  icon,
  color,
  look,
  keeper,
  goods,
  selected,
  onPick,
  onExit,
}: {
  name: string;
  icon: string;
  color: string;
  /** Trang phục nhân vật (đang mặc thử thì là đồ thử) */
  look: Look;
  /** Người bán hàng */
  keeper: Look;
  /** Hình món hàng ở từng vị trí kệ (cùng thứ tự SHELF_SPOTS), kèm dấu đã có */
  goods: ({ key: string; node: ReactNode; owned: boolean } | null)[];
  selected?: string;
  onPick: (index: number) => void;
  onExit: () => void;
}) {
  const [me, setMe] = useState({ x: ENTRY[0], y: ENTRY[1], back: false });
  const meRef = useRef(me);
  meRef.current = me;
  const path = useRef<[number, number][]>([]);
  const arrive = useRef<(() => void) | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  function loop() {
    let last = performance.now();
    const step = (t: number) => {
      const dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
      last = t;
      const m = { ...meRef.current };
      const next = path.current[0];
      if (!next) {
        raf.current = null;
        const done = arrive.current;
        arrive.current = null;
        done?.();
        return;
      }
      const dx = next[0] - m.x;
      const dy = next[1] - m.y;
      const dist = Math.hypot(dx, dy);
      const v = 3.2 * dt;
      if (dist <= Math.max(v, 1e-6)) {
        m.x = next[0];
        m.y = next[1];
        path.current.shift();
      } else {
        m.x += (dx / dist) * v;
        m.y += (dy / dist) * v;
      }
      m.back = dx + dy < 0;
      setMe(m);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }

  function walkTo(to: [number, number], then?: () => void) {
    const from: [number, number] = [Math.round(meRef.current.x), Math.round(meRef.current.y)];
    path.current = findPath(from, to);
    arrive.current = then ?? null;
    if (!raf.current) loop();
  }

  // ---------- Tường, sàn, kệ ----------
  const back: ReactNode[] = [];
  const wall = "#fff7ed";
  const band = shade(color, 1.45);
  // Tường trái (x = 0) và tường phải (y = 0)
  back.push(
    <polygon key="wl" points={poly([pt(P, 0, SHOP_N), pt(P, 0, 0), pt(P, 0, 0, WALL_H), pt(P, 0, SHOP_N, WALL_H)])} fill={shade(wall, 0.93)} stroke={OL} strokeWidth={2} />,
    <polygon key="wr" points={poly([pt(P, 0, 0), pt(P, SHOP_N, 0), pt(P, SHOP_N, 0, WALL_H), pt(P, 0, 0, WALL_H)])} fill={wall} stroke={OL} strokeWidth={2} />,
    <polygon key="bl" points={poly([pt(P, 0, SHOP_N), pt(P, 0, 0), pt(P, 0, 0, 22), pt(P, 0, SHOP_N, 22)])} fill={shade(band, 0.92)} />,
    <polygon key="br" points={poly([pt(P, 0, 0), pt(P, SHOP_N, 0), pt(P, SHOP_N, 0, 22), pt(P, 0, 0, 22)])} fill={band} />,
  );
  // Sàn caro
  for (let x = 0; x < SHOP_N; x++)
    for (let y = 0; y < SHOP_N; y++)
      back.push(
        <FloorQuad
          key={`f${x}-${y}`}
          p={P}
          x={x}
          y={y}
          w={1}
          d={1}
          fill={(x + y) % 2 ? "#f1f5f9" : "#ffffff"}
          stroke="#e2e8f0"
        />,
      );
  // Thảm giữa cửa hàng
  back.push(<FloorQuad key="rug" p={P} x={1.6} y={2.6} w={3.8} d={3.8} fill={shade(color, 1.6)} stroke={shade(color, 1.1)} opacity={0.7} />);
  // Dây cờ trang trí trên hai bức tường
  for (let i = 0; i < SHOP_N * 2; i++) {
    const a = i / 2;
    const r = [pt(P, a, 0.02, WALL_H - 8), pt(P, a + 0.5, 0.02, WALL_H - 8), pt(P, a + 0.25, 0.02, WALL_H - 26)];
    const l = [pt(P, 0.02, a, WALL_H - 8), pt(P, 0.02, a + 0.5, WALL_H - 8), pt(P, 0.02, a + 0.25, WALL_H - 26)];
    back.push(<polygon key={`fr${i}`} points={poly(r)} fill={i % 2 ? "#fde68a" : color} stroke={OL} strokeWidth={1} />);
    back.push(<polygon key={`fl${i}`} points={poly(l)} fill={i % 2 ? color : "#bae6fd"} stroke={OL} strokeWidth={1} />);
  }
  // Biển tên cửa hàng trên tường phải
  back.push(
    <polygon key="sign" points={poly([pt(P, 1.2, 0.01, 104), pt(P, 5.8, 0.01, 104), pt(P, 5.8, 0.01, 128), pt(P, 1.2, 0.01, 128)])} fill={color} stroke={OL} strokeWidth={2} />,
    <WallText key="signt" x={1.45} z={109} text={`${icon} ${name.toUpperCase()}`} size={15} fill="#fff" />,
  );
  // Cửa ra phố trên tường trái
  const door = [pt(P, 0, DOOR_Y + 0.12), pt(P, 0, DOOR_Y + 0.88), pt(P, 0, DOOR_Y + 0.88, 96), pt(P, 0, DOOR_Y + 0.12, 96)];
  back.push(
    <g key="door" onClick={(e) => { e.stopPropagation(); walkTo(ENTRY, onExit); }} style={{ cursor: "pointer" }}>
      <polygon points={poly(door)} fill="#bae6fd" stroke={OL} strokeWidth={2} />
      <path d={`M${pt(P, 0, DOOR_Y + 0.5)[0]} ${pt(P, 0, DOOR_Y + 0.5)[1]} L${pt(P, 0, DOOR_Y + 0.5, 96)[0]} ${pt(P, 0, DOOR_Y + 0.5, 96)[1]}`} stroke={OL} strokeWidth={2} />
      <polygon points={poly([pt(P, 0, DOOR_Y - 0.1, 100), pt(P, 0, DOOR_Y + 1.1, 100), pt(P, 0, DOOR_Y + 1.1, 116), pt(P, 0, DOOR_Y - 0.1, 116)])} fill="#16a34a" stroke={OL} strokeWidth={1.5} />
      <text transform={`matrix(1 -0.5 0 1 ${pt(P, 0, DOOR_Y + 1.02, 103)[0].toFixed(1)} ${pt(P, 0, DOOR_Y + 1.02, 103)[1].toFixed(1)})`} fontSize={10} fontWeight={900} fill="#fff">
        🚪 RA PHỐ
      </text>
    </g>,
  );
  // Kệ gỗ sát tường: tấm lưng, các tầng kệ, cột hai bên
  const wood = "#c08552";
  back.push(<Box key="kr-back" p={P} x={1} y={0} w={5} d={0.12} h={100} color={shade(wood, 1.15)} />);
  back.push(<Box key="kl-back" p={P} x={0} y={1} w={0.12} d={4} h={100} color={shade(wood, 1.1)} />);
  for (const z of BOARDS) {
    back.push(<Box key={`kr${z}`} p={P} x={1} y={0} z={z - 5} w={5} d={0.6} h={5} color={wood} />);
    back.push(<Box key={`kl${z}`} p={P} x={0} y={1} z={z - 5} w={0.6} d={4} h={5} color={wood} />);
  }

  // ---------- Hàng hoá trên kệ ----------
  const spotNode = (i: number): ReactNode => {
    const g = goods[i];
    if (!g) return null;
    const s = SHELF_SPOTS[i];
    const [sx, sy] = pt(P, s.x, s.y, s.z);
    const on = selected === g.key;
    return (
      <g
        key={`g${i}`}
        transform={`translate(${(sx - s.size / 2).toFixed(1)} ${(sy - s.size).toFixed(1)})`}
        onClick={(e) => {
          e.stopPropagation();
          walkTo(s.stand);
          onPick(i);
        }}
        style={{ cursor: "pointer" }}
        className={on ? "shop-on" : undefined}
      >
        <rect x={-2} y={-2} width={s.size + 4} height={s.size + 4} rx={8} fill={on ? "#fde68a" : "transparent"} stroke={on ? "#f59e0b" : "none"} strokeWidth={2} />
        <svg width={s.size} height={s.size} overflow="visible">
          {g.node}
        </svg>
        {g.owned && (
          <text x={s.size - 2} y={8} fontSize={10} textAnchor="middle">
            ✅
          </text>
        )}
      </g>
    );
  };
  for (let i = 0; i < SHELF_SPOTS.length - 4; i++) back.push(spotNode(i));

  // ---------- Đồ đứng trên sàn (xếp theo chiều sâu) ----------
  const objects: { key: number; node: ReactNode }[] = [];
  const cloth = shade(color, 1.5);
  for (const ty of [3, 5]) {
    objects.push({
      key: 2 + 1 + ty + 0.5,
      node: (
        <g key={`t${ty}`}>
          <Box p={P} x={2} y={ty} w={2} d={1} h={26} color={cloth} top={shade(cloth, 1.08)} />
          {spotNode(SHELF_SPOTS.length - 4 + (ty === 3 ? 0 : 2))}
          {spotNode(SHELF_SPOTS.length - 3 + (ty === 3 ? 0 : 2))}
        </g>
      ),
    });
  }
  // Quầy thu ngân, máy tính tiền và người bán
  const [kx, ky] = pt(P, 6.9, 2.1);
  objects.push({
    key: 7 + 2.1,
    node: (
      <g key="keeper" transform={`translate(${(kx - 100 * S).toFixed(1)} ${(ky - 270 * S).toFixed(1)})`} pointerEvents="none">
        <Avatar look={keeper} size={200 * S} layer="char" />
      </g>
    ),
  });
  objects.push({
    key: 6 + 3.5 + 1,
    node: (
      <g key="counter" pointerEvents="none">
        <Box p={P} x={6} y={3} w={1.9} d={0.7} h={40} color={shade(color, 0.95)} top="#f8fafc" />
        <Box p={P} x={6.9} y={3.15} z={40} w={0.5} d={0.4} h={12} color="#475569" top="#334155" />
        <polygon points={poly([pt(P, 6.95, 3.15, 52), pt(P, 7.35, 3.15, 52), pt(P, 7.35, 3.15, 66), pt(P, 6.95, 3.15, 66)])} fill="#86efac" stroke={OL} strokeWidth={1.2} />
        <text x={pt(P, 6.4, 3.7, 44)[0]} y={pt(P, 6.4, 3.7, 44)[1]} fontSize={16}>
          🛍️
        </text>
      </g>
    ),
  });
  // Cây cảnh, bóng bay lấy từ đồ trong nhà
  for (const [id, x, y] of [["h_cay_cao", 7, 7], ["h_bong_bay", 5, 7]] as [string, number, number][]) {
    const it = HOME_MAP[id];
    if (it?.floor) objects.push({ key: x + y + 1, node: <g key={id} pointerEvents="none">{it.floor({ p: P, x, y, rot: 0 })}</g> });
  }
  // Nhân vật
  const [cx, cy] = pt(P, me.x + 0.5, me.y + 0.5);
  const bob = path.current.length ? Math.abs(Math.sin(performance.now() / 90)) * 3 : 0;
  objects.push({
    key: me.x + me.y + 1.01,
    node: (
      <g key="me" transform={`translate(${(cx - 100 * S).toFixed(1)} ${(cy - 270 * S - bob).toFixed(1)})`} pointerEvents="none">
        <ellipse cx={100 * S} cy={270 * S + bob} rx={18} ry={6} fill="#000" opacity={0.15} />
        <Avatar look={look} size={200 * S} layer="char" angle={me.back ? 180 : 0} />
      </g>
    ),
  });
  objects.sort((a, b) => a.key - b.key);

  // Chạm sàn: đi tới ô đó
  function onFloor(e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const r = p.matrixTransform(m.inverse());
    const X = (r.x - P.ox) / (TW / 2);
    const Y = (r.y - P.oy) / (TH / 2);
    const tx = Math.floor((X + Y) / 2);
    const ty = Math.floor((Y - X) / 2);
    if (tx >= 0 && ty >= 0 && tx < SHOP_N && ty < SHOP_N && !BLOCKED.has(`${tx},${ty}`)) walkTo([tx, ty]);
  }

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" style={{ display: "block", background: "linear-gradient(#fffaf0, #fef3c7)" }} onClick={onFloor} role="img" aria-label={`Bên trong cửa hàng ${name}`}>
      {back}
      {objects.map((o) => o.node)}
    </svg>
  );
}
