"use client";

import { useState } from "react";
import { cloudEnabled } from "@/lib/cloud";
import { checkKey, parseKeys } from "@/lib/gemini";
import type { Settings } from "@/lib/types";
import { APP_VERSION, UPDATES_DISABLED } from "@/lib/updater";

const mask = (k: string) => `${k.slice(0, 6)}…${k.slice(-4)}`;

export function ParentSettings({
  settings,
  firstRun,
  onSave,
  onClose,
  onCheckUpdate,
}: {
  settings: Settings;
  firstRun: boolean;
  onSave: (s: Settings) => void;
  onClose?: () => void;
  onCheckUpdate?: () => void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [cap, setCap] = useState(settings.dailyCap);
  const keys = settings.geminiKeys ?? [];

  async function saveKeys() {
    const found = parseKeys(text);
    if (!found.length) return setMsg({ ok: false, text: "Không thấy khóa nào. Khóa Gemini thường bắt đầu bằng AIza… hoặc AQ.…" });
    setBusy(true);
    setMsg(null);
    const checks = await Promise.all(found.map(checkKey));
    setBusy(false);
    const good = found.filter((_, i) => checks[i]);
    if (!good.length) return setMsg({ ok: false, text: "Khóa chưa dùng được. Kiểm tra lại khóa hoặc kết nối mạng nhé." });
    onSave({ ...settings, geminiKeys: [...new Set([...good, ...keys])], setupDone: true });
    setText("");
    setMsg({ ok: true, text: `Đã lưu ${good.length} khóa dùng được${good.length < found.length ? `, bỏ ${found.length - good.length} khóa lỗi` : ""}.` });
  }

  return (
    <div className="stack">
      <div className="topbar">
        {onClose ? (
          <button className="btn" onClick={onClose}>
            ← Quay lại
          </button>
        ) : (
          <span />
        )}
        <span className="muted">Phiên bản {APP_VERSION}</span>
      </div>

      <h1>{firstRun ? "👋 Chào bố mẹ!" : "⚙️ Cài đặt"}</h1>
      {firstRun && (
        <p className="muted" style={{ margin: 0 }}>
          App dùng AI Gemini (miễn phí) để soạn đề theo đúng lớp, môn, chương của con. Bố mẹ nhập khóa Gemini một lần, khóa chỉ lưu trên máy này.
        </p>
      )}

      <div className="card stack">
        <strong>🔑 Khóa Gemini</strong>
        {keys.length > 0 && (
          <div className="stack" style={{ gap: 6 }}>
            {keys.map((k, i) => (
              <div key={k} className="row between">
                <code>
                  {i === 0 ? "Chính" : `Dự phòng ${i}`}: {mask(k)}
                </code>
                <button className="btn btn-ghost" onClick={() => onSave({ ...settings, geminiKeys: keys.filter((x) => x !== k) })}>
                  Xóa
                </button>
              </div>
            ))}
          </div>
        )}
        <textarea
          className="input"
          rows={3}
          value={text}
          placeholder="Dán khóa vào đây (có thể dán nhiều khóa, mỗi dòng một khóa)"
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: 15, fontFamily: "monospace" }}
        />
        <button className="btn btn-primary" disabled={busy || !text.trim()} onClick={saveKeys}>
          {busy ? "Đang kiểm tra khóa…" : "Kiểm tra và lưu khóa"}
        </button>
        {msg && <div className={msg.ok ? "banner" : "error"}>{msg.text}</div>}
        <div className="muted" style={{ fontSize: 14 }}>
          Lấy khóa miễn phí tại aistudio.google.com/apikey (đăng nhập bằng Gmail, bấm Create API key). Đừng bật thanh toán cho dự án chứa khóa để luôn miễn phí.
        </div>
      </div>

      {!firstRun && (
        <div className="card stack">
          <strong>⭐ Giới hạn xu mỗi ngày</strong>
          <div className="row">
            <input className="input" type="number" min={50} max={5000} step={50} value={cap} onChange={(e) => setCap(Number(e.target.value))} style={{ maxWidth: 140 }} />
            <button className="btn" onClick={() => onSave({ ...settings, dailyCap: Math.max(50, cap || 400) })}>
              Lưu
            </button>
          </div>
        </div>
      )}

      {!firstRun && (
        <div className="card stack">
          <strong>🏘️ Mã khu phố</strong>
          {settings.townCode ? (
            <>
              <div className="pill" style={{ fontSize: 18, alignSelf: "flex-start" }}>
                🔑 {settings.townCode}
              </div>
              <span className="muted" style={{ fontSize: 14 }}>
                Nhập đúng mã này trên các máy khác để các con ở chung một khu phố, thấy và thăm nhà nhau.
              </span>
              <button className="btn" onClick={() => onSave({ ...settings, townCode: undefined })}>
                Đổi sang khu phố khác
              </button>
            </>
          ) : (
            <span className="muted">Chưa có. Vào Khu phố từ sảnh để tạo mã hoặc nhập mã có sẵn.</span>
          )}
        </div>
      )}

      {!firstRun && (
        <div className="card stack">
          <strong>☁️ Kho câu hỏi chung</strong>
          <span className="muted">{cloudEnabled ? "Đang bật: câu hỏi đã soạn được lưu lên kho chung, máy khác dùng lại được." : "Chưa bật: câu hỏi chỉ lưu trên máy này."}</span>
        </div>
      )}

      {!firstRun && (
        <div className="card stack">
          <strong>🔄 Cập nhật</strong>
          {UPDATES_DISABLED ? (
            <span className="muted">Đây là bản thử trên máy tính, đã tắt tự cập nhật.</span>
          ) : (
            <>
              <label className="row" style={{ alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  checked={!!settings.betaChannel}
                  onChange={(e) => onSave({ ...settings, betaChannel: e.target.checked })}
                  style={{ width: 22, height: 22, marginTop: 3 }}
                />
                <span>
                  <strong>Nhận bản thử nghiệm</strong>
                  <div className="muted" style={{ fontSize: 14 }}>
                    Chỉ bật trên máy của bố mẹ để thử bản mới trước. Máy các con để tắt, chỉ nhận bản đã duyệt.
                  </div>
                </span>
              </label>
              {onCheckUpdate && (
                <button className="btn" onClick={onCheckUpdate}>
                  Kiểm tra bản cập nhật
                </button>
              )}
            </>
          )}
        </div>
      )}

      {firstRun && (
        <button className="btn btn-ghost" onClick={() => onSave({ ...settings, setupDone: true })}>
          Bỏ qua, tạm dùng đề mẫu →
        </button>
      )}
      {firstRun && keys.length > 0 && (
        <button className="btn btn-primary btn-big" onClick={() => onSave({ ...settings, setupDone: true })}>
          Tiếp tục →
        </button>
      )}
    </div>
  );
}
