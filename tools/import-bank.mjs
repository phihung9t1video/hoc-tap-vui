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

/** Lấy phần JSON trong câu trả lời của Gemini (bỏ ```json, chữ thừa trước/sau, dấu phẩy thừa) */
function extractJson(text) {
  let t = text.replace(/^﻿/, "").replace(/```(?:json)?/gi, "");
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
