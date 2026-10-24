"use client";

import { ACHIEVEMENTS } from "@/lib/achievements";
import { ITEM_MAP } from "@/lib/items";
import type { Profile } from "@/lib/types";

export function Achievements({ profile, onBack }: { profile: Profile; onBack: () => void }) {
  const done = new Set(profile.achievements);
  return (
    <div className="stack">
      <div className="topbar">
        <button className="btn" onClick={onBack}>
          ← Sảnh
        </button>
        <span className="pill">
          🏆 {done.size}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <h1>Thành tích của {profile.name}</h1>
      <div className="muted">
        Đã làm {profile.history.length} bài · Chuỗi dài nhất {profile.bestStreak} ngày
      </div>
      {ACHIEVEMENTS.map((a) => (
        <div key={a.id} className={`card ach ${done.has(a.id) ? "" : "locked"}`}>
          <span className="ico">{done.has(a.id) ? a.icon : "🔒"}</span>
          <div style={{ flex: 1 }}>
            <strong>{a.name}</strong>
            <div className="muted">{a.desc}</div>
            <div style={{ fontSize: 15 }}>
              Thưởng: {a.item ? `🎁 ${ITEM_MAP[a.item]?.name}` : `⭐ ${a.coins} xu`}
            </div>
          </div>
          {done.has(a.id) && <span style={{ fontSize: 26 }}>✅</span>}
        </div>
      ))}
    </div>
  );
}
