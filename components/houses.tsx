import type { ReactNode } from "react";
import { OL, Sparkle } from "@/lib/draw";
import { Box, FloorQuad, Shadow, poly, pt, shade, type Proj } from "@/lib/iso";
import { COLOR_MAP } from "@/lib/town";

type Pt = [number, number];

/** Nhà mái dốc: tường hộp + mái hai mái, nóc chạy dọc trục x */
function Gable(p: { p: Proj; x: number; y: number; w: number; d: number; h: number; rise: number; wall: string; roof: string }) {
  const { x, y, w, d, h, rise } = p;
  const A = pt(p.p, x, y + d, h);
  const B = pt(p.p, x + w, y + d, h);
  const C = pt(p.p, x + w, y, h);
  const R1 = pt(p.p, x, y + d / 2, h + rise);
  const R2 = pt(p.p, x + w, y + d / 2, h + rise);
  return (
    <g>
      <Box p={p.p} x={x} y={y} w={w} d={d} h={h} color={p.wall} />
      <polygon points={poly([A, B, R2, R1])} fill={p.roof} stroke={OL} strokeWidth={2} />
      <polygon points={poly([B, C, R2])} fill={shade(p.wall, 0.78)} stroke={OL} strokeWidth={2} />
      <path d={`M${A[0]} ${A[1]} L${B[0]} ${B[1]}`} stroke={shade(p.roof, 0.7)} strokeWidth={4} />
    </g>
  );
}

/** Hình chữ nhật nằm trên mặt tường trước-trái (mặt y = y0), u dọc theo x, z là độ cao */
const faceL = (p: Proj, y0: number, u0: number, u1: number, z0: number, z1: number): Pt[] => [
  pt(p, u0, y0, z0),
  pt(p, u1, y0, z0),
  pt(p, u1, y0, z1),
  pt(p, u0, y0, z1),
];
/** Hình chữ nhật trên mặt tường trước-phải (mặt x = x0), v dọc theo y */
const faceR = (p: Proj, x0: number, v0: number, v1: number, z0: number, z1: number): Pt[] => [
  pt(p, x0, v0, z0),
  pt(p, x0, v1, z0),
  pt(p, x0, v1, z1),
  pt(p, x0, v0, z1),
];

const Win = ({ pts }: { pts: Pt[] }) => <polygon points={poly(pts)} fill="#bae6fd" stroke={OL} strokeWidth={1.5} />;
const Door = ({ pts }: { pts: Pt[] }) => <polygon points={poly(pts)} fill="#92400e" stroke={OL} strokeWidth={1.5} />;

const Bush = ({ p, x, y, color = "#22c55e" }: { p: Proj; x: number; y: number; color?: string }) => {
  const [sx, sy] = pt(p, x, y);
  return (
    <g stroke={OL} strokeWidth={1.2}>
      <circle cx={sx - 5} cy={sy - 7} r={7} fill={color} />
      <circle cx={sx + 5} cy={sy - 7} r={7} fill={shade(color, 0.85)} />
      <circle cx={sx} cy={sy - 12} r={7} fill={shade(color, 1.15)} />
    </g>
  );
};

export function HouseArt({ p, x, y, tier, color }: { p: Proj; x: number; y: number; tier: string; color: string }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.kem;
  const parts: ReactNode[] = [];

  if (tier === "cap4") {
    const [hx, hy, w, d, h] = [x + 0.5, y + 0.6, 2, 1.8, 36];
    parts.push(
      <Shadow key="s" p={p} x={hx} y={hy} w={w} d={d} />,
      <Gable key="g" p={p} x={hx} y={hy} w={w} d={d} h={h} rise={26} wall={c.wall} roof={c.roof} />,
      <Door key="d" pts={faceL(p, hy + d, hx + 0.8, hx + 1.2, 0, 22)} />,
      <Win key="w1" pts={faceL(p, hy + d, hx + 0.2, hx + 0.6, 12, 26)} />,
      <Win key="w2" pts={faceL(p, hy + d, hx + 1.4, hx + 1.8, 12, 26)} />,
      <Win key="w3" pts={faceR(p, hx + w, hy + 0.6, hy + 1.2, 12, 26)} />,
    );
  } else if (tier === "nhaong") {
    const [hx, hy, w, d, h] = [x + 0.8, y + 0.5, 1.4, 2, 86];
    parts.push(
      <Shadow key="s" p={p} x={hx} y={hy} w={w} d={d} />,
      <Box key="b" p={p} x={hx} y={hy} w={w} d={d} h={h} color={c.wall} />,
      <Box key="r" p={p} x={hx - 0.05} y={hy - 0.05} w={w + 0.1} d={d + 0.1} z={h} h={6} color={c.roof} />,
      <Door key="d" pts={faceL(p, hy + d, hx + 0.5, hx + 0.9, 0, 24)} />,
      <Win key="w1" pts={faceL(p, hy + d, hx + 0.25, hx + 1.15, 52, 72)} />,
      <Win key="w2" pts={faceR(p, hx + w, hy + 0.4, hy + 1.6, 16, 34)} />,
      <Win key="w3" pts={faceR(p, hx + w, hy + 0.4, hy + 1.6, 54, 72)} />,
      <Box key="bal" p={p} x={hx + 0.1} y={hy + d} w={w - 0.2} d={0.35} z={44} h={4} color="#e5e7eb" />,
      <polyline key="rail" points={poly([pt(p, hx + 0.1, hy + d + 0.35, 56), pt(p, hx + w - 0.1, hy + d + 0.35, 56)])} fill="none" stroke={OL} strokeWidth={2} />,
    );
  } else if (tier === "nhavuon") {
    const [hx, hy, w, d, h] = [x + 0.4, y + 0.35, 2.2, 1.6, 40];
    // Hàng rào thấp quanh vườn
    parts.push(
      <FloorQuad key="lawn" p={p} x={x + 0.05} y={y + 0.05} w={2.9} d={2.9} fill="#86efac" stroke="none" />,
      <Box key="f1" p={p} x={x + 0.05} y={y + 2.9} w={1.15} d={0.06} h={8} color="#fef3c7" sw={1} />,
      <Box key="f2" p={p} x={x + 1.85} y={y + 2.9} w={1.1} d={0.06} h={8} color="#fef3c7" sw={1} />,
      <Box key="f3" p={p} x={x + 2.9} y={y + 0.05} w={0.06} d={2.9} h={8} color="#fef3c7" sw={1} />,
      <Shadow key="s" p={p} x={hx} y={hy} w={w} d={d} />,
      <Gable key="g" p={p} x={hx} y={hy} w={w} d={d} h={h} rise={30} wall={c.wall} roof={c.roof} />,
      <Door key="d" pts={faceL(p, hy + d, hx + 0.9, hx + 1.3, 0, 24)} />,
      <Win key="w1" pts={faceL(p, hy + d, hx + 0.2, hx + 0.65, 14, 30)} />,
      <Win key="w2" pts={faceL(p, hy + d, hx + 1.55, hx + 2, 14, 30)} />,
      <Bush key="b1" p={p} x={x + 0.4} y={y + 2.5} color="#f472b6" />,
      <Bush key="b2" p={p} x={x + 2.6} y={y + 2.4} />,
      <Bush key="b3" p={p} x={x + 2.6} y={y + 1.2} color="#facc15" />,
    );
  } else if (tier === "bietthu") {
    parts.push(
      <FloorQuad key="lawn" p={p} x={x + 0.05} y={y + 0.05} w={2.9} d={2.9} fill="#bbf7d0" stroke="none" />,
      <FloorQuad key="pool" p={p} x={x + 1.65} y={y + 1.75} w={1.15} d={1} fill="#38bdf8" />,
      <FloorQuad key="pool2" p={p} x={x + 1.8} y={y + 1.9} w={0.85} d={0.7} fill="#7dd3fc" stroke="none" />,
      <Shadow key="s" p={p} x={x + 0.25} y={y + 0.25} w={2.5} d={1.4} />,
      <Box key="main" p={p} x={x + 0.25} y={y + 0.25} w={2.5} d={1.3} h={70} color={c.wall} />,
      <Box key="roof" p={p} x={x + 0.2} y={y + 0.2} w={2.6} d={1.4} z={70} h={6} color={c.roof} />,
      <Box key="wing" p={p} x={x + 0.25} y={y + 1.55} w={1.2} d={1.2} h={42} color={shade(c.wall, 1.05)} />,
      <Box key="wroof" p={p} x={x + 0.2} y={y + 1.5} w={1.3} d={1.3} z={42} h={5} color={c.roof} />,
      <Door key="d" pts={faceL(p, y + 2.75, x + 0.6, x + 1.0, 0, 26)} />,
      <Win key="w1" pts={faceL(p, y + 1.55, x + 1.6, x + 2.5, 16, 36)} />,
      <Win key="w2" pts={faceL(p, y + 1.55, x + 1.6, x + 2.5, 46, 64)} />,
      <Win key="w3" pts={faceR(p, x + 2.75, y + 0.45, y + 1.35, 46, 64)} />,
      <Win key="w4" pts={faceR(p, x + 1.45, y + 1.8, y + 2.5, 14, 32)} />,
      <polyline key="rail" points={poly([pt(p, x + 1.5, y + 1.75, 52), pt(p, x + 2.7, y + 1.75, 52)])} fill="none" stroke="#f8fafc" strokeWidth={3} />,
    );
  } else if (tier === "laudai") {
    const [hx, hy, w, h] = [x + 0.55, y + 0.55, 1.9, 74];
    const towers: [number, number][] = [
      [x + 0.2, y + 0.2],
      [x + 2.2, y + 0.2],
      [x + 0.2, y + 2.2],
      [x + 2.2, y + 2.2],
    ];
    const tower = (tx: number, ty: number, k: string) => {
      const top = pt(p, tx + 0.3, ty + 0.3, 140);
      const a = pt(p, tx, ty + 0.6, 108);
      const b = pt(p, tx + 0.6, ty + 0.6, 108);
      const cc = pt(p, tx + 0.6, ty, 108);
      return (
        <g key={k}>
          <Box p={p} x={tx} y={ty} w={0.6} d={0.6} h={108} color={shade(c.wall, 0.95)} />
          <polygon points={poly([a, b, top])} fill={c.roof} stroke={OL} strokeWidth={1.5} />
          <polygon points={poly([b, cc, top])} fill={shade(c.roof, 0.75)} stroke={OL} strokeWidth={1.5} />
          <path d={`M${top[0]} ${top[1]} L${top[0]} ${top[1] - 16} L${top[0] + 12} ${top[1] - 12} L${top[0]} ${top[1] - 8}`} fill="#facc15" stroke={OL} strokeWidth={1} />
        </g>
      );
    };
    parts.push(
      <FloorQuad key="lawn" p={p} x={x + 0.05} y={y + 0.05} w={2.9} d={2.9} fill="#d9f99d" stroke="none" />,
      <Shadow key="s" p={p} x={x + 0.2} y={y + 0.2} w={2.6} d={2.6} />,
      tower(towers[0][0], towers[0][1], "t0"),
      tower(towers[1][0], towers[1][1], "t1"),
      tower(towers[2][0], towers[2][1], "t2"),
      <Box key="main" p={p} x={hx} y={hy} w={w} d={w} h={h} color={c.wall} />,
      ...[0, 0.5, 1, 1.5].map((u) => <Box key={`cr${u}`} p={p} x={hx + u} y={hy + w - 0.25} w={0.25} d={0.25} z={h} h={10} color={c.wall} />),
      <polygon key="gate" points={poly([...faceL(p, hy + w, hx + 0.7, hx + 1.2, 0, 30)])} fill="#4c1d95" stroke={OL} strokeWidth={1.5} />,
      <Win key="w1" pts={faceL(p, hy + w, hx + 0.2, hx + 0.5, 40, 60)} />,
      <Win key="w2" pts={faceL(p, hy + w, hx + 1.4, hx + 1.7, 40, 60)} />,
      tower(towers[3][0], towers[3][1], "t3"),
    );
    const [sx, sy] = pt(p, x + 1.5, y + 1.5, 150);
    parts.push(
      <g key="spark" className="tw-group">
        <g className="tw" style={{ animationDelay: "0s" }}>
          <Sparkle x={sx - 30} y={sy} s={6} fill="#fde68a" />
        </g>
        <g className="tw" style={{ animationDelay: "0.6s" }}>
          <Sparkle x={sx + 34} y={sy + 20} s={5} fill="#ffffff" />
        </g>
        <g className="tw" style={{ animationDelay: "1.1s" }}>
          <Sparkle x={sx + 4} y={sy - 18} s={7} fill="#fde68a" />
        </g>
      </g>,
    );
  }

  return <g>{parts}</g>;
}

/** Ảnh nhỏ của một kiểu nhà (dùng trong bảng chọn) */
export function HouseThumb({ tier, color, size = 90 }: { tier: string; color: string; size?: number }) {
  const p: Proj = { ox: 0, oy: 0 };
  return (
    <svg viewBox="-95 -170 190 230" width={size} height={(size * 230) / 190} aria-hidden>
      <FloorQuad p={p} x={0} y={0} w={3} d={3} fill="#bbf7d0" stroke="#86efac" />
      <HouseArt p={p} x={0} y={0} tier={tier} color={color} />
    </svg>
  );
}
