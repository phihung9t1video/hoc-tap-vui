// Sinh thêm câu cho các chương đến khi mỗi chương đủ số câu mong muốn rồi ghi vào file bổ sung.
// Chạy: node tools/gen/run.mjs <lớp-môn> <số câu mỗi chương> <file ra>
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fill, rng } from "./common.mjs";
import { TOAN2 } from "./toan2.mjs";
import { TOAN4 } from "./toan4.mjs";
import { TOAN3 } from "./toan3.mjs";
import { TOAN7 } from "./toan7.mjs";
import { ENGLISH } from "./english.mjs";
import { VIET } from "./viet.mjs";

const SETS = { "2-toan": TOAN2, "4-toan": TOAN4, "3-toan": TOAN3, "7-toan": TOAN7, ...ENGLISH, ...VIET };
const [key, want, out] = process.argv.slice(2);
const gens = SETS[key];
if (!gens) throw new Error(`Chưa có bộ sinh cho ${key}`);
const p = `public/bank/${key}.json`;
const cur = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
const res = { [key]: {} };
let total = 0;
for (const [ch, list] of Object.entries(gens)) {
  const have = cur[ch] ?? [];
  const need = Number(want) - have.length;
  if (need <= 0) continue;
  const r = rng([...`${key}-${ch}-${have.length}`].reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  const qs = fill(r, list, need, have);
  res[key][ch] = qs;
  total += qs.length;
  if (qs.length < need) console.log(`  ${ch}: chỉ sinh được ${qs.length}/${need}`);
}
writeFileSync(out, JSON.stringify(res, null, 1));
console.log(`${key}: sinh ${total} câu -> ${out}`);
