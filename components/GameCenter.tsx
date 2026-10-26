"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HOME_ITEMS } from "@/lib/home";
import { sfx, unlock } from "@/lib/sound";
import type { Profile } from "@/lib/types";

/** Máy chơi game trong nhà: 4 trò nhỏ, mỗi lượt 100 xu, chơi tốt được thưởng lại */
const COST = 100;
type GameId = "claw" | "stack" | "snake" | "eggs";
const GAMES: { id: GameId; name: string; icon: string; desc: string }[] = [
  { id: "claw", name: "Gắp thú", icon: "🧸", desc: "Di chuyển cần gắp rồi bấm Gắp. Gắp được thú là nhận quà!" },
  { id: "stack", name: "Xếp Lego", icon: "🧱", desc: "Chạm đúng lúc để thả khối gạch chồng lên nhau thật cao." },
  { id: "snake", name: "Ăn kim cương", icon: "💎", desc: "Điều khiển rắn ăn kim cương, đừng đâm vào tường!" },
  { id: "eggs", name: "Bắn trứng", icon: "🥚", desc: "Bắn trứng vào cột, 3 quả cùng màu liền nhau sẽ vỡ." },
];

type Result = { text: string; coins: number; itemId?: string };

export function GameCenter({ me, onChange, onClose }: { me: Profile; onChange: (fn: (p: Profile) => Profile) => void; onClose: () => void }) {
  const [game, setGame] = useState<GameId | null>(null);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function start(id: GameId) {
    unlock();
    if (me.coins < COST) return setMsg(`Mỗi lượt chơi cần ${COST} xu. Con làm thêm bài để kiếm xu nhé! 📚`);
    onChange((p) => (p.coins >= COST ? { ...p, coins: p.coins - COST } : p));
    sfx.coin();
    setMsg(null);
    setResult(null);
    setGame(id);
    setRound((r) => r + 1);
  }

  function finish(r: Result) {
    if (r.coins || r.itemId) {
      onChange((p) => ({ ...p, coins: p.coins + r.coins, owned: r.itemId && !p.owned.includes(r.itemId) ? [...p.owned, r.itemId] : p.owned }));
      sfx.win();
    } else sfx.lose();
    setResult(r);
  }

  const info = GAMES.find((g) => g.id === game);
  return (
    <div className="game-overlay" role="dialog" aria-label="Máy chơi game">
      <div className="game-box stack">
        <div className="row between">
          <strong style={{ fontSize: 20 }}>🎮 {info ? info.name : "Máy chơi game"}</strong>
          <span className="pill pill-coin">⭐ {me.coins}</span>
        </div>

        {!game && (
          <>
            <div className="muted">Mỗi lượt chơi {COST} xu. Chơi giỏi sẽ được thưởng xu hoặc quà!</div>
            <div className="game-menu">
              {GAMES.map((g) => (
                <button key={g.id} className="btn game-card" onClick={() => start(g.id)}>
                  <span style={{ fontSize: 40 }}>{g.icon}</span>
                  <strong>{g.name}</strong>
                  <span className="muted" style={{ fontSize: 13 }}>{g.desc}</span>
                  <span className="price">⭐ {COST}</span>
                </button>
              ))}
            </div>
            {msg && <div className="banner pop">{msg}</div>}
            <button className="btn" onClick={onClose}>
              Đóng máy chơi game
            </button>
          </>
        )}

        {game && !result && (
          <>
            <div className="muted" style={{ fontSize: 14 }}>{info?.desc}</div>
            {game === "claw" && <ClawGame key={round} owned={me.owned} onEnd={finish} />}
            {game === "stack" && <StackGame key={round} onEnd={finish} />}
            {game === "snake" && <SnakeGame key={round} onEnd={finish} />}
            {game === "eggs" && <EggGame key={round} onEnd={finish} />}
          </>
        )}

        {game && result && (
          <div className="card center stack pop" style={{ alignItems: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{result.text}</div>
            {result.itemId && <div>🎁 Nhận quà: <strong>{HOME_ITEMS.find((i) => i.id === result.itemId)?.name}</strong> (đã vào kho đồ nhà)</div>}
            {result.coins > 0 && <div>Thưởng +{result.coins} ⭐</div>}
            {msg && <div className="banner">{msg}</div>}
            <div className="row wrap" style={{ justifyContent: "center" }}>
              <button className="btn btn-gold" onClick={() => start(game)}>
                Chơi lại ⭐ {COST}
              </button>
              <button className="btn" onClick={() => { setGame(null); setResult(null); }}>
                Chọn trò khác
              </button>
              <button className="btn" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        )}
        {game && !result && (
          <button className="btn btn-ghost" onClick={() => finish({ text: "Đã dừng lượt chơi.", coins: 0 })}>
            Dừng lượt này
          </button>
        )}
      </div>
    </div>
  );
}

function Pad({ children }: { children: ReactNode }) {
  return <div className="row" style={{ justifyContent: "center", gap: 10, flexWrap: "wrap" }}>{children}</div>;
}

// ---------- Gắp thú ----------

const PLUSH = ["🧸", "🐰", "🦄", "🐻", "🐥", "🐼", "🐸", "🦊"];

function ClawGame({ owned, onEnd }: { owned: string[]; onEnd: (r: Result) => void }) {
  const W = 300, H = 340;
  const [prizes] = useState(() => Array.from({ length: 6 }, (_, i) => ({ x: 70 + i * 38 + (Math.random() * 10 - 5), e: PLUSH[Math.floor(Math.random() * PLUSH.length)] })));
  const [cx, setCx] = useState(150);
  const [cy, setCy] = useState(40);
  const [phase, setPhase] = useState<"aim" | "down" | "up" | "carry" | "done">("aim");
  const [held, setHeld] = useState<number | null>(null);
  const hold = useRef<ReturnType<typeof setInterval> | null>(null);

  const move = (d: number) => setCx((x) => Math.max(40, Math.min(W - 24, x + d)));
  const press = (d: number) => {
    if (phase !== "aim") return;
    move(d);
    hold.current = setInterval(() => move(d), 40);
  };
  const release = () => {
    if (hold.current) clearInterval(hold.current);
    hold.current = null;
  };
  useEffect(() => () => release(), []);

  function grab() {
    if (phase !== "aim") return;
    release();
    setPhase("down");
    let y = 40;
    const down = setInterval(() => {
      y += 8;
      setCy(y);
      if (y >= 270) {
        clearInterval(down);
        // Có thú ngay dưới cần gắp không? Gắp trúng vẫn có thể bị tuột
        const near = prizes.map((p, i) => ({ i, d: Math.abs(p.x - cx) })).sort((a, b) => a.d - b.d)[0];
        const caught = near && near.d < 16 && Math.random() < 0.7 ? near.i : null;
        setHeld(caught);
        setPhase("up");
        const up = setInterval(() => {
          y -= 8;
          setCy(y);
          if (y <= 40) {
            clearInterval(up);
            // Tuột giữa đường lên
            if (caught !== null && Math.random() < 0.15) setHeld(null);
            setPhase("carry");
            let x = cx;
            const carry = setInterval(() => {
              x = Math.max(30, x - 6);
              setCx(x);
              if (x <= 32) {
                clearInterval(carry);
                setPhase("done");
              }
            }, 30);
          }
        }, 30);
      }
    }, 30);
  }

  useEffect(() => {
    if (phase !== "done") return;
    if (held === null) return onEnd({ text: "Tiếc quá, thú bị tuột mất rồi! 😅", coins: 0 });
    const pool = HOME_ITEMS.filter((i) => i.cat === "vuichoi" && !i.starter && !owned.includes(i.id) && i.price <= 400);
    const item = pool.length ? pool[Math.floor(Math.random() * pool.length)] : undefined;
    onEnd(item ? { text: `Gắp được ${prizes[held].e}! Giỏi quá! 🎉`, coins: 0, itemId: item.id } : { text: `Gắp được ${prizes[held].e}! 🎉`, coins: 150 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div className="stack" style={{ alignItems: "center" }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="game-svg">
        <rect x={0} y={0} width={W} height={H} rx={16} fill="#fde7f3" stroke="#3d2c2c" strokeWidth={3} />
        <rect x={6} y={6} width={W - 12} height={H - 12} rx={12} fill="#e0f2fe" opacity={0.7} />
        <rect x={0} y={20} width={W} height={8} fill="#64748b" />
        <rect x={6} y={290} width={52} height={44} fill="#fbbf24" stroke="#3d2c2c" strokeWidth={2} />
        <text x={32} y={318} textAnchor="middle" fontSize={11} fontWeight={800}>QUÀ</text>
        {prizes.map((p, i) => (held === i && phase !== "aim" && phase !== "down" ? null : <text key={i} x={p.x} y={300} textAnchor="middle" fontSize={30}>{p.e}</text>))}
        <line x1={cx} y1={28} x2={cx} y2={cy} stroke="#334155" strokeWidth={3} />
        <g transform={`translate(${cx} ${cy})`}>
          <rect x={-14} y={-6} width={28} height={10} rx={3} fill="#94a3b8" stroke="#334155" strokeWidth={2} />
          <path d={held !== null ? "M-12 4 L-6 22 M12 4 L6 22" : "M-12 4 L-18 22 M12 4 L18 22"} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
          {held !== null && phase !== "down" && <text x={0} y={34} textAnchor="middle" fontSize={26}>{prizes[held].e}</text>}
        </g>
      </svg>
      <Pad>
        <button className="btn" onPointerDown={() => press(-6)} onPointerUp={release} onPointerLeave={release} disabled={phase !== "aim"}>◀</button>
        <button className="btn btn-gold" onClick={grab} disabled={phase !== "aim"}>Gắp!</button>
        <button className="btn" onPointerDown={() => press(6)} onPointerUp={release} onPointerLeave={release} disabled={phase !== "aim"}>▶</button>
      </Pad>
    </div>
  );
}

// ---------- Xếp Lego ----------

const BRICKS = ["#ef4444", "#f59e0b", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

function StackGame({ onEnd }: { onEnd: (r: Result) => void }) {
  const COLS = 10, ROWS = 12;
  const [rows, setRows] = useState<{ x: number; w: number }[]>([{ x: 3, w: 4 }]);
  const [cur, setCur] = useState({ x: 0, w: 4, dir: 1 });
  const curRef = useRef(cur);
  curRef.current = cur;
  const over = useRef(false);

  useEffect(() => {
    const speed = Math.max(70, 230 - rows.length * 13);
    const t = setInterval(() => {
      setCur((c) => {
        let x = c.x + c.dir, dir = c.dir;
        if (x + c.w > COLS || x < 0) { dir = -dir; x = c.x + dir; }
        return { ...c, x, dir };
      });
    }, speed);
    return () => clearInterval(t);
  }, [rows.length]);

  function drop() {
    if (over.current) return;
    const c = curRef.current, top = rows[rows.length - 1];
    const l = Math.max(c.x, top.x), r = Math.min(c.x + c.w, top.x + top.w);
    if (r <= l) {
      over.current = true;
      const h = rows.length - 1;
      return onEnd({ text: `Đổ tháp rồi! Con xếp được ${h} tầng.`, coins: Math.min(300, h * 15) });
    }
    sfx.pop();
    const next = [...rows, { x: l, w: r - l }];
    setRows(next);
    if (next.length > ROWS) {
      over.current = true;
      return onEnd({ text: "Xây tới đỉnh luôn! Siêu quá! 🏆", coins: (next.length - 1) * 15 + 100 });
    }
    setCur({ x: 0, w: r - l, dir: 1 });
  }

  const cell = 26;
  return (
    <div className="stack" style={{ alignItems: "center" }}>
      <svg viewBox={`0 0 ${COLS * cell} ${(ROWS + 1) * cell}`} className="game-svg" onPointerDown={drop}>
        <rect x={0} y={0} width={COLS * cell} height={(ROWS + 1) * cell} fill="#f1f5f9" />
        {rows.map((r, i) => (
          <g key={i}>
            {Array.from({ length: r.w }, (_, k) => (
              <g key={k}>
                <rect x={(r.x + k) * cell + 1} y={(ROWS - i) * cell + 1} width={cell - 2} height={cell - 2} rx={3} fill={BRICKS[i % BRICKS.length]} stroke="#3d2c2c" strokeWidth={1.5} />
                <circle cx={(r.x + k) * cell + cell / 2} cy={(ROWS - i) * cell + 6} r={4} fill="#ffffff" opacity={0.5} />
              </g>
            ))}
          </g>
        ))}
        {rows.length <= ROWS && Array.from({ length: cur.w }, (_, k) => (
          <rect key={k} x={(cur.x + k) * cell + 1} y={(ROWS - rows.length) * cell + 1} width={cell - 2} height={cell - 2} rx={3} fill={BRICKS[rows.length % BRICKS.length]} stroke="#3d2c2c" strokeWidth={1.5} />
        ))}
      </svg>
      <Pad>
        <button className="btn btn-gold btn-big" onClick={drop}>Thả gạch! (tầng {rows.length - 1})</button>
      </Pad>
    </div>
  );
}

// ---------- Rắn ăn kim cương ----------

function SnakeGame({ onEnd }: { onEnd: (r: Result) => void }) {
  const N = 12;
  const [snake, setSnake] = useState<[number, number][]>([[5, 6], [4, 6], [3, 6]]);
  const [gem, setGem] = useState<[number, number]>([9, 6]);
  const [score, setScore] = useState(0);
  const snakeRef = useRef(snake);
  const gemRef = useRef(gem);
  const scoreRef = useRef(0);
  const dir = useRef<[number, number]>([1, 0]);
  const queued = useRef<[number, number] | null>(null);
  const over = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const turn = (d: [number, number]) => {
    const c = queued.current ?? dir.current;
    if (c[0] === -d[0] && c[1] === -d[1]) return;
    queued.current = d;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      if (m[e.key]) { e.preventDefault(); turn(m[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (over.current) return;
      if (queued.current) { dir.current = queued.current; queued.current = null; }
      const s0 = snakeRef.current;
      const head: [number, number] = [s0[0][0] + dir.current[0], s0[0][1] + dir.current[1]];
      const hitWall = head[0] < 0 || head[1] < 0 || head[0] >= N || head[1] >= N;
      const hitSelf = s0.some(([x, y]) => x === head[0] && y === head[1]);
      if (hitWall || hitSelf) {
        over.current = true;
        const sc = scoreRef.current;
        onEnd({ text: `Ối, rắn đâm ${hitWall ? "tường" : "vào mình"}! Ăn được ${sc} 💎`, coins: Math.min(300, sc * 15) });
        return;
      }
      const g0 = gemRef.current;
      const ate = head[0] === g0[0] && head[1] === g0[1];
      const body: [number, number][] = [head, ...s0];
      if (!ate) body.pop();
      else {
        sfx.coin();
        scoreRef.current += 1;
        setScore(scoreRef.current);
        let g: [number, number];
        do g = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)];
        while (body.some(([x, y]) => x === g[0] && y === g[1]));
        gemRef.current = g;
        setGem(g);
      }
      snakeRef.current = body;
      setSnake(body);
    }, 170);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cell = 24;
  return (
    <div className="stack" style={{ alignItems: "center" }}>
      <div><strong>💎 {score}</strong></div>
      <svg
        viewBox={`0 0 ${N * cell} ${N * cell}`}
        className="game-svg"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const t = touch.current;
          touch.current = null;
          if (!t) return;
          const dx = e.clientX - t.x, dy = e.clientY - t.y;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
          turn(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]);
        }}
      >
        <rect width={N * cell} height={N * cell} fill="#dcfce7" />
        {Array.from({ length: N * N }, (_, i) => ((Math.floor(i / N) + i) % 2 ? <rect key={i} x={(i % N) * cell} y={Math.floor(i / N) * cell} width={cell} height={cell} fill="#bbf7d0" /> : null))}
        <text x={gem[0] * cell + cell / 2} y={gem[1] * cell + cell - 4} textAnchor="middle" fontSize={20}>💎</text>
        {snake.map(([x, y], i) => (
          <rect key={i} x={x * cell + 2} y={y * cell + 2} width={cell - 4} height={cell - 4} rx={7} fill={i ? "#22c55e" : "#15803d"} stroke="#3d2c2c" strokeWidth={1.5} />
        ))}
      </svg>
      <div className="snake-pad">
        <span />
        <button className="btn" onClick={() => turn([0, -1])}>▲</button>
        <span />
        <button className="btn" onClick={() => turn([-1, 0])}>◀</button>
        <span />
        <button className="btn" onClick={() => turn([1, 0])}>▶</button>
        <span />
        <button className="btn" onClick={() => turn([0, 1])}>▼</button>
        <span />
      </div>
    </div>
  );
}

// ---------- Bắn trứng ----------

const EGG = ["#ef4444", "#3b82f6", "#22c55e", "#facc15"];

function EggGame({ onEnd }: { onEnd: (r: Result) => void }) {
  const COLS = 7, MAXH = 10;
  const rnd = () => Math.floor(Math.random() * EGG.length);
  // Mỗi cột là một chồng trứng tính từ trên xuống
  const [cols, setCols] = useState<number[][]>(() => Array.from({ length: COLS }, () => Array.from({ length: 4 }, rnd)));
  const [next, setNext] = useState(rnd);
  const [popped, setPopped] = useState(0);
  const [shots, setShots] = useState(0);
  const over = useRef(false);

  function shoot(c: number) {
    if (over.current) return;
    const g = cols.map((col) => [...col]);
    g[c].push(next);
    const row = g[c].length - 1;
    // Tìm nhóm cùng màu dính nhau (trên, dưới, trái, phải)
    const seen = new Set<string>();
    const stack: [number, number][] = [[c, row]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      const k = `${x},${y}`;
      if (seen.has(k) || g[x]?.[y] !== next) continue;
      seen.add(k);
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    let gained = 0;
    if (seen.size >= 3) {
      gained = seen.size;
      for (const k of seen) {
        const [x, y] = k.split(",").map(Number);
        g[x][y] = -1;
      }
      for (let x = 0; x < COLS; x++) g[x] = g[x].filter((v) => v >= 0);
      sfx.pop();
      setTimeout(() => sfx.pop(), 90);
    }
    // Cứ 5 phát lại có một hàng trứng mới chen xuống từ trên
    const s = shots + 1;
    if (s % 5 === 0) for (let x = 0; x < COLS; x++) g[x].unshift(rnd());
    setShots(s);
    setCols(g);
    setNext(rnd());
    const total = popped + gained;
    setPopped(total);
    if (g.some((col) => col.length >= MAXH)) {
      over.current = true;
      onEnd({ text: `Trứng chạm đáy rồi! Con làm vỡ ${total} quả 🥚`, coins: Math.min(300, total * 4) });
    } else if (g.every((col) => !col.length)) {
      over.current = true;
      onEnd({ text: "Bắn sạch trứng! Xuất sắc! 🏆", coins: Math.min(300, total * 4) + 100 });
    }
  }

  const cell = 36;
  return (
    <div className="stack" style={{ alignItems: "center" }}>
      <div className="row" style={{ gap: 16 }}>
        <strong>🥚 Vỡ: {popped}</strong>
        <span>
          Quả tiếp theo: <svg width={22} height={26} style={{ verticalAlign: "middle" }}><ellipse cx={11} cy={14} rx={9} ry={11} fill={EGG[next]} stroke="#3d2c2c" strokeWidth={1.5} /></svg>
        </span>
      </div>
      <svg viewBox={`0 0 ${COLS * cell} ${MAXH * cell + 10}`} className="game-svg">
        <rect width={COLS * cell} height={MAXH * cell + 10} fill="#fff7ed" />
        <rect x={0} y={(MAXH - 1) * cell} width={COLS * cell} height={cell + 10} fill="#fee2e2" />
        {cols.map((col, x) => (
          <g key={x} onPointerDown={() => shoot(x)} style={{ cursor: "pointer" }}>
            <rect x={x * cell} y={0} width={cell} height={MAXH * cell + 10} fill={x % 2 ? "#fef3c7" : "#fffbeb"} opacity={0.6} />
            {col.map((v, y) => (
              <ellipse key={y} cx={x * cell + cell / 2} cy={y * cell + cell / 2 + 2} rx={cell / 2 - 5} ry={cell / 2 - 2} fill={EGG[v]} stroke="#3d2c2c" strokeWidth={1.5} />
            ))}
          </g>
        ))}
      </svg>
      <div className="muted" style={{ fontSize: 13 }}>Chạm vào một cột để bắn quả trứng tiếp theo lên cột đó.</div>
    </div>
  );
}
