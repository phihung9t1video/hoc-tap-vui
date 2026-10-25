// Sinh câu Tiếng Anh từ danh sách từ vựng, mẫu câu (english-data.mjs).
import { makeQ } from "./common.mjs";
import { EN } from "./english-data.mjs";

/** Viết sai chính tả một từ (đổi chỗ, bỏ, gấp đôi, thay nguyên âm) */
function misspell(r, w) {
  const v = "aeiou";
  const i = r.int(1, w.length - 2);
  switch (r.int(0, 3)) {
    case 0: return w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
    case 1: return w.slice(0, i) + w.slice(i + 1);
    case 2: return w.slice(0, i) + w[i] + w.slice(i);
    default: {
      const idx = [...w].map((c, k) => (v.includes(c) ? k : -1)).filter((k) => k > 0);
      if (!idx.length) return w + "e";
      const k = r.pick(idx);
      return w.slice(0, k) + r.pick([...v].filter((c) => c !== w[k])) + w.slice(k + 1);
    }
  }
}

function chapterGens(words, sentences) {
  const gens = [];
  if (words.length >= 4) {
    gens.push((r) => {
      const [en, vi] = r.pick(words);
      return makeQ(r, `'${en}' nghĩa là:`, vi, words.filter((w) => w[1] !== vi).map((w) => w[1]), `${en} = ${vi}.`);
    });
    gens.push((r) => {
      const [en, vi] = r.pick(words);
      return makeQ(r, `"${vi[0].toUpperCase() + vi.slice(1)}" trong tiếng Anh là:`, en, words.filter((w) => w[0] !== en).map((w) => w[0]), `${vi} = ${en}.`);
    });
    gens.push((r) => {
      const single = words.filter(([en]) => /^[a-z]{4,}$/i.test(en));
      if (!single.length) return null;
      const [en, vi] = r.pick(single);
      const wrong = new Set();
      for (let k = 0; k < 20 && wrong.size < 3; k++) {
        const m = misspell(r, en);
        if (m !== en && !words.some((w) => w[0] === m)) wrong.add(m);
      }
      return makeQ(r, `Từ nào viết ĐÚNG chính tả? (nghĩa: ${vi})`, en, [...wrong], `Viết đúng là ${en}.`);
    });
  }
  for (const [q, a, w, e] of sentences ?? []) gens.push((r) => makeQ(r, q, a, w, e));
  return gens;
}

function build(key) {
  const data = EN[key];
  const out = {};
  for (const [ch, { words, sentences }] of Object.entries(data)) out[ch] = chapterGens(words, sentences);
  // Ôn tập cả năm: trộn mọi chương
  out["tong-hop"] = Object.values(out).flat();
  return out;
}

export const ENGLISH = Object.fromEntries(Object.keys(EN).map((k) => [k, build(k)]));
