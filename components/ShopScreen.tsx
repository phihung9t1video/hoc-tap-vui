"use client";

import { useState } from "react";
import { HOME_CATS, HOME_ITEMS, type HomeItem } from "@/lib/home";
import { RARITY } from "@/lib/items";
import type { Shop } from "@/lib/town";
import type { Profile } from "@/lib/types";
import { AvatarEditor } from "./AvatarEditor";
import { HomeThumb } from "./Room";

/** Bên trong một cửa hàng của khu phố: kệ hàng, xem thử rồi mua */
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

      <div className="shop-front" style={{ ["--shop" as string]: shop.color }}>
        <div className="shop-awning" />
        <div className="row" style={{ gap: 10, padding: "10px 14px" }}>
          <span style={{ fontSize: 34 }}>🧑‍💼</span>
          <span>
            <strong>Chào mừng {me.name}!</strong> {shop.greet}
          </span>
        </div>
      </div>

      {shop.slots ? (
        <div className="shop-shelf">
          <AvatarEditor
            look={me.look}
            owned={new Set(me.owned)}
            coins={me.coins}
            shop
            slots={shop.slots}
            onChange={(look) => onChange((p) => ({ ...p, look }))}
            onBuy={(item) =>
              onChange((p) => (p.coins >= item.price && !p.owned.includes(item.id) ? { ...p, coins: p.coins - item.price, owned: [...p.owned, item.id] } : p))
            }
          />
        </div>
      ) : (
        <HomeShelf shop={shop} me={me} onChange={onChange} />
      )}
    </div>
  );
}

function HomeShelf({ shop, me, onChange }: { shop: Shop; me: Profile; onChange: (fn: (p: Profile) => Profile) => void }) {
  const cats = HOME_CATS.filter((c) => shop.cats?.includes(c.id));
  const [cat, setCat] = useState(cats[0]?.id);
  const [trial, setTrial] = useState<HomeItem | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const owned = new Set(me.owned);
  const items = HOME_ITEMS.filter((i) => i.cat === cat).sort((a, b) => Number(!a.starter) - Number(!b.starter) || a.price - b.price);

  function buy(it: HomeItem) {
    onChange((p) => (p.coins >= it.price && !p.owned.includes(it.id) ? { ...p, coins: p.coins - it.price, owned: [...p.owned, it.id] } : p));
    setTrial(null);
    setMsg(`🛍️ Đã mua ${it.name}! Về nhà, bấm ✏️ Sắp xếp để bày nhé.`);
  }

  return (
    <div className="stack">
      {cats.length > 1 && (
        <div className="tabs">
          {cats.map((c) => (
            <button
              key={c.id}
              className={`tab ${cat === c.id ? "on" : ""}`}
              onClick={() => {
                setCat(c.id);
                setTrial(null);
              }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      )}
      {msg && <div className="banner pop">{msg}</div>}
      <div className="items shop-shelf">
        {items.map((it) => {
          const has = owned.has(it.id);
          return (
            <button key={it.id} className={`item r-${it.rarity} ${trial?.id === it.id ? "on" : ""}`} onClick={() => setTrial(it)}>
              <HomeThumb item={it} size={76} />
              <span>{it.name}</span>
              {has ? <span className="tag">✅</span> : <span className="price">⭐ {it.price}</span>}
            </button>
          );
        })}
      </div>
      {trial && (
        <div className={`card shop-panel pop r-${trial.rarity}`}>
          <div className="row between wrap">
            <div className="row">
              <HomeThumb item={trial} size={64} />
              <div>
                <strong style={{ fontSize: 19 }}>{trial.name}</strong>{" "}
                <span className="rarity" style={{ background: RARITY[trial.rarity].color }}>
                  {RARITY[trial.rarity].label}
                </span>
                <div className="muted" style={{ fontSize: 14 }}>
                  {owned.has(trial.id)
                    ? "Con đã có món này."
                    : me.coins >= trial.price
                      ? `Giá ${trial.price} xu`
                      : `Giá ${trial.price} xu – cần thêm ${trial.price - me.coins} xu`}
                </div>
              </div>
            </div>
            <div className="row">
              <button className="btn" onClick={() => setTrial(null)}>
                Thôi
              </button>
              {!owned.has(trial.id) && (
                <button className="btn btn-gold" disabled={me.coins < trial.price} onClick={() => buy(trial)}>
                  Mua ⭐ {trial.price}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
