import type { ReactNode } from "react";
import { OL, PALETTE, Sparkle, Star, type Rarity } from "./draw";
import { Box, FloorQuad, Shadow, Sprite, pt, poly, shade, type Proj } from "./iso";

/**
 * Đồ cho "Ngôi nhà của con".
 * - floor: đồ đặt trên sàn, chiếm w × d ô (xoay được: đổi hướng sang bức tường còn lại)
 * - wall: đồ treo tường, rộng len ô
 * - wallpaper / flooring: giấy dán tường, sàn nhà (chọn một)
 */
export type HomeKind = "floor" | "wall" | "wallpaper" | "flooring";

export interface FloorCtx {
  p: Proj;
  x: number;
  y: number;
  /** 0: chiều dài dọc trục x; 1: chiều dài dọc trục y */
  rot: 0 | 1;
}

export interface HomeItem {
  id: string;
  kind: HomeKind;
  cat: string;
  name: string;
  rarity: Rarity;
  price: number;
  starter?: boolean;
  /** Kích thước trên sàn (đồ floor) hoặc độ rộng trên tường (đồ wall) */
  w: number;
  d: number;
  floor?: (c: FloorCtx) => ReactNode;
  /** Vẽ trong toạ độ cục bộ của tường: rộng w * 30 điểm ảnh, gốc ở góc trên trái */
  wall?: () => ReactNode;
  /** Giấy dán tường / sàn: màu nền, màu phụ và kiểu hoa văn */
  theme?: { a: string; b: string; pattern: "plain" | "stripes" | "dots" | "stars" | "brick" | "check" | "planks" | "grass" | "marble" | "night" | "cloud" };
}

export const HOME_CATS: { id: string; label: string; icon: string }[] = [
  { id: "noithat", label: "Nội thất", icon: "🛋️" },
  { id: "hoctap", label: "Góc học tập", icon: "📚" },
  { id: "trangtri", label: "Trang trí", icon: "🪴" },
  { id: "vuichoi", label: "Vui chơi", icon: "🧸" },
  { id: "bep", label: "Nhà bếp", icon: "🍳" },
  { id: "vesinh", label: "Nhà vệ sinh", icon: "🛁" },
  { id: "treotuong", label: "Treo tường", icon: "🖼️" },
  { id: "tuong", label: "Giấy dán tường", icon: "🧱" },
  { id: "san", label: "Sàn nhà", icon: "🟫" },
];

const WOOD = "#c08552";
const WOOD_LIGHT = "#e2b07a";
const WOOD_DARK = "#8b5a2b";

/** Ánh xạ toạ độ cục bộ (u dọc chiều dài, v theo chiều sâu) sang ô sàn theo hướng xoay */
function local(c: FloorCtx) {
  const m = (u: number, v: number, w: number, d: number) =>
    c.rot ? { x: c.x + v, y: c.y + u, w: d, d: w } : { x: c.x + u, y: c.y + v, w, d };
  return {
    box: (u: number, v: number, w: number, d: number, z: number, h: number, color: string, top?: string, key?: string) => (
      <Box key={key} p={c.p} {...m(u, v, w, d)} z={z} h={h} color={color} top={top} />
    ),
    quad: (u: number, v: number, w: number, d: number, z: number, fill: string, key?: string) => (
      <FloorQuad key={key} p={c.p} {...m(u, v, w, d)} z={z} fill={fill} />
    ),
    shadow: (w: number, d: number) => <Shadow p={c.p} {...m(0, 0, w, d)} />,
  };
}

const floorItem = (
  id: string,
  cat: string,
  name: string,
  rarity: Rarity,
  price: number,
  w: number,
  d: number,
  floor: (c: FloorCtx) => ReactNode,
  starter = false,
): HomeItem => ({ id, kind: "floor", cat, name, rarity, price, w, d, floor, starter });

const wallItem = (id: string, name: string, rarity: Rarity, price: number, w: number, wall: () => ReactNode): HomeItem => ({
  id,
  kind: "wall",
  cat: "treotuong",
  name,
  rarity,
  price,
  w,
  d: 0,
  wall,
});

const sprite = (draw: () => ReactNode, scale = 1) => (c: FloorCtx) => (
  <g>
    <Shadow p={c.p} x={c.x + 0.15} y={c.y + 0.15} w={0.7} d={0.7} />
    <Sprite p={c.p} x={c.x} y={c.y} scale={scale}>
      {draw()}
    </Sprite>
  </g>
);

const pal = (ids: string[]) => PALETTE.filter((c) => ids.includes(c.id));

// ---------- Nội thất ----------

const bed = (blanket: string, frame = WOOD) => (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(2, 1)}
      {L.box(0, 0, 0.18, 1, 0, 44, frame)}
      {L.box(0.18, 0, 1.82, 1, 0, 14, frame)}
      {L.box(0.2, 0.06, 1.78, 0.88, 14, 8, "#ffffff")}
      {L.box(0.26, 0.15, 0.4, 0.7, 22, 7, "#f8fafc")}
      {L.box(0.75, 0.04, 1.27, 0.92, 14, 11, blanket, shade(blanket, 1.25))}
      {L.box(1.9, 0, 0.1, 1, 0, 26, frame)}
    </g>
  );
};

const sofa = (color: string) => (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(2, 1)}
      {L.box(0, 0, 2, 0.3, 0, 40, color)}
      {L.box(0, 0.3, 0.25, 0.7, 0, 28, color)}
      {L.box(0.25, 0.3, 1.5, 0.7, 0, 18, color, shade(color, 1.3))}
      {L.box(0.3, 0.3, 0.68, 0.66, 18, 5, shade(color, 1.1))}
      {L.box(1.02, 0.3, 0.68, 0.66, 18, 5, shade(color, 1.1))}
      {L.box(1.75, 0.3, 0.25, 0.7, 0, 28, color)}
    </g>
  );
};

const chair = (color: string) => (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.25, 0.2, 0.5, 0.1, 0, 52, color)}
      {[0.27, 0.65].flatMap((u) => [0.32, 0.7].map((v) => L.box(u, v, 0.08, 0.08, 0, 18, WOOD_DARK, undefined, `${u}${v}`)))}
      {L.box(0.25, 0.3, 0.5, 0.5, 18, 6, color, shade(color, 1.3))}
    </g>
  );
};

const beanbag = (color: string) => sprite(() => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d="M-26 0 Q-30 -26 -8 -32 Q0 -44 14 -32 Q30 -24 26 0 Q0 8 -26 0 Z" fill={color} />
    <path d="M-14 -12 Q0 -20 14 -12" fill="none" stroke={shade(color, 0.7)} strokeWidth={2} />
  </g>
));

const table = (top: string, w: number) => (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(w, 1)}
      {[0.12, w - 0.2].flatMap((u) => [0.12, 0.8].map((v) => L.box(u, v, 0.08, 0.08, 0, 30, WOOD_DARK, undefined, `${u}${v}`)))}
      {L.box(0.05, 0.05, w - 0.1, 0.9, 30, 6, top)}
    </g>
  );
};

const wardrobe = (color: string) => (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.05, 0.1, 0.9, 0.8, 0, 96, color)}
      {L.box(0.05, 0.1, 0.9, 0.8, 96, 6, shade(color, 0.85))}
    </g>
  );
};

const BOOKS = ["#ef4444", "#3b82f6", "#facc15", "#22c55e", "#a855f7", "#fb923c"];
const bookshelf = (w: number) => (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(w, 0.6)}
      {L.box(0, 0, w, 0.5, 0, 88, WOOD)}
      {[10, 34, 58].flatMap((z, row) =>
        Array.from({ length: Math.round(w * 5) }, (_, i) =>
          L.box(0.08 + i * 0.18, 0.4, 0.13, 0.1, z, 18 - ((i + row) % 3) * 3, BOOKS[(i + row * 2) % BOOKS.length], undefined, `${z}-${i}`),
        ),
      )}
    </g>
  );
};

const tv = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(2, 0.7)}
      {L.box(0.1, 0.1, 1.8, 0.6, 0, 22, WOOD_DARK)}
      {L.box(0.3, 0.3, 1.4, 0.1, 22, 46, "#111827", "#1f2937")}
      {L.box(0.38, 0.4, 1.24, 0.01, 28, 34, "#38bdf8", "#7dd3fc")}
    </g>
  );
};

const fridge = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.1, 0.1, 0.8, 0.8, 0, 92, "#e2e8f0")}
      {L.box(0.75, 0.9, 0.05, 0.02, 50, 26, "#64748b")}
      {L.box(0.75, 0.9, 0.05, 0.02, 14, 22, "#64748b")}
    </g>
  );
};

const piano = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(2, 1)}
      {L.box(0.1, 0, 1.8, 0.45, 0, 62, "#111827", "#1f2937")}
      {L.box(0.1, 0.45, 1.8, 0.3, 30, 5, "#f8fafc")}
      {Array.from({ length: 9 }, (_, i) => L.box(0.2 + i * 0.18, 0.45, 0.08, 0.17, 35, 2, "#111827", undefined, `k${i}`))}
      {[0.2, 1.8].map((u) => L.box(u, 0.6, 0.08, 0.08, 0, 30, "#111827", undefined, `l${u}`))}
    </g>
  );
};

const aquarium = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(2, 1)}
      {L.box(0.1, 0.2, 1.8, 0.6, 0, 24, WOOD_DARK)}
      {L.box(0.12, 0.22, 1.76, 0.56, 24, 40, "#7dd3fc", "#bae6fd")}
      <Sprite p={c.p} x={c.x + (c.rot ? 0 : 0.5)} y={c.y + (c.rot ? 0.5 : 0)}>
        <g stroke={OL} strokeWidth={1}>
          <ellipse cx={-6} cy={-42} rx={6} ry={3.5} fill="#fb923c" />
          <path d="M0 -42 L5 -46 L5 -38 Z" fill="#fb923c" />
          <ellipse cx={12} cy={-34} rx={5} ry={3} fill="#facc15" />
          <circle cx={4} cy={-54} r={2} fill="#fff" />
        </g>
      </Sprite>
    </g>
  );
};

const throne = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.15, 0.1, 0.7, 0.15, 0, 78, "#f5c542")}
      {L.box(0.15, 0.25, 0.7, 0.65, 0, 26, "#f5c542")}
      {L.box(0.2, 0.25, 0.6, 0.6, 26, 6, "#dc2626")}
      {L.box(0.15, 0.25, 0.12, 0.65, 26, 18, "#f5c542")}
      {L.box(0.73, 0.25, 0.12, 0.65, 26, 18, "#f5c542")}
      <Sprite p={c.p} x={c.x} y={c.y}>
        <Sparkle x={-10} y={-100} s={6} fill="#fff7cc" />
        <Sparkle x={16} y={-84} s={4} />
      </Sprite>
    </g>
  );
};

const princessBed = (c: FloorCtx) => (
  <g>
    {bed("#f9a8d4", "#f5f5f4")(c)}
    {local(c).box(0, 0, 2, 1, 96, 6, "#fbcfe8")}
    {[0, 1.9].flatMap((u) => [0, 0.9].map((v) => local(c).box(u, v, 0.1, 0.1, 0, 96, "#f5f5f4", undefined, `${u}${v}`)))}
  </g>
);

const carBed = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(2, 1)}
      {L.box(0, 0.05, 2, 0.9, 6, 22, "#dc2626")}
      {L.box(0.25, 0.15, 1.4, 0.7, 28, 6, "#3b82f6")}
      {L.box(0.1, 0.1, 0.35, 0.8, 28, 16, "#dc2626")}
      {[0.3, 1.6].flatMap((u) => [0, 0.92].map((v) => L.box(u, v, 0.3, 0.08, 0, 14, "#111827", undefined, `${u}${v}`)))}
    </g>
  );
};

const tent = (color: string) => (c: FloorCtx) => {
  const [ax, ay] = pt(c.p, c.x, c.y, 0);
  const [bx, by] = pt(c.p, c.x + 2, c.y, 0);
  const [cx, cy] = pt(c.p, c.x + 2, c.y + 2, 0);
  const [dx, dy] = pt(c.p, c.x, c.y + 2, 0);
  const [tx, ty] = pt(c.p, c.x + 1, c.y + 1, 96);
  return (
    <g stroke={OL} strokeWidth={1.5}>
      <Shadow p={c.p} x={c.x} y={c.y} w={2} d={2} />
      <polygon points={poly([[ax, ay], [dx, dy], [tx, ty]])} fill={shade(color, 0.92)} />
      <polygon points={poly([[dx, dy], [cx, cy], [tx, ty]])} fill={color} />
      <polygon points={poly([[cx, cy], [bx, by], [tx, ty]])} fill={shade(color, 0.75)} />
      <polygon points={poly([[(dx + cx) / 2 - 10, (dy + cy) / 2 - 2], [(dx + cx) / 2 + 10, (dy + cy) / 2 + 2], [tx, ty + 40]])} fill="#3f2a1d" />
      <path d={`M${tx} ${ty} L${tx + 4} ${ty - 16} L${tx + 16} ${ty - 12} L${tx + 4} ${ty - 8}`} fill="#facc15" />
    </g>
  );
};

// ---------- Góc học tập ----------

const desk = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {table(WOOD_LIGHT, 2)(c)}
      {L.box(0.3, 0.2, 0.5, 0.35, 36, 6, "#3b82f6")}
      {L.box(0.34, 0.24, 0.4, 0.3, 42, 5, "#facc15")}
      {L.box(1.4, 0.2, 0.12, 0.12, 36, 30, "#475569")}
      {L.box(1.3, 0.12, 0.35, 0.3, 66, 8, "#fde047")}
    </g>
  );
};

const computerDesk = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {table("#f1f5f9", 2)(c)}
      {L.box(0.9, 0.3, 0.1, 0.1, 36, 12, "#475569")}
      {L.box(0.45, 0.25, 1.0, 0.06, 48, 34, "#111827")}
      {L.box(0.5, 0.31, 0.9, 0.01, 52, 26, "#22d3ee", "#67e8f9")}
      {L.box(0.6, 0.6, 0.6, 0.2, 36, 3, "#cbd5e1")}
    </g>
  );
};

const globe = sprite(() => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d="M-10 0 H10 L6 -6 H-6 Z" fill={WOOD_DARK} />
    <path d="M0 -6 V-14" />
    <circle cx={0} cy={-32} r={18} fill="#60a5fa" />
    <path d="M-12 -40 Q-4 -46 4 -40 Q2 -32 -8 -30 Q-14 -34 -12 -40 Z M4 -26 Q12 -30 14 -22 Q8 -18 4 -26 Z" fill="#4ade80" strokeWidth={1} />
    <path d="M-20 -32 A20 20 0 0 0 20 -32" fill="none" stroke={WOOD_DARK} strokeWidth={2.5} />
  </g>
));

const blackboard = wallItem("h_bang_den", "Bảng đen ABC 123", "hiem", 150, 2, () => (
  <g stroke={OL} strokeWidth={2}>
    <rect x={4} y={0} width={52} height={40} fill="#14532d" />
    <rect x={4} y={0} width={52} height={40} fill="none" stroke={WOOD} strokeWidth={4} />
    <text x={30} y={18} textAnchor="middle" fontSize={11} fill="#f8fafc" stroke="none" fontWeight={700}>
      ABC
    </text>
    <text x={30} y={33} textAnchor="middle" fontSize={11} fill="#fde68a" stroke="none" fontWeight={700}>
      1+2=3
    </text>
  </g>
));

// ---------- Trang trí ----------

const plant = (kind: "bush" | "cactus" | "tall" | "sunflower" | "tulip", pot = "#c2410c") =>
  sprite(() => (
    <g stroke={OL} strokeWidth={1.5}>
      {kind === "bush" && (
        <g>
          <circle cx={-8} cy={-30} r={11} fill="#22c55e" />
          <circle cx={8} cy={-30} r={11} fill="#16a34a" />
          <circle cx={0} cy={-40} r={12} fill="#4ade80" />
        </g>
      )}
      {kind === "cactus" && (
        <g fill="#22c55e">
          <rect x={-6} y={-46} width={12} height={34} rx={6} />
          <rect x={-16} y={-34} width={8} height={16} rx={4} />
          <rect x={8} y={-38} width={8} height={14} rx={4} />
          <circle cx={0} cy={-48} r={3} fill="#f472b6" />
        </g>
      )}
      {kind === "tall" && (
        <g fill="#15803d">
          <path d="M0 -14 V-60" stroke="#166534" strokeWidth={3} />
          <ellipse cx={-12} cy={-42} rx={12} ry={6} transform="rotate(-25 -12 -42)" />
          <ellipse cx={12} cy={-50} rx={12} ry={6} transform="rotate(25 12 -50)" />
          <ellipse cx={-10} cy={-60} rx={11} ry={5} transform="rotate(-35 -10 -60)" />
          <ellipse cx={10} cy={-32} rx={11} ry={5} transform="rotate(30 10 -32)" />
        </g>
      )}
      {kind === "sunflower" && (
        <g>
          <path d="M0 -14 V-52" stroke="#16a34a" strokeWidth={3} />
          <ellipse cx={-7} cy={-30} rx={7} ry={3.5} fill="#22c55e" />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * 36 * Math.PI) / 180;
            return <ellipse key={i} cx={8 * Math.cos(a)} cy={-56 + 8 * Math.sin(a)} rx={5} ry={3} fill="#facc15" transform={`rotate(${i * 36} ${8 * Math.cos(a)} ${-56 + 8 * Math.sin(a)})`} />;
          })}
          <circle cx={0} cy={-56} r={6} fill="#78350f" />
        </g>
      )}
      {kind === "tulip" && (
        <g>
          {[-8, 0, 8].map((dx, i) => (
            <g key={dx}>
              <path d={`M${dx / 2} -14 L${dx} -38`} stroke="#16a34a" strokeWidth={2} />
              <path d={`M${dx - 5} -38 Q${dx} -50 ${dx + 5} -38 L${dx + 5} -44 L${dx} -40 L${dx - 5} -44 Z`} fill={["#ef4444", "#f472b6", "#facc15"][i]} />
            </g>
          ))}
        </g>
      )}
      <path d="M-11 0 L-13 -16 H13 L11 0 Z" fill={pot} />
      <rect x={-14} y={-18} width={28} height={4} fill={shade(pot, 1.2)} />
    </g>
  ));

const lamp = (shadeColor: string) =>
  sprite(() => (
    <g stroke={OL} strokeWidth={1.5}>
      <ellipse cx={0} cy={0} rx={10} ry={4} fill="#475569" />
      <path d="M0 0 V-62" stroke="#475569" strokeWidth={3} />
      <path d="M-14 -60 L-9 -80 H9 L14 -60 Z" fill={shadeColor} />
      <ellipse cx={0} cy={-58} rx={22} ry={8} fill="#fef9c3" opacity={0.35} stroke="none" />
    </g>
  ));

const starLamp = sprite(() => (
  <g stroke={OL} strokeWidth={1.5}>
    <ellipse cx={0} cy={0} rx={10} ry={4} fill="#475569" />
    <path d="M0 0 V-40" stroke="#475569" strokeWidth={3} />
    <circle cx={0} cy={-56} r={22} fill="#fef08a" opacity={0.35} stroke="none" />
    <Star cx={0} cy={-56} R={16} fill="#fde047" />
    <Sparkle x={20} y={-74} s={4} />
  </g>
));

const rug = (color: string, w: number, d: number, round = false) => (c: FloorCtx) => {
  const L = local(c);
  if (!round) {
    return (
      <g>
        {L.quad(0, 0, w, d, 0, color)}
        {L.quad(0.18, 0.18, w - 0.36, d - 0.36, 0, shade(color, 1.25))}
      </g>
    );
  }
  const [cx, cy] = pt(c.p, c.x + w / 2, c.y + d / 2);
  return (
    <g stroke={OL} strokeWidth={1.5}>
      <ellipse cx={cx} cy={cy} rx={(w * 60) / 2.3} ry={(d * 30) / 2.3} fill={color} />
      <ellipse cx={cx} cy={cy} rx={(w * 60) / 4} ry={(d * 30) / 4} fill={shade(color, 1.3)} />
    </g>
  );
};

const rainbowRug = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {["#ef4444", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa"].map((col, i) => L.quad(i * 0.2, i * 0.2, 2.4 - i * 0.4, 2.4 - i * 0.4, 0, col, col))}
    </g>
  );
};

// ---------- Vui chơi ----------

const teddy = (color: string) =>
  sprite(() => (
    <g stroke={OL} strokeWidth={1.5}>
      <ellipse cx={0} cy={-14} rx={14} ry={13} fill={color} />
      <circle cx={-11} cy={-38} r={6} fill={color} />
      <circle cx={11} cy={-38} r={6} fill={color} />
      <circle cx={0} cy={-34} r={12} fill={color} />
      <ellipse cx={0} cy={-30} rx={5} ry={4} fill={shade(color, 1.4)} />
      <circle cx={-4} cy={-36} r={1.6} fill={OL} />
      <circle cx={4} cy={-36} r={1.6} fill={OL} />
      <path d="M-6 -14 L0 -10 L6 -14" fill="none" stroke="#ef4444" strokeWidth={2.5} />
    </g>
  ), 1.2);

const balloons = (cols: string[]) =>
  sprite(() => (
    <g stroke={OL} strokeWidth={1.2}>
      {cols.map((col, i) => {
        const x = (i - 1) * 12;
        const y = -70 - (i % 2) * 10;
        return (
          <g key={i}>
            <path d={`M0 0 Q${x / 2} ${y / 2} ${x} ${y + 14}`} fill="none" />
            <ellipse cx={x} cy={y} rx={9} ry={11} fill={col} />
          </g>
        );
      })}
      <rect x={-4} y={-4} width={8} height={4} fill="#64748b" />
    </g>
  ));

const toyChest = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.1, 0.2, 0.8, 0.6, 0, 28, "#2563eb")}
      {L.box(0.08, 0.18, 0.84, 0.64, 28, 6, "#facc15")}
      <Sprite p={c.p} x={c.x} y={c.y}>
        <g stroke={OL} strokeWidth={1.2}>
          <circle cx={-6} cy={-40} r={6} fill="#ef4444" />
          <rect x={2} y={-46} width={10} height={10} fill="#22c55e" />
        </g>
      </Sprite>
    </g>
  );
};

const rocking = (c: FloorCtx) => (
  <g>
    <Shadow p={c.p} x={c.x + 0.1} y={c.y + 0.1} w={0.8} d={0.8} />
    <Sprite p={c.p} x={c.x} y={c.y}>
      <g stroke={OL} strokeWidth={1.5}>
        <path d="M-24 -2 Q0 8 24 -2" fill="none" stroke={WOOD_DARK} strokeWidth={4} />
        <path d="M-14 -4 L-12 -20 M14 -4 L12 -20" stroke={WOOD_DARK} strokeWidth={3} />
        <ellipse cx={0} cy={-26} rx={18} ry={9} fill="#f5f5f4" />
        <circle cx={-18} cy={-38} r={8} fill="#f5f5f4" />
        <path d="M-24 -42 Q-20 -50 -14 -44" fill="#a16207" />
        <path d="M14 -28 Q24 -30 22 -16" fill="none" stroke="#a16207" strokeWidth={4} />
        <circle cx={-20} cy={-40} r={1.5} fill={OL} />
      </g>
    </Sprite>
  </g>
);

// ---------- Treo tường ----------

const frame = (inner: ReactNode, w = 26, h = 30, color = WOOD) => (
  <g stroke={OL} strokeWidth={1.5}>
    <rect x={(30 - w) / 2} y={0} width={w} height={h} fill={color} />
    <rect x={(30 - w) / 2 + 3} y={3} width={w - 6} height={h - 6} fill="#fef3c7" />
    <g>{inner}</g>
  </g>
);

const WALL_ITEMS: HomeItem[] = [
  wallItem("h_tranh_nui", "Tranh núi và mặt trời", "thuong", 60, 1, () =>
    frame(
      <g strokeWidth={0}>
        <rect x={5} y={3} width={20} height={24} fill="#bae6fd" />
        <circle cx={19} cy={9} r={3.5} fill="#facc15" />
        <path d="M5 27 L12 14 L17 21 L21 16 L25 27 Z" fill="#16a34a" />
      </g>,
    ),
  ),
  wallItem("h_tranh_hoa", "Tranh bình hoa", "thuong", 60, 1, () =>
    frame(
      <g strokeWidth={0}>
        <rect x={5} y={3} width={20} height={24} fill="#fde68a" />
        <path d="M11 26 L13 18 H17 L19 26 Z" fill="#3b82f6" />
        <circle cx={12} cy={12} r={3} fill="#f472b6" />
        <circle cx={18} cy={11} r={3} fill="#ef4444" />
        <circle cx={15} cy={8} r={3} fill="#a855f7" />
      </g>,
    ),
  ),
  wallItem("h_tranh_meo", "Tranh mèo con", "thuong", 80, 1, () =>
    frame(
      <g strokeWidth={0}>
        <rect x={5} y={3} width={20} height={24} fill="#e0f2fe" />
        <circle cx={15} cy={17} r={7} fill="#fb923c" />
        <path d="M9 13 L10 6 L14 11 Z M21 13 L20 6 L16 11 Z" fill="#fb923c" />
        <circle cx={12.5} cy={16} r={1} fill={OL} />
        <circle cx={17.5} cy={16} r={1} fill={OL} />
      </g>,
    ),
  ),
  wallItem("h_tranh_ten_lua", "Tranh tên lửa", "hiem", 120, 1, () =>
    frame(
      <g strokeWidth={0}>
        <rect x={5} y={3} width={20} height={24} fill="#1e1b4b" />
        <circle cx={9} cy={8} r={1} fill="#fff" />
        <circle cx={21} cy={20} r={1} fill="#fff" />
        <path d="M15 6 Q20 12 18 20 H12 Q10 12 15 6 Z" fill="#f8fafc" />
        <circle cx={15} cy={13} r={2} fill="#38bdf8" />
        <path d="M13 20 L15 26 L17 20 Z" fill="#fb923c" />
      </g>,
    ),
  ),
  wallItem("h_tranh_bien", "Tranh biển xanh", "hiem", 120, 2, () =>
    frame(
      <g strokeWidth={0}>
        <rect x={5} y={3} width={50} height={24} fill="#7dd3fc" />
        <rect x={5} y={17} width={50} height={10} fill="#2563eb" />
        <path d="M5 20 Q12 16 19 20 T33 20 T47 20 T55 20" fill="none" stroke="#fff" strokeWidth={1.5} />
        <circle cx={46} cy={9} r={4} fill="#facc15" />
        <path d="M20 17 L24 9 L28 17 Z" fill="#f8fafc" />
      </g>,
      56,
      30,
    ),
  ),
  wallItem("h_cua_so_ngay", "Cửa sổ ban ngày", "thuong", 80, 2, () => (
    <g stroke={OL} strokeWidth={2}>
      <rect x={6} y={0} width={48} height={44} fill="#bae6fd" />
      <circle cx={18} cy={12} r={5} fill="#fde047" strokeWidth={0} />
      <ellipse cx={38} cy={18} rx={9} ry={4} fill="#fff" strokeWidth={0} />
      <path d="M30 0 V44 M6 22 H54" stroke="#f8fafc" strokeWidth={4} />
      <rect x={6} y={0} width={48} height={44} fill="none" stroke="#f8fafc" strokeWidth={4} />
      <path d="M2 -2 Q14 20 8 46 M58 -2 Q46 20 52 46" fill="none" stroke="#f472b6" strokeWidth={5} />
    </g>
  )),
  wallItem("h_cua_so_dem", "Cửa sổ đêm sao", "hiem", 150, 2, () => (
    <g stroke={OL} strokeWidth={2}>
      <rect x={6} y={0} width={48} height={44} fill="#1e1b4b" />
      <path d="M40 8 A7 7 0 1 0 44 18 A5 5 0 1 1 40 8 Z" fill="#fde047" strokeWidth={0} />
      {[[14, 10], [22, 30], [46, 34], [30, 8]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} s={2.5} />
      ))}
      <path d="M30 0 V44 M6 22 H54" stroke="#cbd5e1" strokeWidth={4} />
      <rect x={6} y={0} width={48} height={44} fill="none" stroke="#cbd5e1" strokeWidth={4} />
    </g>
  )),
  wallItem("h_dong_ho", "Đồng hồ treo tường", "thuong", 70, 1, () => (
    <g stroke={OL} strokeWidth={2}>
      <circle cx={15} cy={15} r={13} fill="#ffffff" />
      <circle cx={15} cy={15} r={13} fill="none" stroke="#ef4444" strokeWidth={3} />
      <path d="M15 15 V7 M15 15 L21 18" strokeWidth={2} />
    </g>
  )),
  wallItem("h_co_vn", "Cờ đỏ sao vàng", "thuong", 50, 1, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <rect x={1} y={4} width={28} height={19} fill="#da251d" />
      <Star cx={15} cy={13.5} R={6} fill="#ffcd00" sw={0} />
    </g>
  )),
  wallItem("h_guong", "Gương tròn", "hiem", 120, 1, () => (
    <g stroke={OL} strokeWidth={2}>
      <ellipse cx={15} cy={20} rx={12} ry={18} fill="#e0f2fe" />
      <ellipse cx={15} cy={20} rx={12} ry={18} fill="none" stroke="#f5c542" strokeWidth={3} />
      <path d="M8 12 L12 8 M8 18 L16 10" stroke="#ffffff" strokeWidth={2} />
    </g>
  )),
  wallItem("h_ke_treo", "Kệ treo cây nhỏ", "hiem", 120, 2, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <rect x={2} y={30} width={56} height={5} fill={WOOD} />
      <path d="M12 30 L10 20 H20 L18 30 Z" fill="#c2410c" />
      <circle cx={15} cy={16} r={6} fill="#22c55e" />
      <rect x={28} y={14} width={6} height={16} fill="#ef4444" />
      <rect x={34} y={18} width={6} height={12} fill="#3b82f6" />
      <rect x={40} y={16} width={6} height={14} fill="#facc15" />
    </g>
  )),
  blackboard,
  wallItem("h_bang_khen", "Bằng khen học giỏi", "hiem", 200, 1, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <rect x={2} y={2} width={26} height={22} fill="#fef3c7" />
      <rect x={4} y={4} width={22} height={18} fill="none" stroke="#dc2626" strokeWidth={1.5} />
      <Star cx={15} cy={11} R={5} fill="#facc15" sw={1} />
      <path d="M8 18 H22" stroke="#92400e" />
    </g>
  )),
  wallItem("h_day_den", "Dây đèn lấp lánh", "suthi", 250, 2, () => (
    <g>
      <path d="M0 4 Q15 16 30 6 Q45 16 60 4" fill="none" stroke="#475569" strokeWidth={1.5} />
      {[6, 14, 22, 30, 38, 46, 54].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={8 + Math.sin(i) * 3} r={5} fill={["#fde047", "#f472b6", "#60a5fa", "#4ade80"][i % 4]} opacity={0.35} />
          <circle cx={x} cy={8 + Math.sin(i) * 3} r={2.5} fill={["#fde047", "#f472b6", "#60a5fa", "#4ade80"][i % 4]} stroke={OL} strokeWidth={0.8} />
        </g>
      ))}
    </g>
  )),
  wallItem("h_cau_vong_tuong", "Cầu vồng dán tường", "suthi", 300, 2, () => (
    <g fill="none" strokeWidth={4}>
      {["#ef4444", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa"].map((col, i) => (
        <path key={col} d={`M${8 + i * 4} 40 A${22 - i * 4} ${22 - i * 4} 0 0 1 ${52 - i * 4} 40`} stroke={col} />
      ))}
      <ellipse cx={10} cy={40} rx={8} ry={4} fill="#fff" stroke={OL} strokeWidth={1} />
      <ellipse cx={50} cy={40} rx={8} ry={4} fill="#fff" stroke={OL} strokeWidth={1} />
    </g>
  )),
];

// ---------- Giấy dán tường, sàn ----------

const theme = (id: string, kind: "wallpaper" | "flooring", name: string, rarity: Rarity, price: number, t: NonNullable<HomeItem["theme"]>, starter = false): HomeItem => ({
  id,
  kind,
  cat: kind === "wallpaper" ? "tuong" : "san",
  name,
  rarity,
  price,
  w: 0,
  d: 0,
  theme: t,
  starter,
});

const WALLPAPERS: HomeItem[] = [
  theme("hw_kem", "wallpaper", "Tường màu kem", "thuong", 0, { a: "#fdf2e3", b: "#f5e1c8", pattern: "plain" }, true),
  ...[
    ["hong", "hồng phấn", "#fde2ec", "#fbcfe8"],
    ["xanh", "xanh da trời", "#dbeafe", "#bfdbfe"],
    ["la", "xanh bạc hà", "#dcfce7", "#bbf7d0"],
    ["tim", "tím lavender", "#ede9fe", "#ddd6fe"],
    ["vang", "vàng nắng", "#fef9c3", "#fef08a"],
  ].map(([id, name, a, b]) => theme(`hw_${id}`, "wallpaper", `Tường ${name}`, "thuong", 80, { a, b, pattern: "plain" })),
  theme("hw_soc_hong", "wallpaper", "Giấy sọc hồng", "hiem", 150, { a: "#fdf2f8", b: "#fbcfe8", pattern: "stripes" }),
  theme("hw_soc_xanh", "wallpaper", "Giấy sọc xanh", "hiem", 150, { a: "#eff6ff", b: "#bfdbfe", pattern: "stripes" }),
  theme("hw_cham_bi", "wallpaper", "Giấy chấm bi", "hiem", 150, { a: "#fff7ed", b: "#fdba74", pattern: "dots" }),
  theme("hw_gach", "wallpaper", "Tường gạch đỏ", "hiem", 180, { a: "#c2410c", b: "#9a3412", pattern: "brick" }),
  theme("hw_ngoi_sao", "wallpaper", "Giấy ngôi sao", "suthi", 300, { a: "#e0e7ff", b: "#facc15", pattern: "stars" }),
  theme("hw_dem_sao", "wallpaper", "Bầu trời đêm sao", "huyenthoai", 900, { a: "#1e1b4b", b: "#fde68a", pattern: "night" }),
];

const FLOORINGS: HomeItem[] = [
  theme("hf_go", "flooring", "Sàn gỗ", "thuong", 0, { a: "#d6a46c", b: "#c08552", pattern: "planks" }, true),
  theme("hf_go_sang", "flooring", "Sàn gỗ sáng", "thuong", 80, { a: "#f1d3a8", b: "#e2b07a", pattern: "planks" }),
  theme("hf_go_toi", "flooring", "Sàn gỗ óc chó", "thuong", 80, { a: "#8b5a2b", b: "#6b4423", pattern: "planks" }),
  theme("hf_gach_hong", "flooring", "Gạch hồng", "thuong", 80, { a: "#fbcfe8", b: "#f9a8d4", pattern: "check" }),
  theme("hf_gach_xanh", "flooring", "Gạch xanh", "thuong", 80, { a: "#bfdbfe", b: "#93c5fd", pattern: "check" }),
  theme("hf_caro", "flooring", "Gạch caro đen trắng", "hiem", 150, { a: "#f8fafc", b: "#334155", pattern: "check" }),
  theme("hf_co", "flooring", "Thảm cỏ", "hiem", 180, { a: "#86efac", b: "#4ade80", pattern: "grass" }),
  theme("hf_cam_thach", "flooring", "Đá cẩm thạch", "suthi", 350, { a: "#f8fafc", b: "#cbd5e1", pattern: "marble" }),
  theme("hf_may", "flooring", "Sàn mây bồng bềnh", "huyenthoai", 900, { a: "#e0f2fe", b: "#ffffff", pattern: "cloud" }),
];

// ---------- Bếp ----------

const counter = (c: FloorCtx, color: string) => {
  const L = local(c);
  return (
    <>
      {L.shadow(1, 1)}
      {L.box(0.05, 0.05, 0.9, 0.85, 0, 34, color)}
      {L.box(0.02, 0.02, 0.96, 0.91, 34, 4, "#e5e7eb")}
    </>
  );
};

const stove = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {counter(c, "#f1f5f9")}
      {L.box(0.15, 0.12, 0.7, 0.7, 38, 2, "#1f2937")}
      {L.box(0.22, 0.2, 0.22, 0.22, 40, 1, "#ef4444")}
      {L.box(0.55, 0.5, 0.22, 0.22, 40, 1, "#ef4444")}
      {L.box(0.5, 0.15, 0.32, 0.3, 40, 14, "#94a3b8")}
    </g>
  );
};

const sinkCounter = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {counter(c, WOOD)}
      {L.box(0.2, 0.2, 0.6, 0.5, 38, 1, "#7dd3fc", "#bae6fd")}
      {L.box(0.45, 0.05, 0.1, 0.1, 38, 16, "#cbd5e1")}
    </g>
  );
};

const kitchenCab = (color: string) => (c: FloorCtx) => (
  <g>
    {counter(c, color)}
    {local(c).box(0.2, 0.3, 0.4, 0.3, 38, 8, "#f8fafc")}
  </g>
);

const microwave = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {counter(c, "#f1f5f9")}
      {L.box(0.15, 0.15, 0.7, 0.55, 38, 22, "#475569")}
      {L.box(0.2, 0.7, 0.45, 0.01, 42, 14, "#1e293b", "#334155")}
    </g>
  );
};

const diningTable = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {table(WOOD_LIGHT, 2)(c)}
      {L.quad(0.2, 0.25, 0.4, 0.4, 36.5, "#ffffff")}
      {L.quad(1.4, 0.35, 0.4, 0.4, 36.5, "#ffffff")}
      {L.box(0.85, 0.3, 0.3, 0.3, 36, 8, "#fde68a")}
      <Sprite p={c.p} x={c.x + (c.rot ? 0 : 0.5)} y={c.y + (c.rot ? 0.5 : 0)}>
        <g stroke={OL} strokeWidth={1}>
          <circle cx={-4} cy={-50} r={4} fill="#ef4444" />
          <circle cx={4} cy={-50} r={4} fill="#facc15" />
          <circle cx={0} cy={-55} r={4} fill="#22c55e" />
        </g>
      </Sprite>
    </g>
  );
};

const KITCHEN: HomeItem[] = [
  floorItem("h_bep_nau", "bep", "Bếp nấu", "thuong", 0, 1, 1, stove, true),
  floorItem("h_bon_rua", "bep", "Bồn rửa bát", "thuong", 0, 1, 1, sinkCounter, true),
  ...[
    ["trang", "trắng", "#f8fafc"],
    ["go", "gỗ", WOOD],
    ["xanh", "xanh mint", "#99f6e4"],
    ["hong", "hồng", "#fbcfe8"],
  ].map(([id, name, col]) => floorItem(`h_tu_bep_${id}`, "bep", `Tủ bếp ${name}`, "thuong", 80, 1, 1, kitchenCab(col))),
  floorItem("h_lo_vi_song", "bep", "Lò vi sóng", "hiem", 150, 1, 1, microwave),
  floorItem("h_ban_an", "bep", "Bàn ăn gia đình", "hiem", 200, 2, 1, diningTable),
];

// ---------- Nhà vệ sinh ----------

const toilet = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.25, 0.05, 0.5, 0.2, 0, 44, "#f8fafc")}
      {L.box(0.3, 0.25, 0.4, 0.5, 0, 20, "#f1f5f9")}
      {L.box(0.28, 0.25, 0.44, 0.55, 20, 3, "#e2e8f0")}
    </g>
  );
};

const basin = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.4, 0.2, 0.2, 0.2, 0, 32, "#f1f5f9")}
      {L.box(0.15, 0.05, 0.7, 0.55, 32, 10, "#f8fafc")}
      {L.box(0.25, 0.12, 0.5, 0.4, 42, 1, "#bae6fd")}
      {L.box(0.45, 0.05, 0.1, 0.08, 42, 10, "#94a3b8")}
    </g>
  );
};

const bathtub = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.shadow(2, 1)}
      {L.box(0, 0.05, 2, 0.9, 0, 30, "#f8fafc")}
      {L.box(0.12, 0.15, 1.76, 0.7, 30, 1, "#7dd3fc", "#bae6fd")}
      {L.box(0.05, 0.4, 0.12, 0.12, 30, 14, "#94a3b8")}
      <Sprite p={c.p} x={c.x + (c.rot ? 0 : 0.5)} y={c.y + (c.rot ? 0.5 : 0)}>
        <g fill="#ffffff" stroke="#bae6fd" strokeWidth={1}>
          <circle cx={-6} cy={-34} r={6} />
          <circle cx={4} cy={-38} r={5} />
          <circle cx={14} cy={-32} r={6} />
          <circle cx={24} cy={-30} r={4} />
        </g>
      </Sprite>
    </g>
  );
};

const shower = (c: FloorCtx) => {
  const L = local(c);
  return (
    <g>
      {L.quad(0.05, 0.05, 0.9, 0.9, 0, "#cbd5e1")}
      {L.box(0.1, 0.1, 0.08, 0.08, 0, 96, "#94a3b8")}
      {L.box(0.1, 0.1, 0.4, 0.15, 96, 4, "#94a3b8")}
      <Sprite p={c.p} x={c.x} y={c.y}>
        <g stroke="#7dd3fc" strokeWidth={1.5} strokeLinecap="round">
          {[-6, 0, 6, 12].map((dx) => (
            <line key={dx} x1={dx} y1={-82} x2={dx - 2} y2={-62} strokeDasharray="4 5" />
          ))}
        </g>
      </Sprite>
    </g>
  );
};

const washer = (c: FloorCtx) => {
  const L = local(c);
  const [sx, sy] = pt(c.p, c.x + 0.5, c.y + 0.92, 26);
  return (
    <g>
      {L.shadow(1, 1)}
      {L.box(0.08, 0.08, 0.84, 0.84, 0, 52, "#f8fafc")}
      <ellipse cx={sx - 6} cy={sy} rx={11} ry={13} fill="#93c5fd" stroke={OL} strokeWidth={2} />
      <ellipse cx={sx - 6} cy={sy} rx={6} ry={7} fill="#dbeafe" />
    </g>
  );
};

const duck = sprite(() => (
  <g stroke={OL} strokeWidth={1.5}>
    <ellipse cx={0} cy={-8} rx={13} ry={8} fill="#facc15" />
    <circle cx={6} cy={-20} r={7} fill="#facc15" />
    <path d="M12 -20 L19 -18 L12 -16 Z" fill="#fb923c" />
    <circle cx={8} cy={-22} r={1.3} fill={OL} />
  </g>
));

const BATH: HomeItem[] = [
  floorItem("h_bon_cau", "vesinh", "Bồn cầu", "thuong", 0, 1, 1, toilet, true),
  floorItem("h_lavabo", "vesinh", "Bồn rửa mặt", "thuong", 0, 1, 1, basin, true),
  floorItem("h_bon_tam", "vesinh", "Bồn tắm bọt xà phòng", "hiem", 250, 2, 1, bathtub),
  floorItem("h_voi_sen", "vesinh", "Vòi sen", "thuong", 90, 1, 1, shower),
  floorItem("h_may_giat", "vesinh", "Máy giặt", "hiem", 180, 1, 1, washer),
  floorItem("h_vit_cao_su", "vesinh", "Vịt cao su", "thuong", 30, 1, 1, duck),
  ...pal(["xanhduong", "hong", "xanhla"]).map((c) => floorItem(`h_tham_tam_${c.id}`, "vesinh", `Thảm chùi chân ${c.name}`, "thuong", 40, 1, 1, rug(c.hex, 1, 1))),
  wallItem("h_khan_treo", "Giá treo khăn", "thuong", 60, 1, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <rect x={2} y={4} width={26} height={3} fill="#94a3b8" />
      <rect x={4} y={7} width={9} height={20} fill="#f472b6" />
      <rect x={16} y={7} width={9} height={16} fill="#60a5fa" />
    </g>
  )),
].map((i) => (i.kind === "wall" ? { ...i, cat: "vesinh" } : i));

// ---------- Danh mục ----------

export const HOME_ITEMS: HomeItem[] = [
  // Nội thất
  floorItem("h_giuong_go", "noithat", "Giường gỗ", "thuong", 0, 2, 1, bed("#60a5fa"), true),
  floorItem("h_sofa_kem", "noithat", "Sofa màu kem", "thuong", 0, 2, 1, sofa("#e7d3b5"), true),
  ...pal(["do", "hong", "vang", "xanhla", "tim"]).map((c) => floorItem(`h_giuong_${c.id}`, "noithat", `Giường chăn ${c.name}`, "hiem", 200, 2, 1, bed(c.hex))),
  floorItem("h_giuong_cong_chua", "noithat", "Giường công chúa", "suthi", 600, 2, 1, princessBed),
  floorItem("h_giuong_o_to", "noithat", "Giường ô tô", "suthi", 650, 2, 1, carBed),
  ...pal(["do", "hong", "cam", "xanhla", "xanhduong", "tim"]).map((c) => floorItem(`h_sofa_${c.id}`, "noithat", `Sofa ${c.name}`, "hiem", 220, 2, 1, sofa(c.hex))),
  ...pal(["do", "vang", "xanhla", "xanhduong", "hong", "tim"]).map((c) => floorItem(`h_ghe_${c.id}`, "noithat", `Ghế ${c.name}`, "thuong", 60, 1, 1, chair(c.hex))),
  ...pal(["do", "xanhduong", "hong", "vang"]).map((c) => floorItem(`h_ghe_luoi_${c.id}`, "noithat", `Ghế lười ${c.name}`, "thuong", 90, 1, 1, beanbag(c.hex))),
  floorItem("h_ban_tron", "noithat", "Bàn gỗ nhỏ", "thuong", 80, 1, 1, table(WOOD_LIGHT, 1)),
  floorItem("h_ban_dai", "noithat", "Bàn gỗ dài", "thuong", 120, 2, 1, table(WOOD, 2)),
  floorItem("h_ban_trang", "noithat", "Bàn trắng", "thuong", 120, 2, 1, table("#f8fafc", 2)),
  ...[
    ["go", "gỗ", WOOD],
    ["trang", "trắng", "#f1f5f9"],
    ["hong", "hồng", "#f9a8d4"],
    ["xanh", "xanh", "#93c5fd"],
  ].map(([id, name, col]) => floorItem(`h_tu_${id}`, "noithat", `Tủ quần áo ${name}`, "hiem", 180, 1, 1, wardrobe(col))),
  floorItem("h_tivi", "noithat", "Ti vi", "hiem", 300, 2, 1, tv),
  floorItem("h_tu_lanh", "bep", "Tủ lạnh", "hiem", 250, 1, 1, fridge),
  floorItem("h_be_ca", "noithat", "Bể cá", "suthi", 500, 2, 1, aquarium),
  floorItem("h_piano", "noithat", "Đàn piano", "suthi", 700, 2, 1, piano),
  floorItem("h_ngai_vang", "noithat", "Ngai vàng", "huyenthoai", 1500, 1, 1, throne),

  // Góc học tập
  floorItem("h_ke_sach", "hoctap", "Kệ sách nhỏ", "thuong", 120, 1, 1, bookshelf(1)),
  floorItem("h_ke_sach_lon", "hoctap", "Kệ sách lớn", "hiem", 220, 2, 1, bookshelf(2)),
  floorItem("h_ban_hoc", "hoctap", "Bàn học có đèn", "hiem", 250, 2, 1, desk),
  floorItem("h_ban_may_tinh", "hoctap", "Bàn máy tính", "suthi", 450, 2, 1, computerDesk),
  floorItem("h_qua_dia_cau", "hoctap", "Quả địa cầu", "hiem", 120, 1, 1, globe),

  // Trang trí
  floorItem("h_cay_bui", "trangtri", "Chậu cây xanh", "thuong", 0, 1, 1, plant("bush"), true),
  floorItem("h_xuong_rong", "trangtri", "Xương rồng", "thuong", 40, 1, 1, plant("cactus", "#3b82f6")),
  floorItem("h_cay_cao", "trangtri", "Cây lá to", "thuong", 60, 1, 1, plant("tall", "#f8fafc")),
  floorItem("h_huong_duong", "trangtri", "Hoa hướng dương", "thuong", 60, 1, 1, plant("sunflower", "#a16207")),
  floorItem("h_tulip", "trangtri", "Chậu tulip", "thuong", 70, 1, 1, plant("tulip", "#f472b6")),
  ...pal(["vang", "hong", "xanhduong"]).map((c) => floorItem(`h_den_${c.id}`, "trangtri", `Đèn cây ${c.name}`, "thuong", 70, 1, 1, lamp(c.hex))),
  floorItem("h_den_sao", "trangtri", "Đèn ngôi sao", "suthi", 300, 1, 1, starLamp),
  ...pal(["do", "hong", "vang", "xanhla", "xanhduong", "tim"]).map((c) => floorItem(`h_tham_${c.id}`, "trangtri", `Thảm ${c.name}`, "thuong", 60, 2, 2, rug(c.hex, 2, 2))),
  ...pal(["hong", "xanhduong", "vang"]).map((c) => floorItem(`h_tham_tron_${c.id}`, "trangtri", `Thảm tròn ${c.name}`, "thuong", 70, 2, 2, rug(c.hex, 2, 2, true))),
  floorItem("h_tham_cau_vong", "trangtri", "Thảm cầu vồng", "suthi", 300, 2, 2, (c) => rainbowRug(c)),

  // Vui chơi
  ...[
    ["nau", "nâu", "#b45309"],
    ["hong", "hồng", "#f9a8d4"],
    ["trang", "trắng", "#f5f5f4"],
  ].map(([id, name, col]) => floorItem(`h_gau_${id}`, "vuichoi", `Gấu bông ${name}`, "hiem", 150, 1, 1, teddy(col))),
  floorItem("h_bong_bay", "vuichoi", "Chùm bóng bay", "thuong", 50, 1, 1, balloons(["#ef4444", "#facc15", "#60a5fa"])),
  floorItem("h_bong_bay_hong", "vuichoi", "Bóng bay hồng tím", "thuong", 50, 1, 1, balloons(["#f472b6", "#a78bfa", "#fbcfe8"])),
  floorItem("h_ruong_do_choi", "vuichoi", "Rương đồ chơi", "thuong", 100, 1, 1, toyChest),
  floorItem("h_ngua_bap_benh", "vuichoi", "Ngựa bập bênh", "hiem", 180, 1, 1, rocking),
  ...pal(["do", "xanhla", "tim"]).map((c) => floorItem(`h_leu_${c.id}`, "vuichoi", `Lều cắm trại ${c.name}`, "suthi", 400, 2, 2, tent(c.hex))),

  ...KITCHEN,
  ...BATH,
  ...WALL_ITEMS,
  ...WALLPAPERS,
  ...FLOORINGS,
];

export const HOME_MAP: Record<string, HomeItem> = Object.fromEntries(HOME_ITEMS.map((i) => [i.id, i]));
export const HOME_STARTER_IDS = HOME_ITEMS.filter((i) => i.starter).map((i) => i.id);

// ---------- Trạng thái ngôi nhà ----------

export const ROOM_N = 6;

export interface PlacedFloor {
  uid: string;
  id: string;
  x: number;
  y: number;
  rot: 0 | 1;
}
export interface PlacedWall {
  uid: string;
  id: string;
  side: "L" | "R";
  i: number;
}
/** Một căn phòng */
export interface RoomState {
  wallpaper: string;
  flooring: string;
  floor: PlacedFloor[];
  wall: PlacedWall[];
}

export type RoomId = "khach" | "ngu" | "bep" | "vesinh";
/** "pho" là khu phố (ra khỏi nhà) */
export type DoorTarget = RoomId | "pho";

export interface Door {
  to: DoorTarget;
  side: "L" | "R";
  i: number;
}

export const ROOMS: Record<RoomId, { name: string; icon: string; doors: Door[] }> = {
  khach: {
    name: "Phòng khách",
    icon: "🛋️",
    doors: [
      { to: "pho", side: "L", i: 4 },
      { to: "ngu", side: "L", i: 1 },
      { to: "bep", side: "R", i: 1 },
      { to: "vesinh", side: "R", i: 4 },
    ],
  },
  ngu: { name: "Phòng ngủ", icon: "🛏️", doors: [{ to: "khach", side: "R", i: 4 }] },
  bep: { name: "Nhà bếp", icon: "🍳", doors: [{ to: "khach", side: "L", i: 4 }] },
  vesinh: { name: "Nhà vệ sinh", icon: "🛁", doors: [{ to: "khach", side: "L", i: 4 }] },
};

export const ROOM_ORDER: RoomId[] = ["khach", "ngu", "bep", "vesinh"];

export interface HomeState {
  rooms: Record<RoomId, RoomState>;
}

const room = (wallpaper: string, flooring: string, floor: PlacedFloor[] = []): RoomState => ({ wallpaper, flooring, floor, wall: [] });

export function defaultHome(): HomeState {
  return {
    rooms: {
      khach: room("hw_kem", "hf_go", [
        { uid: "k1", id: "h_sofa_kem", x: 2, y: 0, rot: 0 },
        { uid: "c1", id: "h_cay_bui", x: 5, y: 2, rot: 0 },
      ]),
      ngu: room("hw_xanh", "hf_go_sang", [{ uid: "g1", id: "h_giuong_go", x: 0, y: 0, rot: 1 }]),
      bep: room("hw_kem", "hf_caro", [
        { uid: "b1", id: "h_bep_nau", x: 1, y: 0, rot: 0 },
        { uid: "b2", id: "h_bon_rua", x: 2, y: 0, rot: 0 },
      ]),
      vesinh: room("hw_xanh", "hf_gach_xanh", [
        { uid: "v1", id: "h_bon_cau", x: 2, y: 0, rot: 0 },
        { uid: "v2", id: "h_lavabo", x: 4, y: 0, rot: 0 },
      ]),
    },
  };
}

/** Chuyển dữ liệu nhà từ bản cũ (một phòng) sang nhiều phòng; bổ sung phòng còn thiếu */
export function migrateHome(h: unknown): HomeState {
  const base = defaultHome();
  if (!h || typeof h !== "object") return base;
  const any = h as Partial<HomeState> & Partial<RoomState>;
  if (any.rooms) return { rooms: { ...base.rooms, ...any.rooms } };
  if (Array.isArray(any.floor)) {
    // Bản 1.1 thử nghiệm chỉ có một phòng có giường: coi là phòng ngủ
    return { rooms: { ...base.rooms, ngu: { wallpaper: any.wallpaper ?? "hw_kem", flooring: any.flooring ?? "hf_go", floor: any.floor, wall: any.wall ?? [] } } };
  }
  return base;
}

/** Kích thước chiếm chỗ trên sàn theo hướng xoay */
export const footprint = (it: HomeItem, rot: 0 | 1) => (rot ? { w: it.d, d: it.w } : { w: it.w, d: it.d });

const isRugId = (id: string) => id.startsWith("h_tham");

/** Ô ngay trước một cửa (để trống cho nhân vật đi ra vào) */
export const doorTile = (d: Door): [number, number] => (d.side === "R" ? [d.i, 0] : [0, d.i]);

/** Các ô bị đồ chiếm (thảm không tính, đi qua được) */
export function blockedTiles(floor: PlacedFloor[], skipUid?: string) {
  const set = new Set<string>();
  for (const f of floor) {
    if (f.uid === skipUid) continue;
    const it = HOME_MAP[f.id];
    if (!it || isRugId(it.id)) continue;
    const { w, d } = footprint(it, f.rot);
    for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) set.add(`${f.x + i},${f.y + j}`);
  }
  return set;
}

export function canPlace(floor: PlacedFloor[], it: HomeItem, x: number, y: number, rot: 0 | 1, skipUid?: string, doors: Door[] = []) {
  const { w, d } = footprint(it, rot);
  if (x < 0 || y < 0 || x + w > ROOM_N || y + d > ROOM_N) return false;
  const isRug = isRugId(it.id);
  const used = new Set<string>();
  for (const f of floor) {
    if (f.uid === skipUid) continue;
    const o = HOME_MAP[f.id];
    if (!o || isRugId(o.id) !== isRug) continue;
    const s = footprint(o, f.rot);
    for (let i = 0; i < s.w; i++) for (let j = 0; j < s.d; j++) used.add(`${f.x + i},${f.y + j}`);
  }
  if (!isRug) for (const dr of doors) used.add(doorTile(dr).join(","));
  for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) if (used.has(`${x + i},${y + j}`)) return false;
  return true;
}

export function canHang(wall: PlacedWall[], it: HomeItem, side: "L" | "R", i: number, skipUid?: string, doors: Door[] = []) {
  if (i < 0 || i + it.w > ROOM_N) return false;
  if (doors.some((d) => d.side === side && i <= d.i && d.i < i + it.w)) return false;
  return !wall.some((p) => {
    if (p.uid === skipUid || p.side !== side) return false;
    const o = HOME_MAP[p.id];
    return o && i < p.i + o.w && p.i < i + it.w;
  });
}
