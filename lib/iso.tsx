import type { ReactNode } from "react";
import { OL } from "./draw";

/**
 * Hình học phòng nhìn chéo (isometric 2:1).
 * Toạ độ sàn (x, y) tính theo ô; z là độ cao tính bằng điểm ảnh.
 * Người xem đứng ở góc (x lớn, y lớn) nhìn vào góc trong (0, 0).
 */
export const TW = 60;
export const TH = 30;

export interface Proj {
  ox: number;
  oy: number;
}

export const pt = (p: Proj, x: number, y: number, z = 0): [number, number] => [p.ox + ((x - y) * TW) / 2, p.oy + ((x + y) * TH) / 2 - z];
export const poly = (pts: [number, number][]) => pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

/** Làm sáng (f > 1) hoặc tối (f < 1) một màu hex */
export function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f)));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Khối hộp: mặt trên sáng, mặt trái vừa, mặt phải tối */
export function Box(props: { p: Proj; x: number; y: number; w: number; d: number; z?: number; h: number; color: string; top?: string; sw?: number }) {
  const { p, x, y, w, d, h, color } = props;
  const z = props.z ?? 0;
  const sw = props.sw ?? 1.5;
  const top = [pt(p, x, y, z + h), pt(p, x + w, y, z + h), pt(p, x + w, y + d, z + h), pt(p, x, y + d, z + h)];
  const left = [pt(p, x, y + d, z), pt(p, x + w, y + d, z), pt(p, x + w, y + d, z + h), pt(p, x, y + d, z + h)];
  const right = [pt(p, x + w, y, z), pt(p, x + w, y + d, z), pt(p, x + w, y + d, z + h), pt(p, x + w, y, z + h)];
  return (
    <g stroke={OL} strokeWidth={sw} strokeLinejoin="round">
      <polygon points={poly(left)} fill={shade(color, 0.92)} />
      <polygon points={poly(right)} fill={shade(color, 0.75)} />
      <polygon points={poly(top)} fill={props.top ?? shade(color, 1.18)} />
    </g>
  );
}

/** Mặt phẳng nằm trên sàn (thảm, bóng đổ) */
export function FloorQuad(props: { p: Proj; x: number; y: number; w: number; d: number; z?: number; fill: string; stroke?: string; opacity?: number }) {
  const { p, x, y, w, d } = props;
  const z = props.z ?? 0;
  return (
    <polygon
      points={poly([pt(p, x, y, z), pt(p, x + w, y, z), pt(p, x + w, y + d, z), pt(p, x, y + d, z)])}
      fill={props.fill}
      stroke={props.stroke ?? OL}
      strokeWidth={props.stroke === "none" ? 0 : 1.5}
      opacity={props.opacity}
    />
  );
}

/** Bóng đổ mềm dưới chân đồ vật */
export const Shadow = ({ p, x, y, w, d }: { p: Proj; x: number; y: number; w: number; d: number }) => (
  <FloorQuad p={p} x={x - 0.05} y={y - 0.05} w={w + 0.1} d={d + 0.1} fill="#000" stroke="none" opacity={0.12} />
);

/** Đặt một hình vẽ 2D đứng (cây, gấu bông...) với chân tại giữa ô */
export function Sprite({ p, x, y, children, scale = 1 }: { p: Proj; x: number; y: number; children: ReactNode; scale?: number }) {
  const [sx, sy] = pt(p, x + 0.5, y + 0.5);
  return <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${scale})`}>{children}</g>;
}

/**
 * Ma trận đặt hình vẽ 2D lên tường.
 * Tường phải chạy dọc trục x (y = 0), tường trái chạy dọc trục y (x = 0).
 * Toạ độ cục bộ: u sang phải (đơn vị điểm ảnh ngang), v xuống dưới; gốc ở góc trên bên trái của món đồ.
 */
export function wallMatrix(p: Proj, side: "L" | "R", i: number, len: number, zTop: number) {
  if (side === "R") {
    const [sx, sy] = pt(p, i, 0, zTop);
    return `matrix(1 0.5 0 1 ${sx.toFixed(1)} ${sy.toFixed(1)})`;
  }
  const [sx, sy] = pt(p, 0, i + len, zTop);
  return `matrix(1 -0.5 0 1 ${sx.toFixed(1)} ${sy.toFixed(1)})`;
}

/** Độ rộng ngang (điểm ảnh) của một ô trên tường */
export const WALL_TILE = TW / 2;
