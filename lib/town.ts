import type { RoomId } from "./home";
import type { Slot } from "./types";

/**
 * Cả app dùng chung MỘT khu phố. Bản đồ là lưới các dãy phố (block) ngăn bởi
 * đường kẻ ô bàn cờ, block ở giữa là công viên, mỗi block còn lại có 4 mảnh đất 3×3 ô.
 * Hết đất thì khu phố tự nở thêm một vòng block bao quanh; số của mảnh đất
 * không đổi khi mở rộng (đánh số từ trong ra ngoài theo từng vòng).
 */
export const TOWN = "KHU-PHO-CHUNG";
export const BLOCK = 7;
export const ROAD = 2;
export const PLOT = 3;
/** Còn ít hơn chừng này mảnh trống thì mở rộng thêm một vòng */
const MIN_FREE = 16;

export interface PlotInfo {
  id: number;
  x: number;
  y: number;
  price: number;
  /** Đất cạnh công viên (đẹp, đắt hơn) */
  prime: boolean;
}

// ---------- Cửa hàng quanh công viên: mỗi shop bán một loại hàng ----------

export interface Shop {
  id: string;
  name: string;
  icon: string;
  /** Màu mái hiên, biển hiệu */
  color: string;
  greet: string;
  /** Đồ nhân vật, thú cưng theo ô trang phục */
  slots?: Slot[];
  /** Đồ trong nhà theo nhóm HOME_CATS */
  cats?: string[];
}

export const SHOPS: Shop[] = [
  { id: "thoitrang", name: "Thời trang", icon: "👕", color: "#ec4899", greet: "Áo, quần, váy, giày đủ kiểu! Con vào phòng thử đồ nhé.", slots: ["shirt", "pants", "shoes"] },
  { id: "noithat", name: "Nội thất", icon: "🛋️", color: "#0ea5e9", greet: "Sofa, giường, tủ, bàn ghế cho ngôi nhà của con.", cats: ["noithat"] },
  { id: "thucung", name: "Thú cưng", icon: "🐾", color: "#f97316", greet: "Các bạn thú cưng đang chờ con đón về nhà!", slots: ["pet", "petAcc", "petToy", "petHome"] },
  { id: "nhasach", name: "Nhà sách", icon: "📚", color: "#16a34a", greet: "Bàn học, giá sách, đồ dùng học tập.", cats: ["hoctap"] },
  { id: "lamdep", name: "Tiệm làm đẹp", icon: "💇", color: "#a855f7", greet: "Cắt tóc, nhuộm tóc, đổi kiểu mắt, nụ cười.", slots: ["hair", "hairColor", "eyes", "mouth", "skin"] },
  { id: "dochoi", name: "Đồ chơi", icon: "🧸", color: "#ef4444", greet: "Gấu bông, xe, bóng, cầu trượt và nhiều nữa!", cats: ["vuichoi"] },
  { id: "phukien", name: "Phụ kiện", icon: "🎩", color: "#d97706", greet: "Mũ, kính, cánh và balo thật ngầu.", slots: ["hat", "glasses", "back"] },
  { id: "trangtri", name: "Trang trí", icon: "🪴", color: "#0d9488", greet: "Cây cảnh, tranh treo tường, đèn xinh.", cats: ["trangtri", "treotuong"] },
  { id: "bep", name: "Bếp & Phòng tắm", icon: "🍳", color: "#475569", greet: "Tủ lạnh, bếp, bồn tắm, gương soi.", cats: ["bep", "vesinh"] },
  { id: "sonsan", name: "Sơn & Sàn", icon: "🎨", color: "#7c3aed", greet: "Giấy dán tường và sàn nhà đủ màu sắc.", cats: ["tuong", "san"] },
];
export const SHOP_MAP = Object.fromEntries(SHOPS.map((s) => [s.id, s]));

/** Số mảnh đất của bản đồ có `rings` vòng block quanh công viên */
const plotCount = (rings: number) => 4 * ((2 * rings + 1) ** 2 - 1);

/** Số vòng cần có: đủ chỗ cho mọi mảnh đã mua và còn dư đất trống */
export function ringsFor(owned: number, maxPlotId = -1) {
  let r = 2;
  while (plotCount(r) - SHOPS.length - owned < MIN_FREE || plotCount(r) <= maxPlotId) r++;
  return r;
}

export interface TownLayout {
  rings: number;
  blocks: number;
  mapN: number;
  center: number;
  blockStart: (i: number) => number;
  plots: PlotInfo[];
  park: { x: number; y: number; size: number };
  /** Chỗ xuất hiện của nhân vật khi chưa có nhà: ngã tư cạnh công viên */
  spawn: [number, number];
  /** Mảnh đất dành cho cửa hàng (không bán) */
  shopAt: Map<number, Shop>;
}

const layouts = new Map<number, TownLayout>();

export function townLayout(rings: number): TownLayout {
  const cached = layouts.get(rings);
  if (cached) return cached;
  const blocks = 2 * rings + 1;
  const center = rings;
  const blockStart = (i: number) => ROAD + i * (BLOCK + ROAD);
  const plots: PlotInfo[] = [];
  for (let r = 1; r <= rings; r++) {
    // Các block của vòng r, đi vòng quanh công viên
    const ring: [number, number][] = [];
    for (let dx = -r; dx <= r; dx++) ring.push([dx, -r]);
    for (let dy = -r + 1; dy <= r; dy++) ring.push([r, dy]);
    for (let dx = r - 1; dx >= -r; dx--) ring.push([dx, r]);
    for (let dy = r - 1; dy > -r; dy--) ring.push([-r, dy]);
    for (const [dx, dy] of ring)
      for (const [ox, oy] of [[0, 0], [4, 0], [0, 4], [4, 4]])
        plots.push({ id: plots.length, x: blockStart(center + dx) + ox, y: blockStart(center + dy) + oy, price: r === 1 ? 500 : 300, prime: r === 1 });
  }
  // Các shop chiếm những mảnh gần công viên nhất (vị trí không đổi khi khu phố mở rộng)
  const parkC = blockStart(center) + BLOCK / 2;
  const near = plots
    .filter((p) => p.prime)
    .map((p) => ({ id: p.id, d: Math.hypot(p.x + 1.5 - parkC, p.y + 1.5 - parkC) }))
    .sort((a, b) => a.d - b.d || a.id - b.id);
  const shopAt = new Map(SHOPS.map((s, i) => [near[i].id, s] as [number, Shop]));
  const layout: TownLayout = {
    shopAt,
    rings,
    blocks,
    mapN: ROAD + blocks * (BLOCK + ROAD),
    center,
    blockStart,
    plots,
    park: { x: blockStart(center), y: blockStart(center), size: BLOCK },
    spawn: [blockStart(center) - 1, blockStart(center) + BLOCK + 0.5],
  };
  layouts.set(rings, layout);
  return layout;
}

// ---------- Kiểu nhà ----------

export interface HouseTier {
  id: string;
  name: string;
  price: number;
  rooms: RoomId[];
  icon: string;
}

export const HOUSE_TIERS: HouseTier[] = [
  { id: "cap4", name: "Nhà cấp 4", price: 300, rooms: ["khach", "ngu"], icon: "🏠" },
  { id: "nhaong", name: "Nhà ống 2 tầng", price: 800, rooms: ["khach", "ngu", "bep", "vesinh"], icon: "🏢" },
  { id: "nhavuon", name: "Nhà vườn", price: 1600, rooms: ["khach", "ngu", "bep", "vesinh", "hoc"], icon: "🏡" },
  { id: "bietthu", name: "Biệt thự có bể bơi", price: 3200, rooms: ["khach", "ngu", "bep", "vesinh", "hoc", "choi"], icon: "🏰" },
  { id: "laudai", name: "Lâu đài", price: 6000, rooms: ["khach", "ngu", "bep", "vesinh", "hoc", "choi"], icon: "👑" },
];

export const TIER_MAP = Object.fromEntries(HOUSE_TIERS.map((t) => [t.id, t]));

/** Màu tường nhà con được chọn khi xây */
export const HOUSE_COLORS = [
  { id: "kem", name: "Kem", wall: "#fde68a", roof: "#dc2626" },
  { id: "xanh", name: "Xanh trời", wall: "#bfdbfe", roof: "#2563eb" },
  { id: "hong", name: "Hồng", wall: "#fbcfe8", roof: "#db2777" },
  { id: "la", name: "Xanh lá", wall: "#bbf7d0", roof: "#16a34a" },
  { id: "tim", name: "Tím", wall: "#ddd6fe", roof: "#7c3aed" },
  { id: "cam", name: "Cam", wall: "#fed7aa", roof: "#ea580c" },
  { id: "trang", name: "Trắng", wall: "#f8fafc", roof: "#475569" },
];
export const COLOR_MAP = Object.fromEntries(HOUSE_COLORS.map((c) => [c.id, c]));

/** Giá khi nâng cấp: chỉ trả phần chênh lệch */
export function upgradeCost(from: string | undefined, to: string) {
  return Math.max(0, TIER_MAP[to].price - (from ? TIER_MAP[from]?.price ?? 0 : 0));
}

/** Nhà lưu trên mây dạng "kiểu:màu", ví dụ "bietthu:hong" */
export const encodeHouse = (tier: string, color: string) => `${tier}:${color}`;
export function decodeHouse(s?: string | null) {
  if (!s) return undefined;
  const [tier, color] = s.split(":");
  return TIER_MAP[tier] ? { tier, color: COLOR_MAP[color] ? color : "kem" } : undefined;
}
