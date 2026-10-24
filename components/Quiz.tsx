"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isBuiltinId, reportBuiltin } from "@/lib/builtin";
import { reportCloudQuestion } from "@/lib/cloud";
import { reportQuestion } from "@/lib/storage";
import type { AnswerLog, Profile, QuizItem } from "@/lib/types";

const PRAISE = ["Chính xác! 🎉", "Giỏi quá! 🌟", "Đúng rồi! 👏", "Tuyệt vời! 💯", "Xuất sắc! 🚀"];
const KEYS = ["A", "B", "C", "D"];

export function Quiz({
  profile,
  items: initial,
  title,
  demo,
  notice,
  onFinish,
  onQuit,
}: {
  profile: Profile;
  items: QuizItem[];
  title: string;
  demo: boolean;
  notice?: string;
  onFinish: (answers: AnswerLog[]) => void;
  onQuit: () => void;
}) {
  const [items, setItems] = useState(initial);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [logs, setLogs] = useState<AnswerLog[]>([]);
  const [quitAsk, setQuitAsk] = useState(false);
  const [praise, setPraise] = useState(PRAISE[0]);
  const startRef = useRef(Date.now());

  const q = items[idx];

  const pick = useCallback(
    (i: number) => {
      if (picked !== null || !q) return;
      const correct = i === q.answerIndex;
      setPicked(i);
      setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      setLogs((l) => [...l, { qid: q.id, bankKey: q.bankKey, correct, ms: Date.now() - startRef.current, seenBefore: !!profile.seen[q.id] }]);
    },
    [picked, q, profile.seen],
  );

  const next = useCallback(() => {
    if (idx + 1 >= items.length) {
      onFinish(logs);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
    startRef.current = Date.now();
  }, [idx, items.length, logs, onFinish]);

  function report() {
    if (!q) return;
    if (isBuiltinId(q.id)) reportBuiltin(q.id);
    else if (!demo) {
      reportQuestion(q.bankKey, q.id);
      void reportCloudQuestion(q.id);
    }
    const rest = items.filter((x) => x.id !== q.id);
    const restLogs = logs.filter((l) => l.qid !== q.id);
    setLogs(restLogs);
    setPicked(null);
    startRef.current = Date.now();
    if (idx >= rest.length) {
      if (restLogs.length) onFinish(restLogs);
      else onQuit();
      return;
    }
    setItems(rest);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const n = "1234".indexOf(e.key) >= 0 ? Number(e.key) - 1 : "abcd".indexOf(e.key.toLowerCase());
      if (picked === null && n >= 0 && n < 4) pick(n);
      else if (picked !== null && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pick, next, picked]);

  if (!q) return null;
  const correct = picked !== null && picked === q.answerIndex;

  return (
    <div className="stack">
      <div className="row">
        <button className="btn" aria-label="Thoát bài" onClick={() => setQuitAsk(true)}>
          ✕
        </button>
        <div className="progress" aria-label="Tiến độ">
          <div style={{ width: `${((idx + (picked !== null ? 1 : 0)) / items.length) * 100}%` }} />
        </div>
        <strong>
          {idx + 1}/{items.length}
        </strong>
      </div>

      <div className="muted" style={{ fontSize: 15 }}>
        {title}
      </div>
      {demo && <div className="banner">🧪 Chế độ thử: chưa cài khóa Gemini nên đang dùng đề mẫu.</div>}
      {notice && <div className="banner">{notice}</div>}

      {quitAsk && (
        <div className="card pop">
          <p style={{ marginTop: 0 }}>Con muốn dừng bài này? Bài làm dở sẽ không được tính xu.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => setQuitAsk(false)}>
              Làm tiếp
            </button>
            <button className="btn" onClick={onQuit}>
              Dừng lại
            </button>
          </div>
        </div>
      )}

      <div className="card question">{q.question}</div>

      <div className="options">
        {q.options.map((o, i) => {
          const cls = picked === null ? "" : i === q.answerIndex ? "correct" : i === picked ? "wrong" : "";
          return (
            <button key={i} className={`option ${cls}`} disabled={picked !== null && cls === ""} onClick={() => pick(i)}>
              <span className="key">{KEYS[i]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className={`feedback pop ${correct ? "ok" : "no"}`}>
          {correct ? (
            <>
              <strong>{praise}</strong>
              <details style={{ marginTop: 4 }}>
                <summary style={{ cursor: "pointer", color: "var(--ink-2)" }}>Xem lời giải</summary>
                <div style={{ marginTop: 4 }}>{q.explanation}</div>
              </details>
            </>
          ) : (
            <>
              <strong>Chưa đúng rồi, không sao cả! 💪</strong>
              <div className="guide">
                <div className="guide-title">💡 Hướng dẫn</div>
                <div>
                  Đáp án đúng là <strong>{KEYS[q.answerIndex]}: {q.options[q.answerIndex]}</strong>
                </div>
                <div style={{ marginTop: 4 }}>{q.explanation}</div>
              </div>
            </>
          )}
        </div>
      )}

      {picked !== null && (
        <button className="btn btn-primary btn-big" onClick={next}>
          {idx + 1 >= items.length ? "Xem kết quả 🎁" : "Câu tiếp theo →"}
        </button>
      )}

      <div className="center">
        <button className="btn btn-ghost" style={{ fontSize: 14 }} onClick={report}>
          🚩 Câu này bị sai đề? Báo và bỏ qua
        </button>
      </div>
    </div>
  );
}
