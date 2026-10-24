"use client";

import { useState } from "react";
import { GRADES } from "@/lib/curriculum";
import { STARTER_IDS, defaultLook } from "@/lib/items";
import type { Gender, Look } from "@/lib/types";
import { AvatarEditor } from "./AvatarEditor";

const STARTERS = new Set(STARTER_IDS);

export function CreateProfile({
  onDone,
  onCancel,
}: {
  onDone: (p: { name: string; grade: number; gender: Gender; look: Look }) => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [look, setLook] = useState<Look>(defaultLook("nam"));

  const ready = name.trim().length > 0 && grade !== null && gender !== null;

  if (step === 1) {
    return (
      <div className="stack">
        <div className="topbar">
          {onCancel ? (
            <button className="btn" onClick={onCancel}>
              ← Quay lại
            </button>
          ) : (
            <span />
          )}
          <span className="muted">Bước 1/2</span>
        </div>
        <h1 className="center">Con tên là gì?</h1>

        <div className="card stack">
          <label className="stack" style={{ gap: 6 }}>
            <strong>Tên hoặc biệt danh</strong>
            <input className="input" maxLength={16} value={name} placeholder="Ví dụ: Bin, Na, Sóc..." onChange={(e) => setName(e.target.value)} />
          </label>

          <div className="stack" style={{ gap: 6 }}>
            <strong>Con học lớp mấy?</strong>
            <div className="choice-grid">
              {GRADES.map((g) => (
                <button key={g} className={`choice ${grade === g ? "on" : ""}`} onClick={() => setGrade(g)}>
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <strong>Nhân vật của con là</strong>
            <div className="choice-grid">
              {(["nam", "nu"] as Gender[]).map((g) => (
                <button
                  key={g}
                  className={`choice ${gender === g ? "on" : ""}`}
                  onClick={() => {
                    setGender(g);
                    setLook(defaultLook(g));
                  }}
                >
                  {g === "nam" ? "👦 Bạn nam" : "👧 Bạn nữ"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-big" disabled={!ready} onClick={() => setStep(2)}>
          Tiếp theo: Phối đồ →
        </button>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="topbar">
        <button className="btn" onClick={() => setStep(1)}>
          ← Quay lại
        </button>
        <span className="muted">Bước 2/2</span>
      </div>
      <h1 className="center">Phối đồ cho {name.trim()}</h1>
      <p className="center muted" style={{ margin: 0 }}>
        Đồ có 🔒 sẽ mở khi con làm bài kiếm xu nhé!
      </p>

      <AvatarEditor look={look} owned={STARTERS} coins={0} shop={false} onChange={setLook} />

      <button className="btn btn-primary btn-big" onClick={() => onDone({ name: name.trim(), grade: grade!, gender: gender!, look })}>
        Xong! Bắt đầu học 🚀
      </button>
    </div>
  );
}
