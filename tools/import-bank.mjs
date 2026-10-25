// Nhập đề do Gemini (hoặc người) soạn vào kho đề có sẵn.
// Chạy: node tools/import-bank.mjs [thư mục, mặc định NHAP-DE]
// Mỗi tệp .txt hoặc .json trong thư mục chứa JSON dạng:
//   { "<lớp>-<môn>": { "<mã chương>": [["câu hỏi", ["ĐÚNG", "sai", "sai", "sai"], "lời giải"], ...] } }
// Câu hợp lệ được gộp vào public/bank; câu lỗi bị bỏ và được liệt kê. Tệp đã nhập chuyển sang <thư mục>/da-nhap.
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "NHAP-DE";
const catalog = JSON.parse(readFileSync("tools/muc-luc.json", "utf8"));
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const files = readdirSync(dir).filter((f) => /\.(json|txt)$/i.test(f));
if (!files.length) {
  console.log(`Chưa có tệp nào trong thư mục ${dir}. Dán kết quả của Gemini vào một tệp .txt trong thư mục này rồi chạy lại.`);
  process.exit(0);
}

// ---------- Đổi công thức LaTeX ($\frac{3}{5}$, \in, x^{2}...) sang chữ thường app hiển thị được ----------
// Làm trên văn bản thô (trước khi đọc JSON) vì dấu \ của LaTeX làm hỏng JSON. "\\{1,2}" = 1 hoặc 2 dấu \.
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻", "+": "⁺", n: "ⁿ", x: "ˣ" };
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
const SYMBOLS = {
  notin: "∉", in: "∈", subset: "⊂", cdot: "·", times: "×", div: ":", leq: "≤", le: "≤", geq: "≥", ge: "≥", neq: "≠", ne: "≠",
  approx: "≈", pm: "±", infty: "∞", pi: "π", circ: "°", angle: "∠", widehat: "", hat: "", triangle: "△", perp: "⊥", parallel: "∥",
  Rightarrow: "⇒", rightarrow: "→", Leftrightarrow: "⇔", alpha: "α", beta: "β", Delta: "Δ", quad: " ", qquad: " ", ldots: "…", dots: "…",
  left: "", right: "", displaystyle: "", limits: "",
};
const BB = { N: "ℕ", Z: "ℤ", Q: "ℚ", R: "ℝ", I: "𝕀" };
function latexToText(raw) {
  let t = raw;
  const B = "\\\\{1,2}";
  const re = (s, f = "g") => new RegExp(s, f);
  // Phân số, căn (lặp để xử lí lồng nhau)
  for (let i = 0; i < 4; i++) {
    t = t.replace(re(`${B}[dt]?frac\\s*\\{([^{}]*)\\}\\s*\\{([^{}]*)\\}`), (_, a, b) => `${/^[\w,.]+$/.test(a) ? a : `(${a})`}/${/^[\w,.]+$/.test(b) ? b : `(${b})`}`);
    t = t.replace(re(`${B}sqrt\\s*\\{([^{}]*)\\}`), (_, a) => (a.length > 1 ? `√(${a})` : `√${a}`));
  }
  t = t.replace(re(`${B}mathbb\\s*\\{(\\w)\\}`), (_, a) => BB[a] ?? a);
  // Góc: \widehat{A} → Â, \widehat{xOy} → ∠xOy
  t = t.replace(re(`${B}(?:widehat|hat)\\s*\\{([^{}]*)\\}`), (_, a) => (a.length === 1 ? `${a}̂` : `∠${a}`));
  // Giá trị tuyệt đối: \vert, \lvert, \left| ... → |
  t = t.replace(re(`${B}(?:left|right)\\s*\\|`), "|");
  t = t.replace(re(`${B}(?:vert|lvert|rvert|mid)(?![A-Za-z])\\s*(?:\\{\\})?`), "|");
  t = t.replace(re(`${B}(?:text|mathrm|textbf|mathbf|operatorname)\\s*\\{([^{}]*)\\}`), "$1");
  t = t.replace(re(`${B}overline\\s*\\{([^{}]*)\\}`), "$1");
  t = t.replace(re(`${B}([{}%#&_ ,;!])`), (_, c) => (c === "," || c === ";" || c === "!" ? " " : c));
  t = t.replace(re(`${B}([A-Za-z]+)`), (m, name) => (name in SYMBOLS ? SYMBOLS[name] : name === "n" ? m : name));
  // Số mũ, chỉ số
  t = t.replace(/\^\s*\{([^{}]*)\}/g, (_, a) => ([...a].every((c) => SUP[c]) ? [...a].map((c) => SUP[c]).join("") : `^(${a})`));
  t = t.replace(/\^([0-9n+-])/g, (_, a) => SUP[a]);
  t = t.replace(/\^°/g, "°");
  t = t.replace(/_\s*\{(\d+)\}/g, (_, a) => [...a].map((c) => SUB[c]).join("")).replace(/_(\d)/g, (_, a) => SUB[a]);
  t = t.replace(/\{\}/g, "");
  // Bỏ dấu $ của công thức
  t = t.replace(/\$+/g, "");
  return t;
}

/** Lấy phần JSON trong câu trả lời của Gemini (bỏ ```json, chữ thừa trước/sau, dấu phẩy thừa, LaTeX) */
function extractJson(text) {
  let t = latexToText(text.replace(/^﻿/, "").replace(/```(?:json)?/gi, ""));
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a < 0 || b < a) throw new Error("không tìm thấy dữ liệu JSON (phải bắt đầu bằng { và kết thúc bằng })");
  t = t.slice(a, b + 1).replace(/[“”]/g, '"').replace(/,\s*([\]}])/g, "$1");
  return JSON.parse(t);
}

let added = 0, skipped = 0, dup = 0;
const problems = [];
const done = join(dir, "da-nhap");
for (const f of files) {
  const path = join(dir, f);
  let data;
  try {
    data = extractJson(readFileSync(path, "utf8"));
  } catch (e) {
    problems.push(`${f}: không đọc được (${e.message}). Tệp được giữ nguyên để sửa.`);
    continue;
  }
  for (const [key, chapters] of Object.entries(data)) {
    const k = key.trim().toLowerCase();
    if (!catalog[k]) { problems.push(`${f}: "${key}" không phải mã lớp-môn hợp lệ (xem MUC-LUC-KHO-DE.txt)`); continue; }
    const bankPath = `public/bank/${k}.json`;
    const bank = existsSync(bankPath) ? JSON.parse(readFileSync(bankPath, "utf8")) : {};
    for (const [chRaw, list] of Object.entries(chapters ?? {})) {
      const ch = chRaw.trim().toLowerCase();
      if (!catalog[k][ch] && ch !== "thu-thach") { problems.push(`${f}: ${k} không có chương "${chRaw}"`); skipped += Array.isArray(list) ? list.length : 0; continue; }
      bank[ch] ??= [];
      const have = new Set(bank[ch].map((q) => `${q[0]}\u0001${q[1][0]}`.toLowerCase()));
      (Array.isArray(list) ? list : []).forEach((q, i) => {
        const where = `${f} ${k} ${ch} câu ${i + 1}`;
        if (!Array.isArray(q) || q.length < 3) { problems.push(`${where}: sai dạng [câu hỏi, [4 đáp án], lời giải]`); skipped++; return; }
        const [text, opts, expl] = q.map((x) => (typeof x === "string" ? x.trim() : x));
        const options = Array.isArray(opts) ? opts.map((o) => String(o).trim()) : [];
        if (!text || text.length < 3) { problems.push(`${where}: thiếu câu hỏi`); skipped++; return; }
        if (options.length !== 4 || options.some((o) => !o)) { problems.push(`${where}: cần đúng 4 đáp án`); skipped++; return; }
        if (new Set(options.map((o) => o.toLowerCase())).size !== 4) { problems.push(`${where}: có đáp án trùng nhau`); skipped++; return; }
        if (!expl) { problems.push(`${where}: thiếu lời giải`); skipped++; return; }
        const key2 = `${text}\u0001${options[0]}`.toLowerCase();
        if (have.has(key2)) { dup++; return; }
        have.add(key2);
        bank[ch].push([text, options, String(expl)]);
        added++;
      });
    }
    writeFileSync(bankPath, JSON.stringify(bank, null, 1));
  }
  if (!existsSync(done)) mkdirSync(done);
  renameSync(path, join(done, `${new Date().toISOString().slice(0, 10)}-${f}`));
}

console.log(`\nĐã thêm ${added} câu mới vào kho.`);
if (dup) console.log(`Bỏ qua ${dup} câu trùng với câu đã có.`);
if (skipped) console.log(`Bỏ ${skipped} câu bị lỗi:`);
for (const p of problems.slice(0, 40)) console.log("  - " + p);
if (problems.length > 40) console.log(`  ... và ${problems.length - 40} lỗi khác`);
