"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Body, HAIR_CAP, Head, ITEM_MAP, defaultLook, type Crop } from "@/lib/items";
import { OL, Sparkle, type Rarity } from "@/lib/draw";
import type { Look, Slot } from "@/lib/types";

const FALLBACK = defaultLook("nam");

const RANK: Record<Rarity, number> = { thuong: 0, hiem: 1, suthi: 2, huyenthoai: 3 };
/** Vị trí hạt sáng bay quanh nhân vật */
const TWINKLES: [number, number, number][] = [
  [30, 40, 7], [168, 30, 6], [22, 150, 5], [182, 120, 7], [60, 0, 5], [146, -6, 5], [14, 92, 6], [190, 70, 5],
];

/** Hạt sáng lấp lánh khi mặc đồ Sử thi / Huyền thoại: đồ càng hiếm càng nhiều, càng rực */
function RarityFx({ rank }: { rank: number }) {
  if (rank < 2) return null;
  const legendary = rank === 3;
  const colors = legendary ? ["#fde68a", "#ffffff", "#fbbf24"] : ["#e9d5ff", "#ffffff", "#c084fc"];
  return (
    <g pointerEvents="none">
      {legendary && <ellipse cx={100} cy={130} rx={96} ry={128} fill="url(#hv-glow)" />}
      {TWINKLES.slice(0, legendary ? 8 : 4).map(([x, y, s], i) => (
        <g key={i} className="tw" style={{ animationDelay: `${(i * 0.37) % 1.6}s` }}>
          <Sparkle x={x} y={y} s={legendary ? s + 2 : s} fill={colors[i % 3]} />
        </g>
      ))}
    </g>
  );
}

/** Khung nhìn [x, y, rộng, cao] cho từng kiểu cắt ảnh */
const VIEW: Record<Crop, [number, number, number, number]> = {
  full: [0, -24, 200, 280],
  head: [20, -24, 160, 170],
  pet: [138, 174, 62, 82],
  toy: [4, 212, 48, 44],
};

export function Avatar({
  look,
  size = 200,
  crop = "full",
  className,
  angle = 0,
}: {
  look: Look;
  size?: number;
  crop?: Crop;
  className?: string;
  /** Góc xoay nhân vật (độ): 0 là nhìn thẳng, 180 là quay lưng */
  angle?: number;
}) {
  const get = (s: Slot) => ITEM_MAP[look[s]] ?? ITEM_MAP[FALLBACK[s]];
  const cos = Math.cos((angle * Math.PI) / 180);
  const back = cos < 0;
  const c = { skin: get("skin").color!, hair: get("hairColor").color!, back };
  const [x, y, w, h] = VIEW[crop];
  const hasPet = get("pet").draw !== undefined;
  // Bóp ngang theo góc xoay để tạo cảm giác quay tròn
  const sx = Math.max(Math.abs(cos), 0.04) * (cos < 0 ? -1 : 1);
  const hair = get("hair");
  const fx = crop === "full" && size >= 120;
  const topRank = fx
    ? Math.max(...(["hair", "eyes", "shirt", "pants", "shoes", "glasses", "hat", "back", "pet", "petAcc", "petToy", "petHome"] as Slot[]).map((s) => RANK[get(s).rarity]))
    : 0;

  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} width={size} height={(size * h) / w} className={className} role="img" aria-label="Nhân vật" strokeLinejoin="round">
      {topRank === 3 && (
        <defs>
          <radialGradient id="hv-glow">
            <stop offset="0%" stopColor="#fde68a" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#fde68a" stopOpacity={0} />
          </radialGradient>
        </defs>
      )}
      <RarityFx rank={topRank} />
      {get("petHome").draw?.(c)}
      <g transform={angle ? `translate(100 0) scale(${sx.toFixed(3)} 1) translate(-100 0)` : undefined}>
        {back ? (
          <>
            <Body skin={c.skin} />
            {get("shoes").draw?.(c)}
            {get("pants").draw?.(c)}
            {get("shirt").draw?.(c)}
            <Head skin={c.skin} back />
            {hair.id !== "dau_troc" && <path d={HAIR_CAP} fill={c.hair} stroke={OL} strokeWidth={2.5} />}
            {hair.back?.(c)}
            {get("hat").draw?.(c)}
            {get("back").draw?.(c)}
          </>
        ) : (
          <>
            {get("back").draw?.(c)}
            {hair.back?.(c)}
            <Body skin={c.skin} />
            {get("shoes").draw?.(c)}
            {get("pants").draw?.(c)}
            {get("shirt").draw?.(c)}
            <Head skin={c.skin} />
            {get("eyes").draw?.(c)}
            {get("mouth").draw?.(c)}
            {hair.draw?.(c)}
            {get("glasses").draw?.(c)}
            {get("hat").draw?.(c)}
          </>
        )}
      </g>
      {get("pet").draw?.(c)}
      {hasPet && get("petAcc").draw?.(c)}
      {get("petToy").draw?.(c)}
    </svg>
  );
}

/** Nhân vật chạm để xoay một vòng, hoặc kéo ngang để xoay theo tay. */
export function SpinAvatar({ look, size, className }: { look: Look; size: number; className?: string }) {
  const [angle, setAngle] = useState(0);
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const anim = useRef<number | null>(null);

  useEffect(() => () => {
    if (anim.current) cancelAnimationFrame(anim.current);
  }, []);

  function animateTo(from: number, to: number, ms: number) {
    if (anim.current) cancelAnimationFrame(anim.current);
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setAngle(from + (to - from) * e);
      if (p < 1) anim.current = requestAnimationFrame(step);
      else setAngle(((to % 360) + 360) % 360);
    };
    anim.current = requestAnimationFrame(step);
  }

  function onDown(e: PointerEvent) {
    if (anim.current) cancelAnimationFrame(anim.current);
    drag.current = { x: e.clientX, start: angle, moved: false };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }
  function onMove(e: PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    if (d.moved) setAngle(d.start + dx * 1.5);
  }
  function onUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) animateTo(angle, angle + 360, 1100);
    else animateTo(angle, Math.round(angle / 180) * 180, 350);
  }

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ touchAction: "pan-y", cursor: "grab", userSelect: "none" }}
      title="Chạm để xoay, kéo ngang để quay nhân vật"
    >
      <Avatar look={look} size={size} angle={angle} className={angle % 360 === 0 ? className : undefined} />
    </div>
  );
}
