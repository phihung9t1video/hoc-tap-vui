"use client";

import { useMemo, useState } from "react";
import { ACHIEVEMENT_MAP } from "@/lib/achievements";
import { RARITY } from "@/lib/draw";
import { HOME_CATS, HOME_ITEMS, type HomeItem } from "@/lib/home";
import { ITEMS, SLOTS, defaultLook, type Crop, type Item } from "@/lib/items";
import type { Shop } from "@/lib/town";
import type { Look, Profile } from "@/lib/types";
import { Avatar, SpinAvatar } from "./Avatar";
import { HomeThumb } from "./Room";
import { SHELF_SPOTS, ShopRoom } from "./ShopRoom";

type Goods = { kind: "wear"; item: Item; crop: Crop } | { kind: "home"; item: HomeItem };

const PAGE = SHELF_SPOTS.length;
/** Cô bán hàng đứng sau quầy */
const KEEPER: Look = defaultLook("nu");

/** Bên trong một cửa hàng của khu phố: đi lại giữa các kệ, chạm hàng để xem, mặc thử rồi mua */
export function ShopScreen({
  shop,
  me,
  onChange,
  onExit,
  onBack,
}: {
  shop: Shop;
  me: Profile;
  onChange: (fn: (p: Profile) => Profile) => void;
  onExit: () => void;
  onBack: () => void;
}) {
  // Các khu hàng trong cửa hàng (theo ô trang phục hoặc nhóm đồ nhà)
  const sections = shop.slots
    ? SLOTS.filter((s) => shop.slots!.includes(s.slot)).map((s) => ({ id: s.slot as string, label: s.label, icon: s.icon }))
    : HOME_CATS.filter((c) => shop.cats?.includes(c.id));
  const [section, setSection] = useState(sections[0].id);
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState<Goods | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const owned = useMemo(() => new Set(me.owned), [me.owned]);

  // Hàng của khu đang xem: rẻ trước, đắt sau; đồ có sẵn từ đầu thì không bày bán
  const list: Goods[] = useMemo(() => {
    if (shop.slots) {
      const crop = SLOTS.find((s) => s.slot === section)!.crop;
      return ITEMS.filter((i) => i.slot === section && !i.starter)
        .sort((a, b) => Number(!!a.achievement) - Number(!!b.achievement) || a.price - b.price)
        .map((item) => ({ kind: "wear" as const, item, crop }));
    }
    return HOME_ITEMS.filter((i) => i.cat === section && !i.starter)
      .sort((a, b) => a.price - b.price)
      .map((item) => ({ kind: "home" as const, item }));
  }, [shop.slots, section]);
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const shown = list.slice(page * PAGE, page * PAGE + PAGE);

  const needsPet = me.look.pet === "pet_khong";
  const thumbLook = (it: Item): Look => ({ ...me.look, ...(needsPet && it.slot.startsWith("pet") && it.slot !== "pet" ? { pet: "pet_meo" } : {}), [it.slot]: it.id });

  const goods = SHELF_SPOTS.map((_, i) => {
    const g = shown[i];
    if (!g) return null;
    const node =
      g.kind === "wear" ? (
        g.item.color ? (
          <circle cx="50%" cy="50%" r="40%" fill={g.item.color} stroke="#3d2c2c" strokeWidth={2} />
        ) : (
          <Avatar look={thumbLook(g.item)} size={SHELF_SPOTS[i].size} crop={g.crop} />
        )
      ) : (
        <HomeThumb item={g.item} size={SHELF_SPOTS[i].size} />
      );
    return { key: g.item.id, node, owned: owned.has(g.item.id) };
  });

  const trial = sel?.kind === "wear" && !owned.has(sel.item.id) ? sel.item : null;
  const look = sel?.kind === "wear" ? { ...me.look, [sel.item.slot]: sel.item.id } : me.look;

  function buy(g: Goods) {
    const it = g.item;
    onChange((p) => (p.coins >= it.price && !p.owned.includes(it.id) ? { ...p, coins: p.coins - it.price, owned: [...p.owned, it.id] } : p));
    if (g.kind === "wear") {
      onChange((p) => ({ ...p, look: { ...p.look, [g.item.slot]: g.item.id } }));
      setMsg(`🛍️ Đã mua ${it.name} và mặc luôn rồi!`);
    } else setMsg(`🛍️ Đã mua ${it.name}! Về nhà, bấm ✏️ Sắp xếp để bày nhé.`);
    setSel(null);
  }

  function wear(it: Item) {
    onChange((p) => ({ ...p, look: { ...p.look, [it.slot]: it.id } }));
    setSel(null);
  }

  const it = sel?.item;
  const has = it ? owned.has(it.id) : false;
  const achievement = sel?.kind === "wear" ? sel.item.achievement : undefined;

  return (
    <div className="stack">
      <div className="topbar">
        <button className="btn" onClick={onExit}>
          🚪 Ra phố
        </button>
        <span className="pill pill-coin">⭐ {me.coins}</span>
      </div>
      <h1>
        {shop.icon} {shop.name}
      </h1>
      <div className="muted" style={{ marginTop: -8 }}>
        <button className="btn btn-ghost" style={{ padding: "0 4px" }} onClick={onBack}>
          Sảnh
        </button>
        ›
        <button className="btn btn-ghost" style={{ padding: "0 4px" }} onClick={onExit}>
          🏘️ Khu phố
        </button>
        › {shop.name}
      </div>

      {sections.length > 1 && (
        <div className="tabs">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`tab ${section === s.id ? "on" : ""}`}
              onClick={() => {
                setSection(s.id);
                setPage(0);
                setSel(null);
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="room-card">
        <ShopRoom
          name={shop.name}
          icon={shop.icon}
          color={shop.color}
          look={look}
          keeper={KEEPER}
          goods={goods}
          selected={sel?.item.id}
          onPick={(i) => {
            setSel(shown[i]);
            setMsg(null);
          }}
          onExit={onExit}
        />
      </div>

      <div className="row between">
        <button className="btn" disabled={page === 0} onClick={() => { setPage(page - 1); setSel(null); }}>
          ◀ Kệ trước
        </button>
        <span className="muted">
          Kệ {page + 1}/{pages} · {list.length} món
        </span>
        <button className="btn" disabled={page + 1 >= pages} onClick={() => { setPage(page + 1); setSel(null); }}>
          Kệ sau ▶
        </button>
      </div>

      {msg && <div className="banner pop">{msg}</div>}
      {!sel && !msg && <div className="muted center">🧑‍💼 Chào {me.name}! {shop.greet} Chạm vào món hàng trên kệ để xem nhé.</div>}

      {sel && it && (
        <div className={`card shop-panel pop r-${it.rarity}`}>
          <div className="row between wrap">
            <div className="row">
              {sel.kind === "wear" ? (
                trial ? (
                  <SpinAvatar look={look} size={90} />
                ) : (
                  <Avatar look={thumbLook(sel.item)} size={70} crop={sel.crop} />
                )
              ) : (
                <HomeThumb item={sel.item} size={70} />
              )}
              <div>
                <strong style={{ fontSize: 19 }}>{it.name}</strong>{" "}
                <span className="rarity" style={{ background: RARITY[it.rarity].color }}>
                  {RARITY[it.rarity].label}
                </span>
                <div className="muted" style={{ fontSize: 14 }}>
                  {has
                    ? "Con đã có món này."
                    : achievement
                      ? `Phần thưởng thành tích: ${ACHIEVEMENT_MAP[achievement]?.desc}`
                      : me.coins >= it.price
                        ? `Giá ${it.price} xu${trial ? " · 👀 đang mặc thử" : ""}`
                        : `Giá ${it.price} xu – cần thêm ${it.price - me.coins} xu`}
                </div>
              </div>
            </div>
            <div className="row">
              <button className="btn" onClick={() => setSel(null)}>
                Thôi
              </button>
              {has && sel.kind === "wear" && (
                <button className="btn btn-primary" onClick={() => wear(sel.item)}>
                  Mặc
                </button>
              )}
              {!has && !achievement && (
                <button className="btn btn-gold" disabled={me.coins < it.price} onClick={() => buy(sel)}>
                  Mua ⭐ {it.price}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
