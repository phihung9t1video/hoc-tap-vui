"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";

export function Profiles({
  profiles,
  onPick,
  onCreate,
  onDelete,
  onSettings,
}: {
  profiles: Profile[];
  onPick: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onSettings: () => void;
}) {
  const [manage, setManage] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirming = profiles.find((p) => p.id === confirmId);

  return (
    <div className="stack">
      <div className="center" style={{ padding: "12px 0 4px" }}>
        <h1>🌟 Học Tập Vui 🌟</h1>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          {profiles.length ? "Ai đang học hôm nay?" : "Chào con! Cùng tạo nhân vật của mình nào!"}
        </p>
      </div>

      <div className="profiles">
        {profiles.map((p) => (
          <button key={p.id} className="profile-card" onClick={() => (manage ? setConfirmId(p.id) : onPick(p.id))}>
            <Avatar look={p.look} size={110} crop="head" />
            <strong style={{ fontSize: 20 }}>{p.name}</strong>
            <span className="muted">Lớp {p.grade}</span>
            <span className="pill pill-coin">⭐ {p.coins}</span>
            {manage && <span className="del pill" style={{ background: "#ffeceb" }}>🗑️</span>}
          </button>
        ))}
        {!manage && (
          <button className="profile-card add" onClick={onCreate}>
            <span style={{ fontSize: 44 }}>➕</span>
            Thêm bạn mới
          </button>
        )}
      </div>

      {confirming && (
        <div className="card pop">
          <p style={{ marginTop: 0 }}>
            Xóa hồ sơ <strong>{confirming.name}</strong>? Toàn bộ xu, đồ và lịch sử học sẽ mất.
          </p>
          <div className="row">
            <button className="btn" onClick={() => setConfirmId(null)}>
              Không xóa
            </button>
            <button
              className="btn"
              style={{ background: "var(--red)", color: "#fff" }}
              onClick={() => {
                onDelete(confirming.id);
                setConfirmId(null);
              }}
            >
              Xóa hồ sơ
            </button>
          </div>
        </div>
      )}

      {profiles.length > 0 && (
        <div className="center">
          <button className="btn-ghost btn" onClick={() => { setManage(!manage); setConfirmId(null); }}>
            {manage ? "✔ Xong" : "🗂️ Quản lý hồ sơ"}
          </button>
          <button className="btn-ghost btn" onClick={onSettings}>
            ⚙️ Cài đặt (bố mẹ)
          </button>
        </div>
      )}
    </div>
  );
}
