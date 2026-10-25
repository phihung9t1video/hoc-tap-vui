import { pickBonusItem } from "./rewards";
import type { Profile } from "./types";

/**
 * Bảng xếp hạng tuần: điểm tuần = số xu con kiếm được nhờ học trong tuần (thứ Hai đến Chủ nhật).
 * Sang tuần mới, ba bạn đứng đầu tuần trước được thưởng (mỗi máy tự nhận cho hồ sơ của mình).
 */
export interface WeekStats {
  /** Tuần này (ngày thứ Hai, dạng 2026-10-19) và điểm */
  w: string;
  pts: number;
  /** Tuần trước và điểm */
  pw: string;
  pp: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function weekKey(d = new Date()) {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return `${m.getFullYear()}-${pad(m.getMonth() + 1)}-${pad(m.getDate())}`;
}

export const prevWeekKey = (d = new Date()) => weekKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));

const pointsIn = (p: Profile, week: string) => p.history.reduce((s, h) => s + (weekKey(new Date(h.at)) === week ? h.coins : 0), 0);

export function weekStats(p: Profile, now = new Date()): WeekStats {
  const w = weekKey(now);
  const pw = prevWeekKey(now);
  return { w, pts: pointsIn(p, w), pw, pp: pointsIn(p, pw) };
}

/** Điểm của một tuần theo số liệu đã gửi lên khu phố */
export function pointsOf(s: WeekStats | undefined, week: string) {
  if (!s) return 0;
  return s.w === week ? s.pts : s.pw === week ? s.pp : 0;
}

/** Số ngày còn lại tới lúc tổng kết tuần (hết Chủ nhật) */
export function daysLeft(now = new Date()) {
  return 7 - ((now.getDay() + 6) % 7);
}

export const WEEK_PRIZES = [
  { coins: 500, item: true, label: "500 ⭐ + 1 món đồ Sử thi/Huyền thoại" },
  { coins: 300, item: true, label: "300 ⭐ + 1 món đồ hiếm" },
  { coins: 150, item: false, label: "150 ⭐" },
];

/** Trao thưởng tuần trước cho hạng `rank` (0, 1, 2) */
export function grantWeekPrize(p: Profile, week: string, rank: number): { profile: Profile; itemId?: string } {
  const prize = WEEK_PRIZES[rank];
  const owned = new Set(p.owned);
  const itemId = prize.item ? pickBonusItem(owned) : undefined;
  if (itemId) owned.add(itemId);
  return { profile: { ...p, coins: p.coins + prize.coins, owned: [...owned], weekPrize: week }, itemId };
}
