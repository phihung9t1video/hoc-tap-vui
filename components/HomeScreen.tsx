"use client";

import { useState } from "react";
import {
  EXPAND_COST,
  HOME_ITEMS,
  HOME_MAP,
  ROOMS,
  ROOM_MAX,
  ROOM_ORDER,
  ROOM_PRICE,
  actionsFor,
  canHang,
  canPlace,
  doorTile,
  footprint,
  migrateHome,
  roomSize,
  type DoorTarget,
  type HomeAction,
  type HomeItem,
  type HomeState,
  type RoomId,
  type RoomState,
} from "@/lib/home";
import type { Profile } from "@/lib/types";
import { newId } from "@/lib/util";
import { GameCenter } from "./GameCenter";
import { HomeThumb, Room } from "./Room";

type Mode = "play" | "arrange";
type Where = { room: RoomId; entry?: [number, number] };

/** Bên trong một ngôi nhà: nhà mình (sắp xếp được) hoặc nhà bạn (chỉ tham quan) */
export function HomeScreen({
  me,
  ownerName,
  ownerHome,
  editable,
  unlocked: tierRooms,
  onChange,
  onExit,
  onBack,
}: {
  me: Profile;
  ownerName: string;
  /** Nội thất nhà bạn (khi đi thăm); nhà mình lấy từ hồ sơ */
  ownerHome?: HomeState | null;
  editable: boolean;
  /** Các phòng đã mở theo cấp nhà (cộng thêm các phòng mua lẻ lưu trong nhà) */
  unlocked: RoomId[];
  /** Cập nhật hồ sơ của con đang chơi, dựa trên dữ liệu mới nhất */
  onChange: (fn: (p: Profile) => Profile) => void;
  /** Ra phố */
  onExit: () => void;
  onBack: () => void;
}) {
  const [where, setWhere] = useState<Where>({ room: "khach", entry: [0, 4] });
  const [mode, setMode] = useState<Mode>("play");
  const [selected, setSelected] = useState<string | undefined>();
  const [holding, setHolding] = useState<string | undefined>();
  const [msg, setMsg] = useState<string | null>(null);
  /** Đồ dùng vừa chạm (bồn cầu, tủ lạnh...) để hiện các hành động */
  const [using, setUsing] = useState<string | undefined>();
  const [act, setAct] = useState<{ uid: string; action: HomeAction; n: number } | null>(null);
  const [gaming, setGaming] = useState(false);

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg((m) => (m === t ? null : m)), 2200);
  };
  const resetTools = () => {
    setSelected(undefined);
    setHolding(undefined);
    setUsing(undefined);
  };

  const mine = editable;
  const home = migrateHome(editable ? me.home : ownerHome);
  const unlocked = [...new Set([...tierRooms, ...(home.bought ?? [])])];
  const roomId = unlocked.includes(where.room) ? where.room : "khach";
  const room = home.rooms[roomId];
  const n = roomSize(room);
  const doors = ROOMS[roomId].doors.filter((d) => d.to === "pho" || unlocked.includes(d.to));
  const owned = new Set(me.owned);

  const setRoom = (fn: (r: RoomState) => RoomState) =>
    onChange((p) => {
      const h = migrateHome(p.home);
      return { ...p, home: { ...h, rooms: { ...h.rooms, [roomId]: fn(h.rooms[roomId]) } } };
    });

  // Mỗi món chỉ đặt được một chỗ trong cả ngôi nhà
  const placedIds = new Set(ROOM_ORDER.flatMap((r) => [...home.rooms[r].floor.map((f) => f.id), ...home.rooms[r].wall.map((w) => w.id)]));
  const inventory = HOME_ITEMS.filter((i) => owned.has(i.id) && (i.kind === "floor" || i.kind === "wall") && !placedIds.has(i.id));
  const themesOwned = HOME_ITEMS.filter((i) => owned.has(i.id) && (i.kind === "wallpaper" || i.kind === "flooring"));
  const sel = selected ? room.floor.find((f) => f.uid === selected) ?? room.wall.find((w) => w.uid === selected) : undefined;
  const selItem = sel ? HOME_MAP[sel.id] : undefined;
  const held = holding ? HOME_MAP[holding] : undefined;
  const usingPlaced = using ? room.floor.find((f) => f.uid === using) : undefined;
  const usingItem = usingPlaced ? HOME_MAP[usingPlaced.id] : undefined;
  const usingActions = usingPlaced ? actionsFor(usingPlaced.id) : undefined;
  const lockedRooms = ROOM_ORDER.filter((r) => !unlocked.includes(r) && ROOM_PRICE[r] > 0);

  function go(to: DoorTarget) {
    resetTools();
    if (to === "pho") return onExit();
    // Xuất hiện ở ô trước cửa dẫn ngược về phòng vừa rời
    const back = ROOMS[to].doors.find((d) => d.to === roomId) ?? ROOMS[to].doors[0];
    setWhere({ room: to, entry: doorTile(back) });
  }

  function onTile(x: number, y: number) {
    if (held?.kind === "floor") {
      for (const rot of [0, 1] as const) {
        if (canPlace(room.floor, held, x, y, rot, undefined, doors, n)) {
          setRoom((r) => ({ ...r, floor: [...r.floor, { uid: newId(), id: held.id, x, y, rot }] }));
          setHolding(undefined);
          return;
        }
      }
      return flash("Chỗ này chật quá (hoặc chắn cửa), chọn ô khác nhé!");
    }
    const f = room.floor.find((p) => p.uid === selected);
    if (f) {
      const it = HOME_MAP[f.id];
      if (canPlace(room.floor, it, x, y, f.rot, f.uid, doors, n)) setRoom((r) => ({ ...r, floor: r.floor.map((p) => (p.uid === f.uid ? { ...p, x, y } : p)) }));
      else flash("Không chuyển tới đó được, chật quá!");
      return;
    }
    setSelected(undefined);
  }

  function onWall(side: "L" | "R", i: number) {
    const it = held?.kind === "wall" ? held : selItem?.kind === "wall" ? selItem : undefined;
    if (!it) return;
    const start = Math.min(i, n - it.w);
    const skip = held ? undefined : selected;
    if (!canHang(room.wall, it, side, start, skip, doors, n)) return flash("Chỗ này đã có đồ hoặc có cửa rồi!");
    if (held) {
      setRoom((r) => ({ ...r, wall: [...r.wall, { uid: newId(), id: it.id, side, i: start }] }));
      setHolding(undefined);
    } else {
      setRoom((r) => ({ ...r, wall: r.wall.map((w) => (w.uid === selected ? { ...w, side, i: start } : w)) }));
    }
  }

  function rotate() {
    const f = room.floor.find((p) => p.uid === selected);
    if (!f) return;
    const it = HOME_MAP[f.id];
    const rot = (f.rot ? 0 : 1) as 0 | 1;
    if (canPlace(room.floor, it, f.x, f.y, rot, f.uid, doors, n)) setRoom((r) => ({ ...r, floor: r.floor.map((p) => (p.uid === f.uid ? { ...p, rot } : p)) }));
    else flash("Không đủ chỗ để xoay!");
  }

  function store() {
    setRoom((r) => ({ ...r, floor: r.floor.filter((p) => p.uid !== selected), wall: r.wall.filter((w) => w.uid !== selected) }));
    setSelected(undefined);
  }

  /** Mở rộng phòng đang đứng thêm một ô mỗi cạnh */
  function expand() {
    const next = n + 1;
    const cost = EXPAND_COST[next];
    if (!cost) return;
    if (me.coins < cost) return flash(`Con cần thêm ${cost - me.coins} xu để mở rộng phòng. Chăm học nhé! 📚`);
    onChange((p) => {
      const h = migrateHome(p.home);
      const r = h.rooms[roomId];
      if (p.coins < cost || roomSize(r) !== n) return p;
      return { ...p, coins: p.coins - cost, home: { ...h, rooms: { ...h.rooms, [roomId]: { ...r, size: next } } } };
    });
    flash(`📐 ${ROOMS[roomId].name} đã rộng ${next} × ${next} ô!`);
  }

  /** Mua lẻ một phòng chưa có */
  function buyRoom(r: RoomId) {
    const cost = ROOM_PRICE[r];
    if (me.coins < cost) return flash(`Con cần thêm ${cost - me.coins} xu để thêm ${ROOMS[r].name.toLowerCase()}.`);
    onChange((p) => {
      const h = migrateHome(p.home);
      if (p.coins < cost || h.bought?.includes(r)) return p;
      return { ...p, coins: p.coins - cost, home: { ...h, bought: [...(h.bought ?? []), r] } };
    });
    flash(`🚪 Nhà có thêm ${ROOMS[r].name.toLowerCase()}! Đi qua cửa ở phòng khách để vào nhé.`);
  }

  function applyTheme(it: HomeItem) {
    setRoom((r) => (it.kind === "wallpaper" ? { ...r, wallpaper: it.id } : { ...r, flooring: it.id }));
  }


  return (
    <div className="stack">
      <div className="topbar">
        <button className="btn" onClick={onBack}>
          ← Sảnh
        </button>
        <span className="pill pill-coin">⭐ {me.coins}</span>
      </div>
      <h1>
        {ROOMS[roomId].icon} {ROOMS[roomId].name}
      </h1>
      <div className="muted" style={{ marginTop: -8 }}>
        <button className="btn btn-ghost" style={{ padding: "0 4px" }} onClick={onExit}>
          🏘️ Khu phố
        </button>
        › Nhà {ownerName} › {ROOMS[roomId].name}
      </div>

      {/* Chuyển phòng nhanh */}
      <div className="tabs">
        {ROOM_ORDER.filter((r) => unlocked.includes(r)).map((r) => (
          <button
            key={r}
            className={`tab ${r === roomId ? "on" : ""}`}
            onClick={() => {
              resetTools();
              setWhere({ room: r, entry: doorTile(ROOMS[r].doors.find((d) => d.to !== "pho") ?? ROOMS[r].doors[0]) });
            }}
          >
            {ROOMS[r].icon} {ROOMS[r].name}
          </button>
        ))}
      </div>

      {mine ? (
        <div className="tabs">
          {([
            ["play", "🚶 Đi dạo"],
            ["arrange", "✏️ Sắp xếp"],
          ] as [Mode, string][]).map(([m, label]) => (
            <button
              key={m}
              className={`tab ${mode === m ? "on" : ""}`}
              onClick={() => {
                setMode(m);
                resetTools();
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div className="banner">👋 Con đang đi thăm nhà {ownerName}. Chỉ chủ nhà mới sắp xếp được đồ nhé!</div>
      )}

      {(
        <div className="room-card">
          <Room
            key={`${ownerName}-${roomId}`}
            room={room}
            doors={doors}
            entry={where.entry}
            onDoor={go}
            look={me.look}
            mode={mine && mode === "arrange" ? "arrange" : "play"}
            selectedUid={selected}
            wallTarget={held?.kind === "wall" || selItem?.kind === "wall"}
            onTile={onTile}
            onWall={onWall}
            onItem={(uid) => {
              setHolding(undefined);
              setSelected(uid === selected ? undefined : uid);
            }}
            onInteract={(uid) => setUsing(uid)}
            act={act}
          />
        </div>
      )}

      {msg && <div className="banner pop">{msg}</div>}

      {(mode === "play" || !mine) && usingItem && usingActions && (
        <div className="card stack pop">
          <div className="row between">
            <strong>{usingItem.name}</strong>
            <button className="btn btn-ghost" onClick={() => setUsing(undefined)}>
              Đóng
            </button>
          </div>
          <div className="row wrap">
            {usingActions.map((a) => (
              <button
                key={a.act}
                className="btn btn-blue"
                onClick={() => {
                  if (a.act === "game") return setGaming(true);
                  setAct((old) => ({ uid: using!, action: a.act, n: (old?.n ?? 0) + 1 }));
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {(mode === "play" || !mine) && !usingItem && (
        <div className="muted center">Chạm vào sàn để đi. Chạm vào đồ như bồn cầu, tủ lạnh, máy chơi game để dùng. Chạm vào cửa để sang phòng khác hoặc ra phố.</div>
      )}
      {gaming && <GameCenter me={me} onChange={onChange} onClose={() => setGaming(false)} />}

      {mine && mode === "arrange" && (
        <div className="stack">
          {held && (
            <div className="card row between pop">
              <span>
                Đang cầm <strong>{held.name}</strong>: chạm vào {held.kind === "wall" ? "tường (ô vàng)" : "sàn"} để đặt.
              </span>
              <button className="btn" onClick={() => setHolding(undefined)}>
                Thôi
              </button>
            </div>
          )}
          {sel && selItem && (
            <div className="card stack pop">
              <strong>{selItem.name}</strong>
              <span className="muted" style={{ fontSize: 14 }}>
                Chạm vào {selItem.kind === "wall" ? "chỗ khác trên tường" : "ô khác trên sàn"} để chuyển tới đó.
              </span>
              <div className="row wrap">
                {selItem.kind === "floor" && selItem.w !== selItem.d && (
                  <button className="btn" onClick={rotate}>
                    ↻ Xoay
                  </button>
                )}
                <button className="btn" onClick={store}>
                  📦 Cất vào kho
                </button>
                <button className="btn btn-primary" onClick={() => setSelected(undefined)}>
                  Xong
                </button>
              </div>
            </div>
          )}
          {!held && !sel && (
            <>
              <strong>📦 Kho đồ ({inventory.length})</strong>
              {inventory.length === 0 && <div className="muted">Kho trống. Ra 🏘️ Khu phố, vào các cửa hàng để mua thêm đồ nhé!</div>}
              <div className="items">
                {inventory.map((it) => (
                  <button key={it.id} className={`item r-${it.rarity}`} onClick={() => setHolding(it.id)}>
                    <HomeThumb item={it} size={70} />
                    <span>{it.name}</span>
                  </button>
                ))}
              </div>
              <strong>🎨 Tường và sàn cho {ROOMS[roomId].name.toLowerCase()}</strong>
              <div className="items">
                {themesOwned.map((it) => {
                  const on = room.wallpaper === it.id || room.flooring === it.id;
                  return (
                    <button key={it.id} className={`item r-${it.rarity} ${on ? "on" : ""}`} onClick={() => applyTheme(it)}>
                      <HomeThumb item={it} size={60} />
                      <span>{it.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="muted" style={{ fontSize: 14 }}>
                Chạm vào đồ trong phòng để chuyển chỗ, xoay hoặc cất vào kho. Đồ trong kho đặt được ở bất kì phòng nào.
              </div>
              <strong>📐 Mở rộng {ROOMS[roomId].name.toLowerCase()}</strong>
              {n < ROOM_MAX ? (
                <div className="row wrap">
                  <span className="muted">
                    Đang rộng {n} × {n} ô.
                  </span>
                  <button className="btn btn-gold" onClick={expand}>
                    Mở rộng thành {n + 1} × {n + 1} ⭐ {EXPAND_COST[n + 1]}
                  </button>
                </div>
              ) : (
                <span className="muted">Phòng đã rộng nhất ({n} × {n} ô).</span>
              )}
              {lockedRooms.length > 0 && (
                <>
                  <strong>🚪 Thêm phòng</strong>
                  <div className="row wrap">
                    {lockedRooms.map((r) => (
                      <button key={r} className="btn" onClick={() => buyRoom(r)}>
                        {ROOMS[r].icon} {ROOMS[r].name} ⭐ {ROOM_PRICE[r]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
