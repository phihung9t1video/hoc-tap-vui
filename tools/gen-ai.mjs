// Soạn câu hỏi cho kho đề có sẵn bằng Gemini API (miễn phí), chạy trên máy bố mẹ.
// Chạy: node tools/gen-ai.mjs   (hoặc nhấp đúp 6-SOAN-DE-GEMINI.bat / biểu tượng trên Desktop)
// Khóa đọc từ GEMINI-KEYS.txt (mỗi dòng một khóa) và .env.local. Kết quả lưu vào NHAP-DE rồi tự nhập vào kho.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";

const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"];
const BATCH = 20;
const SUB = { toan: "Toán", tiengviet: "Tiếng Việt", nguvan: "Ngữ văn", tienganh: "Tiếng Anh", tnxh: "Tự nhiên và Xã hội", khoahoc: "Khoa học", khtn: "Khoa học tự nhiên", lsdl: "Lịch sử và Địa lí", tinhoc: "Tin học" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rl = createInterface({ input: process.stdin, output: process.stdout });
// Chạy không hỏi (để kiểm tra): node tools/gen-ai.mjs <lớp-môn,...> <số câu mỗi chương> --yes
const ARGS = process.argv.slice(2).filter((a) => a !== "--yes");
const AUTO = process.argv.includes("--yes");
const ask = async (q, fallback) => (AUTO ? (console.log(q + (fallback ?? "")), fallback ?? "") : rl.question(q));

// ---------- Khóa ----------
function loadKeys() {
  const found = new Set();
  for (const f of ["GEMINI-KEYS.txt", ".env.local"]) {
    if (!existsSync(f)) continue;
    for (const m of readFileSync(f, "utf8").matchAll(/AIza[0-9A-Za-z_-]{30,}|AQ\.[0-9A-Za-z_-]{20,}/g)) found.add(m[0]);
  }
  return [...found].map((k) => ({ k, until: 0, dead: false }));
}
const keys = loadKeys();

class Quota extends Error {}

/** Gọi Gemini, tự đổi khóa / model khi hết lượt; chờ nếu mọi khóa đang nghỉ */
async function gemini(prompt, schema, temperature) {
  for (let round = 0; round < 6; round++) {
    const alive = keys.filter((x) => !x.dead);
    if (!alive.length) throw new Quota("Tất cả khóa đã hết lượt trong ngày (hoặc khóa sai).");
    const ready = alive.filter((x) => x.until <= Date.now());
    if (!ready.length) {
      const wait = Math.min(...alive.map((x) => x.until)) - Date.now();
      process.stdout.write(`   ⏳ Các khóa đang hết lượt tạm thời, chờ ${Math.ceil(wait / 1000)} giây...\n`);
      await sleep(wait + 500);
      continue;
    }
    for (const key of ready) {
      for (const model of MODELS) {
        let res;
        try {
          res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": key.k },
            signal: AbortSignal.timeout(120000),
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature, responseMimeType: "application/json", responseSchema: schema, thinkingConfig: { thinkingLevel: "low" } },
            }),
          });
        } catch {
          continue;
        }
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          const body = await res.text();
          if (/API_KEY_INVALID|PERMISSION_DENIED|API key not valid/i.test(body)) { key.dead = true; break; }
          continue;
        }
        if (res.status === 429) {
          const body = await res.text();
          if (/PerDay|per day|daily/i.test(body) && model === MODELS[MODELS.length - 1]) key.dead = true;
          else key.until = Date.now() + 61000;
          continue;
        }
        if (!res.ok) continue;
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("");
        if (!text) continue;
        try {
          return JSON.parse(text);
        } catch {
          continue;
        }
      }
    }
  }
  throw new Error("Gemini không trả lời được, thử lại sau.");
}

const GEN_SCHEMA = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, explanation: { type: "STRING" } },
        required: ["question", "options", "explanation"],
      },
    },
  },
  required: ["questions"],
};
const CHECK_SCHEMA = {
  type: "OBJECT",
  properties: { answers: { type: "ARRAY", items: { type: "OBJECT", properties: { i: { type: "INTEGER" }, choice: { type: "INTEGER" } }, required: ["i", "choice"] } } },
  required: ["answers"],
};

function genPrompt(key, ch, chName, n, avoid) {
  const [g, s] = key.split("-");
  const english = s === "tienganh";
  return `Bạn là giáo viên giỏi ở Việt Nam. Soạn ${n} câu hỏi trắc nghiệm MỚI theo chương trình GDPT 2018 (sách Kết nối tri thức${english ? " / Global Success" : ""}).
Lớp ${g}, môn ${SUB[s]}, ${chName}.
Mức độ: khoảng 40% nhận biết, 40% thông hiểu, 20% vận dụng; đa dạng dạng bài, đúng nội dung chương.
YÊU CẦU:
- Mỗi câu đúng 4 phương án khác nhau, chỉ MỘT đúng; phương án ĐÚNG đặt ở VỊ TRÍ ĐẦU TIÊN trong mảng options.
- Phương án sai hợp lí (lỗi học sinh hay mắc). Không dùng "tất cả các đáp án trên", "cả A và B".
- explanation: lời giải ngắn 1–2 câu, dễ hiểu với học sinh lớp ${g}${english ? ", viết bằng tiếng Việt" : ""}.
${english ? "- Câu hỏi và phương án bằng tiếng Anh (có thể có câu hỏi nghĩa từ tiếng Việt).\n" : ""}- Không dùng hình vẽ, bảng; KHÔNG dùng LaTeX hay dấu $. Phân số viết 3/5, mũ x², căn √9, góc ∠xOy, độ 60°; số thập phân dùng dấu phẩy (2,5).
- Khi trích lời nói trong câu dùng ngoặc kép cong “ ”.
- Tự giải lại từng câu để chắc chắn phương án đầu tiên là đúng.
${avoid.length ? `- KHÔNG trùng hoặc gần giống các câu đã có sau:\n${avoid.map((q) => `  • ${q}`).join("\n")}\n` : ""}`;
}

function checkPrompt(key, items) {
  const [g, s] = key.split("-");
  return `Bạn là học sinh giỏi lớp ${g} môn ${SUB[s]}. Giải từng câu trắc nghiệm sau, mỗi câu chọn MỘT phương án đúng (choice là số thứ tự 0, 1, 2 hoặc 3).
${items.map((q, i) => `Câu ${i}: ${q.question}\n${q.options.map((o, j) => `  ${j}. ${o}`).join("\n")}`).join("\n\n")}`;
}

const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** Soạn một đợt, giữ lại câu AI tự giải lại ra đúng đáp án */
async function batch(key, ch, chName, n, avoid) {
  const out = await gemini(genPrompt(key, ch, chName, n, avoid), GEN_SCHEMA, 0.9);
  const qs = (out?.questions ?? [])
    .map((q) => ({ question: String(q.question ?? "").trim(), options: (q.options ?? []).map((o) => String(o).trim()), explanation: String(q.explanation ?? "").trim() }))
    .filter((q) => q.question && q.explanation && q.options.length === 4 && new Set(q.options.map((o) => o.toLowerCase())).size === 4);
  if (!qs.length) return { kept: [], dropped: 0 };
  const shuffled = qs.map((q) => ({ ...q, order: shuffle([0, 1, 2, 3]) }));
  const check = await gemini(checkPrompt(key, shuffled.map((q) => ({ question: q.question, options: q.order.map((k) => q.options[k]) }))), CHECK_SCHEMA, 0);
  const answer = new Map((check?.answers ?? []).map((a) => [a.i, a.choice]));
  const kept = shuffled.filter((q, i) => q.order[answer.get(i)] === 0);
  return { kept: kept.map((q) => [q.question, q.options, q.explanation]), dropped: qs.length - kept.length };
}

// ---------- Chương trình chính ----------
async function main() {
  console.log("==============================================");
  console.log("   SOẠN ĐỀ BẰNG GEMINI CHO KHO ĐỀ CÓ SẴN");
  console.log("==============================================");
  if (!keys.length) {
    console.log("\nChưa có khóa Gemini. Mở biểu tượng \"Dán khóa Gemini\" trên Desktop (tệp GEMINI-KEYS.txt),");
    console.log("dán khóa vào (mỗi dòng một khóa), lưu lại rồi chạy lại công cụ này.");
    return;
  }
  console.log(`Có ${keys.length} khóa Gemini.\n`);
  const catalog = JSON.parse(readFileSync("tools/muc-luc.json", "utf8"));
  const list = Object.keys(catalog);
  const count = (k) => {
    const p = `public/bank/${k}.json`;
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
  };
  // Liệt kê lớp – môn theo 3 cột
  const rows = list.map((k, i) => {
    const [g, s] = k.split("-");
    const bank = count(k);
    const total = Object.entries(bank).filter(([c]) => c !== "thu-thach").reduce((a, [, v]) => a + v.length, 0);
    return `${String(i + 1).padStart(2)}. ${`${SUB[s]} ${g}`.padEnd(22)}${String(total).padStart(4)}`;
  });
  for (let i = 0; i < rows.length; i += 3) console.log(rows.slice(i, i + 3).join("   "));
  console.log("\n(số bên phải: số câu đang có trong kho)");

  const pickRaw = (await ask("\nChọn lớp – môn (gõ số, nhiều môn cách nhau dấu phẩy, ví dụ 13 hoặc 10,13): ", ARGS[0])).trim();
  const picks = pickRaw.split(/[,\s]+/).filter(Boolean).map((x) => (/^\d+$/.test(x) ? list[Number(x) - 1] : x.toLowerCase())).filter((k) => catalog[k]);
  if (!picks.length) return console.log("Chưa chọn được lớp – môn nào.");
  const wantRaw = (await ask("Mỗi chương cần có ít nhất bao nhiêu câu? (Enter = 40): ", ARGS[1])).trim();
  const want = Math.max(10, Number(wantRaw) || 40);

  const plan = [];
  for (const k of picks) {
    const bank = count(k);
    for (const [ch, name] of Object.entries(catalog[k])) {
      if (ch === "tong-hop") continue;
      const have = bank[ch]?.length ?? 0;
      if (have < want) plan.push({ k, ch, name, have, need: want - have, avoid: (bank[ch] ?? []).map((q) => q[0]) });
    }
  }
  if (!plan.length) return console.log(`\nCác chương đã đủ từ ${want} câu trở lên. Không cần soạn thêm.`);
  const total = plan.reduce((a, p) => a + p.need, 0);
  console.log(`\nSẽ soạn khoảng ${total} câu cho ${plan.length} chương:`);
  for (const p of plan) console.log(`   ${p.k} ${p.ch.padEnd(4)} ${p.name.slice(0, 50).padEnd(50)} có ${p.have}, cần thêm ${p.need}`);
  await ask("\nBấm Enter để bắt đầu (đóng cửa sổ để hủy)...", "");

  if (!existsSync("NHAP-DE")) mkdirSync("NHAP-DE");
  let made = 0, dropped = 0;
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  try {
    for (const p of plan) {
      console.log(`\n▶ ${SUB[p.k.split("-")[1]]} lớp ${p.k.split("-")[0]} – ${p.name}`);
      const got = [];
      let fails = 0;
      while (got.length < p.need && fails < 3) {
        const n = Math.min(BATCH, p.need - got.length + 3);
        try {
          const avoid = [...p.avoid, ...got.map((q) => q[0])].slice(-40);
          const r = await batch(p.k, p.ch, p.name, n, avoid);
          const fresh = r.kept.filter((q) => !p.avoid.includes(q[0]) && !got.some((x) => x[0] === q[0]));
          got.push(...fresh.slice(0, p.need - got.length));
          dropped += r.dropped;
          console.log(`   + ${fresh.length} câu (bỏ ${r.dropped} câu AI giải lại không khớp)  → ${got.length}/${p.need}`);
          if (!fresh.length) fails++;
        } catch (e) {
          if (e instanceof Quota) throw e;
          fails++;
          console.log(`   ! Lỗi: ${e.message}`);
        }
        // Lưu ngay sau mỗi đợt để không mất câu nếu bị ngắt giữa chừng
        if (got.length) writeFileSync(`NHAP-DE/ai-${p.k}-${p.ch}-${stamp}.json`, JSON.stringify({ [p.k]: { [p.ch]: got } }, null, 1));
      }
      made += got.length;
    }
  } catch (e) {
    console.log(`\n⚠ Dừng sớm: ${e.message}`);
  }

  console.log(`\n==============================================\nĐã soạn ${made} câu (bỏ ${dropped} câu chưa chắc đúng). Đang nhập vào kho...`);
  spawnSync(process.execPath, ["tools/import-bank.mjs", "NHAP-DE"], { stdio: "inherit" });
  console.log("\nĐề mới sẽ có trong app sau khi chạy 3-PHAT-HANH-BAN-THU.bat.");
}

main()
  .catch((e) => console.log("\nLỗi: " + e.message))
  .finally(async () => {
    await ask("\nBấm Enter để đóng...", "");
    rl.close();
  });
