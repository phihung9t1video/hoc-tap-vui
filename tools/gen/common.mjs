// Công cụ chung để sinh câu hỏi tự động (đáp án do máy tính nên luôn đúng).
// Mỗi câu: [câu hỏi, [đáp án ĐÚNG, sai, sai, sai], lời giải]

/** Bộ sinh số ngẫu nhiên có hạt giống: chạy lại cho ra đúng bộ câu cũ */
export function rng(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (a, b) => a + Math.floor(next() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  return { next, int, pick, shuffle };
}

/** Viết số kiểu Việt Nam: 12 345 */
export const fmt = (n) => {
  const neg = n < 0;
  const s = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return neg ? `−${s}` : s;
};

/** Đọc số tiếng Việt (đến hàng tỉ) */
export function readVN(n) {
  if (n === 0) return "không";
  const D = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const three = (x, full) => {
    const h = Math.floor(x / 100);
    const t = Math.floor((x % 100) / 10);
    const u = x % 10;
    const out = [];
    if (full || h) out.push(`${D[h]} trăm`);
    if (t === 0) {
      if (u && (full || h)) out.push(`linh ${D[u]}`);
      else if (u) out.push(D[u]);
    } else if (t === 1) {
      out.push("mười");
      if (u === 5) out.push("lăm");
      else if (u) out.push(D[u]);
    } else {
      out.push(`${D[t]} mươi`);
      if (u === 1) out.push("mốt");
      else if (u === 5) out.push("lăm");
      else if (u) out.push(D[u]);
    }
    return out.join(" ");
  };
  const units = ["", " nghìn", " triệu", " tỉ"];
  const groups = [];
  let x = n;
  while (x > 0) {
    groups.push(x % 1000);
    x = Math.floor(x / 1000);
  }
  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    const full = i < groups.length - 1;
    parts.push(three(g, full) + units[i]);
  }
  const s = parts.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Tạo câu với 3 đáp án nhiễu khác nhau và khác đáp án đúng */
export function makeQ(r, text, correct, distractors, expl, fallback) {
  const c = String(correct);
  const seen = new Set([c]);
  const wrong = [];
  for (const d of r.shuffle(distractors)) {
    const s = String(d);
    if (!seen.has(s) && s !== "NaN" && !s.includes("undefined")) {
      seen.add(s);
      wrong.push(s);
    }
    if (wrong.length === 3) break;
  }
  // Thiếu nhiễu: sinh thêm bằng hàm dự phòng
  let guard = 0;
  while (wrong.length < 3 && fallback && guard++ < 50) {
    const s = String(fallback());
    if (!seen.has(s)) {
      seen.add(s);
      wrong.push(s);
    }
  }
  if (wrong.length < 3) return null;
  return [text, [c, ...wrong], expl];
}

/** Nhiễu cho đáp án là số: lệch ±1, ±10, đảo chữ số... */
export function numWrong(r, n, unit = "") {
  const opts = new Set();
  const add = (v) => {
    if (v >= 0 && v !== n) opts.add(`${fmt(v)}${unit}`);
  };
  [1, 2, 10, -1, -2, -10, 100, -100].forEach((d) => add(n + d));
  const rev = Number(String(n).split("").reverse().join(""));
  if (rev !== n) add(rev);
  return [...opts];
}

/** Sinh đủ `count` câu không trùng nội dung từ danh sách hàm sinh */
export function fill(r, gens, count, existing = []) {
  const key = (q) => `${q[0]}${q[1][0]}`;
  const seen = new Set(existing.map(key));
  const out = [];
  let tries = 0;
  while (out.length < count && tries++ < count * 60) {
    const q = r.pick(gens)(r);
    if (q && !seen.has(key(q))) {
      seen.add(key(q));
      out.push(q);
    }
  }
  return out;
}

export const NAMES = ["An", "Bình", "Chi", "Dũng", "Hà", "Hoa", "Lan", "Minh", "Nam", "Mai", "Tùng", "Linh", "Hùng", "Thảo", "Khôi", "Ngọc", "Phúc", "Vy"];
