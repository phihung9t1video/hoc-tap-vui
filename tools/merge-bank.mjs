// Gộp file câu hỏi bổ sung vào kho đề: node tools/merge-bank.mjs <file.json> ...
// File bổ sung có dạng { "<lớp>-<môn>": { "<id chương>": [[câu hỏi, [đúng, sai, sai, sai], lời giải], ...] } }
import { readFileSync, writeFileSync } from "node:fs";

let added = 0;
for (const f of process.argv.slice(2)) {
  const extra = JSON.parse(readFileSync(f, "utf8"));
  for (const [file, chapters] of Object.entries(extra)) {
    const p = `public/bank/${file}.json`;
    const d = JSON.parse(readFileSync(p, "utf8"));
    for (const [c, qs] of Object.entries(chapters)) {
      if (!d[c]) throw new Error(`${file} không có chương ${c}`);
      const seen = new Set(d[c].map((q) => q[0]));
      const fresh = qs.filter((q) => !seen.has(q[0]));
      d[c].push(...fresh);
      added += fresh.length;
    }
    writeFileSync(p, JSON.stringify(d, null, 1));
  }
}
console.log(`Đã thêm ${added} câu`);
