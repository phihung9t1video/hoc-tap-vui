"use client";

import { useEffect, useState } from "react";
import { builtinCounts } from "@/lib/builtin";
import { SUBJECTS, getCourse } from "@/lib/curriculum";
import type { Profile, Subject } from "@/lib/types";

export function ChooseLesson({
  profile,
  subject,
  onStart,
  onBack,
  hasAI,
}: {
  profile: Profile;
  subject: Subject;
  /** source: "kho" = kho đề có sẵn, "ai" = đề mới do AI soạn */
  onStart: (chapterId: string, source: "kho" | "ai") => void;
  hasAI: boolean;
  onBack: () => void;
}) {
  const course = getCourse(profile.grade, subject);
  const info = SUBJECTS[subject];
  const prefix = `${profile.grade}|${subject}|`;
  const wrongCount = Object.values(profile.wrong).filter((k) => k.startsWith(prefix)).length;
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    builtinCounts(profile.grade, subject).then(setCounts);
  }, [profile.grade, subject]);

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
        <button className="chapter" style={{ borderColor: "#ffb59c", background: "#fff4ef" }} onClick={() => onStart("review", "kho")}>
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
          <div key={c.id} className="stack" style={{ gap: 6 }}>
            <button className="chapter" onClick={() => setOpen(open === c.id ? null : c.id)}>
              <span className="num" style={{ background: info.color }}>
                {c.id === "tong-hop" ? "★" : i + 1}
              </span>
              <span style={{ flex: 1 }}>
                <strong>{c.name}</strong>
                <div className="meta">
                  {counts[c.id] ? `📚 ${counts[c.id]} câu có sẵn · ` : ""}
                  {done.length ? `Đã làm ${done.length} bài · Cao nhất ${Math.round(best * 10) / 10} điểm` : "Chưa làm"}
                </div>
              </span>
              {best === 10 && <span title="Đã đạt điểm 10">🏅</span>}
            </button>
            {open === c.id && (
              <div className="row pop" style={{ gap: 8 }}>
                <button className="btn btn-blue" style={{ flex: 1 }} disabled={!counts[c.id]} onClick={() => onStart(c.id, "kho")}>
                  📚 Kho đề có sẵn
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{counts[c.id] ? `${counts[c.id]} câu` : "Đang soạn thêm"}</div>
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={!hasAI} onClick={() => onStart(c.id, "ai")}>
                  ✨ Đề mới AI soạn
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{hasAI ? "Gemini soạn đề mới" : "Cần khóa Gemini"}</div>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
