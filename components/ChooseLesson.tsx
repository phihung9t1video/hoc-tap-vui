"use client";

import { SUBJECTS, getCourse } from "@/lib/curriculum";
import type { Profile, Subject } from "@/lib/types";

export function ChooseLesson({
  profile,
  subject,
  onStart,
  onBack,
}: {
  profile: Profile;
  subject: Subject;
  onStart: (chapterId: string) => void;
  onBack: () => void;
}) {
  const course = getCourse(profile.grade, subject);
  const info = SUBJECTS[subject];
  const prefix = `${profile.grade}|${subject}|`;
  const wrongCount = Object.values(profile.wrong).filter((k) => k.startsWith(prefix)).length;

  return (
    <div className="stack">
      <div className="topbar">
        <button className="btn" onClick={onBack}>
          ← Sảnh
        </button>
        <span className="pill pill-coin">⭐ {profile.coins}</span>
      </div>
      <div>
        <h1>
          {info.icon} {info.name} lớp {profile.grade}
        </h1>
        <div className="muted" style={{ fontSize: 15 }}>
          {course?.book}
        </div>
      </div>

      {wrongCount > 0 && (
        <button className="chapter" style={{ borderColor: "#ffb59c", background: "#fff4ef" }} onClick={() => onStart("review")}>
          <span className="num" style={{ background: "var(--primary)" }}>
            🔁
          </span>
          <span>
            <strong>Ôn lại câu sai ({wrongCount} câu)</strong>
            <div className="meta">Sửa đúng câu từng sai được thưởng xu Tiến bộ!</div>
          </span>
        </button>
      )}

      {!course && <div className="error">Chưa có chương trình môn này cho lớp {profile.grade}.</div>}

      {course?.chapters.map((c, i) => {
        const done = profile.history.filter((h) => h.subject === subject && h.chapterId === c.id);
        const best = done.reduce((m, h) => Math.max(m, h.total ? (h.correct / h.total) * 10 : 0), 0);
        return (
          <button key={c.id} className="chapter" onClick={() => onStart(c.id)}>
            <span className="num" style={{ background: info.color }}>
              {c.id === "tong-hop" ? "★" : i + 1}
            </span>
            <span style={{ flex: 1 }}>
              <strong>{c.name}</strong>
              <div className="meta">{done.length ? `Đã làm ${done.length} bài · Cao nhất ${Math.round(best * 10) / 10} điểm` : "Chưa làm"}</div>
            </span>
            {best === 10 && <span title="Đã đạt điểm 10">🏅</span>}
          </button>
        );
      })}
    </div>
  );
}
