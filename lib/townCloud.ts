import { cloudEnabled } from "./cloud";
import type { HomeState } from "./home";
import type { Look, Profile } from "./types";
import { weekStats, type WeekStats } from "./weekly";

/**
 * Khu phố chung trên Supabase. Mọi lời gọi đều kèm mã khu phố;
 * máy chủ chỉ cho chủ đất sửa nhà của mình (xem supabase/schema.sql).
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const townOnline = cloudEnabled;

export interface TownPlayer {
  id: string;
  name: string;
  /** Điểm tuần đi kèm trang phục (_wk) để không phải đổi cấu trúc bảng trên máy chủ */
  look: Look & { _wk?: WeekStats };
  coins: number;
}
export interface TownPlot {
  plot: number;
  owner: string;
  house: string | null;
  rooms: HomeState | null;
}
export interface TownState {
  players: TownPlayer[];
  plots: TownPlot[];
}

async function rpc<T>(fn: string, body: object): Promise<T> {
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: KEY!, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`${fn}: ${res.status}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

const CACHE = "hoctap_town_cache_v1";

export function cachedTown(code: string): TownState | null {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE) ?? "null") as { code: string; state: TownState } | null;
    return c?.code === code ? c.state : null;
  } catch {
    return null;
  }
}

export async function fetchTown(code: string): Promise<TownState | null> {
  if (!townOnline) return null;
  try {
    const s = await rpc<TownState>("town_state", { p_town: code });
    const state = { players: s?.players ?? [], plots: s?.plots ?? [] };
    try {
      localStorage.setItem(CACHE, JSON.stringify({ code, state }));
    } catch {
      // bỏ qua
    }
    return state;
  } catch {
    return null;
  }
}

/** Tổng xu con đã kiếm được từ trước tới nay (để xếp hạng chăm chỉ) */
export const totalEarned = (p: Profile) => p.history.reduce((s, h) => s + h.coins, 0);

export async function joinTown(code: string, p: Profile) {
  if (!townOnline) return;
  try {
    await rpc("town_join", { p_town: code, p_id: p.id, p_name: p.name, p_look: { ...p.look, _wk: weekStats(p) }, p_coins: totalEarned(p) });
  } catch {
    // mất mạng: lần sau thử lại
  }
}

/** true: mua được; false: đã có người mua hoặc con đã có đất; null: không kết nối được */
export async function claimPlot(code: string, plot: number, owner: string): Promise<boolean | null> {
  if (!townOnline) return null;
  try {
    return await rpc<boolean>("town_claim", { p_town: code, p_plot: plot, p_owner: owner });
  } catch {
    return null;
  }
}

export async function saveHouse(code: string, plot: number, owner: string, house: string, rooms: HomeState) {
  if (!townOnline) return false;
  try {
    return await rpc<boolean>("town_save_house", { p_town: code, p_plot: plot, p_owner: owner, p_house: house, p_rooms: rooms });
  } catch {
    return false;
  }
}
