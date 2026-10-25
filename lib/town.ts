import type { RoomId } from "./home";

/**
 * Bản đồ khu phố: lưới các dãy phố (block) ngăn bởi đường kẻ ô bàn cờ.
 * Block ở giữa là công viên; mỗi block còn lại có 4 mảnh đất 3×3 ô.
 */
export const BLOCKS = 5;
export const BLOCK = 7;
export const ROAD = 2;
export const PLOT = 3;
export const MAP_N = ROAD + BLOCKS * (BLOCK + ROAD);
const CENTER = Math.floor(BLOCKS / 2);

export const blockStart = (i: number) => ROAD + i * (BLOCK + ROAD);

export interface PlotInfo {
  id: number;
  x: number;
  y: number;
  price: number;
  /** Đất cạnh công viên (đẹp, đắt hơn) */
  prime: boolean;
}

export const PLOTS: PlotInfo[] = (() => {
  const list: PlotInfo[] = [];
  for (let by = 0; by < BLOCKS; by++)
    for (let bx = 0; bx < BLOCKS; bx++) {
      if (bx === CENTER && by === CENTER) continue;
      const prime = Math.max(Math.abs(bx - CENTER), Math.abs(by - CENTER)) === 1;
      for (const [ox, oy] of [[0, 0], [4, 0], [0, 4], [4, 4]]) {
        list.push({ id: list.length, x: blockStart(bx) + ox, y: blockStart(by) + oy, price: prime ? 500 : 300, prime });
      }
    }
  return list;
})();

/** Ô xuất hiện của nhân vật khi chưa có nhà: ngã tư cạnh công viên */
export const SPAWN: [number, number] = [blockStart(CENTER) - 1, blockStart(CENTER) + BLOCK + 0.5];
export const PARK = { x: blockStart(CENTER), y: blockStart(CENTER), size: BLOCK };

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

// ---------- Mã khu phố ----------

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newTownCode() {
  const pick = () => ALPHA[Math.floor(Math.random() * ALPHA.length)];
  return `KP-${Array.from({ length: 4 }, pick).join("")}-${Array.from({ length: 4 }, pick).join("")}`;
}
export const normalizeTownCode = (s: string) => s.trim().toUpperCase().replace(/\s+/g, "");
