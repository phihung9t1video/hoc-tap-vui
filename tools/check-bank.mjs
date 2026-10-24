// Kiểm tra kho đề có sẵn trong public/bank: định dạng, 4 đáp án khác nhau, chương có trong mục lục.
// Chạy: node tools/check-bank.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "bank");
let total = 0;
let errors = 0;
const summary = [];

for (const f of readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  } catch (e) {
    console.log(`LỖI ${f}: không đọc được JSON (${e.message})`);
    errors++;
    continue;
  }
  let n = 0;
  for (const [chapter, list] of Object.entries(data)) {
    list.forEach((q, i) => {
      const where = `${f} ${chapter} #${i + 1}`;
      if (!Array.isArray(q) || q.length !== 3) return errors++, console.log(`LỖI ${where}: phải có dạng [câu hỏi, [4 đáp án], lời giải]`);
      const [text, opts, expl] = q;
      if (typeof text !== "string" || text.length < 3) errors++, console.log(`LỖI ${where}: câu hỏi trống`);
      if (!Array.isArray(opts) || opts.length !== 4) return errors++, console.log(`LỖI ${where}: cần đúng 4 đáp án`);
      if (new Set(opts.map((o) => String(o).trim())).size !== 4) errors++, console.log(`LỖI ${where}: có đáp án trùng nhau: ${opts.join(" | ")}`);
      if (typeof expl !== "string" || !expl) errors++, console.log(`LỖI ${where}: thiếu lời giải`);
      n++;
    });
  }
  total += n;
  summary.push(`${f.replace(".json", "")}: ${n} câu / ${Object.keys(data).length} chương`);
}

console.log(summary.join("\n"));
console.log(`\nTổng: ${total} câu, ${errors} lỗi`);
process.exit(errors ? 1 : 0);
