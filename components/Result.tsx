"use client";

import { useMemo, useState } from "react";
import { HOME_MAP } from "@/lib/home";
import { ITEM_MAP, RARITY } from "@/lib/items";
import type { QuizOutcome } from "@/lib/rewards";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";
import { HomeThumb } from "./Room";

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2 + Math.random() * 2,
        color: ["#ff7a59", "#ffd23f", "#3bceac", "#5aa9ff", "#c084fc", "#ff8fc1"][i % 6],
      })),
    [],
  );
  return (
    <div className="confetti" aria-hidden>
      {bits.map((b, i) => (
        <i key={i} style={{ left: `${b.left}%`, background: b.color, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
      ))}
    </div>
  );
}

function scoreMessage(score: number) {
  if (score === 10) return "Hoàn hảo! Con là siêu sao! 🌟";
  if (score >= 8) return "Giỏi lắm! Sắp được điểm 10 rồi! 👏";
  if (score >= 5) return "Khá lắm! Cố thêm chút nữa nhé! 💪";
  return "Không sao cả, ôn lại câu sai rồi thử lại nhé! 🤗";
}

function NewItem({ id, profile, onWear }: { id: string; profile: Profile; onWear: (id: string) => void }) {
  const home = HOME_MAP[id];
  if (home) {
    return (
      <div className={`card center pop stack r-${home.rarity}`} style={{ alignItems: "center" }}>
        <HomeThumb item={home} size={130} />
        <div>
          <strong style={{ fontSize: 20 }}>{home.name}</strong>{" "}
          <span className="rarity" style={{ background: RARITY[home.rarity].color }}>
            {RARITY[home.rarity].label}
          </span>
        </div>
        <button className="btn btn-gold" onClick={() => onWear(id)}>
          🏠 Mang về nhà
        </button>
      </div>
    );
  }
  const item = ITEM_MAP[id];
  const worn = profile.look[item.slot] === id;
  return (
    <div className={`card center pop stack r-${item.rarity}`} style={{ alignItems: "center", borderColor: RARITY[item.rarity].color }}>
      <Avatar look={{ ...profile.look, [item.slot]: id }} size={140} />
      <div>
        <strong style={{ fontSize: 20 }}>{item.name}</strong>{" "}
        <span className="rarity" style={{ background: RARITY[item.rarity].color }}>
          {RARITY[item.rarity].label}
        </span>
      </div>
      <button className="btn btn-gold" disabled={worn} onClick={() => onWear(id)}>
        {worn ? "✔ Đã mặc" : "Mặc ngay"}
      </button>
    </div>
  );
}

export function Result({
  outcome,
  profile,
  onAgain,
  onHome,
  onWear,
}: {
  outcome: QuizOutcome;
  profile: Profile;
  onAgain: () => void;
  onHome: () => void;
  onWear: (itemId: string) => void;
}) {
  const [opened, setOpened] = useState(false);
  const stars = outcome.score === 10 ? 3 : outcome.score >= 8 ? 2 : outcome.score >= 5 ? 1 : 0;
  const hasChest = !!(outcome.chestItemId || outcome.chestCoins);

  return (
    <div className="stack">
      {outcome.score >= 8 && <Confetti />}

      <div className="card center stack" style={{ alignItems: "center" }}>
        <div style={{ fontSize: 40, letterSpacing: 4 }}>{"★".repeat(stars) + "☆".repeat(3 - stars)}</div>
        <div className="score">{outcome.score}</div>
        <div className="muted">
          Đúng {outcome.correct}/{outcome.total} câu
        </div>
        <strong style={{ fontSize: 20 }}>{scoreMessage(outcome.score)}</strong>
        <Avatar look={profile.look} size={150} className={outcome.score >= 8 ? "jump" : "bounce"} />
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 6 }}>Phần thưởng</h3>
        {outcome.lines.map((l, i) => (
          <div className="reward-line" key={i}>
            <span>{l.label}</span>
            <strong>+{l.coins} ⭐</strong>
          </div>
        ))}
        <div className="reward-line" style={{ fontSize: 22 }}>
          <strong>Tổng nhận</strong>
          <strong style={{ color: "#b7791f" }}>+{outcome.coins} ⭐</strong>
        </div>
        {outcome.tooFast && <div className="banner" style={{ marginTop: 8 }}>⏱️ Con bấm nhanh quá! Đọc kỹ đề rồi mới chọn để nhận đủ thưởng nhé.</div>}
        {outcome.capped && <div className="banner" style={{ marginTop: 8 }}>🌙 Hôm nay con đã nhận đủ số xu tối đa rồi. Mai học tiếp để nhận thêm nhé!</div>}
      </div>

      {hasChest && (
        <div className="card center stack" style={{ alignItems: "center", background: "#fff8e1" }}>
          <h3>🎁 Rương quà điểm 10!</h3>
          {!opened ? (
            <>
              <span className="chest">🎁</span>
              <button className="btn btn-gold btn-big" onClick={() => setOpened(true)}>
                Mở rương!
              </button>
            </>
          ) : outcome.chestItemId ? (
            <NewItem id={outcome.chestItemId} profile={profile} onWear={onWear} />
          ) : (
            <strong className="pop" style={{ fontSize: 24 }}>
              Con đã có hết đồ trong rương! Nhận +{outcome.chestCoins} ⭐
            </strong>
          )}
        </div>
      )}

      {outcome.newAchievements.map((a) => (
        <div key={a.id} className="card stack pop" style={{ background: "#fff1ec", alignItems: "center" }}>
          <div className="ach">
            <span className="ico">{a.icon}</span>
            <div>
              <strong>Thành tích mới: {a.name}</strong>
              <div className="muted">{a.desc}</div>
              {a.coins && <div>Thưởng +{a.coins} ⭐</div>}
            </div>
          </div>
          {a.item && <NewItem id={a.item} profile={profile} onWear={onWear} />}
        </div>
      ))}

      <div className="row">
        <button className="btn btn-big" onClick={onHome}>
          🏠 Về sảnh
        </button>
        <button className="btn btn-primary btn-big" onClick={onAgain}>
          Làm bài nữa →
        </button>
      </div>
    </div>
  );
}
