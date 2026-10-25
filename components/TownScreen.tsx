"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { migrateHome } from "@/lib/home";
import { HOUSE_COLORS, HOUSE_TIERS, PLOTS, TIER_MAP, decodeHouse, encodeHouse, newTownCode, normalizeTownCode, upgradeCost } from "@/lib/town";
import { cachedTown, claimPlot, fetchTown, joinTown, saveHouse, totalEarned, townOnline, type TownState } from "@/lib/townCloud";
import type { Profile, Settings } from "@/lib/types";
import { HomeScreen } from "./HomeScreen";
import { HouseThumb } from "./houses";
import { TownMap, type MapPlayer, type MapPlot } from "./TownMap";

type View = { kind: "map" } | { kind: "inside"; ownerId: string };

/** Đất, nhà của một hồ sơ trong khu phố đang mở (bỏ qua nếu thuộc khu phố khác) */
const townOf = (p: Profile, code?: string) => (p.town && code && (!p.town.code || p.town.code === code) ? p.town : undefined);

export function TownScreen({
  me,
  profiles,
  settings,
  onSettings,
  onChange,
  onBack,
}: {
  me: Profile;
  /** Các hồ sơ trên máy này (để chơi chung khi không có mạng) */
  profiles: Profile[];
  settings: Settings;
  onSettings: (s: Settings) => void;
  onChange: (fn: (p: Profile) => Profile) => void;
  onBack: () => void;
}) {
  const code = settings.townCode;
  const [cloud, setCloud] = useState<TownState | null>(() => (code ? cachedTown(code) : null));
  const [view, setView] = useState<View>({ kind: "map" });
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [color, setColor] = useState(decodeHouse(me.town?.house)?.color ?? "kem");

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg((m) => (m === t ? null : m)), 3000);
  };

  const refresh = useCallback(async () => {
    if (!code) return;
    const s = await fetchTown(code);
    if (s) setCloud(s);
  }, [code]);

  // Vào khu phố: cập nhật tên, trang phục; tải lại khu phố định kì
  useEffect(() => {
    if (!code) return;
    joinTown(code, me).then(refresh);
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, me.id, me.name, JSON.stringify(me.look)]);

  // Nội thất nhà mình thay đổi: lưu lên khu phố (chờ 1,5 giây cho gom nhiều thay đổi)
  const homeJson = JSON.stringify(me.home);
  useEffect(() => {
    const t = townOf(me, code);
    if (!code || t?.plot === undefined || !t.house) return;
    const timer = setTimeout(() => {
      void saveHouse(code, t.plot!, me.id, t.house!, migrateHome(me.home));
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, homeJson, me.town?.house, me.town?.plot]);

  // ---------- Gộp dữ liệu: trên mạng + các hồ sơ trên máy này ----------
  const { plots, players } = useMemo(() => {
    const names = new Map<string, string>();
    const plots = new Map<number, MapPlot>();
    const players = new Map<string, MapPlayer & { coins: number }>();
    for (const p of cloud?.players ?? []) {
      names.set(p.id, p.name);
      players.set(p.id, { id: p.id, name: p.name, look: p.look, coins: p.coins });
    }
    for (const pl of cloud?.plots ?? []) {
      plots.set(pl.plot, { owner: pl.owner, ownerName: names.get(pl.owner) ?? "?", house: decodeHouse(pl.house) });
      const pr = players.get(pl.owner);
      if (pr) pr.plot = pl.plot;
    }
    // Hồ sơ trên máy này luôn là bản mới nhất của chính nó
    for (const p of profiles) {
      const t = townOf(p, code);
      players.set(p.id, { id: p.id, name: p.name, look: p.look, coins: totalEarned(p), plot: t?.plot });
      if (t?.plot !== undefined) plots.set(t.plot, { owner: p.id, ownerName: p.name, house: decodeHouse(t.house) });
    }
    return { plots, players: [...players.values()] };
  }, [cloud, profiles, code]);

  // ---------- Chưa có mã khu phố ----------
  if (!code) return <TownSetup onDone={(c) => onSettings({ ...settings, townCode: c })} onBack={onBack} />;

  const myTown = townOf(me, code);
  const myPlot = myTown?.plot;
  const myHouse = decodeHouse(myTown?.house);

  // ---------- Bên trong một ngôi nhà ----------
  if (view.kind === "inside") {
    const mine = view.ownerId === me.id;
    const owner = players.find((p) => p.id === view.ownerId);
    const local = profiles.find((p) => p.id === view.ownerId);
    const plotEntry = [...plots.entries()].find(([, v]) => v.owner === view.ownerId);
    const house = plotEntry?.[1].house;
    const cloudRooms = cloud?.plots.find((p) => p.owner === view.ownerId)?.rooms ?? null;
    return (
      <HomeScreen
        me={me}
        ownerName={owner?.name ?? "bạn"}
        ownerHome={local ? local.home : cloudRooms}
        editable={mine}
        unlocked={TIER_MAP[house?.tier ?? "cap4"].rooms}
        onChange={onChange}
        onExit={() => {
          setView({ kind: "map" });
          void refresh();
        }}
        onBack={onBack}
      />
    );
  }

  // ---------- Hành động trên mảnh đất ----------
  const selInfo = sel !== null ? plots.get(sel) : undefined;
  const selPlot = sel !== null ? PLOTS[sel] : undefined;

  async function buy() {
    if (sel === null || !selPlot) return;
    if (myPlot !== undefined) return flash("Con đã có đất rồi. Mỗi bạn chỉ được một mảnh đất nhé!");
    if (me.coins < selPlot.price) return flash(`Con cần thêm ${selPlot.price - me.coins} xu nữa. Chăm học thêm nhé! 📚`);
    setBusy(true);
    let ok: boolean | null;
    if (townOnline) ok = await claimPlot(code!, sel, me.id);
    else ok = !plots.has(sel);
    setBusy(false);
    if (ok === null) return flash("Cần có mạng để mua đất. Con kiểm tra wifi rồi thử lại nhé!");
    if (!ok) {
      void refresh();
      return flash("Tiếc quá, mảnh đất này vừa có bạn khác mua rồi!");
    }
    onChange((p) => ({ ...p, coins: p.coins - selPlot.price, town: { code, plot: sel } }));
    flash("🎉 Chúc mừng! Con đã có mảnh đất của riêng mình. Giờ hãy xây nhà nào!");
    void refresh();
  }

  async function build(tier: string) {
    if (myPlot === undefined) return;
    const cost = upgradeCost(myHouse?.tier, tier);
    if (me.coins < cost) return flash(`Con cần thêm ${cost - me.coins} xu nữa để xây ${TIER_MAP[tier].name}. Cố lên! 💪`);
    const house = encodeHouse(tier, color);
    onChange((p) => ({ ...p, coins: p.coins - cost, town: { code, plot: myPlot, house } }));
    if (townOnline) {
      setBusy(true);
      await saveHouse(code!, myPlot, me.id, house, migrateHome(me.home));
      setBusy(false);
    }
    flash(myHouse ? `✨ Đã nâng cấp thành ${TIER_MAP[tier].name}!` : `🏠 Đã xây xong ${TIER_MAP[tier].name}! Vào nhà bày đồ thôi!`);
    void refresh();
  }

  function repaint() {
    if (myPlot === undefined || !myHouse) return;
    const house = encodeHouse(myHouse.tier, color);
    onChange((p) => ({ ...p, town: { code, plot: myPlot, house } }));
    flash("🎨 Đã sơn lại nhà!");
  }

  const ranking = [...players].sort((a, b) => b.coins - a.coins).slice(0, 5);

  return (
    <div className="stack">
      <div className="topbar">
        <button className="btn" onClick={onBack}>
          ← Sảnh
        </button>
        <span className="pill pill-coin">⭐ {me.coins}</span>
      </div>
      <div className="row between wrap">
        <h1>🏘️ Khu phố</h1>
        <span className="pill" title="Gửi mã này cho người thân để chơi cùng khu phố">
          🔑 {code}
        </span>
      </div>
      {!townOnline && <div className="banner">Đang chơi trên máy này (chưa kết nối khu phố chung).</div>}
      {myPlot === undefined && (
        <div className="banner">👋 {me.name} chưa có nhà. Hãy chọn một mảnh đất có biển <strong>Bán đất</strong> và mua bằng xu kiếm được khi học nhé!</div>
      )}

      <div className="room-card">
        <TownMap plots={plots} players={players} meId={me.id} myLook={me.look} myPlot={myPlot} onPlot={setSel} />
      </div>

      {msg && <div className="banner pop">{msg}</div>}

      {sel !== null && selPlot && (
        <div className="card stack pop">
          <div className="row between">
            <strong>
              Mảnh đất số {sel + 1}
              {selPlot.prime ? " · cạnh công viên 🌳" : ""}
            </strong>
            <button className="btn btn-ghost" onClick={() => setSel(null)}>
              Đóng
            </button>
          </div>

          {!selInfo && (
            <>
              <span className="muted">Đất trống, giá {selPlot.price} xu.</span>
              <button className="btn btn-gold" disabled={busy || myPlot !== undefined} onClick={buy}>
                {myPlot !== undefined ? "Con đã có đất rồi" : `Mua đất ⭐ ${selPlot.price}`}
              </button>
            </>
          )}

          {selInfo && selInfo.owner !== me.id && (
            <>
              <span className="muted">
                Đất của <strong>{selInfo.ownerName}</strong>
                {selInfo.house ? ` · ${TIER_MAP[selInfo.house.tier].name}` : " · chưa xây nhà"}
              </span>
              {selInfo.house && (
                <button className="btn btn-blue" onClick={() => setView({ kind: "inside", ownerId: selInfo.owner })}>
                  👋 Vào thăm nhà {selInfo.ownerName}
                </button>
              )}
            </>
          )}

          {selInfo && selInfo.owner === me.id && (
            <>
              {myHouse && (
                <button className="btn btn-primary" onClick={() => setView({ kind: "inside", ownerId: me.id })}>
                  🚪 Vào nhà
                </button>
              )}
              <strong>{myHouse ? "Nâng cấp nhà" : "Xây nhà"}</strong>
              <div className="row wrap" style={{ gap: 6 }}>
                {HOUSE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => setColor(c.id)}
                    style={{ width: 34, height: 34, borderRadius: 10, border: color === c.id ? "3px solid var(--ink)" : "2px solid var(--line)", background: `linear-gradient(135deg, ${c.wall} 55%, ${c.roof} 55%)` }}
                  />
                ))}
                {myHouse && myHouse.color !== color && (
                  <button className="btn" onClick={repaint}>
                    🎨 Sơn lại (miễn phí)
                  </button>
                )}
              </div>
              <div className="items">
                {HOUSE_TIERS.map((t, i) => {
                  const curIdx = myHouse ? HOUSE_TIERS.findIndex((x) => x.id === myHouse.tier) : -1;
                  const done = i <= curIdx;
                  const cost = upgradeCost(myHouse?.tier, t.id);
                  return (
                    <button
                      key={t.id}
                      className={`item ${t.id === "laudai" ? "r-huyenthoai" : t.id === "bietthu" ? "r-suthi" : t.id === "nhavuon" ? "r-hiem" : ""}`}
                      disabled={done || busy}
                      onClick={() => build(t.id)}
                    >
                      <HouseThumb tier={t.id} color={color} size={86} />
                      <span>{t.name}</span>
                      <span className="muted" style={{ fontSize: 11 }}>{t.rooms.length} phòng</span>
                      {done ? <span className="tag">✅</span> : <span className="price">⭐ {cost}</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <div className="card stack">
        <strong>🏆 Bảng chăm chỉ (tổng xu đã kiếm)</strong>
        {ranking.map((p, i) => (
          <div key={p.id} className="row between">
            <span>
              {["🥇", "🥈", "🥉", "4.", "5."][i]} {p.name}
              {p.id === me.id ? " (con)" : ""}
            </span>
            <strong>⭐ {p.coins}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function TownSetup({ onDone, onBack }: { onDone: (code: string) => void; onBack: () => void }) {
  const [text, setText] = useState("");
  const [created] = useState(newTownCode);
  return (
    <div className="stack">
      <div className="topbar">
        <button className="btn" onClick={onBack}>
          ← Sảnh
        </button>
      </div>
      <h1>🏘️ Khu phố</h1>
      <p className="muted" style={{ margin: 0 }}>
        Mỗi khu phố có một <strong>mã riêng</strong>. Những ai dùng cùng mã sẽ thấy nhà của nhau và đến thăm nhau được. Bố mẹ tạo mã một lần rồi gửi cho các máy khác.
      </p>
      <div className="card stack">
        <strong>Tạo khu phố mới</strong>
        <div className="pill" style={{ fontSize: 20, alignSelf: "flex-start" }}>
          🔑 {created}
        </div>
        <span className="muted" style={{ fontSize: 14 }}>
          Ghi lại mã này và nhập vào các máy khác để vào cùng khu phố.
        </span>
        <button className="btn btn-primary" onClick={() => onDone(created)}>
          Tạo khu phố với mã này
        </button>
      </div>
      <div className="card stack">
        <strong>Vào khu phố đã có</strong>
        <input className="input" value={text} placeholder="Nhập mã, ví dụ KP-ABCD-1234" onChange={(e) => setText(e.target.value)} />
        <button className="btn btn-blue" disabled={normalizeTownCode(text).length < 6} onClick={() => onDone(normalizeTownCode(text))}>
          Vào khu phố
        </button>
      </div>
    </div>
  );
}
