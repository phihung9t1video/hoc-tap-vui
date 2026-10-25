"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { migrateHome } from "@/lib/home";
import { HOUSE_COLORS, HOUSE_TIERS, SHOP_MAP, TIER_MAP, TOWN, decodeHouse, encodeHouse, ringsFor, townLayout, upgradeCost } from "@/lib/town";
import { cachedTown, claimPlot, fetchTown, joinTown, saveHouse, totalEarned, townOnline, type TownState } from "@/lib/townCloud";
import type { Profile } from "@/lib/types";
import { ITEM_MAP } from "@/lib/items";
import { HOME_MAP } from "@/lib/home";
import { WEEK_PRIZES, daysLeft, grantWeekPrize, pointsOf, prevWeekKey, weekKey, weekStats, type WeekStats } from "@/lib/weekly";
import { HomeScreen } from "./HomeScreen";
import { HouseThumb } from "./houses";
import { ShopScreen } from "./ShopScreen";
import { TownMap, type MapPlayer, type MapPlot } from "./TownMap";

type View = { kind: "map" } | { kind: "inside"; ownerId: string } | { kind: "shop"; shopId: string };

/** Đất, nhà của một hồ sơ trong khu phố chung */
const townOf = (p: Profile, code: string) => (p.town?.code === code ? p.town : undefined);

export function TownScreen({
  me,
  profiles,
  onChange,
  onBack,
}: {
  me: Profile;
  /** Các hồ sơ trên máy này (để chơi chung khi không có mạng) */
  profiles: Profile[];
  onChange: (fn: (p: Profile) => Profile) => void;
  onBack: () => void;
}) {
  const code = TOWN;
  const [cloud, setCloud] = useState<TownState | null>(() => cachedTown(code));
  const [view, setView] = useState<View>({ kind: "map" });
  const [sel, setSel] = useState<number | null>(null);
  /** Ra khỏi shop, nhà: đứng lại trước cửa chỗ đó */
  const [backAt, setBackAt] = useState<number | undefined>();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** Đã tải xong dữ liệu khu phố mới nhất (để xét thưởng tuần cho chính xác) */
  const [fresh, setFresh] = useState(!townOnline);
  const [board, setBoard] = useState<"week" | "all">("week");
  const [prize, setPrize] = useState<{ rank: number; itemId?: string } | null>(null);
  const [color, setColor] = useState(decodeHouse(me.town?.house)?.color ?? "kem");

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg((m) => (m === t ? null : m)), 3000);
  };

  // Bản 1.2.0 cho tạo nhiều khu phố riêng: nay gộp làm một, hoàn lại xu đã mua đất, xây nhà ở khu phố cũ
  useEffect(() => {
    if (!me.town || me.town.code === TOWN) return;
    const refundOf = (t: NonNullable<Profile["town"]>) => (t.plot !== undefined ? 500 : 0) + (TIER_MAP[decodeHouse(t.house)?.tier ?? ""]?.price ?? 0);
    const refund = refundOf(me.town);
    onChange((p) => (p.town && p.town.code !== TOWN ? { ...p, coins: p.coins + refundOf(p.town), town: undefined } : p));
    if (refund) flash(`Các khu phố đã gộp thành một khu phố chung. Con được hoàn lại ⭐ ${refund} để mua đất, xây nhà mới nhé!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.id]);

  const refresh = useCallback(async () => {
    if (!code) return;
    const s = await fetchTown(code);
    if (s) {
      setCloud(s);
      setFresh(true);
    }
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
    const players = new Map<string, MapPlayer & { coins: number; wk?: WeekStats }>();
    for (const p of cloud?.players ?? []) {
      names.set(p.id, p.name);
      players.set(p.id, { id: p.id, name: p.name, look: p.look, coins: p.coins, wk: p.look?._wk });
    }
    for (const pl of cloud?.plots ?? []) {
      plots.set(pl.plot, { owner: pl.owner, ownerName: names.get(pl.owner) ?? "?", house: decodeHouse(pl.house) });
      const pr = players.get(pl.owner);
      if (pr) pr.plot = pl.plot;
    }
    // Hồ sơ trên máy này luôn là bản mới nhất của chính nó
    for (const p of profiles) {
      const t = townOf(p, code);
      players.set(p.id, { id: p.id, name: p.name, look: p.look, coins: totalEarned(p), plot: t?.plot, wk: weekStats(p) });
      if (t?.plot !== undefined) plots.set(t.plot, { owner: p.id, ownerName: p.name, house: decodeHouse(t.house) });
    }
    return { plots, players: [...players.values()] };
  }, [cloud, profiles, code]);

  // Sang tuần mới: ba bạn chăm nhất tuần trước nhận thưởng (mỗi hồ sơ tự nhận một lần)
  const lastWeek = prevWeekKey();
  useEffect(() => {
    if (!fresh || me.weekPrize === lastWeek) return;
    const ranked = players
      .map((p) => ({ id: p.id, pts: pointsOf(p.wk, lastWeek) }))
      .filter((x) => x.pts > 0)
      .sort((a, b) => b.pts - a.pts);
    const rank = ranked.findIndex((x) => x.id === me.id);
    if (rank < 0 || rank > 2) {
      onChange((p) => ({ ...p, weekPrize: lastWeek }));
      return;
    }
    const { profile: won, itemId } = grantWeekPrize(me, lastWeek, rank);
    onChange((p) => (p.weekPrize === lastWeek ? p : { ...p, coins: won.coins - me.coins + p.coins, owned: [...new Set([...p.owned, ...won.owned])], weekPrize: lastWeek }));
    setPrize({ rank, itemId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh, me.id, lastWeek]);

  // Khu phố tự nở thêm một vòng dãy phố khi gần hết đất
  const layout = townLayout(ringsFor(plots.size, Math.max(-1, ...plots.keys())));

  const myTown = townOf(me, code);
  const myPlot = myTown?.plot;
  const myHouse = decodeHouse(myTown?.house);

  // ---------- Bên trong một cửa hàng ----------
  if (view.kind === "shop") {
    return (
      <ShopScreen
        shop={SHOP_MAP[view.shopId]}
        me={me}
        onChange={onChange}
        onExit={() => setView({ kind: "map" })}
        onBack={onBack}
      />
    );
  }

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
  const selPlot = sel !== null ? layout.plots[sel] : undefined;

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

  const thisWeek = weekKey();
  const ranking =
    board === "week"
      ? players
          .map((p) => ({ ...p, coins: pointsOf(p.wk, thisWeek) }))
          .filter((p) => p.coins > 0 || p.id === me.id)
          .sort((a, b) => b.coins - a.coins)
          .slice(0, 10)
      : [...players].sort((a, b) => b.coins - a.coins).slice(0, 10);
  const prizeItem = prize?.itemId ? (ITEM_MAP[prize.itemId] ?? HOME_MAP[prize.itemId]) : undefined;

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
        <span className="pill">
          🏡 {plots.size}/{layout.plots.length - layout.shopAt.size} mảnh đất đã có chủ
        </span>
      </div>
      {!townOnline && <div className="banner">Đang chơi trên máy này (chưa kết nối khu phố chung).</div>}
      {myPlot === undefined && (
        <div className="banner">👋 {me.name} chưa có nhà. Hãy chọn một mảnh đất có biển <strong>Bán đất</strong> và mua bằng xu kiếm được khi học nhé!</div>
      )}

      <div className="room-card">
        <TownMap
          key={layout.rings}
          layout={layout}
          startPlot={backAt}
          onShop={(shopId) => {
            setBackAt([...layout.shopAt.entries()].find(([, s]) => s.id === shopId)?.[0]);
            setSel(null);
            setView({ kind: "shop", shopId });
          }}
          plots={plots} players={players} meId={me.id} myLook={me.look} myPlot={myPlot} onPlot={setSel} />
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
                <button className="btn btn-blue" onClick={() => { setBackAt(sel); setView({ kind: "inside", ownerId: selInfo.owner }); }}>
                  👋 Vào thăm nhà {selInfo.ownerName}
                </button>
              )}
            </>
          )}

          {selInfo && selInfo.owner === me.id && (
            <>
              {myHouse && (
                <button className="btn btn-primary" onClick={() => { setBackAt(sel); setView({ kind: "inside", ownerId: me.id }); }}>
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

      {prize && (
        <div className="card center stack pop" style={{ alignItems: "center", background: "linear-gradient(135deg, #fff7cc, #fde68a)" }}>
          <div style={{ fontSize: 48 }}>{["🥇", "🥈", "🥉"][prize.rank]}</div>
          <strong style={{ fontSize: 20 }}>Tuần trước {me.name} đứng hạng {prize.rank + 1} bảng chăm chỉ!</strong>
          <span>
            Phần thưởng: +{WEEK_PRIZES[prize.rank].coins} ⭐{prizeItem ? ` và ${prizeItem.name}` : ""}
          </span>
          <button className="btn btn-gold" onClick={() => setPrize(null)}>
            Tuyệt vời! 🎉
          </button>
        </div>
      )}

      <div className="card stack">
        <div className="row between wrap">
          <strong>🏆 Bảng chăm chỉ</strong>
          <div className="row" style={{ gap: 6 }}>
            <button className={`tab ${board === "week" ? "on" : ""}`} onClick={() => setBoard("week")}>
              🗓️ Tuần này
            </button>
            <button className={`tab ${board === "all" ? "on" : ""}`} onClick={() => setBoard("all")}>
              ⭐ Từ trước tới nay
            </button>
          </div>
        </div>
        {board === "week" && (
          <div className="muted" style={{ fontSize: 14 }}>
            Điểm tuần = số xu kiếm được khi học từ thứ Hai. Còn {daysLeft()} ngày nữa tổng kết: 🥇 {WEEK_PRIZES[0].label} · 🥈 {WEEK_PRIZES[1].label} · 🥉{" "}
            {WEEK_PRIZES[2].label}.
          </div>
        )}
        {ranking.map((p, i) => (
          <div key={p.id} className="row between" style={p.id === me.id ? { background: "#fff7cc", borderRadius: 10, padding: "2px 6px" } : undefined}>
            <span>
              {["🥇", "🥈", "🥉"][i] ?? `${i + 1}.`} {p.name}
              {p.id === me.id ? " (con)" : ""}
            </span>
            <strong>⭐ {p.coins}</strong>
          </div>
        ))}
        {board === "week" && ranking.every((p) => p.coins === 0) && <div className="muted">Tuần này chưa ai học. Con làm bài để đứng đầu bảng nhé!</div>}
      </div>
    </div>
  );
}
