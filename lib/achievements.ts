import type { Profile } from "./types";

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  coins?: number;
  item?: string;
  check: (p: Profile) => boolean;
}

const perfectCount = (p: Profile, subject: string) => p.history.filter((h) => h.subject === subject && h.perfect).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: "bai_dau_tien", name: "Bước đầu tiên", desc: "Hoàn thành bài đầu tiên", icon: "🌱", coins: 50, check: (p) => p.history.length >= 1 },
  { id: "diem10_dau", name: "Điểm 10 đầu tiên", desc: "Đạt điểm 10 lần đầu tiên", icon: "⭐", item: "kinh_sao", check: (p) => p.history.some((h) => h.perfect) },
  { id: "chuoi_3", name: "Khởi động", desc: "Học 3 ngày liên tục", icon: "🔥", coins: 60, check: (p) => p.bestStreak >= 3 },
  { id: "chuoi_7", name: "Chăm chỉ 7 ngày", desc: "Học 7 ngày liên tục", icon: "🎓", item: "mu_tot_nghiep", check: (p) => p.bestStreak >= 7 },
  { id: "toan_10", name: "Nhà Toán học", desc: "10 bài Toán đạt điểm 10", icon: "📐", item: "ao_toan", check: (p) => perfectCount(p, "toan") >= 10 },
  { id: "anh_10", name: "Siêu sao Tiếng Anh", desc: "10 bài Tiếng Anh đạt điểm 10", icon: "🔤", item: "ao_abc", check: (p) => perfectCount(p, "tienganh") >= 10 },
  { id: "bai_20", name: "Học trò chăm ngoan", desc: "Hoàn thành 20 bài", icon: "📚", coins: 150, check: (p) => p.history.length >= 20 },
  { id: "bai_50", name: "Chiến binh học tập", desc: "Hoàn thành 50 bài", icon: "🏅", item: "pet_khung_long", check: (p) => p.history.length >= 50 },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
