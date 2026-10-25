// Sinh câu Toán lớp 2 (KNTT/GDPT 2018) cho từng chương.
import { NAMES, fmt, makeQ, numWrong, readVN } from "./common.mjs";

const n = (r, q, c, w, e) => makeQ(r, q, c, w, e, () => fmt(Math.max(0, Number(String(c).replace(/\D/g, "")) + r.int(-15, 15))));

/** Cộng có nhớ / không nhớ trong phạm vi `max` */
function addQ(r, max, carry) {
  for (;;) {
    const a = r.int(10, max - 10);
    const b = r.int(2, max - a);
    const hasCarry = (a % 10) + (b % 10) >= 10;
    if (carry !== undefined && hasCarry !== carry) continue;
    const s = a + b;
    const noCarry = s - 10;
    return n(r, `${a} + ${b} = ?`, s, [noCarry, s + 10, s + 1, s - 1, ...numWrong(r, s)], hasCarry ? `Cộng hàng đơn vị: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}, viết ${s % 10} nhớ 1. Kết quả ${s}.` : `Cộng từng hàng: kết quả ${s}.`);
  }
}
function subQ(r, max, borrow) {
  for (;;) {
    const a = r.int(20, max);
    const b = r.int(2, a - 1);
    const hasBorrow = a % 10 < b % 10;
    if (borrow !== undefined && hasBorrow !== borrow) continue;
    const d = a - b;
    return n(r, `${a} − ${b} = ?`, d, [d + 10, d - 10, d + 1, a + b, ...numWrong(r, d)], hasBorrow ? `${a % 10} không trừ được ${b % 10}, lấy ${(a % 10) + 10} − ${b % 10} = ${(a % 10) + 10 - (b % 10)}, nhớ 1 sang hàng chục. Kết quả ${d}.` : `Trừ từng hàng: kết quả ${d}.`);
  }
}
const things = [["quả cam", "quả"], ["cái kẹo", "cái"], ["quyển vở", "quyển"], ["bông hoa", "bông"], ["viên bi", "viên"], ["con gà", "con"], ["cây bút", "cây"], ["quả bóng", "quả"]];
function storyAdd(r, max) {
  const [a, b] = [r.int(5, Math.floor(max / 2)), r.int(5, Math.floor(max / 2))];
  const [t, u] = r.pick(things);
  const [x, y] = [r.pick(NAMES), r.pick(NAMES)];
  if (x === y) return null;
  return n(r, `${x} có ${a} ${t}, ${y} có ${b} ${t}. Cả hai bạn có tất cả bao nhiêu ${t}?`, `${a + b} ${u}`, [`${Math.abs(a - b)} ${u}`, `${a + b + 1} ${u}`, `${a + b - 10} ${u}`, `${a + b + 10} ${u}`], `Gộp lại: ${a} + ${b} = ${a + b} ${t}.`);
}
function storySub(r, max) {
  const a = r.int(15, max);
  const b = r.int(3, a - 2);
  const [t, u] = r.pick(things);
  const x = r.pick(NAMES);
  return n(r, `${x} có ${a} ${t}, ${x} cho bạn ${b} ${t}. ${x} còn lại bao nhiêu ${t}?`, `${a - b} ${u}`, [`${a + b} ${u}`, `${a - b + 1} ${u}`, `${a - b - 1} ${u}`, `${a - b + 10} ${u}`], `Bớt đi: ${a} − ${b} = ${a - b} ${t}.`);
}
function moreLess(r, max) {
  const a = r.int(10, max - 20);
  const k = r.int(2, 15);
  const more = r.next() < 0.5;
  const res = more ? a + k : a - k;
  const [x, y] = [r.pick(NAMES), r.pick(NAMES)];
  if (x === y || res <= 0) return null;
  return n(r, `${x} cao ${a} cm. ${y} ${more ? "cao hơn" : "thấp hơn"} ${x} ${k} cm. ${y} cao bao nhiêu xăng-ti-mét?`, `${res} cm`, [`${more ? a - k : a + k} cm`, `${res + 1} cm`, `${k} cm`, `${res - 1} cm`], `${more ? "Nhiều hơn thì cộng" : "Ít hơn thì trừ"}: ${a} ${more ? "+" : "−"} ${k} = ${res} cm.`);
}
function missing(r, max) {
  const a = r.int(5, max - 10);
  const b = r.int(3, max - a);
  const s = a + b;
  return r.next() < 0.5
    ? n(r, `... + ${b} = ${s}. Số cần điền là:`, a, [s + b, a + 1, a - 1, b], `Số hạng chưa biết = tổng − số hạng kia: ${s} − ${b} = ${a}.`)
    : n(r, `${s} − ... = ${a}. Số cần điền là:`, b, [s + a, b + 1, b - 1, a], `Số trừ = số bị trừ − hiệu: ${s} − ${a} = ${b}.`);
}

function placeValue(r, max) {
  const x = r.int(11, max);
  const h = Math.floor(x / 100), t = Math.floor((x % 100) / 10), u = x % 10;
  if (max <= 100) return n(r, `Số gồm ${t} chục và ${u} đơn vị là:`, x, [u * 10 + t, t + u, t * 100 + u, x + 10], `${t} chục là ${t * 10}, thêm ${u} đơn vị là ${x}.`);
  if (!h) return null;
  return n(r, `Số gồm ${h} trăm, ${t} chục và ${u} đơn vị là:`, x, [h * 100 + u * 10 + t, t * 100 + h * 10 + u, h * 1000 + t * 10 + u, x + 100], `${h} trăm = ${h * 100}, ${t} chục = ${t * 10}: ${h * 100} + ${t * 10} + ${u} = ${x}.`);
}
function compare(r, max) {
  const a = r.int(10, max);
  let b = r.next() < 0.15 ? a : r.int(10, max);
  const sign = a > b ? ">" : a < b ? "<" : "=";
  return makeQ(r, `Điền dấu thích hợp: ${a} ... ${b}`, sign, ["<", ">", "=", "+"].filter((s) => s !== sign), sign === "=" ? `Hai số bằng nhau.` : `So sánh từ hàng cao nhất: ${a} ${sign} ${b}.`);
}
function beforeAfter(r, max) {
  const a = r.int(11, max - 1);
  return r.next() < 0.5
    ? n(r, `Số liền sau của ${a} là:`, a + 1, [a - 1, a + 10, a, a + 2], `Số liền sau hơn số đó 1 đơn vị: ${a} + 1 = ${a + 1}.`)
    : n(r, `Số liền trước của ${a} là:`, a - 1, [a + 1, a - 10, a, a - 2], `Số liền trước kém số đó 1 đơn vị: ${a} − 1 = ${a - 1}.`);
}
function readNum(r, lo, hi) {
  const x = r.int(lo, hi);
  const w = [readVN(x + 10), readVN(x + 1), readVN(Number(String(x).split("").reverse().join("")) || x + 2), readVN(x + 100)];
  return makeQ(r, `Số ${fmt(x)} đọc là:`, readVN(x), w, `${fmt(x)} đọc là: ${readVN(x).toLowerCase()}.`);
}
function writeNum(r, lo, hi) {
  const x = r.int(lo, hi);
  return n(r, `Số "${readVN(x).toLowerCase()}" viết là:`, fmt(x), numWrong(r, x).concat([fmt(x * 10)]), `Viết từng hàng theo cách đọc: ${fmt(x)}.`);
}
function biggest(r, max) {
  const xs = new Set();
  while (xs.size < 4) xs.add(r.int(Math.max(10, max / 10), max));
  const arr = [...xs];
  const big = r.next() < 0.5;
  const ans = big ? Math.max(...arr) : Math.min(...arr);
  return makeQ(r, `Số ${big ? "lớn" : "bé"} nhất trong các số ${arr.join(", ")} là:`, ans, arr.filter((v) => v !== ans), `So sánh các số theo từng hàng từ trái sang phải: số ${big ? "lớn" : "bé"} nhất là ${ans}.`);
}

function kgL(r) {
  const unit = r.pick(["kg", "l"]);
  const what = unit === "kg" ? r.pick(["bao gạo", "thùng táo", "bao ngô", "túi đường", "con lợn"]) : r.pick(["can nước", "thùng dầu", "bình sữa", "xô nước", "chum nước"]);
  const a = r.int(10, 60), b = r.int(3, 30);
  const t = r.int(0, 2);
  if (t === 0) return n(r, `${what[0].toUpperCase() + what.slice(1)} thứ nhất có ${a} ${unit}, ${what} thứ hai có ${b} ${unit}. Cả hai có bao nhiêu ${unit === "kg" ? "ki-lô-gam" : "lít"}?`, `${a + b} ${unit}`, [`${a - b} ${unit}`, `${a + b + 10} ${unit}`, `${a + b} ${unit === "kg" ? "l" : "kg"}`, `${a + b - 1} ${unit}`], `${a} + ${b} = ${a + b} ${unit}.`);
  if (t === 1 && a > b) return n(r, `Một ${what} có ${a} ${unit}, đã dùng ${b} ${unit}. Còn lại bao nhiêu?`, `${a - b} ${unit}`, [`${a + b} ${unit}`, `${a - b + 10} ${unit}`, `${a - b} ${unit === "kg" ? "l" : "kg"}`, `${a - b - 1} ${unit}`], `${a} − ${b} = ${a - b} ${unit}.`);
  return n(r, `${a} ${unit} + ${b} ${unit} = ?`, `${a + b} ${unit}`, [`${a + b}`, `${a - b} ${unit}`, `${a + b + 1} ${unit}`, `${a + b} ${unit === "kg" ? "l" : "kg"}`], `Cộng số đo rồi viết đơn vị ${unit}: ${a + b} ${unit}.`);
}

function zigzag(r) {
  const k = r.int(2, 4);
  const segs = Array.from({ length: k }, () => r.int(2, 9));
  const s = segs.reduce((a, b) => a + b, 0);
  const letters = "ABCDE".slice(0, k + 1).split("");
  const desc = segs.map((v, i) => `${letters[i]}${letters[i + 1]} = ${v} cm`).join(", ");
  return n(r, `Đường gấp khúc ${letters.join("")} có ${desc}. Độ dài đường gấp khúc là:`, `${s} cm`, [`${s + 1} cm`, `${s - 1} cm`, `${segs[0] * k} cm`, `${s + 2} cm`], `Độ dài đường gấp khúc bằng tổng các đoạn: ${segs.join(" + ")} = ${s} cm.`);
}
function sameZigzag(r) {
  const k = r.int(3, 5), v = r.int(2, 9);
  return n(r, `Đường gấp khúc gồm ${k} đoạn thẳng, mỗi đoạn dài ${v} cm. Độ dài đường gấp khúc là:`, `${k * v} cm`, [`${k + v} cm`, `${v} cm`, `${k * v + v} cm`, `${k * v - v} cm`], `${v} × ${k} = ${k * v} cm (hoặc cộng ${k} lần ${v}).`);
}

function clock(r) {
  const t = r.int(0, 3);
  if (t === 0) {
    const h = r.int(13, 23);
    return n(r, `${h} giờ còn gọi là mấy giờ ${h < 18 ? "chiều" : "tối"}?`, `${h - 12} giờ`, [`${h - 10} giờ`, `${h - 2} giờ`, `${h - 11} giờ`, `${h - 13} giờ`], `${h} − 12 = ${h - 12}, nên ${h} giờ là ${h - 12} giờ ${h < 18 ? "chiều" : "tối"}.`);
  }
  if (t === 1) {
    const k = r.pick([3, 6, 9]);
    return n(r, `Kim phút (kim dài) chỉ vào số ${k}. Đồng hồ chỉ bao nhiêu phút?`, `${k * 5} phút`, [`${k} phút`, `${k * 10} phút`, `${k * 5 + 5} phút`, `${k * 5 - 5} phút`], `Mỗi số trên mặt đồng hồ ứng với 5 phút: ${k} × 5 = ${k * 5} phút.`);
  }
  if (t === 2) {
    const days = ["thứ Hai", "thứ Ba", "thứ Tư", "thứ Năm", "thứ Sáu", "thứ Bảy", "Chủ nhật"];
    const i = r.int(0, 6), k = r.int(1, 10), d = r.int(1, 15);
    return makeQ(r, `Ngày ${d} là ${days[i]}. Ngày ${d + k} cùng tháng là thứ mấy?`, days[(i + k) % 7], days.filter((_, j) => j !== (i + k) % 7), `Cứ 7 ngày lại lặp lại thứ. ${k} ngày sau ${days[i]} là ${days[(i + k) % 7]}.`);
  }
  const h1 = r.int(6, 10), m = r.pick([15, 30, 45]);
  return n(r, `${r.pick(NAMES)} bắt đầu làm bài lúc ${h1} giờ, làm xong lúc ${h1} giờ ${m} phút. Bạn ấy làm bài trong bao lâu?`, `${m} phút`, [`${m + 15} phút`, `${h1} phút`, `1 giờ`, `${m - 5} phút`], `Từ ${h1} giờ đến ${h1} giờ ${m} phút là ${m} phút.`);
}

function mulQ(r) {
  const a = r.pick([2, 5]), b = r.int(1, 10);
  return r.next() < 0.5
    ? n(r, `${a} × ${b} = ?`, a * b, [a + b, a * b + a, a * b - a, a * (b + 1) + 1], `${a} được lấy ${b} lần: ${a} × ${b} = ${a * b}.`)
    : n(r, `${a * b} : ${a} = ?`, b, [b + 1, b - 1, a * b - a, a], `Vì ${a} × ${b} = ${a * b} nên ${a * b} : ${a} = ${b}.`);
}
function mulStory(r) {
  const t = r.int(0, 2);
  const a = r.pick([2, 5]), b = r.int(2, 10);
  if (t === 0) {
    const [obj, per] = a === 2 ? r.pick([["đôi đũa", "chiếc"], ["con gà", "chân"], ["chiếc xe đạp", "bánh xe"]]) : r.pick([["bàn tay", "ngón tay"], ["bông hoa", "cánh hoa"], ["hộp bút", "cây bút"]]);
    return n(r, `Mỗi ${obj} có ${a} ${per}. ${b} ${obj} có bao nhiêu ${per}?`, `${a * b} ${per}`, [`${a + b} ${per}`, `${a * b + a} ${per}`, `${a * b - a} ${per}`, `${b} ${per}`], `${a} × ${b} = ${a * b} ${per}.`);
  }
  if (t === 1) return n(r, `Có ${a * b} cái kẹo chia đều cho ${a} bạn. Mỗi bạn được mấy cái kẹo?`, `${b} cái`, [`${b + 1} cái`, `${a * b - a} cái`, `${a} cái`, `${b - 1} cái`], `${a * b} : ${a} = ${b} cái.`);
  return n(r, `Có ${a * b} quyển vở xếp đều vào các chồng, mỗi chồng ${a} quyển. Được mấy chồng?`, `${b} chồng`, [`${a} chồng`, `${b + 1} chồng`, `${a * b + a} chồng`, `${b - 1} chồng`], `${a * b} : ${a} = ${b} chồng.`);
}
function mulTerms(r) {
  const a = r.int(2, 5), b = r.int(2, 9);
  return r.next() < 0.5
    ? makeQ(r, `Trong phép nhân ${a} × ${b} = ${a * b}, số ${a * b} gọi là gì?`, "Tích", ["Thừa số", "Thương", "Tổng"], "Kết quả của phép nhân gọi là tích; các số được nhân là thừa số.")
    : makeQ(r, `Tổng ${Array(b).fill(a).join(" + ")} viết thành phép nhân là:`, `${a} × ${b}`, [`${b} × ${b}`, `${a} + ${b}`, `${a} × ${a}`, `${a * b} × ${b}`], `${a} được lấy ${b} lần nên viết ${a} × ${b}.`);
}

function hundreds(r, carry) {
  for (;;) {
    const a = r.int(100, 899), b = r.int(10, 999 - a);
    const c = (a % 10) + (b % 10) >= 10 || (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 10;
    if (c !== carry) continue;
    return n(r, `${a} + ${b} = ?`, a + b, [a + b - 10, a + b + 10, a + b - 100, a + b + 1], `Cộng từ hàng đơn vị sang trái${c ? ", nhớ 1 khi tổng một hàng từ 10 trở lên" : ""}: ${a + b}.`);
  }
}
function hundredsSub(r, borrow) {
  for (;;) {
    const a = r.int(200, 999), b = r.int(10, a - 50);
    const c = a % 10 < b % 10 || Math.floor(a / 10) % 10 < Math.floor(b / 10) % 10;
    if (c !== borrow) continue;
    return n(r, `${a} − ${b} = ?`, a - b, [a - b + 10, a - b - 10, a - b + 100, a + b], `Trừ từ hàng đơn vị sang trái${c ? ", mượn 1 ở hàng bên trái khi không trừ được" : ""}: ${a - b}.`);
  }
}
function roundHundreds(r) {
  const a = r.int(1, 8) * 100, b = r.int(1, 9 - a / 100) * 100;
  return r.next() < 0.5
    ? n(r, `${a} + ${b} = ?`, a + b, [a + b + 100, a / 100 + b / 100, a + b - 100, (a + b) * 10], `${a / 100} trăm + ${b / 100} trăm = ${(a + b) / 100} trăm = ${a + b}.`)
    : a > b
      ? n(r, `${a} − ${b} = ?`, a - b, [a - b + 100, a + b, a - b - 100 < 0 ? a : a - b - 100, (a - b) / 100], `${a / 100} trăm − ${b / 100} trăm = ${(a - b) / 100} trăm = ${a - b}.`)
      : null;
}
function story1000(r) {
  const a = r.int(150, 600), b = r.int(100, 350);
  const t = r.int(0, 1);
  const what = r.pick([["học sinh", "trường"], ["cây", "vườn"], ["quyển sách", "thư viện"], ["con gà", "trang trại"]]);
  return t === 0
    ? n(r, `${what[1][0].toUpperCase() + what[1].slice(1)} thứ nhất có ${a} ${what[0]}, ${what[1]} thứ hai có ${b} ${what[0]}. Cả hai có tất cả bao nhiêu ${what[0]}?`, `${a + b} ${what[0]}`, [`${Math.abs(a - b)} ${what[0]}`, `${a + b + 10} ${what[0]}`, `${a + b - 100} ${what[0]}`, `${a + b + 1} ${what[0]}`], `${a} + ${b} = ${a + b}.`)
    : n(r, `Một ${what[1]} có ${a + b} ${what[0]}, sau đó bớt đi ${b} ${what[0]}. Còn lại bao nhiêu ${what[0]}?`, `${a} ${what[0]}`, [`${a + 2 * b} ${what[0]}`, `${a + 10} ${what[0]}`, `${a - 10} ${what[0]}`, `${b} ${what[0]}`], `${a + b} − ${b} = ${a}.`);
}

function lengthUnits(r) {
  const t = r.int(0, 5);
  if (t === 0) { const a = r.int(1, 9); return n(r, `${a} dm = ... cm`, a * 10, [a, a * 100, a + 10, a * 10 + 1], `1 dm = 10 cm nên ${a} dm = ${a * 10} cm.`); }
  if (t === 1) { const a = r.int(1, 9); return n(r, `${a} m = ... dm`, a * 10, [a, a * 100, a + 10, a * 1000], `1 m = 10 dm nên ${a} m = ${a * 10} dm.`); }
  if (t === 2) { const a = r.int(1, 9); return n(r, `${a} m = ... cm`, a * 100, [a * 10, a, a * 1000, a + 100], `1 m = 100 cm nên ${a} m = ${a * 100} cm.`); }
  if (t === 3) { const a = r.int(1, 5); return n(r, `${a} km = ... m`, fmt(a * 1000), [fmt(a * 100), fmt(a * 10), fmt(a * 10000), fmt(a + 1000)], `1 km = 1000 m nên ${a} km = ${fmt(a * 1000)} m.`); }
  if (t === 4) { const a = r.int(10, 60), b = r.int(5, 30); const u = r.pick(["dm", "m", "km"]); return n(r, `${a} ${u} + ${b} ${u} = ?`, `${a + b} ${u}`, [`${a + b} cm`, `${a - b} ${u}`, `${a + b + 10} ${u}`, `${a + b}`], `${a} + ${b} = ${a + b}, giữ đơn vị ${u}.`); }
  const a = r.int(2, 9);
  const c = a * 10 + r.pick([-5, 0, 5]);
  const sign = a * 10 > c ? ">" : a * 10 < c ? "<" : "=";
  return makeQ(r, `Điền dấu: ${a} dm ... ${c} cm`, sign, ["<", ">", "=", "+"].filter((x) => x !== sign), `${a} dm = ${a * 10} cm, so với ${c} cm: ${a} dm ${sign} ${c} cm.`);
}

function money(r) {
  const notes = [100, 200, 500, 1000, 2000, 5000, 10000];
  const t = r.int(0, 2);
  if (t === 0) {
    const a = r.pick(notes), b = r.pick(notes);
    return n(r, `Em có một tờ ${fmt(a)} đồng và một tờ ${fmt(b)} đồng. Em có tất cả:`, `${fmt(a + b)} đồng`, [`${fmt(Math.abs(a - b) || a * 3)} đồng`, `${fmt(a + b + 100)} đồng`, `${fmt(a * b > 50000 ? a + b + 1000 : a * 2 + b * 2)} đồng`, `${fmt(a + b - 100)} đồng`], `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)} đồng.`);
  }
  if (t === 1) {
    const pay = r.pick([2000, 5000, 10000]);
    const price = r.int(1, pay / 500 - 1) * 500;
    return n(r, `Mua một món đồ giá ${fmt(price)} đồng, đưa người bán tờ ${fmt(pay)} đồng. Em được trả lại:`, `${fmt(pay - price)} đồng`, [`${fmt(pay + price)} đồng`, `${fmt(pay - price + 500)} đồng`, `${fmt(price)} đồng`, `${fmt(Math.max(100, pay - price - 500))} đồng`], `${fmt(pay)} − ${fmt(price)} = ${fmt(pay - price)} đồng.`);
  }
  const k = r.int(2, 5), v = r.pick([200, 500, 1000]);
  return n(r, `${k} tờ ${fmt(v)} đồng bằng bao nhiêu tiền?`, `${fmt(k * v)} đồng`, [`${fmt(k + v)} đồng`, `${fmt(k * v + v)} đồng`, `${fmt(v)} đồng`, `${fmt(k * v * 10)} đồng`], `${fmt(v)} × ${k} = ${fmt(k * v)} đồng.`);
}
const CHANCE = [
  ["Trong hộp chỉ có bi xanh. Lấy ra một viên bi, viên bi đó màu xanh là việc:", "Chắc chắn", "Hộp chỉ có bi xanh nên chắc chắn lấy được bi xanh."],
  ["Trong hộp chỉ có bi xanh. Lấy ra một viên bi màu đỏ là việc:", "Không thể", "Không có bi đỏ nên không thể lấy được bi đỏ."],
  ["Hộp có bi xanh và bi đỏ. Lấy ra một viên bi đỏ là việc:", "Có thể", "Có cả bi đỏ và bi xanh nên có thể lấy được bi đỏ, cũng có thể không."],
  ["Tung một đồng xu, đồng xu ra mặt ngửa là việc:", "Có thể", "Đồng xu có thể ra sấp hoặc ngửa."],
  ["Ngày mai Mặt Trời mọc ở phía Đông là việc:", "Chắc chắn", "Mặt Trời luôn mọc ở phía Đông."],
  ["Một con mèo biết bay là việc:", "Không thể", "Mèo không có cánh, không thể bay."],
  ["Gieo một con xúc xắc, ra mặt 7 chấm là việc:", "Không thể", "Xúc xắc chỉ có từ 1 đến 6 chấm."],
  ["Gieo một con xúc xắc, ra mặt 3 chấm là việc:", "Có thể", "Mặt 3 chấm có thể xuất hiện, cũng có thể không."],
  ["Hôm nay là Chủ nhật thì ngày mai là thứ Hai. Việc này là:", "Chắc chắn", "Sau Chủ nhật luôn là thứ Hai."],
  ["Bốc một thẻ trong các thẻ số 2, 4, 6, 8: bốc được số chẵn là việc:", "Chắc chắn", "Mọi thẻ đều là số chẵn."],
];
function chance(r) {
  const [q, a, e] = r.pick(CHANCE);
  return makeQ(r, `${q}`, a, ["Chắc chắn", "Có thể", "Không thể", "Đã xảy ra"].filter((x) => x !== a), e);
}
function tally(r) {
  const fruits = r.shuffle(["Cam", "Táo", "Chuối", "Xoài", "Lê"]).slice(0, 4);
  const vals = fruits.map(() => r.int(2, 15));
  const max = Math.max(...vals);
  if (vals.filter((v) => v === max).length > 1) return null;
  const i = vals.indexOf(max);
  const t = r.int(0, 1);
  const table = fruits.map((f, j) => `${f}: ${vals[j]}`).join("; ");
  return t === 0
    ? makeQ(r, `Số quả trong giỏ – ${table}. Loại quả nào nhiều nhất?`, fruits[i], fruits.filter((_, j) => j !== i), `${max} là số lớn nhất nên ${fruits[i]} nhiều nhất.`)
    : n(r, `Số quả trong giỏ – ${table}. Có tất cả bao nhiêu quả?`, vals.reduce((a, b) => a + b, 0), numWrong(r, vals.reduce((a, b) => a + b, 0)), `Cộng tất cả: ${vals.join(" + ")} = ${vals.reduce((a, b) => a + b, 0)}.`);
}

export const TOAN2 = {
  c1: [(r) => placeValue(r, 99), (r) => compare(r, 99), (r) => beforeAfter(r, 99), (r) => addQ(r, 99, false), (r) => subQ(r, 99, false), (r) => biggest(r, 99), (r) => readNum(r, 11, 99), (r) => missing(r, 99)],
  c2: [(r) => { const a = r.int(2, 9), b = r.int(11 - a, 9); return n(r, `${a} + ${b} = ?`, a + b, [a + b - 1, a + b + 1, a + b - 10, Math.abs(a - b)], `Tách để tròn chục: ${a} + ${10 - a} = 10, rồi cộng thêm ${b - (10 - a)}: ${a + b}.`); },
    (r) => { const s = r.int(11, 18), b = r.int(s - 9, 9); return n(r, `${s} − ${b} = ?`, s - b, [s - b + 1, s - b - 1, s + b, s - b + 10], `${s} − ${s - 10} = 10, rồi 10 − ${b - (s - 10)} = ${s - b}.`); },
    (r) => storyAdd(r, 18), (r) => storySub(r, 18), (r) => missing(r, 18)],
  c3: [kgL],
  c4: [(r) => addQ(r, 100, true), (r) => subQ(r, 100, true), (r) => storyAdd(r, 100), (r) => storySub(r, 100), (r) => moreLess(r, 100), (r) => missing(r, 100)],
  c5: [zigzag, sameZigzag],
  c6: [clock],
  c7: [mulQ, mulStory, mulTerms],
  c8: [(r) => placeValue(r, 999), (r) => compare(r, 999), (r) => beforeAfter(r, 999), (r) => readNum(r, 101, 999), (r) => writeNum(r, 101, 999), (r) => biggest(r, 999)],
  c9: [lengthUnits],
  c10: [(r) => hundreds(r, false), (r) => hundreds(r, true), (r) => hundredsSub(r, false), (r) => hundredsSub(r, true), roundHundreds, story1000],
  c11: [money, chance, tally],
  "tong-hop": [(r) => addQ(r, 100, true), (r) => subQ(r, 100, true), mulQ, mulStory, (r) => readNum(r, 101, 999), lengthUnits, clock, money, zigzag, kgL, story1000],
};
