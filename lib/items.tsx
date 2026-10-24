import type { ReactNode } from "react";
import { Limb, OL, SIDES, Sparkle, Star, heartPath, mirror, type Draw, type DrawCtx, type Item } from "./draw";
import { PET_ITEMS } from "./pets";
import type { Gender, Look, Slot } from "./types";

export { RARITY, type Item, type Rarity } from "./draw";

export type Crop = "head" | "full" | "pet" | "toy";

export const SLOTS: { slot: Slot; label: string; icon: string; crop: Crop }[] = [
  { slot: "skin", label: "Màu da", icon: "🧑", crop: "head" },
  { slot: "hair", label: "Kiểu tóc", icon: "💇", crop: "head" },
  { slot: "hairColor", label: "Màu tóc", icon: "🎨", crop: "head" },
  { slot: "eyes", label: "Mắt", icon: "👀", crop: "head" },
  { slot: "mouth", label: "Miệng", icon: "😊", crop: "head" },
  { slot: "shirt", label: "Áo", icon: "👕", crop: "full" },
  { slot: "pants", label: "Quần, váy", icon: "👖", crop: "full" },
  { slot: "shoes", label: "Giày", icon: "👟", crop: "full" },
  { slot: "glasses", label: "Kính", icon: "🕶️", crop: "head" },
  { slot: "hat", label: "Mũ", icon: "🎩", crop: "head" },
  { slot: "back", label: "Sau lưng", icon: "🦋", crop: "full" },
  { slot: "pet", label: "Thú cưng", icon: "🐱", crop: "pet" },
  { slot: "petAcc", label: "Đồ cho thú cưng", icon: "🎀", crop: "pet" },
  { slot: "petToy", label: "Đồ chơi, bát ăn", icon: "🦴", crop: "toy" },
  { slot: "petHome", label: "Nệm, nhà thú cưng", icon: "🏠", crop: "pet" },
];

export function Body({ skin }: { skin: string }) {
  return (
    <g>
      {SIDES.map((f, i) => (
        <g key={i}>
          <Limb x1={f(72)} y1={152} x2={f(57)} y2={190} w={13} color={skin} />
          <circle cx={f(56)} cy={194} r={8} fill={skin} stroke={OL} strokeWidth={2.5} />
          <rect x={f(80) - (i ? 16 : 0)} y={194} width={16} height={42} rx={6} fill={skin} stroke={OL} strokeWidth={2.5} />
        </g>
      ))}
      <rect x={92} y={128} width={16} height={18} fill={skin} stroke={OL} strokeWidth={2.5} />
    </g>
  );
}

export function Head({ skin, back }: { skin: string; back?: boolean }) {
  return (
    <g>
      {SIDES.map((f, i) => (
        <g key={i}>
          <circle cx={f(46)} cy={96} r={10} fill={skin} stroke={OL} strokeWidth={2.5} />
          <circle cx={f(46)} cy={96} r={4.5} fill="#000" opacity={0.08} />
        </g>
      ))}
      <ellipse cx={100} cy={88} rx={56} ry={52} fill={skin} stroke={OL} strokeWidth={2.5} />
      {!back &&
        SIDES.map((f, i) => <ellipse key={i} cx={f(68)} cy={110} rx={8} ry={5} fill="#ff8fa3" opacity={0.45} />)}
    </g>
  );
}

// ---------- Áo ----------

const TORSO = "M70 146 Q100 138 130 146 L138 204 Q100 210 62 204 Z";
const DRESS = "M72 146 Q100 138 128 146 L150 232 Q100 240 50 232 Z";
const torsoLeft = (y: number) => 70 - ((y - 146) * 8) / 58;

function shirt(
  color: string,
  o: { sleeve?: "short" | "long"; dress?: boolean; sleeveColor?: string; detail?: ReactNode } = {},
): Draw {
  const sc = o.sleeveColor ?? color;
  return (c) => (
    <g>
      {SIDES.map((f, i) =>
        o.sleeve === "long" ? (
          <Limb key={i} x1={f(73)} y1={150} x2={f(58)} y2={185} w={16} color={sc} />
        ) : (
          <Limb key={i} x1={f(73)} y1={150} x2={f(66)} y2={165} w={18} color={sc} />
        ),
      )}
      <path d={o.dress ? DRESS : TORSO} fill={color} stroke={OL} strokeWidth={2.5} />
      {!c.back && <path d="M90 143 Q100 152 110 143" fill="none" stroke={OL} strokeWidth={2} />}
      {!c.back && o.detail}
    </g>
  );
}

const stripes = (color: string) => (
  <g stroke={color} strokeWidth={6}>
    {[162, 176, 190].map((y) => (
      <line key={y} x1={torsoLeft(y) + 2} y1={y} x2={mirror(torsoLeft(y) + 2)} y2={y} />
    ))}
  </g>
);

const hoodie = (color: string, dark: string) => (
  <g>
    <path d="M78 146 Q100 130 122 146 Q100 158 78 146 Z" fill={dark} stroke={OL} strokeWidth={2} />
    <path d="M82 180 L118 180 L114 198 L86 198 Z" fill={dark} stroke={OL} strokeWidth={2} />
    <line x1={94} y1={150} x2={93} y2={168} stroke="#fff" strokeWidth={2} />
    <line x1={106} y1={150} x2={107} y2={168} stroke="#fff" strokeWidth={2} />
  </g>
);

const sparkles = (pts: [number, number][]) => (
  <g>
    {pts.map(([x, y], i) => (
      <Sparkle key={i} x={x} y={y} s={4} />
    ))}
  </g>
);

// ---------- Quần, váy ----------

const LONG = "M66 198 L134 198 L125 236 L102 236 L100 214 L98 236 L75 236 Z";
const SHORT = "M66 198 L134 198 L129 220 L102 220 L100 210 L98 220 L71 220 Z";
const SKIRT = "M68 196 L132 196 L146 226 Q100 232 54 226 Z";

function pants(color: string, shape: string, detail?: ReactNode): Draw {
  return () => (
    <g>
      <path d={shape} fill={color} stroke={OL} strokeWidth={2.5} />
      {detail}
    </g>
  );
}

// ---------- Giày ----------

function shoes(color: string, sole = "#ffffff", o: { boot?: boolean; lights?: boolean; shine?: boolean } = {}): Draw {
  return () => (
    <g>
      {[86, 114].map((cx) => (
        <g key={cx}>
          {o.boot && <rect x={cx - 10} y={212} width={20} height={24} rx={4} fill={color} stroke={OL} strokeWidth={2.5} />}
          <path d={`M${cx - 15} 242 Q${cx - 15} 228 ${cx} 228 Q${cx + 15} 228 ${cx + 15} 242 Z`} fill={color} stroke={OL} strokeWidth={2.5} />
          <rect x={cx - 16} y={240} width={32} height={6} rx={3} fill={sole} stroke={OL} strokeWidth={2} />
          {o.lights &&
            ["#ff4d6d", "#ffd23f", "#3bceac"].map((c, i) => <circle key={c} cx={cx - 8 + i * 8} cy={243} r={2} fill={c} />)}
          {o.shine && <Sparkle x={cx + 5} y={234} s={4} />}
        </g>
      ))}
    </g>
  );
}

// ---------- Tóc ----------

const BANGS = "M42 96 Q38 30 100 30 Q162 30 158 96 Q150 62 120 56 Q100 76 70 58 Q50 66 42 96 Z";

function hair(front: string, back?: (c: DrawCtx) => ReactNode, extra?: (c: DrawCtx) => ReactNode) {
  return {
    back,
    draw: (c: DrawCtx) => (
      <g>
        <path d={front} fill={c.hair} stroke={OL} strokeWidth={2.5} />
        {extra?.(c)}
      </g>
    ),
  };
}

/** Mặt sau đầu: tóc phủ kín (trừ đầu trọc) */
export const HAIR_CAP = "M44 96 Q38 28 100 28 Q162 28 156 96 Q152 132 100 138 Q48 132 44 96 Z";

const curlyCircles = (c: DrawCtx) => (
  <g>
    {Array.from({ length: 9 }, (_, i) => {
      const a = ((190 + i * 20) * Math.PI) / 180;
      return <circle key={i} cx={100 + 54 * Math.cos(a)} cy={86 + 50 * Math.sin(a)} r={15} fill={c.hair} stroke={OL} strokeWidth={2.5} />;
    })}
    <path d="M50 84 Q50 40 100 38 Q150 40 150 84 Q130 66 100 66 Q70 66 50 84 Z" fill={c.hair} />
  </g>
);

// ---------- Mắt ----------

const EYE_L = 78;
const EYE_R = 122;
const EYE_Y = 94;

const brows = (
  <g fill="none" stroke={OL} strokeWidth={2.5} strokeLinecap="round">
    <path d={`M${EYE_L - 9} 79 Q${EYE_L} 74 ${EYE_L + 9} 79`} />
    <path d={`M${EYE_R - 9} 79 Q${EYE_R} 74 ${EYE_R + 9} 79`} />
  </g>
);

const roundEye = (x: number) => (
  <g key={x}>
    <circle cx={x} cy={EYE_Y} r={9} fill="#2d2424" />
    <circle cx={x + 3} cy={EYE_Y - 3} r={3} fill="#fff" />
  </g>
);

const happyEye = (x: number) => (
  <path key={x} d={`M${x - 9} ${EYE_Y + 3} Q${x} ${EYE_Y - 9} ${x + 9} ${EYE_Y + 3}`} fill="none" stroke={OL} strokeWidth={3.5} strokeLinecap="round" />
);

const animeEye = (iris: string) => (x: number) => (
  <g key={x}>
    <ellipse cx={x} cy={EYE_Y} rx={10} ry={13} fill="#2d2424" />
    <ellipse cx={x} cy={EYE_Y + 3} rx={7} ry={9} fill={iris} />
    <circle cx={x + 3} cy={EYE_Y - 5} r={4} fill="#fff" />
    <circle cx={x - 4} cy={EYE_Y + 6} r={2} fill="#fff" />
  </g>
);

// ---------- Kính ----------

const lens = (shape: (x: number) => ReactNode, frame = OL) => (
  <g>
    {[EYE_L, EYE_R].map((x) => shape(x))}
    <path d={`M${EYE_L + 14} ${EYE_Y - 2} Q100 ${EYE_Y - 7} ${EYE_R - 14} ${EYE_Y - 2}`} fill="none" stroke={frame} strokeWidth={3} />
  </g>
);

// ---------- Danh mục đồ ----------

export const ITEMS: Item[] = [
  // Màu da
  { id: "da_sang", slot: "skin", name: "Da sáng", rarity: "thuong", price: 0, starter: true, color: "#ffe0c7" },
  { id: "da_vang", slot: "skin", name: "Da vàng", rarity: "thuong", price: 0, starter: true, color: "#f6cfa3" },
  { id: "da_nau", slot: "skin", name: "Da nâu", rarity: "thuong", price: 0, starter: true, color: "#d9a066" },
  { id: "da_dam", slot: "skin", name: "Da ngăm", rarity: "thuong", price: 0, starter: true, color: "#a86b3c" },

  // Màu tóc
  { id: "mt_den", slot: "hairColor", name: "Đen", rarity: "thuong", price: 0, starter: true, color: "#2b2323" },
  { id: "mt_nau", slot: "hairColor", name: "Nâu", rarity: "thuong", price: 0, starter: true, color: "#6b4226" },
  { id: "mt_vang", slot: "hairColor", name: "Vàng", rarity: "thuong", price: 0, starter: true, color: "#e3b94f" },
  { id: "mt_do", slot: "hairColor", name: "Đỏ", rarity: "thuong", price: 50, color: "#c0503a" },
  { id: "mt_hong", slot: "hairColor", name: "Hồng", rarity: "hiem", price: 120, color: "#ff8fc1" },
  { id: "mt_xanh", slot: "hairColor", name: "Xanh dương", rarity: "hiem", price: 120, color: "#5aa9ff" },
  { id: "mt_tim", slot: "hairColor", name: "Tím", rarity: "hiem", price: 120, color: "#9b6bff" },
  { id: "mt_bac", slot: "hairColor", name: "Bạch kim", rarity: "suthi", price: 300, color: "#e2e6ec" },

  // Kiểu tóc
  { id: "toc_ngan", slot: "hair", name: "Tóc ngắn", rarity: "thuong", price: 0, starter: true,
    ...hair("M44 92 Q40 34 100 32 Q160 34 156 92 Q150 66 132 62 Q118 74 100 64 Q82 74 68 62 Q50 66 44 92 Z") },
  { id: "toc_dai", slot: "hair", name: "Tóc dài", rarity: "thuong", price: 0, starter: true,
    ...hair(BANGS, (c) => <path d="M40 80 Q40 28 100 28 Q160 28 160 80 L164 170 Q100 180 36 170 Z" fill={c.hair} stroke={OL} strokeWidth={2.5} />) },
  { id: "toc_bob", slot: "hair", name: "Tóc bob", rarity: "thuong", price: 0, starter: true,
    ...hair("M44 92 Q40 30 100 30 Q160 30 156 92 L152 66 Q100 58 48 66 Z",
      (c) => <path d="M40 80 Q40 28 100 28 Q160 28 160 80 L162 132 Q150 142 138 132 L62 132 Q50 142 38 132 Z" fill={c.hair} stroke={OL} strokeWidth={2.5} />) },
  { id: "toc_duoi_ngua", slot: "hair", name: "Đuôi ngựa", rarity: "thuong", price: 0, starter: true,
    ...hair(BANGS, (c) => <path d="M146 44 Q200 56 182 152 Q172 118 150 98 Z" fill={c.hair} stroke={OL} strokeWidth={2.5} />,
      () => <circle cx={152} cy={50} r={6} fill="#ff6b9d" stroke={OL} strokeWidth={2} />) },
  { id: "toc_dung", slot: "hair", name: "Tóc dựng", rarity: "thuong", price: 80,
    ...hair("M44 92 Q42 50 60 40 L58 18 L78 32 L84 10 L100 28 L116 10 L122 32 L142 18 L140 40 Q158 50 156 92 Q148 64 128 60 Q100 72 72 60 Q52 64 44 92 Z") },
  { id: "toc_hai_bim", slot: "hair", name: "Hai búi", rarity: "thuong", price: 80,
    ...hair(BANGS, (c) => (
      <g>
        <circle cx={52} cy={42} r={21} fill={c.hair} stroke={OL} strokeWidth={2.5} />
        <circle cx={148} cy={42} r={21} fill={c.hair} stroke={OL} strokeWidth={2.5} />
      </g>
    )) },
  { id: "toc_xoan", slot: "hair", name: "Tóc xoăn", rarity: "hiem", price: 150, back: undefined, draw: curlyCircles },
  { id: "dau_troc", slot: "hair", name: "Đầu trọc", rarity: "thuong", price: 30,
    draw: () => <path d="M96 40 Q108 30 98 22" fill="none" stroke={OL} strokeWidth={2.5} strokeLinecap="round" /> },

  // Mắt
  { id: "mat_tron", slot: "eyes", name: "Mắt tròn", rarity: "thuong", price: 0, starter: true,
    draw: () => <g>{brows}{[EYE_L, EYE_R].map(roundEye)}</g> },
  { id: "mat_cuoi", slot: "eyes", name: "Mắt cười", rarity: "thuong", price: 0, starter: true,
    draw: () => <g>{brows}{[EYE_L, EYE_R].map(happyEye)}</g> },
  { id: "mat_nhay", slot: "eyes", name: "Nháy mắt", rarity: "thuong", price: 50,
    draw: () => <g>{brows}{roundEye(EYE_L)}{happyEye(EYE_R)}</g> },
  { id: "mat_to_xanh", slot: "eyes", name: "Mắt long lanh xanh", rarity: "hiem", price: 150,
    draw: () => <g>{brows}{[EYE_L, EYE_R].map(animeEye("#4f8ef7"))}</g> },
  { id: "mat_to_tim", slot: "eyes", name: "Mắt long lanh tím", rarity: "hiem", price: 150,
    draw: () => <g>{brows}{[EYE_L, EYE_R].map(animeEye("#a36bff"))}</g> },
  { id: "mat_sao", slot: "eyes", name: "Mắt ngôi sao", rarity: "suthi", price: 400,
    draw: () => <g>{brows}{[EYE_L, EYE_R].map((x) => <Star key={x} cx={x} cy={EYE_Y} R={12} fill="#ffd23f" />)}</g> },
  { id: "mat_tim", slot: "eyes", name: "Mắt trái tim", rarity: "suthi", price: 350,
    draw: () => <g>{brows}{[EYE_L, EYE_R].map((x) => <path key={x} d={heartPath(x, EYE_Y, 10)} fill="#ff4d6d" stroke={OL} strokeWidth={2} />)}</g> },

  // Miệng
  { id: "mieng_cuoi", slot: "mouth", name: "Cười mỉm", rarity: "thuong", price: 0, starter: true,
    draw: () => <path d="M90 114 Q100 124 110 114" fill="none" stroke={OL} strokeWidth={3} strokeLinecap="round" /> },
  { id: "mieng_ha", slot: "mouth", name: "Cười tươi", rarity: "thuong", price: 0, starter: true,
    draw: () => (
      <g>
        <path d="M88 112 Q100 132 112 112 Z" fill="#a8323e" stroke={OL} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M94 122 Q100 118 106 122 Q100 127 94 122 Z" fill="#ff8fa3" />
      </g>
    ) },
  { id: "mieng_meo", slot: "mouth", name: "Miệng mèo", rarity: "thuong", price: 50,
    draw: () => <path d="M90 113 Q95 120 100 113 Q105 120 110 113" fill="none" stroke={OL} strokeWidth={3} strokeLinecap="round" /> },
  { id: "mieng_le", slot: "mouth", name: "Lè lưỡi", rarity: "hiem", price: 120,
    draw: () => (
      <g>
        <path d="M100 116 Q100 130 106 130 Q112 130 111 116 Z" fill="#ff6b81" stroke={OL} strokeWidth={2} />
        <path d="M88 114 Q100 120 112 114" fill="none" stroke={OL} strokeWidth={3} strokeLinecap="round" />
      </g>
    ) },

  // Áo
  { id: "ao_thun_xanh", slot: "shirt", name: "Áo thun xanh", rarity: "thuong", price: 0, starter: true, draw: shirt("#5aa9ff") },
  { id: "ao_thun_hong", slot: "shirt", name: "Áo thun hồng", rarity: "thuong", price: 0, starter: true, draw: shirt("#ff9cc6") },
  { id: "ao_dong_phuc", slot: "shirt", name: "Đồng phục khăn quàng đỏ", rarity: "thuong", price: 0, starter: true,
    draw: shirt("#ffffff", {
      detail: (
        <g>
          <path d="M84 142 L116 142 L100 160 Z" fill="#e63946" stroke={OL} strokeWidth={2} />
          <path d="M98 156 L88 182 L96 180 Z M102 156 L112 182 L104 180 Z" fill="#e63946" stroke={OL} strokeWidth={2} />
          <circle cx={100} cy={188} r={2.2} fill={OL} />
          <circle cx={100} cy={198} r={2.2} fill={OL} />
        </g>
      ),
    }) },
  { id: "ao_thun_vang", slot: "shirt", name: "Áo thun vàng", rarity: "thuong", price: 60, draw: shirt("#ffd23f") },
  { id: "ao_soc", slot: "shirt", name: "Áo sọc thủy thủ", rarity: "thuong", price: 100, draw: shirt("#ffffff", { detail: stripes("#3b82f6") }) },
  { id: "ao_hoodie_xam", slot: "shirt", name: "Hoodie xám", rarity: "hiem", price: 180,
    draw: shirt("#9aa5b1", { sleeve: "long", detail: hoodie("#9aa5b1", "#7b8794") }) },
  { id: "ao_hoodie_tim", slot: "shirt", name: "Hoodie tím", rarity: "hiem", price: 180,
    draw: shirt("#a78bfa", { sleeve: "long", detail: hoodie("#a78bfa", "#8b5cf6") }) },
  { id: "vay_hong", slot: "shirt", name: "Váy hồng", rarity: "hiem", price: 200,
    draw: shirt("#ff8fc1", { dress: true, detail: <path d="M60 214 Q100 222 140 214" fill="none" stroke="#fff" strokeWidth={4} /> }) },
  { id: "vay_xanh", slot: "shirt", name: "Váy xanh bạc hà", rarity: "hiem", price: 200,
    draw: shirt("#7ee0c3", { dress: true, detail: <path d="M60 214 Q100 222 140 214" fill="none" stroke="#fff" strokeWidth={4} /> }) },
  { id: "ao_sieu_nhan", slot: "shirt", name: "Áo siêu nhân", rarity: "suthi", price: 450,
    draw: shirt("#2563eb", { sleeve: "long", sleeveColor: "#1d4ed8", detail: <Star cx={100} cy={174} R={15} fill="#ffd23f" /> }) },
  { id: "vay_cong_chua", slot: "shirt", name: "Váy công chúa", rarity: "suthi", price: 500,
    draw: shirt("#c084fc", {
      dress: true,
      detail: (
        <g>
          <path d="M56 218 Q100 228 144 218 L150 232 Q100 240 50 232 Z" fill="#f0abfc" stroke={OL} strokeWidth={2} />
          {sparkles([[84, 170], [116, 184], [96, 200], [124, 160]])}
        </g>
      ),
    }) },
  { id: "ao_hoang_kim", slot: "shirt", name: "Áo hoàng kim", rarity: "huyenthoai", price: 1200,
    draw: shirt("#f5c542", {
      sleeve: "long",
      sleeveColor: "#e6a817",
      detail: (
        <g>
          <path d="M72 150 L130 196" stroke="#e63946" strokeWidth={8} />
          <Star cx={100} cy={172} R={11} fill="#fff4b0" />
          {sparkles([[80, 190], [124, 158], [118, 198]])}
        </g>
      ),
    }) },
  { id: "ao_toan", slot: "shirt", name: "Áo Nhà Toán học", rarity: "suthi", price: 0, achievement: "toan_10",
    draw: shirt("#7c5cff", { detail: <text x={100} y={186} textAnchor="middle" fontSize={30} fontWeight={800} fill="#fff">π</text> }) },
  { id: "ao_abc", slot: "shirt", name: "Áo Siêu sao Tiếng Anh", rarity: "suthi", price: 0, achievement: "anh_10",
    draw: shirt("#10b981", { detail: <text x={100} y={182} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff">ABC</text> }) },

  // Quần, váy
  { id: "quan_dai_xanh", slot: "pants", name: "Quần dài xanh đen", rarity: "thuong", price: 0, starter: true, draw: pants("#334e7a", LONG) },
  { id: "quan_short_xanh", slot: "pants", name: "Quần short xanh", rarity: "thuong", price: 0, starter: true, draw: pants("#334e7a", SHORT) },
  { id: "chan_vay_xanh", slot: "pants", name: "Chân váy xanh", rarity: "thuong", price: 0, starter: true, draw: pants("#334e7a", SKIRT) },
  { id: "quan_short_kaki", slot: "pants", name: "Quần short kaki", rarity: "thuong", price: 60, draw: pants("#c8a46e", SHORT) },
  { id: "quan_jean", slot: "pants", name: "Quần jean", rarity: "thuong", price: 80,
    draw: pants("#4a78c2", LONG, <path d="M100 200 L100 212 M74 204 Q80 210 88 204 M112 204 Q120 210 126 204" fill="none" stroke="#9cc0f0" strokeWidth={2} />) },
  { id: "chan_vay_hong", slot: "pants", name: "Chân váy hồng", rarity: "thuong", price: 80, draw: pants("#ff8fc1", SKIRT) },
  { id: "quan_the_thao", slot: "pants", name: "Quần thể thao", rarity: "hiem", price: 150,
    draw: pants("#1f2937", LONG, <path d="M69 202 L78 234 M131 202 L122 234" stroke="#fff" strokeWidth={3} />) },
  { id: "chan_vay_cau_vong", slot: "pants", name: "Váy cầu vồng", rarity: "suthi", price: 380,
    draw: pants("#ff6b6b", SKIRT, (
      <g strokeWidth={5} fill="none">
        <path d="M64 206 Q100 210 136 206" stroke="#ffd23f" />
        <path d="M60 214 Q100 219 140 214" stroke="#3bceac" />
        <path d="M57 221 Q100 227 143 221" stroke="#5aa9ff" />
      </g>
    )) },

  // Giày
  { id: "giay_trang", slot: "shoes", name: "Giày trắng", rarity: "thuong", price: 0, starter: true, draw: shoes("#f8fafc", "#cbd5e1") },
  { id: "giay_den", slot: "shoes", name: "Giày đen", rarity: "thuong", price: 0, starter: true, draw: shoes("#374151") },
  { id: "giay_do", slot: "shoes", name: "Giày đỏ", rarity: "thuong", price: 60, draw: shoes("#e63946") },
  { id: "ung_vang", slot: "shoes", name: "Ủng vàng", rarity: "hiem", price: 150, draw: shoes("#ffd23f", "#e6a817", { boot: true }) },
  { id: "giay_phat_sang", slot: "shoes", name: "Giày phát sáng", rarity: "suthi", price: 400, draw: shoes("#a78bfa", "#ffffff", { lights: true }) },
  { id: "giay_vang", slot: "shoes", name: "Giày vàng ròng", rarity: "huyenthoai", price: 900, draw: shoes("#f5c542", "#e6a817", { shine: true }) },

  // Kính
  { id: "kinh_khong", slot: "glasses", name: "Không đeo kính", rarity: "thuong", price: 0, starter: true },
  { id: "kinh_tron", slot: "glasses", name: "Kính tròn", rarity: "thuong", price: 80,
    draw: () => lens((x) => <circle key={x} cx={x} cy={EYE_Y} r={15} fill="#ffffff" fillOpacity={0.25} stroke={OL} strokeWidth={3} />) },
  { id: "kinh_ram", slot: "glasses", name: "Kính râm", rarity: "hiem", price: 150,
    draw: () => lens((x) => <rect key={x} x={x - 15} y={EYE_Y - 11} width={30} height={22} rx={8} fill="#1f2937" stroke={OL} strokeWidth={3} />) },
  { id: "kinh_tim", slot: "glasses", name: "Kính trái tim", rarity: "suthi", price: 350,
    draw: () => lens((x) => <path key={x} d={heartPath(x, EYE_Y, 15)} fill="#ff4d6d" fillOpacity={0.85} stroke={OL} strokeWidth={3} />) },
  { id: "kinh_sao", slot: "glasses", name: "Kính ngôi sao", rarity: "suthi", price: 0, achievement: "diem10_dau",
    draw: () => lens((x) => <Star key={x} cx={x} cy={EYE_Y} R={18} fill="#ffd23f" />) },

  // Mũ
  { id: "mu_khong", slot: "hat", name: "Không đội mũ", rarity: "thuong", price: 0, starter: true },
  { id: "no_do", slot: "hat", name: "Nơ đỏ", rarity: "thuong", price: 60,
    draw: () => (
      <g stroke={OL} strokeWidth={2}>
        <path d="M134 38 L114 26 L116 50 Z M134 38 L154 26 L152 50 Z" fill="#ff4d6d" />
        <circle cx={134} cy={38} r={6} fill="#e63946" />
      </g>
    ) },
  { id: "mu_luoi_trai", slot: "hat", name: "Mũ lưỡi trai", rarity: "thuong", price: 80,
    draw: () => (
      <g stroke={OL} strokeWidth={2.5}>
        <path d="M44 66 Q46 20 100 20 Q154 20 156 66 Z" fill="#e63946" />
        <path d="M44 66 Q100 54 156 66 Q160 76 100 74 Q40 76 44 66 Z" fill="#c1121f" />
        <circle cx={100} cy={22} r={5} fill="#c1121f" />
      </g>
    ) },
  { id: "mu_len", slot: "hat", name: "Mũ len", rarity: "hiem", price: 150,
    draw: () => (
      <g stroke={OL} strokeWidth={2.5}>
        <path d="M46 62 Q46 14 100 14 Q154 14 154 62 Z" fill="#38bdf8" />
        <rect x={42} y={54} width={116} height={16} rx={8} fill="#f8fafc" />
        <circle cx={100} cy={12} r={10} fill="#f8fafc" />
      </g>
    ) },
  { id: "tai_meo", slot: "hat", name: "Băng đô tai mèo", rarity: "hiem", price: 180,
    draw: () => (
      <g stroke={OL} strokeWidth={2.5}>
        <path d="M52 56 L56 12 L86 36 Z M148 56 L144 12 L114 36 Z" fill="#2d2424" />
        <path d="M60 46 L62 24 L78 37 Z M140 46 L138 24 L122 37 Z" fill="#ff8fa3" strokeWidth={0} />
      </g>
    ) },
  { id: "mu_phu_thuy", slot: "hat", name: "Mũ phù thủy", rarity: "suthi", price: 500,
    draw: () => (
      <g stroke={OL} strokeWidth={2.5}>
        <path d="M60 42 L112 -20 L140 42 Z" fill="#5b21b6" />
        <ellipse cx={100} cy={44} rx={64} ry={11} fill="#6d28d9" />
        <Star cx={104} cy={18} R={7} fill="#ffd23f" />
      </g>
    ) },
  { id: "vuong_mien", slot: "hat", name: "Vương miện", rarity: "huyenthoai", price: 1000,
    draw: () => (
      <g stroke={OL} strokeWidth={2.5}>
        <path d="M62 40 L66 4 L84 24 L100 0 L116 24 L134 4 L138 40 Z" fill="#f5c542" />
        <circle cx={100} cy={28} r={5} fill="#e63946" />
        <circle cx={78} cy={32} r={4} fill="#3b82f6" />
        <circle cx={122} cy={32} r={4} fill="#10b981" />
        <Sparkle x={70} y={10} s={5} />
      </g>
    ) },
  { id: "mu_tot_nghiep", slot: "hat", name: "Mũ tốt nghiệp", rarity: "suthi", price: 0, achievement: "chuoi_7",
    draw: () => (
      <g stroke={OL} strokeWidth={2.5}>
        <path d="M66 38 L66 54 Q100 64 134 54 L134 38 Z" fill="#1f2937" />
        <path d="M36 30 L100 10 L164 30 L100 50 Z" fill="#111827" />
        <path d="M100 30 L150 36 L152 60" fill="none" stroke="#ffd23f" strokeWidth={3} />
        <circle cx={152} cy={62} r={4} fill="#ffd23f" />
      </g>
    ) },

  // Sau lưng
  { id: "lung_khong", slot: "back", name: "Không có", rarity: "thuong", price: 0, starter: true },
  { id: "ao_choang_do", slot: "back", name: "Áo choàng siêu nhân", rarity: "suthi", price: 400,
    draw: () => <path d="M72 146 L128 146 L154 240 Q100 250 46 240 Z" fill="#e63946" stroke={OL} strokeWidth={2.5} /> },
  { id: "canh_buom", slot: "back", name: "Cánh bướm", rarity: "suthi", price: 450,
    draw: () => (
      <g stroke={OL} strokeWidth={2.5}>
        {SIDES.map((f, i) => (
          <g key={i}>
            <ellipse cx={f(46)} cy={150} rx={30} ry={24} fill="#f472b6" transform={`rotate(${i ? 25 : -25} ${f(46)} 150)`} />
            <ellipse cx={f(54)} cy={192} rx={20} ry={16} fill="#c084fc" />
            <circle cx={f(42)} cy={148} r={7} fill="#fff" opacity={0.7} />
          </g>
        ))}
      </g>
    ) },
  { id: "canh_thien_than", slot: "back", name: "Cánh thiên thần", rarity: "huyenthoai", price: 1000,
    draw: () => (
      <g stroke={OL} strokeWidth={2.5} fill="#ffffff">
        <path d="M74 158 Q14 110 6 162 Q10 182 30 182 Q16 196 40 204 Q60 206 74 190 Z" />
        <path d="M126 158 Q186 110 194 162 Q190 182 170 182 Q184 196 160 204 Q140 206 126 190 Z" />
        <path d="M30 160 Q46 166 60 166 M42 186 Q56 186 66 182 M170 160 Q154 166 140 166 M158 186 Q144 186 134 182" fill="none" stroke="#cbd5e1" strokeWidth={2} />
      </g>
    ) },

  // Thú cưng và đồ cho thú cưng (lib/pets.tsx)
  ...PET_ITEMS,
];

export const ITEM_MAP: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const STARTER_IDS = ITEMS.filter((i) => i.starter).map((i) => i.id);

export function defaultLook(gender: Gender): Look {
  return {
    skin: "da_vang",
    hairColor: "mt_den",
    hair: gender === "nam" ? "toc_ngan" : "toc_duoi_ngua",
    eyes: "mat_tron",
    mouth: "mieng_cuoi",
    shirt: gender === "nam" ? "ao_thun_xanh" : "ao_thun_hong",
    pants: gender === "nam" ? "quan_short_xanh" : "chan_vay_xanh",
    shoes: "giay_trang",
    glasses: "kinh_khong",
    hat: "mu_khong",
    back: "lung_khong",
    pet: "pet_khong",
    petAcc: "pa_khong",
    petToy: "pt_khong",
    petHome: "ph_khong",
  };
}
