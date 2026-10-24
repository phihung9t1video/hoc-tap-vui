"use client";

import { OL } from "@/lib/draw";
import { Box, FloorQuad, poly, pt, shade, type Proj } from "@/lib/iso";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";

const WALLS = ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0", "#ddd6fe", "#fed7aa"];
const ROOFS = ["#dc2626", "#2563eb", "#db2777", "#16a34a", "#7c3aed", "#ea580c"];

/** Mỗi hồ sơ có một ngôi nhà, đặt dọc con phố */
function House({ p, x, y, color, roof, name, me }: { p: Proj; x: number; y: number; color: string; roof: string; name: string; me: boolean }) {
  const H = 64;
  const R = 104;
  const A = pt(p, x, y + 2, H);
  const B = pt(p, x + 2, y + 2, H);
  const C = pt(p, x + 2, y, H);
  const R1 = pt(p, x, y + 1, R);
  const R2 = pt(p, x + 2, y + 1, R);
  const face = (u: number, z: number) => pt(p, x + u, y + 2, z);
  const side = (v: number, z: number) => pt(p, x + 2, y + v, z);
  const [sx, sy] = face(1, H + 4);
  return (
    <g>
      <FloorQuad p={p} x={x - 0.1} y={y - 0.1} w={2.2} d={2.2} fill="#000" stroke="none" opacity={0.12} />
      <Box p={p} x={x} y={y} w={2} d={2} h={H} color={color} />
      {/* Mái nhà */}
      <polygon points={poly([A, B, R2, R1])} fill={roof} stroke={OL} strokeWidth={2} />
      <polygon points={poly([B, C, R2])} fill={shade(color, 0.7)} stroke={OL} strokeWidth={2} />
      <path d={`M${A[0]} ${A[1]} L${B[0]} ${B[1]}`} stroke={shade(roof, 0.7)} strokeWidth={4} />
      {/* Cửa ra vào và cửa sổ */}
      <polygon points={poly([face(0.75, 0), face(1.25, 0), face(1.25, 38), face(0.75, 38)])} fill="#92400e" stroke={OL} strokeWidth={1.5} />
      <polygon points={poly([face(0.2, 22), face(0.55, 22), face(0.55, 46), face(0.2, 46)])} fill="#bae6fd" stroke={OL} strokeWidth={1.5} />
      <polygon points={poly([face(1.45, 22), face(1.8, 22), face(1.8, 46), face(1.45, 46)])} fill="#bae6fd" stroke={OL} strokeWidth={1.5} />
      <polygon points={poly([side(0.6, 24), side(1.4, 24), side(1.4, 48), side(0.6, 48)])} fill="#bae6fd" stroke={OL} strokeWidth={1.5} />
      {/* Biển tên */}
      <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`}>
        <rect x={-34} y={-12} width={68} height={18} rx={6} fill={me ? "#fff7cc" : "#ffffff"} stroke={me ? "#f59e0b" : OL} strokeWidth={me ? 2.5 : 1.5} />
        <text x={0} y={1.5} textAnchor="middle" fontSize={10} fontWeight={800} fill="#3d2c2c">
          Nhà {name.length > 9 ? `${name.slice(0, 8)}…` : name}
        </text>
      </g>
    </g>
  );
}

const Tree = ({ p, x, y }: { p: Proj; x: number; y: number }) => {
  const [sx, sy] = pt(p, x, y);
  return (
    <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`} stroke={OL} strokeWidth={1.5}>
      <ellipse cx={0} cy={0} rx={12} ry={5} fill="#000" opacity={0.12} stroke="none" />
      <rect x={-4} y={-26} width={8} height={26} fill="#92400e" />
      <circle cx={-10} cy={-36} r={14} fill="#16a34a" />
      <circle cx={10} cy={-36} r={14} fill="#22c55e" />
      <circle cx={0} cy={-50} r={16} fill="#4ade80" />
    </g>
  );
};

const Lamp = ({ p, x, y }: { p: Proj; x: number; y: number }) => {
  const [sx, sy] = pt(p, x, y);
  return (
    <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`} stroke={OL} strokeWidth={1.5}>
      <rect x={-2} y={-56} width={4} height={56} fill="#475569" />
      <circle cx={0} cy={-60} r={6} fill="#fde047" />
      <circle cx={0} cy={-60} r={14} fill="#fde047" opacity={0.25} stroke="none" />
    </g>
  );
};

export function Street({
  profiles,
  meId,
  onEnter,
}: {
  profiles: Profile[];
  meId: string;
  /** Bấm vào một ngôi nhà */
  onEnter: (profileId: string) => void;
}) {
  const n = Math.max(profiles.length, 2);
  const LEN = n * 3 + 1;
  const p: Proj = { ox: 6 * 30 + 20, oy: 130 };
  // Khung nhìn bao trọn con phố
  const left = pt(p, 0, 6)[0] - 20;
  const right = pt(p, LEN, 0)[0] + 20;
  const bottom = pt(p, LEN, 6)[1] + 20;

  return (
    <svg viewBox={`${left} 0 ${right - left} ${bottom}`} width="100%" style={{ display: "block" }} role="img" aria-label="Khu phố">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect x={left} y={0} width={right - left} height={bottom} fill="url(#sky)" />
      <ellipse cx={left + 70} cy={40} rx={34} ry={12} fill="#fff" />
      <ellipse cx={right - 90} cy={30} rx={40} ry={13} fill="#fff" />
      <circle cx={right - 40} cy={42} r={16} fill="#fde047" />

      {/* Bãi cỏ, vỉa hè, đường */}
      <FloorQuad p={p} x={0} y={0} w={LEN} d={6} fill="#86efac" />
      <FloorQuad p={p} x={0} y={2.6} w={LEN} d={0.9} fill="#e5e7eb" />
      <FloorQuad p={p} x={0} y={3.5} w={LEN} d={2} fill="#64748b" />
      {Array.from({ length: Math.floor(LEN / 1.5) }, (_, i) => (
        <polygon key={i} points={poly([pt(p, i * 1.5 + 0.2, 4.45), pt(p, i * 1.5 + 0.9, 4.45), pt(p, i * 1.5 + 0.9, 4.55), pt(p, i * 1.5 + 0.2, 4.55)])} fill="#f8fafc" />
      ))}

      {/* Nhà và cây xếp từ trong ra ngoài */}
      {profiles.map((pr, i) => (
        <g key={pr.id} onClick={() => onEnter(pr.id)} style={{ cursor: "pointer" }}>
          <House p={p} x={i * 3 + 0.5} y={0.3} color={WALLS[i % WALLS.length]} roof={ROOFS[i % ROOFS.length]} name={pr.name} me={pr.id === meId} />
        </g>
      ))}
      {Array.from({ length: n + 1 }, (_, i) => (
        <g key={`t${i}`}>
          <Tree p={p} x={i * 3 + 0.05} y={1.2} />
          {i % 2 === 1 && <Lamp p={p} x={i * 3} y={3.3} />}
        </g>
      ))}

      {/* Các con đứng trước cửa nhà mình */}
      {profiles.map((pr, i) => {
        const [sx, sy] = pt(p, i * 3 + 1.5, 2.95);
        const s = 0.24;
        return (
          <g key={`a${pr.id}`} transform={`translate(${(sx - 100 * s).toFixed(1)} ${(sy - 270 * s).toFixed(1)})`} onClick={() => onEnter(pr.id)} style={{ cursor: "pointer" }}>
            <Avatar look={pr.look} size={200 * s} layer="char" />
          </g>
        );
      })}
    </svg>
  );
}
