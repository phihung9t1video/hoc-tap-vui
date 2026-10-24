import type { ReactNode } from "react";
import type { Slot } from "./types";

/** Màu viền chung cho nét vẽ chibi */
export const OL = "#3d2c2c";

export type Rarity = "thuong" | "hiem" | "suthi" | "huyenthoai";

export const RARITY: Record<Rarity, { label: string; color: string }> = {
  thuong: { label: "Thường", color: "#94a3b8" },
  hiem: { label: "Hiếm", color: "#3b82f6" },
  suthi: { label: "Sử thi", color: "#a855f7" },
  huyenthoai: { label: "Huyền thoại", color: "#f59e0b" },
};

export interface DrawCtx {
  skin: string;
  hair: string;
  /** Đang vẽ mặt sau (nhân vật quay lưng) */
  back?: boolean;
}
export type Draw = (c: DrawCtx) => ReactNode;

export interface Item {
  id: string;
  slot: Slot;
  name: string;
  rarity: Rarity;
  price: number;
  /** Có sẵn ngay khi tạo nhân vật */
  starter?: boolean;
  /** Chỉ nhận được khi đạt thành tích này */
  achievement?: string;
  /** Dùng cho slot màu da, màu tóc */
  color?: string;
  /** Lớp vẽ phía sau (tóc dài, đuôi ngựa...) */
  back?: Draw;
  draw?: Draw;
}

/** Bảng màu dùng để sinh nhiều phiên bản cho cùng một món đồ */
export const PALETTE: { id: string; name: string; hex: string; light: string }[] = [
  { id: "do", name: "đỏ", hex: "#ef4444", light: "#fca5a5" },
  { id: "hong", name: "hồng", hex: "#f472b6", light: "#fbcfe8" },
  { id: "cam", name: "cam", hex: "#fb923c", light: "#fed7aa" },
  { id: "vang", name: "vàng", hex: "#facc15", light: "#fef08a" },
  { id: "xanhla", name: "xanh lá", hex: "#4ade80", light: "#bbf7d0" },
  { id: "xanhduong", name: "xanh dương", hex: "#60a5fa", light: "#bfdbfe" },
  { id: "tim", name: "tím", hex: "#a78bfa", light: "#ddd6fe" },
  { id: "den", name: "đen", hex: "#374151", light: "#9ca3af" },
];

export const mirror = (x: number) => 200 - x;
export const SIDES = [(x: number) => x, mirror];

export function Limb(p: { x1: number; y1: number; x2: number; y2: number; w: number; color: string }) {
  return (
    <g strokeLinecap="round">
      <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={OL} strokeWidth={p.w + 5} />
      <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={p.color} strokeWidth={p.w} />
    </g>
  );
}

export function starPoints(cx: number, cy: number, R: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function heartPath(cx: number, cy: number, s: number) {
  return `M${cx} ${cy + s * 0.9} C${cx - s * 1.4} ${cy + s * 0.1} ${cx - s * 0.9} ${cy - s} ${cx} ${cy - s * 0.35} C${cx + s * 0.9} ${cy - s} ${cx + s * 1.4} ${cy + s * 0.1} ${cx} ${cy + s * 0.9} Z`;
}

export const Star = (p: { cx: number; cy: number; R: number; fill: string; sw?: number }) => (
  <polygon points={starPoints(p.cx, p.cy, p.R, p.R * 0.45)} fill={p.fill} stroke={OL} strokeWidth={p.sw ?? 2} />
);

export const Sparkle = (p: { x: number; y: number; s?: number; fill?: string }) => {
  const s = p.s ?? 5;
  return (
    <path
      d={`M${p.x} ${p.y - s} Q${p.x} ${p.y} ${p.x + s} ${p.y} Q${p.x} ${p.y} ${p.x} ${p.y + s} Q${p.x} ${p.y} ${p.x - s} ${p.y} Q${p.x} ${p.y} ${p.x} ${p.y - s} Z`}
      fill={p.fill ?? "#fff"}
    />
  );
};
