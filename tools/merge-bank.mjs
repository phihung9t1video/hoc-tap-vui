// Gộp file câu hỏi bổ sung vào kho đề: node tools/merge-bank.mjs <file.json> ...
// File bổ sung có dạng { "<lớp>-<môn>": { "<id chương>": [[câu hỏi, [đúng, sai, sai, sai], lời giải], ...] } }
// Lớp, môn chưa có file thì tự tạo file mới. Bỏ qua câu trùng nội dung với câu đã có.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

let added = 0;
for (const f of process.argv.slice(2)) {
  const extra = JSON.parse(readFileSync(f, "utf8"));
  for (const [file, chapters] of Object.entries(extra)) {
    if (!/^\d-[a-z]+$/.test(file)) throw new Error(`Tên file không hợp lệ: ${file}`);
    const p = `public/bank/${file}.json`;
    const d = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
    for (const [c, qs] of Object.entries(chapters)) {
      if (!/^(c\d+|u\d+|tong-hop|thu-thach)$/.test(c)) throw new Error(`${file}: id chương không hợp lệ ${c}`);
      d[c] ??= [];
      const key = (q) => `${q[0]}${q[1][0]}`;
      const seen = new Set(d[c].map(key));
      const fresh = qs.filter((q) => !seen.has(key(q)));
      d[c].push(...fresh);
      added += fresh.length;
    }
    writeFileSync(p, JSON.stringify(d, null, 1));
  }
}
console.log(`Đã thêm ${added} câu`);
