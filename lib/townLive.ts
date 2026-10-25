import { RealtimeClient, type RealtimeChannel } from "@supabase/realtime-js";
import { townOnline } from "./townCloud";
import type { Look } from "./types";

/**
 * Vị trí trực tiếp của các bạn đang mở khu phố (Supabase Realtime: presence + broadcast,
 * không lưu vào cơ sở dữ liệu). Toạ độ tính theo ô, gốc là góc công viên để mọi máy khớp nhau
 * dù bản đồ đang mở rộng tới vòng nào.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface LivePeer {
  id: string;
  name: string;
  look: Look;
  x: number;
  y: number;
  back: boolean;
  at: number;
}

export interface LiveHandle {
  move: (x: number, y: number, back: boolean) => void;
  leave: () => void;
}

let client: RealtimeClient | null = null;

export function joinLive(
  town: string,
  me: { id: string; name: string; look: Look },
  start: { x: number; y: number },
  onPeers: (peers: Map<string, LivePeer>) => void,
): LiveHandle {
  if (!townOnline || !URL || !KEY) return { move: () => {}, leave: () => {} };
  client ??= new RealtimeClient(`${URL.replace(/^http/, "ws")}/realtime/v1`, { params: { apikey: KEY } });
  client.connect();

  const peers = new Map<string, LivePeer>();
  const emit = () => onPeers(new Map(peers));
  const channel: RealtimeChannel = client.channel(`town-live:${town}`, {
    config: { broadcast: { self: false }, presence: { key: me.id } },
  });
  let last = { x: start.x, y: start.y, back: false };

  channel.on("presence", { event: "sync" }, () => {
    const state = channel.presenceState<{ id: string; name: string; look: Look; x: number; y: number }>();
    const online = new Set<string>();
    for (const [key, metas] of Object.entries(state)) {
      const m = metas[metas.length - 1];
      if (!m || key === me.id) continue;
      online.add(key);
      const old = peers.get(key);
      peers.set(key, { id: key, name: m.name, look: m.look, x: old?.x ?? m.x, y: old?.y ?? m.y, back: old?.back ?? false, at: Date.now() });
    }
    for (const id of [...peers.keys()]) if (!online.has(id)) peers.delete(id);
    emit();
  });
  channel.on("broadcast", { event: "pos" }, ({ payload }) => {
    const p = payload as { id: string; x: number; y: number; back: boolean };
    const old = peers.get(p.id);
    if (!old) return;
    peers.set(p.id, { ...old, x: p.x, y: p.y, back: p.back, at: Date.now() });
    emit();
  });
  // Có bạn mới vào: gửi ngay vị trí hiện tại để bạn ấy thấy mình đứng đúng chỗ
  channel.on("presence", { event: "join" }, ({ key }) => {
    if (key !== me.id) void channel.send({ type: "broadcast", event: "pos", payload: { id: me.id, ...last } });
  });
  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") void channel.track({ id: me.id, name: me.name, look: me.look, x: last.x, y: last.y });
  });

  // Gửi vị trí tối đa 5 lần/giây; vị trí cuối cùng luôn được gửi
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastSent = 0;
  const send = () => {
    timer = null;
    lastSent = Date.now();
    void channel.send({ type: "broadcast", event: "pos", payload: { id: me.id, ...last } });
  };
  return {
    move(x, y, back) {
      last = { x, y, back };
      if (timer) return;
      const wait = Math.max(0, 200 - (Date.now() - lastSent));
      timer = setTimeout(send, wait);
    },
    leave() {
      if (timer) clearTimeout(timer);
      void channel.untrack();
      void client?.removeChannel(channel);
    },
  };
}
