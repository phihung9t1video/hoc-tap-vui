import type { ReactNode } from "react";
import { OL, PALETTE, Sparkle, Star, type Item, type Rarity } from "./draw";

/** Vị trí thú cưng (bên phải chân nhân vật) */
export const PX = 172;
export const PY = 230;
/** Vị trí đồ chơi, bát ăn (bên trái chân nhân vật) */
const TX = 30;
const TY = 236;

// ---------- Thú cưng ----------

interface PetSpec {
  body: string;
  head?: string;
  ears: "cat" | "dog" | "bunny" | "bear" | "pig" | "fox" | "none" | "dino";
  earColor?: string;
  face?: "panda" | "pig" | "beak" | "fox" | "unicorn" | "parrot" | "penguin" | "turtle";
}

const petDraw = (s: PetSpec) => () => {
  const head = s.head ?? s.body;
  const ec = s.earColor ?? head;
  return (
    <g strokeWidth={2} stroke={OL}>
      {/* Đuôi */}
      {(s.ears === "cat" || s.ears === "fox") && (
        <path d={`M${PX + 13} ${PY + 12} Q${PX + 30} ${PY + 10} ${PX + 26} ${PY - 6}`} fill="none" strokeWidth={6} stroke={OL} strokeLinecap="round" />
      )}
      {(s.ears === "cat" || s.ears === "fox") && (
        <path d={`M${PX + 13} ${PY + 12} Q${PX + 30} ${PY + 10} ${PX + 26} ${PY - 6}`} fill="none" strokeWidth={3} stroke={s.body} strokeLinecap="round" />
      )}
      {s.ears === "dino" && (
        <path d={`M${PX - 12} ${PY + 12} Q${PX - 30} ${PY + 6} ${PX - 30} ${PY - 4} Q${PX - 20} ${PY + 4} ${PX - 10} ${PY + 2} Z`} fill={s.body} />
      )}
      {s.face === "unicorn" && (
        <path d={`M${PX + 10} ${PY - 20} Q${PX + 26} ${PY - 10} ${PX + 22} ${PY + 6} Q${PX + 16} ${PY - 6} ${PX + 8} ${PY - 8} Z`} fill="#f9a8d4" />
      )}

      {/* Thân */}
      {s.face === "turtle" ? (
        <g>
          <ellipse cx={PX} cy={PY + 10} rx={20} ry={11} fill="#86c06c" />
          <path d={`M${PX - 18} ${PY + 8} Q${PX} ${PY - 10} ${PX + 18} ${PY + 8} Z`} fill="#a16207" />
          <path d={`M${PX - 8} ${PY + 6} L${PX - 4} ${PY - 1} L${PX + 4} ${PY - 1} L${PX + 8} ${PY + 6}`} fill="none" stroke="#fde68a" strokeWidth={1.5} />
        </g>
      ) : (
        <ellipse cx={PX} cy={PY + 8} rx={16} ry={12} fill={s.body} />
      )}
      {(s.face === "penguin" || s.face === "panda") && <ellipse cx={PX} cy={PY + 10} rx={9} ry={8} fill="#fff" strokeWidth={0} />}
      {(s.face === "beak" || s.face === "parrot" || s.face === "penguin") &&
        [-1, 1].map((d) => <ellipse key={d} cx={PX + d * 15} cy={PY + 6} rx={4} ry={8} fill={s.body} transform={`rotate(${d * 20} ${PX + d * 15} ${PY + 6})`} />)}

      {/* Tai phía sau đầu */}
      {s.ears === "cat" &&
        [-1, 1].map((d) => <path key={d} d={`M${PX + d * 12} ${PY - 18} L${PX + d * 11} ${PY - 32} L${PX + d * 2} ${PY - 22} Z`} fill={ec} />)}
      {s.ears === "fox" &&
        [-1, 1].map((d) => <path key={d} d={`M${PX + d * 13} ${PY - 16} L${PX + d * 13} ${PY - 34} L${PX + d * 1} ${PY - 22} Z`} fill={ec} />)}
      {s.ears === "bunny" && [-1, 1].map((d) => <ellipse key={d} cx={PX + d * 6} cy={PY - 34} rx={5} ry={14} fill={ec} />)}
      {s.ears === "bear" && [-1, 1].map((d) => <circle key={d} cx={PX + d * 11} cy={PY - 21} r={5.5} fill={ec} />)}
      {s.ears === "pig" &&
        [-1, 1].map((d) => <path key={d} d={`M${PX + d * 6} ${PY - 22} L${PX + d * 14} ${PY - 28} L${PX + d * 13} ${PY - 16} Z`} fill={ec} />)}
      {s.ears === "dino" &&
        [-6, 2, 10].map((dx) => <path key={dx} d={`M${PX + dx - 4} ${PY - 20} L${PX + dx} ${PY - 29} L${PX + dx + 4} ${PY - 20} Z`} fill="#ffb74d" strokeWidth={1.5} />)}

      {/* Đầu */}
      <circle cx={PX} cy={PY - 10} r={14} fill={head} />
      {s.ears === "dog" && [-1, 1].map((d) => <ellipse key={d} cx={PX + d * 13} cy={PY - 8} rx={5} ry={10} fill={ec} />)}
      {s.face === "fox" && <ellipse cx={PX} cy={PY - 4} rx={9} ry={6} fill="#fff" strokeWidth={0} />}
      {s.face === "penguin" && <ellipse cx={PX} cy={PY - 7} rx={10} ry={8} fill="#fff" strokeWidth={0} />}
      {s.face === "panda" && [-1, 1].map((d) => <ellipse key={d} cx={PX + d * 5.5} cy={PY - 12} rx={4} ry={5} fill="#1f2937" strokeWidth={0} />)}
      {s.face === "unicorn" && <path d={`M${PX - 4} ${PY - 22} L${PX} ${PY - 40} L${PX + 4} ${PY - 22} Z`} fill="#fcd34d" />}

      {/* Mắt */}
      {[-5, 5].map((dx) => (
        <g key={dx} strokeWidth={0}>
          <circle cx={PX + dx} cy={PY - 12} r={2.3} fill={s.face === "panda" ? "#fff" : "#2d2424"} />
          {s.face === "panda" && <circle cx={PX + dx} cy={PY - 12} r={1.3} fill="#2d2424" />}
        </g>
      ))}

      {/* Mũi, mỏ */}
      {s.face === "pig" ? (
        <g>
          <ellipse cx={PX} cy={PY - 5} rx={5} ry={3.5} fill="#f9a8d4" />
          <circle cx={PX - 1.8} cy={PY - 5} r={0.9} fill={OL} strokeWidth={0} />
          <circle cx={PX + 1.8} cy={PY - 5} r={0.9} fill={OL} strokeWidth={0} />
        </g>
      ) : s.face === "beak" || s.face === "penguin" ? (
        <path d={`M${PX - 4} ${PY - 7} L${PX + 4} ${PY - 7} L${PX} ${PY - 2} Z`} fill="#fb923c" strokeWidth={1.5} />
      ) : s.face === "parrot" ? (
        <path d={`M${PX - 3} ${PY - 8} Q${PX + 6} ${PY - 9} ${PX + 2} ${PY} Q${PX} ${PY - 4} ${PX - 3} ${PY - 8} Z`} fill="#fbbf24" strokeWidth={1.5} />
      ) : (
        <ellipse cx={PX} cy={PY - 6} rx={2.5} ry={1.8} fill={s.ears === "dino" || s.face === "panda" || s.face === "fox" ? "#2d2424" : "#ff8fa3"} strokeWidth={0} />
      )}
    </g>
  );
};

const pet = (id: string, name: string, rarity: Rarity, price: number, spec: PetSpec, extra: Partial<Item> = {}): Item => ({
  id,
  slot: "pet",
  name,
  rarity,
  price,
  draw: petDraw(spec),
  ...extra,
});

const PETS: Item[] = [
  { id: "pet_khong", slot: "pet", name: "Không có", rarity: "thuong", price: 0, starter: true },
  pet("pet_ga_con", "Gà con", "thuong", 120, { body: "#fde047", ears: "none", face: "beak" }),
  pet("pet_meo_den", "Mèo mun", "thuong", 150, { body: "#374151", ears: "cat", earColor: "#374151" }),
  pet("pet_meo", "Mèo cam", "hiem", 250, { body: "#f6a04d", ears: "cat" }),
  pet("pet_cho", "Cún con", "hiem", 250, { body: "#f3e2c7", ears: "dog", earColor: "#8d5a3b" }),
  pet("pet_hamster", "Chuột hamster", "hiem", 220, { body: "#f2c48d", ears: "bear", earColor: "#e8a96a" }),
  pet("pet_heo", "Heo hồng", "hiem", 200, { body: "#fbcfe8", ears: "pig", earColor: "#f9a8d4", face: "pig" }),
  pet("pet_rua", "Rùa con", "hiem", 220, { body: "#86c06c", ears: "none", face: "turtle" }),
  pet("pet_vet", "Vẹt xanh", "hiem", 260, { body: "#4ade80", head: "#ef4444", ears: "none", face: "parrot" }),
  pet("pet_tho", "Thỏ trắng", "suthi", 400, { body: "#ffffff", ears: "bunny" }),
  pet("pet_cao", "Cáo lửa", "suthi", 380, { body: "#f97316", ears: "fox", face: "fox" }),
  pet("pet_canh_cut", "Chim cánh cụt", "suthi", 400, { body: "#1f2937", ears: "none", face: "penguin" }),
  pet("pet_gau_truc", "Gấu trúc", "suthi", 450, { body: "#1f2937", head: "#ffffff", ears: "bear", earColor: "#1f2937", face: "panda" }),
  pet("pet_ky_lan", "Kỳ lân", "huyenthoai", 1000, { body: "#ffffff", ears: "cat", face: "unicorn" }),
  pet("pet_khung_long", "Khủng long xanh", "huyenthoai", 0, { body: "#6ccf7f", ears: "dino" }, { achievement: "bai_50" }),
];

// ---------- Đồ đeo cho thú cưng ----------

const acc = (id: string, name: string, rarity: Rarity, price: number, draw: () => ReactNode): Item => ({ id, slot: "petAcc", name, rarity, price, draw });

const collar = (color: string, bell: boolean) => () => (
  <g>
    <path d={`M${PX - 11} ${PY + 1} Q${PX} ${PY + 8} ${PX + 11} ${PY + 1}`} fill="none" stroke={OL} strokeWidth={7} strokeLinecap="round" />
    <path d={`M${PX - 11} ${PY + 1} Q${PX} ${PY + 8} ${PX + 11} ${PY + 1}`} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" />
    {bell && <circle cx={PX} cy={PY + 8} r={3.5} fill="#facc15" stroke={OL} strokeWidth={1.5} />}
  </g>
);

const bowTie = (color: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d={`M${PX} ${PY + 4} L${PX - 9} ${PY - 1} L${PX - 9} ${PY + 9} Z M${PX} ${PY + 4} L${PX + 9} ${PY - 1} L${PX + 9} ${PY + 9} Z`} fill={color} />
    <circle cx={PX} cy={PY + 4} r={2.5} fill={color} />
  </g>
);

const bandana = (color: string, light: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d={`M${PX - 12} ${PY + 1} L${PX + 12} ${PY + 1} L${PX} ${PY + 14} Z`} fill={color} />
    <circle cx={PX - 3} cy={PY + 5} r={1.3} fill={light} strokeWidth={0} />
    <circle cx={PX + 3} cy={PY + 5} r={1.3} fill={light} strokeWidth={0} />
    <circle cx={PX} cy={PY + 9} r={1.3} fill={light} strokeWidth={0} />
  </g>
);

const headBow = (color: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d={`M${PX + 9} ${PY - 22} L${PX + 2} ${PY - 27} L${PX + 3} ${PY - 17} Z M${PX + 9} ${PY - 22} L${PX + 16} ${PY - 27} L${PX + 15} ${PY - 17} Z`} fill={color} />
    <circle cx={PX + 9} cy={PY - 22} r={2.2} fill={color} />
  </g>
);

const partyHat = (color: string, light: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d={`M${PX - 8} ${PY - 21} L${PX + 1} ${PY - 44} L${PX + 9} ${PY - 21} Z`} fill={color} />
    <circle cx={PX - 1} cy={PY - 27} r={1.6} fill={light} strokeWidth={0} />
    <circle cx={PX + 4} cy={PY - 32} r={1.6} fill={light} strokeWidth={0} />
    <circle cx={PX + 1} cy={PY - 44} r={3} fill={light} />
  </g>
);

const beanie = (color: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d={`M${PX - 13} ${PY - 17} Q${PX} ${PY - 40} ${PX + 13} ${PY - 17} Z`} fill={color} />
    <rect x={PX - 14} y={PY - 21} width={28} height={6} rx={3} fill="#f8fafc" />
    <circle cx={PX} cy={PY - 34} r={3.5} fill="#f8fafc" />
  </g>
);

const flower = (color: string) => () => (
  <g stroke={OL} strokeWidth={1}>
    {[0, 72, 144, 216, 288].map((a) => (
      <circle key={a} cx={PX - 9 + 3.6 * Math.cos((a * Math.PI) / 180)} cy={PY - 21 + 3.6 * Math.sin((a * Math.PI) / 180)} r={2.8} fill={color} />
    ))}
    <circle cx={PX - 9} cy={PY - 21} r={2.2} fill="#facc15" />
  </g>
);

const ACC_COLORS = PALETTE;
const pick = (ids: string[]) => ACC_COLORS.filter((c) => ids.includes(c.id));

const PET_ACCS: Item[] = [
  { id: "pa_khong", slot: "petAcc", name: "Không đeo", rarity: "thuong", price: 0, starter: true },
  ...ACC_COLORS.map((c) => acc(`pa_vong_${c.id}`, `Vòng cổ ${c.name}`, "thuong", 40, collar(c.hex, false))),
  ...pick(["do", "hong", "xanhduong", "tim"]).map((c) => acc(`pa_chuong_${c.id}`, `Vòng chuông ${c.name}`, "hiem", 120, collar(c.hex, true))),
  ...pick(["do", "hong", "vang", "xanhla", "xanhduong", "den"]).map((c) => acc(`pa_no_co_${c.id}`, `Nơ cổ ${c.name}`, "thuong", 60, bowTie(c.hex))),
  ...pick(["do", "cam", "vang", "xanhla", "xanhduong", "tim"]).map((c) => acc(`pa_khan_${c.id}`, `Khăn quàng ${c.name}`, "thuong", 60, bandana(c.hex, c.light))),
  ...pick(["do", "hong", "cam", "vang", "xanhduong", "tim"]).map((c) => acc(`pa_no_dau_${c.id}`, `Nơ cài đầu ${c.name}`, "thuong", 50, headBow(c.hex))),
  ...pick(["hong", "cam", "xanhduong", "tim"]).map((c) => acc(`pa_hoa_${c.id}`, `Hoa cài ${c.name}`, "thuong", 50, flower(c.hex))),
  ...pick(["do", "xanhla", "xanhduong", "tim"]).map((c) => acc(`pa_mu_tiec_${c.id}`, `Mũ sinh nhật ${c.name}`, "hiem", 120, partyHat(c.hex, c.light))),
  ...pick(["do", "vang", "xanhduong"]).map((c) => acc(`pa_mu_len_${c.id}`, `Mũ len ${c.name}`, "hiem", 140, beanie(c.hex))),
  acc("pa_kinh_ram", "Kính râm mini", "hiem", 150, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <rect x={PX - 10} y={PY - 15} width={8} height={6} rx={2} fill="#111827" />
      <rect x={PX + 2} y={PY - 15} width={8} height={6} rx={2} fill="#111827" />
      <line x1={PX - 2} y1={PY - 13} x2={PX + 2} y2={PY - 13} />
    </g>
  )),
  acc("pa_kinh_tim", "Kính trái tim mini", "hiem", 160, () => (
    <g stroke={OL} strokeWidth={1.2}>
      {[-5, 5].map((dx) => (
        <path key={dx} d={`M${PX + dx} ${PY - 8} C${PX + dx - 7} ${PY - 12} ${PX + dx - 4} ${PY - 18} ${PX + dx} ${PY - 14} C${PX + dx + 4} ${PY - 18} ${PX + dx + 7} ${PY - 12} ${PX + dx} ${PY - 8} Z`} fill="#ff4d6d" />
      ))}
    </g>
  )),
  acc("pa_mu_phu_thuy", "Mũ phù thủy mini", "suthi", 350, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <path d={`M${PX - 9} ${PY - 22} L${PX + 4} ${PY - 46} L${PX + 10} ${PY - 22} Z`} fill="#5b21b6" />
      <ellipse cx={PX} cy={PY - 22} rx={15} ry={3.5} fill="#6d28d9" />
      <Star cx={PX + 2} cy={PY - 32} R={3} fill="#facc15" sw={1} />
    </g>
  )),
  acc("pa_hao_quang", "Hào quang thiên thần", "suthi", 400, () => (
    <ellipse cx={PX} cy={PY - 32} rx={10} ry={3} fill="none" stroke="#facc15" strokeWidth={3} />
  )),
  acc("pa_vuong_mien", "Vương miện mini", "huyenthoai", 800, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <path d={`M${PX - 9} ${PY - 21} L${PX - 10} ${PY - 33} L${PX - 4} ${PY - 27} L${PX} ${PY - 36} L${PX + 4} ${PY - 27} L${PX + 10} ${PY - 33} L${PX + 9} ${PY - 21} Z`} fill="#f5c542" />
      <circle cx={PX} cy={PY - 25} r={1.8} fill="#ef4444" strokeWidth={0} />
      <Sparkle x={PX - 12} y={PY - 36} s={3} />
    </g>
  )),
];

// ---------- Đồ chơi, bát ăn (bên trái) ----------

const toy = (id: string, name: string, rarity: Rarity, price: number, draw: () => ReactNode): Item => ({ id, slot: "petToy", name, rarity, price, draw });

const bowl = (color: string, food: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    {[-8, -3, 2, 7, -5, 4].map((dx, i) => (
      <circle key={i} cx={TX + dx} cy={TY - (i > 3 ? 4 : 1)} r={2.6} fill={food} />
    ))}
    <path d={`M${TX - 16} ${TY} Q${TX - 14} ${TY + 13} ${TX} ${TY + 13} Q${TX + 14} ${TY + 13} ${TX + 16} ${TY} Z`} fill={color} />
    <ellipse cx={TX} cy={TY} rx={16} ry={3.5} fill={color} />
  </g>
);

const bone = (color: string, shine = false) => () => (
  <g stroke={OL} strokeWidth={1.5} transform={`rotate(-15 ${TX} ${TY + 6})`}>
    {[-1, 1].flatMap((d) => [-1, 1].map((e) => <circle key={`${d}${e}`} cx={TX + d * 12} cy={TY + 6 + e * 3} r={4} fill={color} />))}
    <rect x={TX - 12} y={TY + 3} width={24} height={6} fill={color} strokeWidth={0} />
    <path d={`M${TX - 10} ${TY + 3} L${TX + 10} ${TY + 3} M${TX - 10} ${TY + 9} L${TX + 10} ${TY + 9}`} />
    {shine && <Sparkle x={TX + 14} y={TY - 4} s={4} fill="#fff7cc" />}
  </g>
);

const ball = (color: string, light: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <circle cx={TX} cy={TY + 4} r={10} fill={color} />
    <path d={`M${TX - 9} ${TY} Q${TX} ${TY + 6} ${TX + 9} ${TY}`} fill="none" stroke={light} strokeWidth={2.5} />
    <path d={`M${TX - 8} ${TY + 9} Q${TX} ${TY + 4} ${TX + 8} ${TY + 9}`} fill="none" stroke={light} strokeWidth={2.5} />
  </g>
);

const yarn = (color: string, light: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d={`M${TX + 8} ${TY + 10} Q${TX + 20} ${TY + 16} ${TX + 24} ${TY + 8}`} fill="none" stroke={color} strokeWidth={2} />
    <circle cx={TX} cy={TY + 4} r={10} fill={color} />
    <path d={`M${TX - 8} ${TY - 2} Q${TX} ${TY + 4} ${TX + 4} ${TY + 13} M${TX - 4} ${TY - 5} Q${TX + 6} ${TY + 2} ${TX + 9} ${TY + 9} M${TX - 9} ${TY + 6} Q${TX - 2} ${TY + 9} ${TX} ${TY + 14}`} fill="none" stroke={light} strokeWidth={1.5} />
  </g>
);

const fishToy = (color: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <path d={`M${TX + 8} ${TY + 6} L${TX + 18} ${TY} L${TX + 18} ${TY + 12} Z`} fill={color} />
    <ellipse cx={TX} cy={TY + 6} rx={11} ry={7} fill={color} />
    <circle cx={TX - 5} cy={TY + 4} r={1.5} fill={OL} strokeWidth={0} />
  </g>
);

const frisbee = (color: string, light: string) => () => (
  <g stroke={OL} strokeWidth={1.5}>
    <ellipse cx={TX} cy={TY + 8} rx={15} ry={6} fill={color} />
    <ellipse cx={TX} cy={TY + 7} rx={8} ry={3} fill={light} />
  </g>
);

const PET_TOYS: Item[] = [
  { id: "pt_khong", slot: "petToy", name: "Không có", rarity: "thuong", price: 0, starter: true },
  ...pick(["do", "hong", "cam", "xanhla", "xanhduong", "tim"]).map((c) => toy(`pt_bat_${c.id}`, `Bát ăn ${c.name}`, "thuong", 40, bowl(c.hex, "#a0522d"))),
  toy("pt_bat_ca", "Bát cá ngon", "hiem", 100, bowl("#60a5fa", "#fb923c")),
  toy("pt_xuong", "Xương gặm", "thuong", 30, bone("#fffbeb")),
  toy("pt_xuong_vang", "Xương vàng", "huyenthoai", 700, bone("#f5c542", true)),
  ...pick(["do", "vang", "xanhla", "xanhduong", "tim", "hong"]).map((c) => toy(`pt_bong_${c.id}`, `Bóng ${c.name}`, "thuong", 40, ball(c.hex, "#ffffff"))),
  ...pick(["do", "hong", "cam", "xanhduong", "tim"]).map((c) => toy(`pt_len_${c.id}`, `Cuộn len ${c.name}`, "thuong", 50, yarn(c.hex, c.light))),
  toy("pt_ca_cam", "Cá đồ chơi cam", "thuong", 60, fishToy("#fb923c")),
  toy("pt_ca_xanh", "Cá đồ chơi xanh", "thuong", 60, fishToy("#60a5fa")),
  toy("pt_chuot", "Chuột đồ chơi", "thuong", 60, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <path d={`M${TX + 10} ${TY + 9} Q${TX + 22} ${TY + 14} ${TX + 22} ${TY + 4}`} fill="none" />
      <ellipse cx={TX} cy={TY + 7} rx={11} ry={7} fill="#9ca3af" />
      <circle cx={TX - 6} cy={TY - 1} r={3.5} fill="#f9a8d4" />
      <circle cx={TX - 10} cy={TY + 6} r={1.3} fill={OL} strokeWidth={0} />
    </g>
  )),
  toy("pt_ca_rot", "Cà rốt", "thuong", 40, () => (
    <g stroke={OL} strokeWidth={1.5}>
      <path d={`M${TX - 2} ${TY - 2} Q${TX - 8} ${TY - 12} ${TX - 4} ${TY - 14} M${TX + 2} ${TY - 2} Q${TX + 4} ${TY - 14} ${TX + 8} ${TY - 12}`} fill="#4ade80" stroke="#16a34a" strokeWidth={2.5} />
      <path d={`M${TX - 7} ${TY - 1} Q${TX} ${TY - 4} ${TX + 7} ${TY - 1} L${TX + 1} ${TY + 18} Z`} fill="#fb923c" />
    </g>
  )),
  ...pick(["do", "vang", "xanhduong"]).map((c) => toy(`pt_dia_${c.id}`, `Đĩa bay ${c.name}`, "hiem", 100, frisbee(c.hex, c.light))),
];

// ---------- Nệm, nhà (phía sau thú cưng) ----------

const home = (id: string, name: string, rarity: Rarity, price: number, draw: () => ReactNode): Item => ({ id, slot: "petHome", name, rarity, price, draw });

const bed = (color: string, light: string) => () => (
  <g stroke={OL} strokeWidth={2}>
    <ellipse cx={PX} cy={PY + 17} rx={27} ry={9} fill={color} />
    <ellipse cx={PX} cy={PY + 16} rx={19} ry={5} fill={light} />
  </g>
);

const house = (wall: string, roof: string) => () => (
  <g stroke={OL} strokeWidth={2}>
    <rect x={PX - 22} y={PY - 30} width={44} height={50} fill={wall} />
    <path d={`M${PX - 28} ${PY - 28} L${PX} ${PY - 52} L${PX + 28} ${PY - 28} Z`} fill={roof} />
    <path d={`M${PX - 13} ${PY + 20} L${PX - 13} ${PY - 8} Q${PX} ${PY - 22} ${PX + 13} ${PY - 8} L${PX + 13} ${PY + 20} Z`} fill="#3f2a1d" />
  </g>
);

const PET_HOMES: Item[] = [
  { id: "ph_khong", slot: "petHome", name: "Không có", rarity: "thuong", price: 0, starter: true },
  ...pick(["do", "hong", "cam", "xanhla", "xanhduong", "tim"]).map((c) => home(`ph_nem_${c.id}`, `Nệm ${c.name}`, "hiem", 150, bed(c.hex, c.light))),
  home("ph_nha_go", "Nhà gỗ", "suthi", 350, house("#d6a46c", "#b45309")),
  home("ph_nha_hong", "Nhà hồng", "suthi", 350, house("#fbcfe8", "#ec4899")),
  home("ph_nha_xanh", "Nhà xanh", "suthi", 350, house("#bfdbfe", "#2563eb")),
  home("ph_nha_vang", "Nhà vàng", "suthi", 350, house("#fef08a", "#16a34a")),
  home("ph_lau_dai", "Lâu đài thú cưng", "huyenthoai", 1000, () => (
    <g stroke={OL} strokeWidth={2}>
      <rect x={PX - 24} y={PY - 30} width={48} height={50} fill="#ddd6fe" />
      {[-24, -8, 8].map((dx) => (
        <rect key={dx} x={PX + dx} y={PY - 38} width={16} height={8} fill="#c4b5fd" />
      ))}
      <path d={`M${PX - 13} ${PY + 20} L${PX - 13} ${PY - 8} Q${PX} ${PY - 22} ${PX + 13} ${PY - 8} L${PX + 13} ${PY + 20} Z`} fill="#4c1d95" />
      <path d={`M${PX - 20} ${PY - 38} L${PX - 20} ${PY - 54} L${PX - 8} ${PY - 50} L${PX - 20} ${PY - 46}`} fill="#f472b6" />
      <Sparkle x={PX + 18} y={PY - 46} s={4} fill="#facc15" />
    </g>
  )),
];

export const PET_ITEMS: Item[] = [...PETS, ...PET_ACCS, ...PET_TOYS, ...PET_HOMES];
