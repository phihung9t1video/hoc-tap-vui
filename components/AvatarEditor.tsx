"use client";

import { useState } from "react";
import { ACHIEVEMENT_MAP } from "@/lib/achievements";
import { ITEMS, RARITY, SLOTS, type Crop, type Item } from "@/lib/items";
import type { Look, Slot } from "@/lib/types";
import { Avatar, SpinAvatar } from "./Avatar";

const THUMB: Record<Crop, number> = { head: 74, full: 62, pet: 64, toy: 76 };

export function AvatarEditor({
  look,
  owned,
  coins,
  shop,
  onChange,
  onBuy,
}: {
  look: Look;
  owned: Set<string>;
  coins: number;
  /** true: cho phép mua đồ; false: màn tạo nhân vật, chỉ dùng đồ có sẵn */
  shop: boolean;
  onChange: (look: Look) => void;
  onBuy?: (item: Item) => void;
}) {
  const [slot, setSlot] = useState<Slot>(SLOTS[0].slot);
  const [trial, setTrial] = useState<Item | null>(null);
  const tab = SLOTS.find((s) => s.slot === slot)!;
  const preview = trial ? { ...look, [trial.slot]: trial.id } : look;
  /** Đồ cho thú cưng cần có thú cưng để xem thử */
  const needsPet = slot === "petAcc" && look.pet === "pet_khong";

  function pick(item: Item) {
    if (owned.has(item.id)) {
      setTrial(null);
      onChange({ ...look, [item.slot]: item.id });
    } else {
      setTrial(item);
    }
  }

  function buy(item: Item) {
    onBuy?.(item);
    setTrial(null);
    onChange({ ...look, [item.slot]: item.id });
  }

  return (
    <div className="stack">
      <div className="stage">
        <SpinAvatar look={preview} size={190} className="bounce" />
        {trial && (
          <span className="pill" style={{ position: "absolute", top: 10, left: 10 }}>
            👀 Đang mặc thử
          </span>
        )}
      </div>

      <div className="tabs" role="tablist">
        {SLOTS.map((s) => (
          <button
            key={s.slot}
            role="tab"
            aria-selected={slot === s.slot}
            className={`tab ${slot === s.slot ? "on" : ""}`}
            onClick={() => {
              setSlot(s.slot);
              setTrial(null);
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {needsPet && <div className="banner">🐾 Con chưa có thú cưng. Chọn thú cưng ở mục 🐱 trước để đeo đồ cho bạn ấy nhé!</div>}

      <div className="items">
        {ITEMS.filter((i) => i.slot === slot).map((item) => {
          const has = owned.has(item.id);
          const on = look[slot] === item.id || trial?.id === item.id;
          return (
            <button
              key={item.id}
              className={`item r-${item.rarity} ${on ? "on" : ""} ${has ? "" : "locked"}`}
              onClick={() => pick(item)}
              title={item.name}
            >
              {item.color ? (
                <span className="swatch" style={{ background: item.color }} />
              ) : (
                <Avatar look={{ ...look, ...(needsPet ? { pet: "pet_meo" } : {}), [slot]: item.id }} size={THUMB[tab.crop]} crop={tab.crop} />
              )}
              <span>{item.name}</span>
              {!has && <span className="tag">🔒</span>}
              {!has && (item.achievement ? <span className="price">🏆 Thành tích</span> : <span className="price">⭐ {item.price}</span>)}
            </button>
          );
        })}
      </div>

      {trial && (
        <div className="card shop-panel pop">
          <div className="row between wrap">
            <div>
              <strong style={{ fontSize: 20 }}>{trial.name}</strong>{" "}
              <span className="rarity" style={{ background: RARITY[trial.rarity].color }}>
                {RARITY[trial.rarity].label}
              </span>
              <div className="muted" style={{ fontSize: 15 }}>
                {trial.achievement
                  ? `Phần thưởng thành tích: ${ACHIEVEMENT_MAP[trial.achievement]?.desc}`
                  : !shop
                    ? "Làm bài kiếm xu rồi vào Cửa hàng mua nhé!"
                    : coins >= trial.price
                      ? `Giá ${trial.price} xu`
                      : `Giá ${trial.price} xu – con cần thêm ${trial.price - coins} xu nữa`}
              </div>
            </div>
            <div className="row">
              <button className="btn" onClick={() => setTrial(null)}>
                Thôi
              </button>
              {shop && !trial.achievement && (
                <button className="btn btn-gold" disabled={coins < trial.price} onClick={() => buy(trial)}>
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
