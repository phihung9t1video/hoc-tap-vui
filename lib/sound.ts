/**
 * Âm thanh tự tạo bằng Web Audio (không dùng tệp nhạc): nhạc nền khu phố, tiếng bước chân,
 * xả nước, vòi nước, tủ lạnh, tiếng xu, thắng/thua trong trò chơi.
 * Trình duyệt (nhất là iPhone) chỉ cho phát tiếng sau khi người dùng chạm: gọi unlock() trong sự kiện chạm.
 */
const MUTE_KEY = "hoctap_sound_off_v1";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(off: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, off ? "1" : "0");
  } catch {
    // bỏ qua
  }
  if (master) master.gain.value = off ? 0 : 1;
  if (off) stopMusic();
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = isMuted() ? 0 : 1;
    master.connect(ctx.destination);
  }
  return ctx;
}

/** Gọi khi người dùng chạm lần đầu để trình duyệt cho phép phát tiếng */
export function unlock() {
  const c = ac();
  if (c && c.state === "suspended") void c.resume();
}

function noise(c: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  return s;
}

function tone(freq: number, start: number, dur: number, vol: number, type: OscillatorType = "sine", out?: AudioNode) {
  const c = ac();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(out ?? master);
  o.start(start);
  o.stop(start + dur + 0.05);
}

/** Tiếng ồn lọc (nước, bước chân...) */
function burst(dur: number, vol: number, filter: { type: BiquadFilterType; from: number; to?: number; q?: number }, delay = 0) {
  const c = ac();
  if (!c || !master || isMuted()) return;
  const t = c.currentTime + delay;
  const src = noise(c);
  const f = c.createBiquadFilter();
  f.type = filter.type;
  f.Q.value = filter.q ?? 1;
  f.frequency.setValueAtTime(filter.from, t);
  if (filter.to) f.frequency.exponentialRampToValueAtTime(filter.to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + Math.min(0.05, dur / 4));
  g.gain.linearRampToValueAtTime(vol * 0.8, t + dur * 0.7);
  g.gain.linearRampToValueAtTime(0, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random());
  src.stop(t + dur + 0.05);
}

// ---------- Hiệu ứng ----------

let stepFoot = false;
/** Tiếng bước chân: gọi mỗi bước (khoảng 3 lần/giây khi đang đi) */
export function footstep() {
  stepFoot = !stepFoot;
  burst(0.07, 0.18, { type: "bandpass", from: stepFoot ? 900 : 700, q: 1.5 });
}

export const sfx = {
  flush: () => {
    burst(1.8, 0.35, { type: "lowpass", from: 2200, to: 300, q: 0.7 });
    burst(0.9, 0.15, { type: "bandpass", from: 500, to: 150, q: 2 }, 1.2);
  },
  water: () => burst(1.6, 0.18, { type: "highpass", from: 1800, q: 0.5 }),
  bath: () => {
    burst(2.2, 0.2, { type: "bandpass", from: 1200, to: 600, q: 0.8 });
    const c = ac();
    if (c && !isMuted()) for (let i = 0; i < 5; i++) tone(500 + Math.random() * 400, c.currentTime + 0.3 + i * 0.25, 0.12, 0.05);
  },
  fridge: () => {
    const c = ac();
    if (!c || isMuted()) return;
    burst(0.12, 0.25, { type: "lowpass", from: 600 });
    tone(55, c.currentTime + 0.1, 1.4, 0.06, "sawtooth");
  },
  eat: () => {
    for (let i = 0; i < 3; i++) burst(0.08, 0.2, { type: "bandpass", from: 1500, q: 2 }, i * 0.18);
  },
  coin: () => {
    const c = ac();
    if (!c || isMuted()) return;
    tone(988, c.currentTime, 0.12, 0.15, "square");
    tone(1319, c.currentTime + 0.08, 0.3, 0.15, "square");
  },
  pop: () => {
    const c = ac();
    if (!c || isMuted()) return;
    tone(660, c.currentTime, 0.08, 0.12, "triangle");
  },
  win: () => {
    const c = ac();
    if (!c || isMuted()) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, c.currentTime + i * 0.12, 0.35, 0.12, "triangle"));
  },
  lose: () => {
    const c = ac();
    if (!c || isMuted()) return;
    [392, 330, 262].forEach((f, i) => tone(f, c.currentTime + i * 0.16, 0.3, 0.1, "triangle"));
  },
};

// ---------- Nhạc nền khu phố: giai điệu ngũ cung nhẹ nhàng, tự sinh ----------

let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicGain: GainNode | null = null;

export function startMusic() {
  const c = ac();
  if (!c || !master || musicTimer || isMuted()) return;
  musicGain = c.createGain();
  musicGain.gain.value = 0.35;
  musicGain.connect(master);
  // Thang ngũ cung C, D, E, G, A qua hai quãng tám
  const scale = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3];
  const chords = [[130.8, 196, 261.6], [110, 164.8, 220], [146.8, 220, 293.7], [98, 146.8, 196]];
  let step = 0;
  let note = 4;
  const beat = 0.42;
  const tick = () => {
    if (!ctx || !musicGain) return;
    const t = ctx.currentTime + 0.05;
    if (step % 8 === 0) for (const f of chords[(step / 8) % chords.length]) tone(f, t, beat * 7.5, 0.035, "sine", musicGain);
    if (Math.random() < 0.75) {
      note = Math.max(0, Math.min(scale.length - 1, note + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
      tone(scale[note], t, beat * 1.8, 0.05, "triangle", musicGain);
    }
    step = (step + 1) % 32;
  };
  tick();
  musicTimer = setInterval(tick, beat * 1000);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  if (musicGain && ctx) {
    const g = musicGain;
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => g.disconnect(), 600);
  }
  musicGain = null;
}
