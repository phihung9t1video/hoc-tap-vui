// Bù phần "Ôn tập tổng hợp cả năm" cho đủ số câu bằng cách lấy câu từ các chương của cùng môn.
// Chạy: node tools/fill-review.mjs [số câu mong muốn, mặc định 40]
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { rng } from "./gen/common.mjs";

const want = Number(process.argv[2] ?? 40);
let added = 0;
for (const f of readdirSync("public/bank").filter((x) => x.endsWith(".json"))) {
  const p = `public/bank/${f}`;
  const d = JSON.parse(readFileSync(p, "utf8"));
  const review = d["tong-hop"] ?? [];
  if (review.length >= want) continue;
  const have = new Set(review.map((q) => q[0] + "\u0001" + q[1][0]));
  const r = rng([...f].reduce((a, c) => a * 31 + c.charCodeAt(0), 11));
  // Lấy lần lượt từng chương cho đều, mỗi lượt một câu ngẫu nhiên
  const pools = Object.entries(d)
    .filter(([c]) => c !== "tong-hop" && c !== "thu-thach")
    .map(([, qs]) => r.shuffle(qs));
  let round = 0;
  while (review.length < want && pools.some((p) => p.length)) {
    const pool = pools[round++ % pools.length];
    const q = pool.pop();
    if (!q || have.has(q[0] + "\u0001" + q[1][0])) continue;
    have.add(q[0] + "\u0001" + q[1][0]);
    review.push(q);
    added++;
  }
  d["tong-hop"] = review;
  writeFileSync(p, JSON.stringify(d, null, 1));
}
console.log(`Đã bù ${added} câu vào phần ôn tập tổng hợp`);
