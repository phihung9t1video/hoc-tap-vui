"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode, type WheelEvent } from "react";
import { OL } from "@/lib/draw";
import { FloorQuad, TH, TW, poly, pt, type Proj } from "@/lib/iso";
import { BLOCK, ROAD, type TownLayout } from "@/lib/town";
import type { Look } from "@/lib/types";
import { Avatar } from "./Avatar";
import { HouseArt, ShopArt } from "./houses";

const projFor = (L: TownLayout): Proj => ({ ox: (L.mapN * TW) / 2 + 40, oy: 170 });
const VW = 400;
const VH = 520;
const AV = 0.3;

export interface MapPlot {
  owner: string;
  ownerName: string;
  house?: { tier: string; color: string };
}
export interface MapPlayer {
  id: string;
  name: string;
  look: Look;
  plot?: number;
}

interface View {
  x: number;
  y: number;
  s: number;
}

// ---------- Đi theo đường ----------

/** Ô đi được: lòng đường và công viên (không đi xuyên qua đất, nhà) */
const isWalk = (L: TownLayout, x: number, y: number) => {
  const MAP_N = L.mapN;
  const PARK = L.park;
  if (x < 0 || y < 0 || x >= MAP_N || y >= MAP_N) return false;
  const onRoad = x % (BLOCK + ROAD) < ROAD || y % (BLOCK + ROAD) < ROAD;
  const inPark = x >= PARK.x && x < PARK.x + PARK.size && y >= PARK.y && y < PARK.y + PARK.size;
  return onRoad || inPark;
};

/** Ô đường gần nhất (tìm loang từ ô đã chọn) */
function nearestWalk(L: TownLayout, x: number, y: number): [number, number] {
  const MAP_N = L.mapN;
  const sx = Math.min(MAP_N - 1, Math.max(0, Math.floor(x)));
  const sy = Math.min(MAP_N - 1, Math.max(0, Math.floor(y)));
  if (isWalk(L, sx, sy)) return [sx, sy];
  const seen = new Set([sx * MAP_N + sy]);
  const q: [number, number][] = [[sx, sy]];
  while (q.length) {
    const [cx, cy] = q.shift()!;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= MAP_N || ny >= MAP_N || seen.has(nx * MAP_N + ny)) continue;
      if (isWalk(L, nx, ny)) return [nx, ny];
      seen.add(nx * MAP_N + ny);
      q.push([nx, ny]);
    }
  }
  return [Math.floor(L.spawn[0]), Math.floor(L.spawn[1])];
}

/** Đường đi trên lưới ô đường, trả về các điểm rẽ (tâm ô) */
function roadPath(L: TownLayout, from: [number, number], to: [number, number]): [number, number][] {
  const MAP_N = L.mapN;
  const key = (x: number, y: number) => x * MAP_N + y;
  const prev = new Map<number, number>([[key(...from), -1]]);
  const q: [number, number][] = [from];
  while (q.length) {
    const [cx, cy] = q.shift()!;
    if (cx === to[0] && cy === to[1]) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (!isWalk(L, nx, ny) || prev.has(key(nx, ny))) continue;
      prev.set(key(nx, ny), key(cx, cy));
      q.push([nx, ny]);
    }
  }
  if (!prev.has(key(...to))) return [];
  const tiles: [number, number][] = [];
  for (let k = key(...to); k !== -1 && k !== key(...from); k = prev.get(k)!) tiles.unshift([Math.floor(k / MAP_N), k % MAP_N]);
  // Chỉ giữ điểm rẽ để nhân vật đi thẳng từng đoạn
  const turns: [number, number][] = [];
  let last = from;
  tiles.forEach((t, i) => {
    const n = tiles[i + 1];
    const straight = n && (n[0] - t[0] === t[0] - last[0]) && (n[1] - t[1] === t[1] - last[1]);
    if (!straight) turns.push([t[0] + 0.5, t[1] + 0.5]);
    last = t;
  });
  return turns;
}

/** Ô đường ngay trước mảnh đất (phía có lối vào) */
const plotDoor = (L: TownLayout, plotId: number): [number, number] => {
  const pl = L.plots[plotId];
  const bottomRow = (pl.y - ROAD) % (BLOCK + ROAD) === 4;
  return nearestWalk(L, pl.x + 1, bottomRow ? pl.y + 3 : pl.y - 1);
};

const front = (L: TownLayout, plotId: number): [number, number] => {
  const pl = L.plots[plotId];
  return [pl.x + 1, pl.y + 2.75];
};

function Tree({ p: P, x, y }: { p: Proj; x: number; y: number }) {
  const [sx, sy] = pt(P, x, y);
  return (
    <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`} stroke={OL} strokeWidth={1.5}>
      <ellipse cx={0} cy={0} rx={14} ry={6} fill="#000" opacity={0.12} stroke="none" />
      <rect x={-4} y={-26} width={8} height={26} fill="#92400e" />
      <circle cx={-10} cy={-36} r={14} fill="#16a34a" />
      <circle cx={10} cy={-36} r={14} fill="#22c55e" />
      <circle cx={0} cy={-50} r={16} fill="#4ade80" />
    </g>
  );
}

function Sign({ p: P, x, y, text, color }: { p: Proj; x: number; y: number; text: string; color: string }) {
  const [sx, sy] = pt(P, x, y);
  const w = Math.max(44, text.length * 6.4 + 12);
  return (
    <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`}>
      <rect x={-1.5} y={-14} width={3} height={14} fill="#92400e" />
      <rect x={-w / 2} y={-32} width={w} height={18} rx={6} fill={color} stroke={OL} strokeWidth={1.5} />
      <text x={0} y={-19} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#3d2c2c">
        {text}
      </text>
    </g>
  );
}

export function TownMap({
  layout: L,
  plots,
  players,
  meId,
  myLook,
  myPlot,
  startPlot,
  onPlot,
  onShop,
}: {
  layout: TownLayout;
  plots: Map<number, MapPlot>;
  players: MapPlayer[];
  meId: string;
  myLook: Look;
  myPlot?: number;
  /** Đứng trước mảnh đất này khi mở bản đồ (ví dụ vừa ra khỏi shop) */
  startPlot?: number;
  onPlot: (id: number) => void;
  /** Đã đi tới cửa shop: mở shop */
  onShop: (shopId: string) => void;
}) {
  const P = projFor(L);
  const MAP_N = L.mapN;
  const WORLD_W = MAP_N * TW + 80;
  const WORLD_H = P.oy + MAP_N * TH + 60;
  const PARK = L.park;
  const SPAWN = L.spawn;
  const startAt = startPlot ?? myPlot;
  const start: [number, number] = startAt !== undefined && L.plots[startAt] ? ((d) => [d[0] + 0.5, d[1] + 0.5] as [number, number])(plotDoor(L, startAt)) : SPAWN;
  const [me, setMe] = useState({ x: start[0], y: start[1], back: false, moving: false });
  const meRef = useRef(me);
  meRef.current = me;
  const route = useRef<[number, number][]>([]);
  const arrive = useRef<(() => void) | null>(null);
  const raf = useRef<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>(() => {
    const [sx, sy] = pt(P, start[0], start[1]);
    return { s: 1, x: sx - VW / 2, y: sy - VH / 2 - 40 };
  });
  const viewRef = useRef(view);
  viewRef.current = view;
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ moved: boolean; target: EventTarget | null; dist?: number; s0?: number; anchor?: { x: number; y: number } }>({
    moved: false,
    target: null,
  });

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  function walkLoop() {
    let last = performance.now();
    const step = (t: number) => {
      // Mốc giờ của khung hình có thể sớm hơn lúc bắt đầu đi: không để thời gian âm
      const dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
      last = t;
      const m = { ...meRef.current };
      const tg = route.current[0];
      if (!tg) {
        setMe({ ...m, moving: false });
        raf.current = null;
        const done = arrive.current;
        arrive.current = null;
        if (done) setTimeout(done, 150);
        return;
      }
      const dx = tg[0] - m.x;
      const dy = tg[1] - m.y;
      const dist = Math.hypot(dx, dy);
      const v = 3.5 * dt;
      if (dist <= Math.max(v, 1e-6)) {
        m.x = tg[0];
        m.y = tg[1];
        route.current.shift();
      } else {
        m.x += (dx / dist) * v;
        m.y += (dy / dist) * v;
      }
      m.back = dx + dy < 0;
      m.moving = true;
      setMe(m);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }

  function goTo(tx: number, ty: number, then?: () => void) {
    arrive.current = then ?? null;
    const from = nearestWalk(L, meRef.current.x, meRef.current.y);
    const to = nearestWalk(L, tx, ty);
    const path = roadPath(L, from, to);
    // Đang đứng lệch khỏi tâm ô: bước về tâm ô trước
    route.current = [[from[0] + 0.5, from[1] + 0.5], ...path];
    if (!raf.current) walkLoop();
  }

  function toSvg(e: { clientX: number; clientY: number }) {
    const svg = svgRef.current!;
    const m = svg.getScreenCTM()!.inverse();
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const r = p.matrixTransform(m);
    return { x: r.x, y: r.y };
  }

  const clampView = (v: View): View => {
    const s = Math.min(2, Math.max(0.3, v.s));
    return {
      s,
      x: Math.min(WORLD_W - VW / s / 2, Math.max(-VW / s / 2, v.x)),
      y: Math.min(WORLD_H - VH / s / 2, Math.max(-VH / s / 2, v.y)),
    };
  };

  function onDown(e: RPointerEvent<SVGSVGElement>) {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    ptrs.current.set(e.pointerId, toSvg(e));
    if (ptrs.current.size === 1) gesture.current = { moved: false, target: e.target };
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      const v = viewRef.current;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      gesture.current = { moved: true, target: null, dist: Math.hypot(a.x - b.x, a.y - b.y), s0: v.s, anchor: { x: mid.x / v.s + v.x, y: mid.y / v.s + v.y } };
    }
  }

  function onMove(e: RPointerEvent<SVGSVGElement>) {
    const prev = ptrs.current.get(e.pointerId);
    if (!prev) return;
    const cur = toSvg(e);
    ptrs.current.set(e.pointerId, cur);
    const g = gesture.current;
    if (ptrs.current.size === 1) {
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      if (!g.moved && Math.hypot(dx, dy) < 2) return;
      g.moved = true;
      setView((v) => clampView({ ...v, x: v.x - dx / v.s, y: v.y - dy / v.s }));
    } else if (ptrs.current.size === 2 && g.dist && g.s0 && g.anchor) {
      const [a, b] = [...ptrs.current.values()];
      const s = Math.min(2, Math.max(0.3, (g.s0 * Math.hypot(a.x - b.x, a.y - b.y)) / g.dist));
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      setView(clampView({ s, x: g.anchor.x - mid.x / s, y: g.anchor.y - mid.y / s }));
    }
  }

  function onUp(e: RPointerEvent<SVGSVGElement>) {
    const was = ptrs.current.size;
    const at = ptrs.current.get(e.pointerId);
    ptrs.current.delete(e.pointerId);
    const g = gesture.current;
    if (was !== 1 || g.moved || !at) return;
    const shopEl = (g.target as Element | null)?.closest?.("[data-shop]");
    if (shopEl) {
      const id = Number(shopEl.getAttribute("data-plot"));
      const shopId = shopEl.getAttribute("data-shop")!;
      return goTo(...plotDoor(L, id), () => onShop(shopId));
    }
    const el = (g.target as Element | null)?.closest?.("[data-plot]");
    if (el) {
      const id = Number(el.getAttribute("data-plot"));
      goTo(...plotDoor(L, id));
      return onPlot(id);
    }
    // Chạm vào đường, bãi cỏ: đi tới đó
    const v = viewRef.current;
    const wx = at.x / v.s + v.x;
    const wy = at.y / v.s + v.y;
    const X = (wx - P.ox) / (TW / 2);
    const Y = (wy - P.oy) / (TH / 2);
    const tx = Math.min(MAP_N - 0.2, Math.max(0.2, (X + Y) / 2));
    const ty = Math.min(MAP_N - 0.2, Math.max(0.2, (Y - X) / 2));
    goTo(tx, ty);
  }

  function onWheel(e: WheelEvent<SVGSVGElement>) {
    const at = toSvg(e);
    const v = viewRef.current;
    const s = Math.min(2, Math.max(0.3, v.s * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    const wx = at.x / v.s + v.x;
    const wy = at.y / v.s + v.y;
    setView(clampView({ s, x: wx - at.x / s, y: wy - at.y / s }));
  }

  function zoom(f: number) {
    setView((v) => {
      const cx = v.x + VW / v.s / 2;
      const cy = v.y + VH / v.s / 2;
      const s = Math.min(2, Math.max(0.3, v.s * f));
      return clampView({ s, x: cx - VW / s / 2, y: cy - VH / s / 2 });
    });
  }

  function recenter() {
    const [sx, sy] = pt(P, meRef.current.x, meRef.current.y);
    setView((v) => clampView({ ...v, x: sx - VW / v.s / 2, y: sy - VH / v.s / 2 - 30 / v.s }));
  }

  // ---------- Lớp nền (không đổi khi nhân vật đi) ----------
  const ground = useMemo(() => {
    const items: ReactNode[] = [];
    items.push(<FloorQuad key="grass" p={P} x={0} y={0} w={MAP_N} d={MAP_N} fill="#86efac" />);
    for (let i = 0; i <= L.blocks; i++) {
      const r = i * (BLOCK + ROAD);
      items.push(<FloorQuad key={`rv${i}`} p={P} x={r} y={0} w={ROAD} d={MAP_N} fill="#64748b" stroke="none" />);
      items.push(<FloorQuad key={`rh${i}`} p={P} x={0} y={r} w={MAP_N} d={ROAD} fill="#64748b" stroke="none" />);
      for (let k = 0; k < MAP_N; k += 1.6) {
        items.push(<FloorQuad key={`dv${i}-${k}`} p={P} x={r + 0.97} y={k} w={0.06} d={0.7} fill="#f8fafc" stroke="none" />);
        items.push(<FloorQuad key={`dh${i}-${k}`} p={P} x={k} y={r + 0.97} w={0.7} d={0.06} fill="#f8fafc" stroke="none" />);
      }
    }
    for (let by = 0; by < L.blocks; by++)
      for (let bx = 0; bx < L.blocks; bx++)
        items.push(<FloorQuad key={`b${bx}-${by}`} p={P} x={L.blockStart(bx) - 0.08} y={L.blockStart(by) - 0.08} w={BLOCK + 0.16} d={BLOCK + 0.16} fill="#e5e7eb" stroke="#94a3b8" />);
    for (let by = 0; by < L.blocks; by++)
      for (let bx = 0; bx < L.blocks; bx++) items.push(<FloorQuad key={`g${bx}-${by}`} p={P} x={L.blockStart(bx) + 0.1} y={L.blockStart(by) + 0.1} w={BLOCK - 0.2} d={BLOCK - 0.2} fill="#86efac" stroke="none" />);
    // Công viên ở giữa: lối đi chữ thập, hồ nước, đài phun nước
    items.push(<FloorQuad key="pk1" p={P} x={PARK.x + 3} y={PARK.y + 0.1} w={1} d={PARK.size - 0.2} fill="#fde68a" stroke="none" />);
    items.push(<FloorQuad key="pk2" p={P} x={PARK.x + 0.1} y={PARK.y + 3} w={PARK.size - 0.2} d={1} fill="#fde68a" stroke="none" />);
    const [fx, fy] = pt(P, PARK.x + 3.5, PARK.y + 3.5);
    items.push(
      <g key="fountain" stroke={OL} strokeWidth={1.5}>
        <ellipse cx={fx} cy={fy} rx={48} ry={24} fill="#38bdf8" />
        <ellipse cx={fx} cy={fy} rx={34} ry={17} fill="#7dd3fc" stroke="none" />
        <rect x={fx - 4} y={fy - 30} width={8} height={30} fill="#e5e7eb" />
        <path d={`M${fx} ${fy - 30} Q${fx - 18} ${fy - 50} ${fx - 26} ${fy - 8} M${fx} ${fy - 30} Q${fx + 18} ${fy - 50} ${fx + 26} ${fy - 8}`} fill="none" stroke="#bae6fd" strokeWidth={3} />
      </g>,
    );
    const [lx, ly] = pt(P, PARK.x + 1.5, PARK.y + 5.5);
    items.push(<ellipse key="pond" cx={lx} cy={ly} rx={50} ry={22} fill="#60a5fa" stroke={OL} strokeWidth={1.5} />);
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L]);

  // ---------- Đất và nhà ----------
  const plotNodes = useMemo(() => {
    const flat: ReactNode[] = [];
    const tall: { key: number; node: ReactNode }[] = [];
    for (const pl of L.plots) {
      const shop = L.shopAt.get(pl.id);
      if (shop) {
        flat.push(<FloorQuad key={`p${pl.id}`} p={P} x={pl.x} y={pl.y} w={3} d={3} fill="#e2e8f0" stroke="#94a3b8" />);
        tall.push({
          key: pl.x + pl.y + 3,
          node: (
            <g key={`shop${pl.id}`} data-plot={pl.id} data-shop={shop.id} style={{ cursor: "pointer" }}>
              <ShopArt p={P} x={pl.x} y={pl.y} name={shop.name} icon={shop.icon} color={shop.color} />
            </g>
          ),
        });
        continue;
      }
      const info = plots.get(pl.id);
      const mine = info?.owner === meId;
      const fill = !info ? (pl.prime ? "#fef9c3" : "#ecfccb") : info.house ? "#bbf7d0" : "#d6b98c";
      flat.push(
        <g key={`p${pl.id}`} data-plot={pl.id} style={{ cursor: "pointer" }}>
          <FloorQuad p={P} x={pl.x} y={pl.y} w={3} d={3} fill={fill} stroke={mine ? "#f59e0b" : "#65a30d"} />
        </g>,
      );
      const key = pl.x + pl.y + 3;
      if (info?.house) {
        tall.push({
          key,
          node: (
            <g key={`h${pl.id}`} data-plot={pl.id} style={{ cursor: "pointer" }}>
              <HouseArt p={P} x={pl.x} y={pl.y} tier={info.house.tier} color={info.house.color} />
              <Sign p={P} x={pl.x + 2.95} y={pl.y + 2.95} text={`Nhà ${info.ownerName}`} color={mine ? "#fff7cc" : "#ffffff"} />
            </g>
          ),
        });
      } else {
        tall.push({
          key,
          node: (
            <g key={`s${pl.id}`} data-plot={pl.id} style={{ cursor: "pointer" }}>
              <Sign
                p={P}
                x={pl.x + 1.5}
                y={pl.y + 1.5}
                text={info ? `Đất của ${info.ownerName}` : `Bán đất ${pl.price}⭐`}
                color={info ? (mine ? "#fff7cc" : "#f5f5f4") : "#dcfce7"}
              />
            </g>
          ),
        });
      }
    }
    // Cây xanh trong các dãy phố và quanh công viên
    for (let by = 0; by < L.blocks; by++)
      for (let bx = 0; bx < L.blocks; bx++) {
        const x0 = L.blockStart(bx);
        const y0 = L.blockStart(by);
        const spots: [number, number][] =
          bx === L.center && by === L.center
            ? [[0.8, 0.8], [6.2, 0.8], [0.8, 6.2], [6.2, 6.2], [5.6, 1.8], [1.8, 1.8]]
            : [[3.5, 1.4], [3.5, 5.6]];
        for (const [ox, oy] of spots) tall.push({ key: x0 + ox + y0 + oy, node: <Tree key={`t${bx}-${by}-${ox}-${oy}`} p={P} x={x0 + ox} y={y0 + oy} /> });
      }
    return { flat, tall };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plots, meId, L]);

  // ---------- Nhân vật ----------
  const others = players.filter((p) => p.id !== meId);
  const people: { key: number; node: ReactNode }[] = others.map((p, i) => {
    const [x, y] = p.plot !== undefined && L.plots[p.plot] ? front(L, p.plot) : [SPAWN[0] + 0.8 + (i % 4) * 0.7, SPAWN[1] - 1.2 - Math.floor(i / 4) * 0.7];
    const [sx, sy] = pt(P, x, y);
    return {
      key: x + y + 0.01,
      node: (
        <g key={`pl${p.id}`} transform={`translate(${(sx - 100 * AV).toFixed(1)} ${(sy - 270 * AV).toFixed(1)})`} pointerEvents="none">
          <Avatar look={p.look} size={200 * AV} layer="char" />
          <text x={100 * AV} y={-4} textAnchor="middle" fontSize={11} fontWeight={800} fill="#3d2c2c" stroke="#fff" strokeWidth={3} paintOrder="stroke">
            {p.name}
          </text>
        </g>
      ),
    };
  });
  const [mx, my] = pt(P, me.x, me.y);
  const bob = me.moving ? Math.abs(Math.sin(performance.now() / 90)) * 3 : 0;
  people.push({
    key: me.x + me.y + 0.02,
    node: (
      <g key="me" transform={`translate(${(mx - 100 * AV).toFixed(1)} ${(my - 270 * AV - bob).toFixed(1)})`} pointerEvents="none">
        <ellipse cx={100 * AV} cy={270 * AV + bob} rx={16} ry={5} fill="#000" opacity={0.18} />
        <Avatar look={myLook} size={200 * AV} layer="char" angle={me.back ? 180 : 0} />
        <polygon points={poly([[100 * AV - 7, -16], [100 * AV + 7, -16], [100 * AV, -6]])} fill="#f59e0b" stroke={OL} strokeWidth={1.5} />
      </g>
    ),
  });

  const sorted = [...plotNodes.tall, ...people].sort((a, b) => a.key - b.key);

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        style={{ display: "block", touchAction: "none", background: "linear-gradient(#bae6fd, #e0f2fe)", userSelect: "none" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={(e) => ptrs.current.delete(e.pointerId)}
        onWheel={onWheel}
        role="img"
        aria-label="Khu phố"
      >
        <g transform={`scale(${view.s.toFixed(4)}) translate(${(-view.x).toFixed(1)} ${(-view.y).toFixed(1)})`}>
          {ground}
          {plotNodes.flat}
          {sorted.map((o) => o.node)}
        </g>
      </svg>
      <div className="map-tools">
        <button className="btn" onClick={() => zoom(1.25)} aria-label="Phóng to">
          ＋
        </button>
        <button className="btn" onClick={() => zoom(0.8)} aria-label="Thu nhỏ">
          －
        </button>
        <button className="btn" onClick={recenter} aria-label="Về chỗ nhân vật">
          📍
        </button>
      </div>
    </div>
  );
}
