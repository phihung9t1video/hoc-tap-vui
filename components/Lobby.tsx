"use client";

import { SUBJECTS, subjectsForGrade } from "@/lib/curriculum";
import { dayKey } from "@/lib/rewards";
import type { Profile, Subject } from "@/lib/types";
import { SpinAvatar } from "./Avatar";

function greeting(name: string) {
  const h = new Date().getHours();
  if (h < 11) return `Chào buổi sáng, ${name}! ☀️`;
  if (h < 14) return `Chào buổi trưa, ${name}! 🍚`;
  if (h < 18) return `Chào buổi chiều, ${name}! 🌤️`;
  return `Chào buổi tối, ${name}! 🌙`;
}

export function Lobby({
  profile,
  onPlay,
  onWardrobe,
  onAchievements,
  onHome,
  onSwitch,
}: {
  profile: Profile;
  onPlay: (s: Subject) => void;
  onWardrobe: () => void;
  onAchievements: () => void;
  onHome: () => void;
  onSwitch: () => void;
}) {
  const today = dayKey();
  const todayCount = profile.history.filter((h) => dayKey(new Date(h.at)) === today).length;
  const earned = profile.earnedDay === today ? profile.earnedToday : 0;
  const streakAlive = profile.lastDay === today || profile.lastDay === dayKey(new Date(Date.now() - 86400000));

  return (
    <div className="stack">
      <div className="topbar">
        <div>
          <h2>{profile.name}</h2>
          <span className="muted">Lớp {profile.grade}</span>
        </div>
        <div className="row">
          <span className="pill pill-fire" title="Số ngày học liên tục">🔥 {streakAlive ? profile.streak : 0}</span>
          <span className="pill pill-coin" title="Số xu">⭐ {profile.coins}</span>
        </div>
      </div>

      <div className="stage">
        <SpinAvatar look={profile.look} size={230} className="bounce" />
      </div>

      <div className="center">
        <strong style={{ fontSize: 22 }}>{greeting(profile.name)}</strong>
        <div className="muted" style={{ fontSize: 16 }}>
          {todayCount ? `Hôm nay con đã làm ${todayCount} bài, nhận ${earned} xu. Tuyệt lắm!` : "Hôm nay mình học gì nào?"}
        </div>
      </div>

      <div className="menu">
        <button className="btn" style={{ gridColumn: "1 / -1", background: "linear-gradient(135deg, #fde68a, #fdba74)" }} onClick={onHome}>
          <span className="ico">🏠</span>
          Nhà của {profile.name}
        </button>
        {subjectsForGrade(profile.grade).map((s: Subject) => (
          <button key={s} className="btn" style={{ background: SUBJECTS[s].color, color: "#fff" }} onClick={() => onPlay(s)}>
            <span className="ico">{SUBJECTS[s].icon}</span>
            {SUBJECTS[s].name}
          </button>
        ))}
        <button className="btn btn-gold" onClick={onWardrobe}>
          <span className="ico">👕</span>
          Tủ đồ & Cửa hàng
        </button>
        <button className="btn" style={{ background: "#ffe1d6" }} onClick={onAchievements}>
          <span className="ico">🏆</span>
          Thành tích
        </button>
      </div>

      <div className="center">
        <button className="btn btn-ghost" onClick={onSwitch}>
          ↩ Đổi người chơi
        </button>
      </div>
    </div>
  );
}
