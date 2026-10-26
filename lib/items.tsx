import type { ReactNode } from "react";
import { Limb, OL, PALETTE, SIDES, Sparkle, Star, heartPath, mirror, type Draw, type DrawCtx, type Item } from "./draw";
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
          <g className={i ? "arm arm-r" : "arm arm-l"}>
            <Limb x1={f(72)} y1={152} x2={f(57)} y2={190} w={13} color={skin} />
            <circle cx={f(56)} cy={194} r={8} fill={skin} stroke={OL} strokeWidth={2.5} />
          </g>
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
  o: { sleeve?: "short" | "long"; dress?: boolean; sleeveColor?: string; detail?: ReactNode; shape?: string } = {},
): Draw {
  const sc = o.sleeveColor ?? color;
  return (c) => (
    <g>
      {SIDES.map((f, i) =>
        <g key={i} className={i ? "arm arm-r" : "arm arm-l"}>
          {o.sleeve === "long" ? (
            <Limb x1={f(73)} y1={150} x2={f(58)} y2={185} w={16} color={sc} />
          ) : (
            <Limb x1={f(73)} y1={150} x2={f(66)} y2={165} w={18} color={sc} />
          )}
        </g>,
      )}
      <path d={o.shape ?? (o.dress ? DRESS : TORSO)} fill={color} stroke={OL} strokeWidth={2.5} />
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

// ---------- Bộ sưu tập mở rộng (bản 1.1) ----------

const pal = (ids: string[]) => PALETTE.filter((c) => ids.includes(c.id));
const darker: Record<string, string> = {
  do: "#b91c1c", hong: "#db2777", cam: "#ea580c", vang: "#ca8a04", xanhla: "#16a34a", xanhduong: "#2563eb", tim: "#7c3aed", den: "#111827",
};
const it = (id: string, slot: Slot, name: string, rarity: Item["rarity"], price: number, draw: Draw, back?: Draw): Item => ({
  id, slot, name, rarity, price, draw, back,
});

const AODAI = "M72 146 Q100 138 128 146 L134 240 L106 240 L102 206 L98 206 L94 240 L66 240 Z";
const mandarin = <path d="M88 141 L88 147 Q100 152 112 147 L112 141" fill="none" stroke={OL} strokeWidth={2} />;
const blossoms = (fill: string) => (
  <g>
    {[[84, 172], [114, 188], [92, 214], [118, 224], [80, 230]].map(([x, y], i) => (
      <g key={i}>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={x + 3 * Math.cos((a * Math.PI) / 180)} cy={y + 3 * Math.sin((a * Math.PI) / 180)} r={2.4} fill={fill} />
        ))}
        <circle cx={x} cy={y} r={1.4} fill="#fff7cc" />
      </g>
    ))}
  </g>
);
const grid = (color: string) => (
  <g stroke={color} strokeWidth={2.5} opacity={0.8}>
    {[78, 90, 102, 114, 126].map((x) => <line key={x} x1={x - 2} y1={146} x2={x - 2} y2={204} />)}
    {[158, 172, 186, 198].map((y) => <line key={y} x1={torsoLeft(y) + 2} y1={y} x2={mirror(torsoLeft(y) + 2)} y2={y} />)}
  </g>
);
const rainbowBands = (
  <g strokeWidth={7}>
    {["#ef4444", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa"].map((c, i) => {
      const y = 152 + i * 9;
      return <line key={c} x1={torsoLeft(y) + 2} y1={y} x2={mirror(torsoLeft(y) + 2)} y2={y} stroke={c} />;
    })}
  </g>
);

const MORE_SHIRTS: Item[] = [
  ...pal(["do", "cam", "xanhla", "tim", "den"]).map((c) => it(`ao_thun_${c.id}`, "shirt", `Áo thun ${c.name}`, "thuong", 50, shirt(c.hex))),
  ...pal(["do", "xanhla", "den", "hong"]).map((c) => it(`ao_hoodie_${c.id}`, "shirt", `Hoodie ${c.name}`, "hiem", 180, shirt(c.hex, { sleeve: "long", detail: hoodie(c.hex, darker[c.id]) }))),
  ...pal(["vang", "tim", "do", "cam"]).map((c) =>
    it(`vay_${c.id}`, "shirt", `Váy ${c.name}`, "hiem", 200, shirt(c.hex, { dress: true, detail: <path d="M60 214 Q100 222 140 214" fill="none" stroke="#fff" strokeWidth={4} /> })),
  ),
  it("ao_bong_da", "shirt", "Áo bóng đá đỏ sao vàng", "thuong", 120, shirt("#da251d", { detail: <Star cx={100} cy={174} R={12} fill="#ffcd00" /> })),
  it("ao_so_mi_caro", "shirt", "Áo sơ mi caro", "thuong", 90, shirt("#f87171", { sleeve: "long", detail: grid("#7f1d1d") })),
  it("ao_bac_si", "shirt", "Áo bác sĩ", "hiem", 150, shirt("#ffffff", {
    sleeve: "long",
    detail: (
      <g>
        <path d="M92 144 L100 176 L108 144" fill="none" stroke={OL} strokeWidth={2} />
        <rect x={110} y={180} width={14} height={12} rx={2} fill="#fff" stroke={OL} strokeWidth={1.5} />
        <path d="M117 182 V190 M113 186 H121" stroke="#ef4444" strokeWidth={2.5} />
      </g>
    ),
  })),
  it("ao_khoac_jean", "shirt", "Áo khoác jean", "hiem", 160, shirt("#4a78c2", {
    sleeve: "long",
    detail: (
      <g>
        <path d="M100 146 V206" stroke="#1e3a8a" strokeWidth={2} />
        <path d="M84 144 L94 160 L100 148 L106 160 L116 144" fill="#3b63a8" stroke={OL} strokeWidth={1.5} />
        {[168, 180, 192].map((y) => <circle key={y} cx={104} cy={y} r={1.8} fill="#facc15" />)}
        <rect x={78} y={166} width={14} height={10} rx={2} fill="none" stroke="#9cc0f0" strokeWidth={1.5} />
        <rect x={108} y={166} width={14} height={10} rx={2} fill="none" stroke="#9cc0f0" strokeWidth={1.5} />
      </g>
    ),
  })),
  ...[
    { id: "do", name: "đỏ hoa mai", color: "#dc2626", flower: "#facc15" },
    { id: "trang", name: "trắng", color: "#ffffff", flower: "#93c5fd" },
    { id: "xanh", name: "xanh ngọc", color: "#2dd4bf", flower: "#ffffff" },
    { id: "hong", name: "hồng đào", color: "#f9a8d4", flower: "#ffffff" },
  ].map((c) => it(`ao_dai_${c.id}`, "shirt", `Áo dài ${c.name}`, "suthi", 350, shirt(c.color, { sleeve: "long", shape: AODAI, detail: <g>{mandarin}{blossoms(c.flower)}</g> }))),
  it("ao_cau_vong", "shirt", "Áo cầu vồng", "suthi", 380, shirt("#ffffff", { detail: rainbowBands })),
  it("ao_ninja", "shirt", "Áo ninja", "suthi", 400, shirt("#1f2937", {
    sleeve: "long",
    detail: (
      <g>
        <path d="M86 144 L112 176 M114 144 L88 176" stroke="#374151" strokeWidth={4} />
        <rect x={64} y={188} width={72} height={8} fill="#dc2626" stroke={OL} strokeWidth={1.5} />
      </g>
    ),
  })),
  it("ao_phi_hanh_gia", "shirt", "Bộ phi hành gia", "suthi", 450, shirt("#f8fafc", {
    sleeve: "long",
    sleeveColor: "#e5e7eb",
    detail: (
      <g>
        <rect x={86} y={164} width={28} height={20} rx={3} fill="#cbd5e1" stroke={OL} strokeWidth={1.5} />
        <circle cx={93} cy={171} r={2.5} fill="#ef4444" />
        <circle cx={100} cy={171} r={2.5} fill="#22c55e" />
        <circle cx={107} cy={171} r={2.5} fill="#3b82f6" />
        <rect x={91} y={177} width={18} height={3} rx={1.5} fill="#64748b" />
        <circle cx={78} cy={156} r={5} fill="#2563eb" stroke={OL} strokeWidth={1} />
        <Star cx={78} cy={156} R={3} fill="#fff" sw={0} />
      </g>
    ),
  })),
  it("ao_ngan_ha", "shirt", "Áo dải ngân hà", "huyenthoai", 1200, shirt("#312e81", {
    sleeve: "long",
    sleeveColor: "#3730a3",
    detail: (
      <g>
        <path d="M66 190 Q100 160 134 172" fill="none" stroke="#a78bfa" strokeWidth={8} opacity={0.5} />
        {[[78, 160], [118, 156], [96, 182], [124, 194], [74, 196], [108, 168]].map(([x, y], i) => (
          <Sparkle key={i} x={x} y={y} s={i % 2 ? 3 : 5} fill={i % 3 ? "#fde68a" : "#ffffff"} />
        ))}
        <Star cx={100} cy={196} R={6} fill="#fde047" />
      </g>
    ),
  })),
];

const plaid = (
  <g stroke="#7f1d1d" strokeWidth={2} opacity={0.7}>
    <path d="M70 206 H130 M72 218 H128 M74 230 H126 M84 198 V236 M116 198 V236" />
  </g>
);
const MORE_PANTS: Item[] = [
  ...pal(["do", "xanhla", "hong", "vang"]).map((c) => it(`quan_short_${c.id}`, "pants", `Quần short ${c.name}`, "thuong", 50, pants(c.hex, SHORT))),
  it("quan_dai_den", "pants", "Quần dài đen", "thuong", 60, pants("#1f2937", LONG)),
  it("quan_dai_kaki", "pants", "Quần kaki", "thuong", 60, pants("#b08d57", LONG)),
  it("quan_dai_trang", "pants", "Quần dài trắng", "thuong", 60, pants("#f8fafc", LONG)),
  ...pal(["tim", "vang", "xanhla", "do"]).map((c) => it(`chan_vay_${c.id}`, "pants", `Chân váy ${c.name}`, "thuong", 70, pants(c.hex, SKIRT))),
  it("quan_ca_ro", "pants", "Quần caro", "hiem", 140, pants("#f87171", LONG, plaid)),
  it("vay_tutu", "pants", "Váy tutu", "hiem", 180, pants("#f9a8d4", SKIRT, (
    <g stroke={OL} strokeWidth={1.5}>
      <path d="M58 220 Q64 232 72 222 Q80 234 88 224 Q96 236 104 224 Q112 236 120 224 Q128 234 136 222 Q142 232 146 220" fill="#fbcfe8" />
      <Sparkle x={86} y={208} s={3} />
      <Sparkle x={116} y={212} s={3} />
    </g>
  ))),
];

const sandals = (color: string): Draw => (c) => (
  <g stroke={OL} strokeWidth={1.8}>
    {[86, 114].map((cx) => (
      <g key={cx}>
        <ellipse cx={cx} cy={236} rx={11} ry={6} fill={c.skin} />
        <rect x={cx - 15} y={240} width={30} height={6} rx={3} fill={color} />
        <path d={`M${cx - 8} 240 L${cx} 232 L${cx + 8} 240`} fill="none" stroke={darker.do} strokeWidth={2.5} />
      </g>
    ))}
  </g>
);
const skates = (color: string): Draw => () => (
  <g stroke={OL} strokeWidth={2}>
    {[86, 114].map((cx) => (
      <g key={cx}>
        <rect x={cx - 10} y={214} width={20} height={22} rx={4} fill={color} />
        <path d={`M${cx - 15} 242 Q${cx - 15} 228 ${cx} 228 Q${cx + 15} 228 ${cx + 15} 242 Z`} fill={color} />
        <rect x={cx - 15} y={240} width={30} height={4} rx={2} fill="#e5e7eb" />
        <circle cx={cx - 9} cy={248} r={3.5} fill="#facc15" />
        <circle cx={cx + 9} cy={248} r={3.5} fill="#facc15" />
      </g>
    ))}
  </g>
);
const MORE_SHOES: Item[] = [
  ...pal(["cam", "vang", "xanhla", "xanhduong", "hong", "tim"]).map((c) => it(`giay_mau_${c.id}`, "shoes", `Giày ${c.name}`, "thuong", 50, shoes(c.hex))),
  ...pal(["do", "hong", "xanhduong"]).map((c) => it(`ung_${c.id}`, "shoes", `Ủng ${c.name}`, "hiem", 140, shoes(c.hex, darker[c.id], { boot: true }))),
  it("dep_lao", "shoes", "Dép lào", "thuong", 30, sandals("#60a5fa")),
  it("giay_ba_le", "shoes", "Giày ba lê", "hiem", 150, (c) => (
    <g>
      {shoes("#fbcfe8", "#f9a8d4")(c)}
      <path d="M80 230 L92 214 M120 230 L108 214 M92 230 L80 214 M108 230 L120 214" stroke="#f472b6" strokeWidth={1.5} />
    </g>
  )),
  it("giay_patin", "shoes", "Giày trượt patin", "suthi", 380, skates("#a78bfa")),
  it("giay_cau_vong", "shoes", "Giày cầu vồng", "suthi", 400, (c) => (
    <g>
      {shoes("#ffffff", "#a78bfa", { lights: true })(c)}
      {[86, 114].map((cx) =>
        ["#ef4444", "#facc15", "#4ade80", "#60a5fa"].map((col, i) => (
          <line key={`${cx}${i}`} x1={cx - 10 + i * 6} y1={232} x2={cx - 12 + i * 6} y2={240} stroke={col} strokeWidth={3} />
        )),
      )}
    </g>
  )),
];

const cap = (color: string, dark: string): Draw => () => (
  <g stroke={OL} strokeWidth={2.5}>
    <path d="M44 66 Q46 20 100 20 Q154 20 156 66 Z" fill={color} />
    <path d="M44 66 Q100 54 156 66 Q160 76 100 74 Q40 76 44 66 Z" fill={dark} />
    <circle cx={100} cy={22} r={5} fill={dark} />
  </g>
);
const bow = (color: string, dark: string): Draw => () => (
  <g stroke={OL} strokeWidth={2}>
    <path d="M134 38 L114 26 L116 50 Z M134 38 L154 26 L152 50 Z" fill={color} />
    <circle cx={134} cy={38} r={6} fill={dark} />
  </g>
);
const MORE_HATS: Item[] = [
  ...pal(["xanhduong", "vang", "xanhla", "den"]).map((c) => it(`mu_luoi_trai_${c.id}`, "hat", `Mũ lưỡi trai ${c.name}`, "thuong", 70, cap(c.hex, darker[c.id]))),
  ...pal(["hong", "tim", "vang", "xanhduong"]).map((c) => it(`no_${c.id}`, "hat", `Nơ ${c.name}`, "thuong", 50, bow(c.hex, darker[c.id]))),
  it("mu_bao_hiem", "hat", "Mũ bảo hiểm", "thuong", 100, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M40 72 Q40 12 100 12 Q160 12 160 72 Z" fill="#3b82f6" />
      <path d="M100 12 V72" stroke="#ffffff" strokeWidth={6} />
      <path d="M40 72 H160" strokeWidth={4} />
    </g>
  )),
  it("non_la", "hat", "Nón lá", "hiem", 150, () => (
    <g stroke={OL} strokeWidth={2}>
      <path d="M22 60 L100 -2 L178 60 Q100 74 22 60 Z" fill="#ead9a6" />
      {[0.25, 0.5, 0.75].map((t) => (
        <path key={t} d={`M${100 - 78 * t} ${-2 + 62 * t} Q100 ${-2 + 70 * t} ${100 + 78 * t} ${-2 + 62 * t}`} fill="none" stroke="#c4a665" strokeWidth={1.5} />
      ))}
      <path d="M58 60 Q60 110 80 128 M142 60 Q140 110 120 128" fill="none" stroke="#f472b6" strokeWidth={2} />
    </g>
  )),
  it("mu_cao_boi", "hat", "Mũ cao bồi", "hiem", 180, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M62 48 Q64 6 84 10 Q100 18 116 10 Q136 6 138 48 Z" fill="#a16207" />
      <path d="M62 40 H138" stroke="#7c2d12" strokeWidth={6} />
      <path d="M14 46 Q100 26 186 46 Q174 66 100 58 Q26 66 14 46 Z" fill="#b45309" />
    </g>
  )),
  it("mu_dau_bep", "hat", "Mũ đầu bếp", "hiem", 150, () => (
    <g stroke={OL} strokeWidth={2.5} fill="#ffffff">
      <circle cx={76} cy={18} r={20} />
      <circle cx={100} cy={8} r={22} />
      <circle cx={124} cy={18} r={20} />
      <rect x={60} y={22} width={80} height={30} rx={4} />
    </g>
  )),
  it("mu_tho", "hat", "Mũ tai thỏ", "hiem", 180, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <ellipse cx={74} cy={6} rx={12} ry={34} fill="#ffffff" transform="rotate(-12 74 6)" />
      <ellipse cx={126} cy={6} rx={12} ry={34} fill="#ffffff" transform="rotate(12 126 6)" />
      <ellipse cx={74} cy={8} rx={5} ry={24} fill="#fbcfe8" strokeWidth={0} transform="rotate(-12 74 8)" />
      <ellipse cx={126} cy={8} rx={5} ry={24} fill="#fbcfe8" strokeWidth={0} transform="rotate(12 126 8)" />
      <path d="M46 50 Q100 22 154 50" fill="none" stroke="#ffffff" strokeWidth={8} />
    </g>
  )),
  it("mu_hai_tac", "hat", "Mũ hải tặc", "suthi", 380, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M26 56 Q40 4 100 2 Q160 4 174 56 Q100 36 26 56 Z" fill="#111827" />
      <circle cx={100} cy={28} r={7} fill="#ffffff" />
      <path d="M92 40 L108 46 M108 40 L92 46" stroke="#ffffff" strokeWidth={2.5} />
      <path d="M30 54 Q100 34 170 54" fill="none" stroke="#facc15" strokeWidth={3} />
    </g>
  )),
  it("vong_hoa", "hat", "Vương miện hoa", "suthi", 350, () => (
    <g stroke={OL} strokeWidth={1.2}>
      {Array.from({ length: 9 }, (_, i) => {
        const a = ((200 + i * 17.5) * Math.PI) / 180;
        const x = 100 + 54 * Math.cos(a);
        const y = 62 + 30 * Math.sin(a);
        const col = ["#f472b6", "#facc15", "#a78bfa", "#fb7185"][i % 4];
        return (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((d) => (
              <circle key={d} cx={x + 4.5 * Math.cos((d * Math.PI) / 180)} cy={y + 4.5 * Math.sin((d * Math.PI) / 180)} r={3.6} fill={col} />
            ))}
            <circle cx={x} cy={y} r={2.4} fill="#fff7cc" />
          </g>
        );
      })}
    </g>
  )),
  it("sung_ky_lan", "hat", "Sừng kỳ lân", "huyenthoai", 900, () => (
    <g stroke={OL} strokeWidth={2}>
      <path d="M88 40 L100 -18 L112 40 Z" fill="#fcd34d" />
      <path d="M92 26 L108 20 M90 34 L110 28 M95 14 L105 10" stroke="#f59e0b" strokeWidth={2} />
      <Sparkle x={120} y={-8} s={5} fill="#fff7cc" />
      <Sparkle x={80} y={4} s={3} fill="#ffffff" />
    </g>
  )),
];

const MORE_GLASSES: Item[] = [
  it("kinh_ram_hong", "glasses", "Kính râm hồng", "hiem", 150, () => lens((x) => <rect key={x} x={x - 15} y={EYE_Y - 11} width={30} height={22} rx={8} fill="#f472b6" fillOpacity={0.85} stroke={OL} strokeWidth={3} />)),
  it("kinh_ram_xanh", "glasses", "Kính râm xanh", "hiem", 150, () => lens((x) => <rect key={x} x={x - 15} y={EYE_Y - 11} width={30} height={22} rx={8} fill="#38bdf8" fillOpacity={0.85} stroke={OL} strokeWidth={3} />)),
  it("kinh_3d", "glasses", "Kính 3D", "hiem", 120, () => (
    <g>
      {lens((x) => <rect key={x} x={x - 15} y={EYE_Y - 10} width={30} height={20} rx={3} fill={x < 100 ? "#ef4444" : "#3b82f6"} fillOpacity={0.8} stroke="#f8fafc" strokeWidth={4} />, "#f8fafc")}
    </g>
  )),
  it("kinh_phi_cong", "glasses", "Kính phi công", "hiem", 160, () =>
    lens((x) => <path key={x} d={`M${x - 15} ${EYE_Y - 9} H${x + 15} Q${x + 15} ${EYE_Y + 14} ${x} ${EYE_Y + 12} Q${x - 15} ${EYE_Y + 14} ${x - 15} ${EYE_Y - 9} Z`} fill="#92400e" fillOpacity={0.8} stroke="#ca8a04" strokeWidth={2.5} />, "#ca8a04"),
  ),
  it("mat_na", "glasses", "Mặt nạ dạ hội", "suthi", 380, () => (
    <g stroke={OL} strokeWidth={2}>
      <path d="M60 86 Q78 74 96 88 L100 92 L104 88 Q122 74 140 86 Q144 104 124 106 Q110 106 100 98 Q90 106 76 106 Q56 104 60 86 Z" fill="#7c3aed" />
      <ellipse cx={78} cy={92} rx={8} ry={5} fill="#2d2424" />
      <ellipse cx={122} cy={92} rx={8} ry={5} fill="#2d2424" />
      <path d="M140 84 Q156 60 150 44 M142 86 Q166 70 168 54" fill="none" stroke="#f472b6" strokeWidth={3} />
      <Sparkle x={100} y={82} s={3} fill="#fde68a" />
    </g>
  )),
  it("kinh_kim_cuong", "glasses", "Kính kim cương", "huyenthoai", 900, () => (
    <g>
      {lens((x) => (
        <g key={x}>
          <polygon points={`${x},${EYE_Y - 15} ${x + 15},${EYE_Y} ${x},${EYE_Y + 15} ${x - 15},${EYE_Y}`} fill="#a5f3fc" fillOpacity={0.85} stroke="#0891b2" strokeWidth={2.5} />
          <path d={`M${x - 15} ${EYE_Y} H${x + 15} M${x} ${EYE_Y - 15} L${x - 6} ${EYE_Y} L${x} ${EYE_Y + 15} L${x + 6} ${EYE_Y} Z`} fill="none" stroke="#ffffff" strokeWidth={1.2} />
        </g>
      ), "#0891b2")}
      <Sparkle x={EYE_R + 16} y={EYE_Y - 14} s={5} />
    </g>
  )),
];

const backpack = (color: string, dark: string): Draw => () => (
  <g stroke={OL} strokeWidth={2.5}>
    <rect x={56} y={148} width={88} height={60} rx={14} fill={color} />
    <rect x={56} y={180} width={88} height={8} fill={dark} strokeWidth={0} />
  </g>
);
const cape = (color: string): Draw => () => <path d="M72 146 L128 146 L154 240 Q100 250 46 240 Z" fill={color} stroke={OL} strokeWidth={2.5} />;
const MORE_BACKS: Item[] = [
  ...pal(["do", "xanhduong", "hong", "vang"]).map((c) => it(`balo_${c.id}`, "back", `Balo ${c.name}`, "thuong", 80, backpack(c.hex, darker[c.id]))),
  ...pal(["tim", "xanhduong", "vang"]).map((c) => it(`ao_choang_${c.id}`, "back", `Áo choàng ${c.name}`, "hiem", 250, cape(c.hex))),
  it("canh_doi", "back", "Cánh dơi", "suthi", 400, () => (
    <g stroke={OL} strokeWidth={2.5} fill="#4c1d95">
      <path d="M72 156 L20 120 Q24 146 10 156 Q30 160 26 176 Q44 172 48 188 Q60 178 74 186 Z" />
      <path d="M128 156 L180 120 Q176 146 190 156 Q170 160 174 176 Q156 172 152 188 Q140 178 126 186 Z" />
    </g>
  )),
  it("canh_rong", "back", "Cánh rồng", "suthi", 450, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M72 156 L14 100 L22 130 L4 136 L24 156 L12 172 L40 176 L50 196 L74 186 Z" fill="#16a34a" />
      <path d="M128 156 L186 100 L178 130 L196 136 L176 156 L188 172 L160 176 L150 196 L126 186 Z" fill="#16a34a" />
      <path d="M72 160 L22 132 M72 168 L26 158 M128 160 L178 132 M128 168 L174 158" stroke="#bbf7d0" strokeWidth={1.5} />
    </g>
  )),
  it("canh_tien", "back", "Cánh tiên", "suthi", 420, () => (
    <g stroke="#0ea5e9" strokeWidth={2}>
      {SIDES.map((f, i) => (
        <g key={i}>
          <ellipse cx={f(48)} cy={148} rx={34} ry={20} fill="#bae6fd" fillOpacity={0.7} transform={`rotate(${i ? 30 : -30} ${f(48)} 148)`} />
          <ellipse cx={f(56)} cy={190} rx={22} ry={13} fill="#e0f2fe" fillOpacity={0.7} transform={`rotate(${i ? -20 : 20} ${f(56)} 190)`} />
        </g>
      ))}
      <Sparkle x={30} y={140} s={4} />
      <Sparkle x={168} y={186} s={4} />
    </g>
  )),
];

const braid = (c: DrawCtx) => (
  <g>
    {SIDES.map((f, i) => (
      <g key={i}>
        {[112, 128, 144, 160, 176].map((y, j) => (
          <ellipse key={y} cx={f(44 - j * 0.6)} cy={y} rx={9} ry={9} fill={c.hair} stroke={OL} strokeWidth={2.2} />
        ))}
        <circle cx={f(43)} cy={190} r={4} fill="#f472b6" stroke={OL} strokeWidth={1.5} />
      </g>
    ))}
  </g>
);
const MORE_HAIR: Item[] = [
  { id: "toc_mai_bang", slot: "hair", name: "Tóc mái bằng", rarity: "thuong", price: 60, ...hair("M42 94 Q40 26 100 26 Q160 26 158 94 L156 72 Q100 64 44 72 Z") },
  { id: "toc_vuot", slot: "hair", name: "Tóc vuốt ngược", rarity: "thuong", price: 80, ...hair("M44 92 Q36 26 104 22 Q166 26 156 92 Q152 58 128 50 Q96 62 62 60 Q50 70 44 92 Z") },
  { id: "toc_bui_cao", slot: "hair", name: "Búi tóc cao", rarity: "thuong", price: 80,
    ...hair(BANGS, (c) => <circle cx={100} cy={22} r={22} fill={c.hair} stroke={OL} strokeWidth={2.5} />) },
  { id: "toc_bim_tet", slot: "hair", name: "Hai bím tết", rarity: "hiem", price: 150, ...hair(BANGS, braid) },
  { id: "toc_xu", slot: "hair", name: "Tóc xù", rarity: "hiem", price: 150,
    ...hair("M40 96 Q34 24 100 24 Q166 24 160 96 Q150 64 100 60 Q50 64 40 96 Z", (c) => <circle cx={100} cy={70} r={76} fill={c.hair} stroke={OL} strokeWidth={2.5} />) },
];

const MORE_EYES: Item[] = [
  it("mat_to_hong", "eyes", "Mắt long lanh hồng", "hiem", 150, () => <g>{brows}{[EYE_L, EYE_R].map(animeEye("#f472b6"))}</g>),
  it("mat_to_vang", "eyes", "Mắt long lanh hổ phách", "hiem", 150, () => <g>{brows}{[EYE_L, EYE_R].map(animeEye("#f59e0b"))}</g>),
  it("mat_to_xanh_la", "eyes", "Mắt long lanh xanh lá", "hiem", 150, () => <g>{brows}{[EYE_L, EYE_R].map(animeEye("#22c55e"))}</g>),
];

// ---------- Bộ sưu tập lấp lánh (bản 1.4) ----------

const galaxyDots = (pts: [number, number, string][]) => (
  <g>
    {pts.map(([x, y, c], i) => (
      <circle key={i} cx={x} cy={y} r={2.2} fill={c} />
    ))}
  </g>
);

const FANCY: Item[] = [
  // Áo, váy
  it("vay_ngan_ha", "shirt", "Váy dạ hội ngân hà", "huyenthoai", 1500, shirt("#312e81", {
    dress: true,
    detail: (
      <g>
        <path d="M56 214 Q100 224 144 214 L150 232 Q100 240 50 232 Z" fill="#6d28d9" stroke={OL} strokeWidth={2} />
        {galaxyDots([[82, 166, "#fde68a"], [116, 176, "#ffffff"], [92, 196, "#a5f3fc"], [126, 204, "#fde68a"], [74, 214, "#ffffff"], [110, 222, "#f0abfc"]])}
        {sparkles([[88, 182], [120, 160], [104, 212]])}
      </g>
    ),
  })),
  it("ao_giap_hiep_si", "shirt", "Áo giáp hiệp sĩ", "huyenthoai", 1400, shirt("#cbd5e1", {
    sleeve: "long",
    sleeveColor: "#94a3b8",
    detail: (
      <g>
        <path d="M80 152 Q100 146 120 152 L118 196 Q100 204 82 196 Z" fill="#e2e8f0" stroke={OL} strokeWidth={2} />
        <path d="M100 158 V192 M88 172 H112" stroke="#f5c542" strokeWidth={5} />
        {sparkles([[78, 160], [124, 186]])}
      </g>
    ),
  })),
  it("vay_anh_dao", "shirt", "Váy hoa anh đào", "suthi", 600, shirt("#fbcfe8", {
    dress: true,
    detail: (
      <g>
        {[[80, 170], [114, 160], [96, 196], [126, 206], [70, 216], [108, 226]].map(([x, y], i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={x + 4 * Math.cos((a * Math.PI) / 180)} cy={y + 4 * Math.sin((a * Math.PI) / 180)} r={3.2} fill="#f472b6" />
            ))}
            <circle cx={x} cy={y} r={2} fill="#fde047" />
          </g>
        ))}
      </g>
    ),
  })),
  it("ao_dai_do_vang", "shirt", "Áo dài đỏ thêu vàng", "suthi", 700, shirt("#dc2626", {
    shape: AODAI,
    sleeve: "long",
    detail: (
      <g>
        {mandarin}
        <path d="M84 170 Q100 160 116 170 Q100 184 84 170 Z" fill="#fbbf24" stroke={OL} strokeWidth={1.5} />
        <circle cx={100} cy={196} r={5} fill="#fbbf24" />
        {sparkles([[90, 214], [112, 184]])}
      </g>
    ),
  })),
  it("ao_du_hanh_vu_tru", "shirt", "Áo du hành vũ trụ", "suthi", 650, shirt("#f8fafc", {
    sleeve: "long",
    sleeveColor: "#e2e8f0",
    detail: (
      <g>
        <rect x={86} y={160} width={28} height={22} rx={4} fill="#93c5fd" stroke={OL} strokeWidth={2} />
        <circle cx={92} cy={168} r={3} fill="#ef4444" />
        <circle cx={100} cy={168} r={3} fill="#22c55e" />
        <circle cx={108} cy={168} r={3} fill="#facc15" />
        <rect x={114} y={150} width={12} height={8} fill="#da251d" stroke={OL} strokeWidth={1} />
      </g>
    ),
  })),
  it("ao_len_cau_vong", "shirt", "Áo len cầu vồng", "hiem", 320, shirt("#ef4444", {
    sleeve: "long",
    sleeveColor: "#a855f7",
    detail: (
      <g strokeWidth={7}>
        {["#f97316", "#facc15", "#22c55e", "#3b82f6"].map((c, i) => {
          const y = 160 + i * 11;
          return <line key={c} x1={torsoLeft(y) + 2} y1={y} x2={mirror(torsoLeft(y) + 2)} y2={y} stroke={c} />;
        })}
      </g>
    ),
  })),
  // Quần, váy
  it("vay_xoe_lap_lanh", "pants", "Chân váy xòe lấp lánh", "suthi", 480, pants("#c084fc", SKIRT, sparkles([[82, 212], [116, 220], [100, 206]]))),
  it("quan_jean_thoi_trang", "pants", "Quần jean thời trang", "hiem", 260, pants("#3b82f6", LONG, <path d="M76 222 L86 224 M114 220 L124 222" stroke="#bfdbfe" strokeWidth={3} />)),
  // Giày
  it("giay_bang_tuyet", "shoes", "Giày băng tuyết", "suthi", 450, shoes("#a5f3fc", "#ffffff", { boot: true, shine: true })),
  it("giay_ki_lan", "shoes", "Giày kì lân", "huyenthoai", 950, shoes("#f0abfc", "#fde68a", { lights: true, shine: true })),
  // Mũ
  it("mu_ki_lan", "hat", "Mũ kì lân", "huyenthoai", 1200, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M60 46 Q100 18 140 46 Q120 40 100 42 Q80 40 60 46 Z" fill="#fdf4ff" />
      <path d="M92 32 L100 -6 L108 32 Z" fill="#fde68a" />
      <path d="M95 22 L105 18 M94 12 L104 8" stroke="#f59e0b" strokeWidth={2} />
      <path d="M64 40 L56 20 L74 34 Z M136 40 L144 20 L126 34 Z" fill="#f9a8d4" />
      <Sparkle x={124} y={8} s={5} />
    </g>
  )),
  it("vuong_mien_kim_cuong", "hat", "Vương miện kim cương", "huyenthoai", 1600, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M60 42 L64 8 L82 26 L100 2 L118 26 L136 8 L140 42 Z" fill="#e0f2fe" />
      <path d="M94 22 L100 12 L106 22 L100 32 Z" fill="#38bdf8" />
      <circle cx={76} cy={34} r={4} fill="#f0abfc" />
      <circle cx={124} cy={34} r={4} fill="#a5f3fc" />
      <Sparkle x={66} y={6} s={5} />
      <Sparkle x={136} y={4} s={4} />
    </g>
  )),
  it("bang_do_tai_tho", "hat", "Băng đô tai thỏ", "hiem", 250, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M54 56 Q100 22 146 56" fill="none" stroke="#f472b6" strokeWidth={6} />
      <ellipse cx={80} cy={10} rx={10} ry={26} fill="#ffffff" transform="rotate(-12 80 10)" />
      <ellipse cx={120} cy={10} rx={10} ry={26} fill="#ffffff" transform="rotate(12 120 10)" />
      <ellipse cx={80} cy={12} rx={5} ry={18} fill="#fbcfe8" transform="rotate(-12 80 12)" stroke="none" />
      <ellipse cx={120} cy={12} rx={5} ry={18} fill="#fbcfe8" transform="rotate(12 120 12)" stroke="none" />
    </g>
  )),
  it("mu_cao_boi_sa_mac", "hat", "Mũ cao bồi sa mạc", "hiem", 280, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <path d="M30 46 Q100 64 170 46 Q160 56 100 60 Q40 56 30 46 Z" fill="#a16207" />
      <path d="M66 46 Q64 14 84 16 Q100 24 116 16 Q136 14 134 46 Z" fill="#ca8a04" />
      <path d="M68 40 Q100 46 132 40" fill="none" stroke="#7c2d12" strokeWidth={5} />
    </g>
  )),
  // Kính
  it("kinh_cau_vong", "glasses", "Kính cầu vồng", "suthi", 400, () => (
    <g stroke={OL} strokeWidth={2.5}>
      {[74, 126].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 18} y={98} width={36} height={22} rx={10} fill={i ? "#a5f3fc" : "#fbcfe8"} opacity={0.85} />
          <path d={`M${cx - 14} 104 H${cx + 14}`} stroke="#fde047" strokeWidth={3} />
          <path d={`M${cx - 14} 112 H${cx + 14}`} stroke="#86efac" strokeWidth={3} />
        </g>
      ))}
      <path d="M92 108 H108" />
    </g>
  )),
  // Sau lưng
  it("canh_rong_xanh", "back", "Cánh rồng xanh lục", "huyenthoai", 1500, () => (
    <g stroke={OL} strokeWidth={2.5}>
      {SIDES.map((f, i) => (
        <g key={i}>
          <path d={`M${f(74)} 156 L${f(14)} 112 L${f(28)} 150 L${f(4)} 160 L${f(30)} 176 L${f(12)} 196 L${f(74)} 186 Z`} fill="#16a34a" />
          <path d={`M${f(74)} 158 L${f(22)} 124 M${f(74)} 170 L${f(16)} 168 M${f(74)} 182 L${f(24)} 190`} stroke="#14532d" strokeWidth={2} fill="none" />
        </g>
      ))}
    </g>
  )),
  it("canh_tien_bang", "back", "Cánh tiên băng giá", "suthi", 700, () => (
    <g stroke={OL} strokeWidth={2}>
      {SIDES.map((f, i) => (
        <g key={i}>
          <ellipse cx={f(42)} cy={146} rx={32} ry={20} fill="#a5f3fc" opacity={0.85} transform={`rotate(${i ? 35 : -35} ${f(42)} 146)`} />
          <ellipse cx={f(52)} cy={190} rx={20} ry={13} fill="#c4b5fd" opacity={0.85} transform={`rotate(${i ? -25 : 25} ${f(52)} 190)`} />
          <Sparkle x={f(34)} y={140} s={4} />
        </g>
      ))}
    </g>
  )),
  it("balo_gau", "back", "Ba lô gấu", "hiem", 260, () => (
    <g stroke={OL} strokeWidth={2.5}>
      <rect x={66} y={150} width={68} height={62} rx={18} fill="#d97706" />
      <circle cx={74} cy={152} r={10} fill="#d97706" />
      <circle cx={126} cy={152} r={10} fill="#d97706" />
    </g>
  )),
];

const MORE: Item[] = [...MORE_HAIR, ...MORE_EYES, ...MORE_SHIRTS, ...MORE_PANTS, ...MORE_SHOES, ...MORE_GLASSES, ...MORE_HATS, ...MORE_BACKS, ...FANCY];

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

  // Bộ sưu tập mở rộng
  ...MORE,

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
