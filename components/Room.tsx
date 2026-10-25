"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { OL, Sparkle, Star } from "@/lib/draw";
import { HOME_MAP, ROOMS, ROOM_N, blockedTiles, doorTile, footprint, type Door, type DoorTarget, type HomeItem, type RoomState } from "@/lib/home";
import { FloorQuad, TW, TH, poly, pt, shade, wallMatrix, type Proj } from "@/lib/iso";
import type { Look } from "@/lib/types";
import { Avatar } from "./Avatar";

const WALL_H = 150;
const P: Proj = { ox: (ROOM_N * TW) / 2 + 12, oy: WALL_H + 16 };
const VIEW_W = ROOM_N * TW + 24;
const VIEW_H = P.oy + ROOM_N * TH + 22;
/** Độ cao (tính từ sàn) của mép trên đồ treo tường */
const WALL_ITEM_TOP = 118;

type Theme = NonNullable<HomeItem["theme"]>;

/** Hoa văn giấy dán tường, nghiêng theo mặt tường */
function WallPattern({ id, t, side }: { id: string; t: Theme; side: "L" | "R" }) {
  const skew = side === "R" ? "matrix(1 0.5 0 1 0 0)" : "matrix(1 -0.5 0 1 0 0)";
  const size = t.pattern === "brick" ? [30, 16] : t.pattern === "night" ? [44, 44] : [18, 18];
  return (
    <pattern id={id} width={size[0]} height={size[1]} patternUnits="userSpaceOnUse" patternTransform={skew}>
      <rect width={size[0]} height={size[1]} fill={t.a} />
      {t.pattern === "stripes" && <rect width={9} height={18} fill={t.b} />}
      {t.pattern === "dots" && <circle cx={9} cy={9} r={3} fill={t.b} />}
      {t.pattern === "stars" && <Star cx={9} cy={9} R={4} fill={t.b} sw={0} />}
      {t.pattern === "brick" && <path d="M0 0.5 H30 M0 8.5 H30 M15 0 V8 M0 8 V16 M30 8 V16" stroke={t.b} strokeWidth={1.5} />}
      {t.pattern === "night" && (
        <g>
          <Sparkle x={8} y={10} s={2.5} fill={t.b} />
          <Sparkle x={30} y={28} s={3.5} fill="#ffffff" />
          <circle cx={22} cy={8} r={1} fill="#ffffff" />
          <circle cx={10} cy={36} r={1.2} fill={t.b} />
        </g>
      )}
    </pattern>
  );
}

function FloorTile({ x, y, t }: { x: number; y: number; t: Theme }) {
  const corners = [pt(P, x, y), pt(P, x + 1, y), pt(P, x + 1, y + 1), pt(P, x, y + 1)];
  const alt = (x + y) % 2 === 1;
  const fill = t.pattern === "check" ? (alt ? t.b : t.a) : t.pattern === "planks" ? (y % 2 ? t.b : t.a) : t.a;
  const [cx, cy] = pt(P, x + 0.5, y + 0.5);
  return (
    <g>
      <polygon points={poly(corners)} fill={fill} stroke={shade(t.a, 0.85)} strokeWidth={0.8} />
      {t.pattern === "planks" && (
        <path d={`M${pt(P, x + 0.5, y)[0]} ${pt(P, x + 0.5, y)[1]} L${pt(P, x + 0.5, y + 1)[0]} ${pt(P, x + 0.5, y + 1)[1]}`} stroke={shade(t.b, 0.8)} strokeWidth={0.8} />
      )}
      {t.pattern === "grass" && <path d={`M${cx - 8} ${cy + 2} l2 -5 l2 5 M${cx + 6} ${cy - 3} l2 -5 l2 5`} stroke={t.b} strokeWidth={1.5} fill="none" />}
      {t.pattern === "marble" && alt && <path d={`M${cx - 14} ${cy} Q${cx} ${cy - 6} ${cx + 12} ${cy + 3}`} stroke={t.b} strokeWidth={1.2} fill="none" />}
      {t.pattern === "cloud" && alt && <ellipse cx={cx} cy={cy} rx={14} ry={5} fill={t.b} opacity={0.9} />}
    </g>
  );
}

// ---------- Ngồi, nằm ----------

type Pose = { uid: string; kind: "sit" | "lie" } | null;

function seatKind(id: string): "sit" | "lie" | null {
  if (id.startsWith("h_giuong")) return "lie";
  if (id.startsWith("h_sofa") || id.startsWith("h_ghe") || id === "h_ngai_vang") return "sit";
  return null;
}

// ---------- Tìm đường trên lưới ô ----------

function findPath(from: [number, number], to: [number, number], blocked: Set<string>): [number, number][] {
  const key = (x: number, y: number) => `${x},${y}`;
  const free = (x: number, y: number) => x >= 0 && y >= 0 && x < ROOM_N && y < ROOM_N && !blocked.has(key(x, y));
  let goal = to;
  if (!free(...to)) {
    // Bấm vào đồ đạc: đi tới ô trống gần nhất bên cạnh
    const around: [number, number][] = [];
    for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) if (free(to[0] + dx, to[1] + dy)) around.push([to[0] + dx, to[1] + dy]);
    if (!around.length) return [];
    around.sort((a, b) => Math.hypot(a[0] - to[0], a[1] - to[1]) - Math.hypot(b[0] - to[0], b[1] - to[1]));
    goal = around[0];
  }
  const prev = new Map<string, string | null>([[key(...from), null]]);
  const queue: [number, number][] = [from];
  while (queue.length) {
    const [x, y] = queue.shift()!;
    if (x === goal[0] && y === goal[1]) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (free(nx, ny) && !prev.has(key(nx, ny))) {
        prev.set(key(nx, ny), key(x, y));
        queue.push([nx, ny]);
      }
    }
  }
  if (!prev.has(key(...goal))) return [];
  const path: [number, number][] = [];
  for (let k: string | null = key(...goal); k && k !== key(...from); k = prev.get(k) ?? null) {
    const [a, b] = k.split(",").map(Number);
    path.unshift([a, b]);
  }
  return path;
}

// ---------- Khung cảnh ----------

export interface RoomProps {
  room: RoomState;
  doors: Door[];
  /** Ô xuất hiện khi vừa bước vào phòng */
  entry?: [number, number];
  onDoor?: (to: DoorTarget) => void;
  look: Look;
  /** play: chạm để đi; arrange: chạm để đặt/chọn đồ */
  mode: "play" | "arrange";
  selectedUid?: string;
  /** Đang cầm đồ treo tường: hiện các vị trí treo */
  wallTarget?: boolean;
  onTile?: (x: number, y: number) => void;
  onWall?: (side: "L" | "R", i: number) => void;
  onItem?: (uid: string) => void;
}

export function Room({ room, doors, entry, onDoor, look, mode, selectedUid, wallTarget, onTile, onWall, onItem }: RoomProps) {
  const uid = useId().replace(/:/g, "");
  const wp = HOME_MAP[room.wallpaper]?.theme ?? HOME_MAP.hw_kem.theme!;
  const fl = HOME_MAP[room.flooring]?.theme ?? HOME_MAP.hf_go.theme!;
  const blocked = blockedTiles(room.floor);
  const hasPet = look.pet && look.pet !== "pet_khong";

  // Vị trí nhân vật, thú cưng (toạ độ ô, số thực để đi mượt)
  const start = useRef<[number, number]>(entry && !blocked.has(entry.join(",")) ? entry : firstFree(blocked));
  const pendingDoor = useRef<DoorTarget | null>(null);
  // Ngồi ghế, sofa hoặc nằm giường
  const [pose, setPose] = useState<Pose>(null);
  const pendingPose = useRef<Pose>(null);
  const [me, setMe] = useState({ x: start.current[0], y: start.current[1], back: false, hop: 0 });
  const [pet, setPet] = useState({ x: Math.min(start.current[0] + 1, ROOM_N - 1), y: start.current[1] });
  const path = useRef<[number, number][]>([]);
  const raf = useRef<number | null>(null);
  const meRef = useRef(me);
  const petRef = useRef(pet);
  meRef.current = me;
  petRef.current = pet;

  // Nếu đồ mới đặt đè lên chỗ đang đứng thì nhảy ra ô trống
  useEffect(() => {
    const k = `${Math.round(meRef.current.x)},${Math.round(meRef.current.y)}`;
    if (blocked.has(k)) {
      const [x, y] = firstFree(blocked);
      setMe((m) => ({ ...m, x, y }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.floor]);

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  function loop(t0: number) {
    let last = t0;
    const step = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const m = { ...meRef.current };
      const next = path.current[0];
      let moving = false;
      if (next) {
        const dx = next[0] - m.x;
        const dy = next[1] - m.y;
        const dist = Math.hypot(dx, dy);
        const v = 3.2 * dt;
        if (dist <= v) {
          m.x = next[0];
          m.y = next[1];
          path.current.shift();
        } else {
          m.x += (dx / dist) * v;
          m.y += (dy / dist) * v;
        }
        m.back = dx + dy < 0;
        moving = true;
      }
      if (m.hop > 0) m.hop = Math.max(0, m.hop - dt * 1.6);
      setMe(m);
      if (!path.current.length && pendingPose.current) {
        setPose(pendingPose.current);
        pendingPose.current = null;
      }
      if (!path.current.length && pendingDoor.current) {
        const to = pendingDoor.current;
        pendingDoor.current = null;
        setTimeout(() => onDoor?.(to), 120);
      }

      // Thú cưng chạy theo, giữ khoảng cách gần một ô
      const p = { ...petRef.current };
      const pdx = m.x - p.x;
      const pdy = m.y - p.y;
      const pd = Math.hypot(pdx, pdy);
      let petMoving = false;
      if (pd > 0.95) {
        const v = Math.min(pd - 0.9, 3.4 * dt);
        p.x += (pdx / pd) * v;
        p.y += (pdy / pd) * v;
        petMoving = true;
        setPet(p);
      }
      if (moving || petMoving || m.hop > 0) raf.current = requestAnimationFrame(step);
      else raf.current = null;
    };
    raf.current = requestAnimationFrame(step);
  }

  function walkTo(x: number, y: number, door?: DoorTarget, seat?: Pose) {
    const from: [number, number] = [Math.round(meRef.current.x), Math.round(meRef.current.y)];
    path.current = findPath(from, [x, y], blocked);
    pendingDoor.current = door ?? null;
    pendingPose.current = seat ?? null;
    setPose(null);
    if (seat && !path.current.length) {
      pendingPose.current = null;
      setPose(seat);
      return;
    }
    if (door && !path.current.length) {
      pendingDoor.current = null;
      onDoor?.(door);
      return;
    }
    if (!raf.current) loop(performance.now());
  }

  function hop() {
    setMe((m) => ({ ...m, hop: 1 }));
    if (!raf.current) loop(performance.now());
  }

  // ---------- Các vật thể xếp theo chiều sâu ----------
  const objects: { key: number; node: ReactNode }[] = [];
  const rugs: ReactNode[] = [];
  for (const f of room.floor) {
    const it = HOME_MAP[f.id];
    if (!it?.floor) continue;
    const { w, d } = footprint(it, f.rot);
    const node = (
      <g
        key={f.uid}
        onClick={(e) => {
          e.stopPropagation();
          if (mode === "arrange") onItem?.(f.uid);
          else {
            const kind = seatKind(f.id);
            walkTo(f.x, f.y, undefined, kind ? { uid: f.uid, kind } : null);
          }
        }}
        style={{ cursor: "pointer" }}
        className={selectedUid === f.uid ? "home-selected" : undefined}
      >
        {it.floor({ p: P, x: f.x, y: f.y, rot: f.rot })}
      </g>
    );
    if (it.id.startsWith("h_tham")) rugs.push(node);
    else objects.push({ key: f.x + w / 2 + f.y + d / 2, node });
  }

  const S = 0.33;
  const seatOn = pose ? room.floor.find((f) => f.uid === pose.uid) : undefined;
  const seatItem = seatOn ? HOME_MAP[seatOn.id] : undefined;
  if (pose && seatOn && seatItem) {
    const { w, d } = footprint(seatItem, seatOn.rot);
    const furnitureKey = seatOn.x + w / 2 + seatOn.y + d / 2;
    if (pose.kind === "sit") {
      const z = seatItem.id === "h_ngai_vang" ? 32 : seatItem.id.startsWith("h_ghe_luoi") ? 14 : seatItem.id.startsWith("h_ghe") ? 24 : 22;
      const [sx, sy] = seatOn.rot ? pt(P, seatOn.x + 0.6, seatOn.y + d / 2, z) : pt(P, seatOn.x + w / 2, seatOn.y + 0.6, z);
      objects.push({
        key: furnitureKey + 0.01,
        node: (
          <g key="me" transform={`translate(${(sx - 100 * S).toFixed(1)} ${(sy - 224 * S).toFixed(1)})`} pointerEvents="none">
            <g clipPath={`url(#${uid}sit)`}>
              <Avatar look={look} size={200 * S} layer="char" />
            </g>
          </g>
        ),
      });
    } else {
      const [sx, sy] = seatOn.rot ? pt(P, seatOn.x + 0.5, seatOn.y + 1.1, 24) : pt(P, seatOn.x + 1.1, seatOn.y + 0.5, 24);
      const blanket = seatOn.rot
        ? { x: seatOn.x + 0.06, y: seatOn.y + 0.95, w: 0.88, d: 1.0 }
        : { x: seatOn.x + 0.95, y: seatOn.y + 0.06, w: 1.0, d: 0.88 };
      objects.push({
        key: furnitureKey + 0.01,
        node: (
          <g key="me" pointerEvents="none">
            <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)}) rotate(${seatOn.rot ? 63.4 : -63.4}) translate(${-100 * S} ${-154 * S})`}>
              <Avatar look={look} size={200 * S} layer="char" />
            </g>
            <FloorQuad p={P} x={blanket.x} y={blanket.y} w={blanket.w} d={blanket.d} z={27} fill="#93c5fd" />
            <text x={sx + (seatOn.rot ? 18 : -18)} y={sy - 34} fontSize={16} className="zzz">
              💤
            </text>
          </g>
        ),
      });
    }
  }
  const [cx, cy] = pt(P, me.x + 0.5, me.y + 0.5);
  const bob = path.current.length ? Math.abs(Math.sin(performance.now() / 90)) * 3 : 0;
  const jump = Math.sin(me.hop * Math.PI) * 26;
  if (!pose || !seatOn) objects.push({
    key: me.x + me.y + 1.01,
    node: (
      <g key="me" transform={`translate(${(cx - 100 * S).toFixed(1)} ${(cy - 270 * S - bob - jump).toFixed(1)})`} onClick={(e) => { e.stopPropagation(); hop(); }} style={{ cursor: "pointer" }}>
        <ellipse cx={100 * S} cy={270 * S + bob + jump} rx={18} ry={6} fill="#000" opacity={0.15} />
        <Avatar look={look} size={200 * S} layer="char" angle={me.back ? 180 : me.hop ? me.hop * 360 : 0} />
      </g>
    ),
  });
  if (hasPet) {
    const PS = 0.5;
    const [px, py] = pt(P, pet.x + 0.5, pet.y + 0.5);
    objects.push({
      key: pet.x + pet.y + 1,
      node: (
        <g key="pet" transform={`translate(${(px - 34 * PS).toFixed(1)} ${(py - 76 * PS).toFixed(1)})`}>
          <ellipse cx={34 * PS} cy={76 * PS} rx={11} ry={4} fill="#000" opacity={0.15} />
          <Avatar look={look} size={62 * PS} crop="pet" layer="pet" />
        </g>
      ),
    });
  }
  objects.sort((a, b) => a.key - b.key);

  // ---------- Vùng chạm ----------
  const tiles: ReactNode[] = [];
  for (let x = 0; x < ROOM_N; x++)
    for (let y = 0; y < ROOM_N; y++)
      tiles.push(
        <polygon
          key={`t${x}-${y}`}
          points={poly([pt(P, x, y), pt(P, x + 1, y), pt(P, x + 1, y + 1), pt(P, x, y + 1)])}
          fill={mode === "arrange" ? "rgba(255,255,255,0.01)" : "transparent"}
          stroke={mode === "arrange" ? "rgba(61,44,44,0.25)" : "none"}
          strokeDasharray="3 3"
          onClick={() => (mode === "arrange" ? onTile?.(x, y) : walkTo(x, y))}
        />,
      );

  const wallSlots: ReactNode[] = [];
  if (wallTarget)
    for (const side of ["L", "R"] as const)
      for (let i = 0; i < ROOM_N; i++) {
        const q =
          side === "R"
            ? [pt(P, i, 0, 20), pt(P, i + 1, 0, 20), pt(P, i + 1, 0, WALL_H - 10), pt(P, i, 0, WALL_H - 10)]
            : [pt(P, 0, i, 20), pt(P, 0, i + 1, 20), pt(P, 0, i + 1, WALL_H - 10), pt(P, 0, i, WALL_H - 10)];
        wallSlots.push(
          <polygon key={`${side}${i}`} points={poly(q)} fill="rgba(250,204,21,0.12)" stroke="#f59e0b" strokeDasharray="4 3" onClick={() => onWall?.(side, i)} />,
        );
      }

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" style={{ display: "block", touchAction: "manipulation" }} role="img" aria-label="Ngôi nhà">
      <defs>
        <clipPath id={`${uid}sit`}>
          <rect x={0} y={0} width={200 * 0.33} height={224 * 0.33} />
        </clipPath>
        <WallPattern id={`${uid}wl`} t={wp} side="L" />
        <WallPattern id={`${uid}wr`} t={wp} side="R" />
      </defs>

      {/* Tường */}
      <polygon points={poly([pt(P, 0, 0), pt(P, 0, ROOM_N), pt(P, 0, ROOM_N, WALL_H), pt(P, 0, 0, WALL_H)])} fill={`url(#${uid}wl)`} stroke={OL} strokeWidth={2} />
      <polygon points={poly([pt(P, 0, 0), pt(P, 0, ROOM_N), pt(P, 0, ROOM_N, WALL_H), pt(P, 0, 0, WALL_H)])} fill="#000" opacity={0.06} />
      <polygon points={poly([pt(P, 0, 0), pt(P, ROOM_N, 0), pt(P, ROOM_N, 0, WALL_H), pt(P, 0, 0, WALL_H)])} fill={`url(#${uid}wr)`} stroke={OL} strokeWidth={2} />
      <polygon points={poly([pt(P, 0, 0), pt(P, 0, ROOM_N), pt(P, 0, ROOM_N, 8), pt(P, 0, 0, 8)])} fill="#f8fafc" stroke={OL} strokeWidth={1} />
      <polygon points={poly([pt(P, 0, 0), pt(P, ROOM_N, 0), pt(P, ROOM_N, 0, 8), pt(P, 0, 0, 8)])} fill="#ffffff" stroke={OL} strokeWidth={1} />

      {/* Cửa sang phòng khác */}
      {doors.map((d) => {
        const label = d.to === "pho" ? { icon: "🏘️", name: "Ra phố" } : ROOMS[d.to];
        return (
          <g
            key={`${d.side}${d.i}`}
            transform={wallMatrix(P, d.side, d.i, 1, 96)}
            onClick={(e) => {
              e.stopPropagation();
              if (mode === "play") walkTo(...doorTile(d), d.to);
            }}
            style={{ cursor: mode === "play" ? "pointer" : undefined }}
          >
            <rect x={1} y={0} width={28} height={96} fill={d.to === "pho" ? "#92400e" : "#b45309"} stroke={OL} strokeWidth={2} />
            <rect x={5} y={6} width={20} height={36} fill={d.to === "pho" ? "#a16207" : "#d97706"} stroke={OL} strokeWidth={1} />
            <rect x={5} y={48} width={20} height={40} fill={d.to === "pho" ? "#a16207" : "#d97706"} stroke={OL} strokeWidth={1} />
            <circle cx={23} cy={50} r={2.2} fill="#facc15" stroke={OL} strokeWidth={0.8} />
            <rect x={-12} y={-17} width={54} height={14} rx={4} fill="#fff7ed" stroke={OL} strokeWidth={1.2} />
            <text x={15} y={-7} textAnchor="middle" fontSize={7} fontWeight={800} fill="#3d2c2c">
              {label.icon} {label.name}
            </text>
          </g>
        );
      })}

      {/* Đồ treo tường */}
      {room.wall.map((w) => {
        const it = HOME_MAP[w.id];
        if (!it?.wall) return null;
        return (
          <g
            key={w.uid}
            transform={wallMatrix(P, w.side, w.i, it.w, WALL_ITEM_TOP)}
            onClick={(e) => {
              e.stopPropagation();
              if (mode === "arrange") onItem?.(w.uid);
            }}
            className={selectedUid === w.uid ? "home-selected" : undefined}
            style={{ cursor: mode === "arrange" ? "pointer" : undefined }}
          >
            {it.wall()}
          </g>
        );
      })}

      {/* Sàn */}
      {Array.from({ length: ROOM_N }, (_, x) => Array.from({ length: ROOM_N }, (_, y) => <FloorTile key={`${x}-${y}`} x={x} y={y} t={fl} />))}
      <polygon points={poly([pt(P, 0, 0), pt(P, ROOM_N, 0), pt(P, ROOM_N, ROOM_N), pt(P, 0, ROOM_N)])} fill="none" stroke={OL} strokeWidth={2} />
      {rugs}
      {tiles}
      {objects.map((o) => o.node)}
      {wallSlots}
    </svg>
  );
}

function firstFree(blocked: Set<string>): [number, number] {
  const order: [number, number][] = [];
  for (let s = ROOM_N * 2 - 2; s >= 0; s--) for (let x = 0; x < ROOM_N; x++) { const y = s - x; if (y >= 0 && y < ROOM_N) order.push([x, y]); }
  // Ưu tiên giữa phòng
  order.sort((a, b) => Math.hypot(a[0] - 3, a[1] - 3.5) - Math.hypot(b[0] - 3, b[1] - 3.5));
  return order.find(([x, y]) => !blocked.has(`${x},${y}`)) ?? [ROOM_N - 1, ROOM_N - 1];
}

// ---------- Ảnh nhỏ trong cửa hàng ----------

/** Vẽ một món đồ riêng lẻ, tự canh khung theo kích thước thật */
export function HomeThumb({ item, size = 76 }: { item: HomeItem; size?: number }) {
  const ref = useRef<SVGGElement>(null);
  const [vb, setVb] = useState("-60 -110 120 130");
  const uid = useId().replace(/:/g, "");
  const p: Proj = { ox: 0, oy: 0 };

  useLayoutEffect(() => {
    const b = ref.current?.getBBox();
    if (b && b.width > 0) {
      const m = 6;
      const side = Math.max(b.width, b.height) + m * 2;
      setVb(`${(b.x + b.width / 2 - side / 2).toFixed(1)} ${(b.y + b.height / 2 - side / 2).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}`);
    }
  }, [item.id]);

  let content: ReactNode;
  if (item.kind === "floor" && item.floor) {
    content = (
      <g>
        <FloorQuad p={p} x={-0.2} y={-0.2} w={item.w + 0.4} d={item.d + 0.4} fill="#f5e6d3" stroke="none" />
        {item.floor({ p, x: 0, y: 0, rot: 0 })}
      </g>
    );
  } else if (item.kind === "wall" && item.wall) {
    content = (
      <g>
        <rect x={-4} y={-6} width={item.w * 30 + 8} height={52} fill="#fdf2e3" />
        {item.wall()}
      </g>
    );
  } else if (item.theme) {
    const t = item.theme;
    content =
      item.kind === "wallpaper" ? (
        <g>
          <defs>
            <WallPattern id={`${uid}t`} t={t} side="R" />
          </defs>
          <rect x={0} y={0} width={60} height={60} fill={`url(#${uid}t)`} stroke={OL} strokeWidth={2} />
        </g>
      ) : (
        <g>
          {[0, 1].flatMap((x) => [0, 1].map((y) => {
            const corners = [pt(p, x, y), pt(p, x + 1, y), pt(p, x + 1, y + 1), pt(p, x, y + 1)];
            const fill = t.pattern === "check" ? ((x + y) % 2 ? t.b : t.a) : t.pattern === "planks" ? (y % 2 ? t.b : t.a) : t.a;
            return <polygon key={`${x}${y}`} points={poly(corners)} fill={fill} stroke={OL} strokeWidth={1} />;
          }))}
          {t.pattern === "cloud" && <ellipse cx={0} cy={30} rx={18} ry={6} fill="#fff" />}
        </g>
      );
  }

  return (
    <svg viewBox={vb} width={size} height={size} aria-hidden>
      <g ref={ref}>{content}</g>
    </svg>
  );
}
