// Sinh câu Toán lớp 4 (KNTT/GDPT 2018) cho từng chương.
import { NAMES, fmt, makeQ, numWrong, readVN } from "./common.mjs";

const n = (r, q, c, w, e) => makeQ(r, q, c, w, e, () => fmt(Math.max(0, Number(String(c).replace(/\D/g, "")) + r.int(-20, 20))));
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (a, b) => `${a}/${b}`;

// ---------- Chương 1: Số có nhiều chữ số ----------
const PLACES = ["đơn vị", "chục", "trăm", "nghìn", "chục nghìn", "trăm nghìn", "triệu", "chục triệu", "trăm triệu"];
function bigNum(r) {
  const digits = r.int(5, 9);
  let x = r.int(1, 9);
  for (let i = 1; i < digits; i++) x = x * 10 + r.int(0, 9);
  return x;
}
function readBig(r) {
  const x = bigNum(r);
  const alt = [x + 1000, x + 10, Math.floor(x / 10), x * 10].map(readVN);
  return makeQ(r, `Số ${fmt(x)} đọc là:`, readVN(x), alt, `Tách lớp ba chữ số từ phải sang trái rồi đọc: ${readVN(x).toLowerCase()}.`);
}
function writeBig(r) {
  const x = bigNum(r);
  return n(r, `Số "${readVN(x).toLowerCase()}" viết là:`, fmt(x), [fmt(x * 10), fmt(Math.floor(x / 10)), fmt(x + 1000), fmt(x + 100000)], `Viết từng lớp: ${fmt(x)}.`);
}
function digitValue(r) {
  const x = bigNum(r);
  const s = String(x);
  const pos = r.int(0, s.length - 1);
  const d = Number(s[s.length - 1 - pos]);
  if (d === 0) return null;
  const v = d * 10 ** pos;
  return n(r, `Trong số ${fmt(x)}, chữ số ${d} ở hàng ${PLACES[pos]} có giá trị là:`, fmt(v), [fmt(d), fmt(v * 10), fmt(v / 10 >= 1 ? v / 10 : v * 100), fmt(d * 10 ** (pos + 2))], `Chữ số ${d} đứng ở hàng ${PLACES[pos]} nên có giá trị ${fmt(v)}.`);
}
function whichPlace(r) {
  const x = bigNum(r);
  const s = String(x);
  const pos = r.int(1, s.length - 1);
  const d = s[s.length - 1 - pos];
  if (s.split("").filter((c) => c === d).length > 1) return null;
  return makeQ(r, `Trong số ${fmt(x)}, chữ số ${d} thuộc hàng nào?`, `Hàng ${PLACES[pos]}`, PLACES.filter((_, i) => i !== pos && i < s.length + 1).map((p) => `Hàng ${p}`), `Đếm từ phải sang trái: đơn vị, chục, trăm, nghìn,... chữ số ${d} ở hàng ${PLACES[pos]}.`);
}
function compareBig(r) {
  const a = bigNum(r);
  const b = r.next() < 0.5 ? a + r.pick([1, 10, 1000, -1000, 100000, -10]) : bigNum(r);
  const sign = a > b ? ">" : a < b ? "<" : "=";
  return makeQ(r, `Điền dấu: ${fmt(a)} ... ${fmt(b)}`, sign, ["<", ">", "=", "+"].filter((s) => s !== sign), `So sánh số chữ số, rồi so sánh từng hàng từ trái sang phải: ${fmt(a)} ${sign} ${fmt(b)}.`);
}
function roundNum(r) {
  const x = r.int(10000, 999999);
  const t = r.pick([[1000, "nghìn"], [10000, "chục nghìn"], [100000, "trăm nghìn"]]);
  const rd = Math.round(x / t[0]) * t[0];
  return n(r, `Làm tròn số ${fmt(x)} đến hàng ${t[1]} được:`, fmt(rd), [fmt(Math.floor(x / t[0]) * t[0] === rd ? rd + t[0] : Math.floor(x / t[0]) * t[0]), fmt(Math.round(x / (t[0] / 10)) * (t[0] / 10)), fmt(rd + t[0] * 2), fmt(Math.max(0, rd - t[0]))], `Xét chữ số ngay sau hàng ${t[1]}: nhỏ hơn 5 thì giữ nguyên, từ 5 trở lên thì cộng thêm 1 vào hàng ${t[1]}. Kết quả ${fmt(rd)}.`);
}
function evenOdd(r) {
  const x = r.int(1000, 99999);
  const even = x % 2 === 0;
  return makeQ(r, `Số ${fmt(x)} là số chẵn hay số lẻ?`, even ? "Số chẵn" : "Số lẻ", [even ? "Số lẻ" : "Số chẵn", "Không chẵn không lẻ", "Vừa chẵn vừa lẻ"], `Chữ số tận cùng là ${x % 10} nên ${fmt(x)} là ${even ? "số chẵn" : "số lẻ"}.`);
}

// ---------- Chương 2: Góc và đường thẳng ----------
function angleKind(r) {
  const deg = r.pick([20, 35, 45, 60, 75, 89, 90, 100, 120, 135, 150, 170, 180]);
  const kind = deg < 90 ? "Góc nhọn" : deg === 90 ? "Góc vuông" : deg < 180 ? "Góc tù" : "Góc bẹt";
  return makeQ(r, `Góc có số đo ${deg}° là:`, kind, ["Góc nhọn", "Góc vuông", "Góc tù", "Góc bẹt"].filter((k) => k !== kind), "Góc nhọn bé hơn 90°, góc vuông bằng 90°, góc tù lớn hơn 90° và bé hơn 180°, góc bẹt bằng 180°.");
}
function clockAngle(r) {
  const [h, kind] = r.pick([[3, "Góc vuông"], [9, "Góc vuông"], [6, "Góc bẹt"], [1, "Góc nhọn"], [2, "Góc nhọn"], [4, "Góc tù"], [5, "Góc tù"], [10, "Góc nhọn"], [8, "Góc tù"]]);
  return makeQ(r, `Lúc ${h} giờ đúng, kim giờ và kim phút tạo thành:`, kind, ["Góc nhọn", "Góc vuông", "Góc tù", "Góc bẹt"].filter((k) => k !== kind), `Mỗi khoảng giữa hai số trên mặt đồng hồ là 30°. Lúc ${h} giờ hai kim cách nhau ${Math.min(h, 12 - h) * 30}°.`);
}
const LINES = [
  ["Hai đường thẳng vuông góc tạo thành mấy góc vuông?", "4 góc vuông", ["2 góc vuông", "1 góc vuông", "3 góc vuông"], "Hai đường thẳng vuông góc cắt nhau tạo thành 4 góc vuông chung đỉnh."],
  ["Hai đường thẳng song song thì:", "Không bao giờ cắt nhau", ["Cắt nhau tại một điểm", "Vuông góc với nhau", "Cắt nhau tại hai điểm"], "Hai đường thẳng song song kéo dài mãi cũng không gặp nhau."],
  ["Dụng cụ dùng để đo góc là:", "Thước đo góc", ["Com-pa", "Thước kẻ thẳng", "Ê-ke"], "Thước đo góc có vạch từ 0° đến 180°."],
  ["Dụng cụ dùng để kiểm tra góc vuông là:", "Ê-ke", ["Com-pa", "Thước dây", "Cân"], "Ê-ke có một góc vuông để kiểm tra và vẽ góc vuông."],
  ["Đơn vị đo góc là:", "Độ (°)", ["Xăng-ti-mét", "Ki-lô-gam", "Lít"], "Góc được đo bằng độ, kí hiệu °."],
  ["Hình chữ nhật có mấy cặp cạnh song song?", "2 cặp", ["1 cặp", "3 cặp", "4 cặp"], "Hai cặp cạnh đối diện của hình chữ nhật song song với nhau."],
  ["Góc bẹt bằng mấy góc vuông?", "2 góc vuông", ["1 góc vuông", "3 góc vuông", "4 góc vuông"], "Góc bẹt 180° = 2 × 90°."],
  ["Hai cạnh kề nhau của hình vuông thì:", "Vuông góc với nhau", ["Song song với nhau", "Trùng nhau", "Không cắt nhau"], "Mọi góc của hình vuông đều là góc vuông."],
];
const lineQ = (r) => { const [q, a, w, e] = r.pick(LINES); return makeQ(r, q, a, w, e); };
function compareAngle(r) {
  const a = r.int(10, 170), b = r.int(10, 170);
  if (a === b) return null;
  return makeQ(r, `Góc A bằng ${a}°, góc B bằng ${b}°. Khẳng định nào đúng?`, a > b ? "Góc A lớn hơn góc B" : "Góc B lớn hơn góc A", [a > b ? "Góc B lớn hơn góc A" : "Góc A lớn hơn góc B", "Hai góc bằng nhau", "Không so sánh được"], `So sánh số đo: ${Math.max(a, b)}° > ${Math.min(a, b)}°.`);
}

// ---------- Chương 3: Cộng, trừ ----------
function bigAdd(r) {
  const a = r.int(10000, 500000), b = r.int(1000, 400000);
  return n(r, `${fmt(a)} + ${fmt(b)} = ?`, fmt(a + b), numWrong(r, a + b).map((x) => x).concat([fmt(a + b + 1000), fmt(a + b - 10000)]), `Đặt tính thẳng hàng rồi cộng từ phải sang trái: ${fmt(a + b)}.`);
}
function bigSub(r) {
  const a = r.int(50000, 900000), b = r.int(1000, a - 1000);
  return n(r, `${fmt(a)} − ${fmt(b)} = ?`, fmt(a - b), [fmt(a - b + 10), fmt(a - b - 1000), fmt(a - b + 10000), fmt(a + b)], `Đặt tính thẳng hàng rồi trừ từ phải sang trái: ${fmt(a - b)}.`);
}
function addProps(r) {
  const a = r.int(100, 999), b = r.int(100, 999), c = 1000 - b;
  return n(r, `Tính thuận tiện: ${a} + ${b} + ${c} = ?`, fmt(a + 1000), [fmt(a + b), fmt(a + 100), fmt(a + 1000 + 10), fmt(a + b + c + 100)], `Nhóm ${b} + ${c} = 1000 trước: ${a} + 1000 = ${fmt(a + 1000)}.`);
}
function findX(r) {
  const x = r.int(1000, 90000), b = r.int(1000, 50000);
  return r.next() < 0.5
    ? n(r, `Tìm x: x + ${fmt(b)} = ${fmt(x + b)}`, fmt(x), [fmt(x + 2 * b), fmt(x + 10), fmt(b), fmt(x - 100)], `x = ${fmt(x + b)} − ${fmt(b)} = ${fmt(x)}.`)
    : n(r, `Tìm x: x − ${fmt(b)} = ${fmt(x)}`, fmt(x + b), [fmt(x - b > 0 ? x - b : x + 1), fmt(x + b + 10), fmt(x), fmt(x + b - 1000)], `x = ${fmt(x)} + ${fmt(b)} = ${fmt(x + b)}.`);
}
function storyBig(r) {
  const a = r.int(12000, 60000), b = r.int(5000, 30000);
  const what = r.pick([["kg gạo", "kho"], ["lít xăng", "trạm"], ["cây giống", "vườn ươm"], ["quyển sách", "nhà sách"]]);
  return r.next() < 0.5
    ? n(r, `Một ${what[1]} có ${fmt(a)} ${what[0]}, nhập thêm ${fmt(b)} ${what[0]}. Lúc này ${what[1]} có bao nhiêu ${what[0]}?`, `${fmt(a + b)} ${what[0]}`, [`${fmt(a - b)} ${what[0]}`, `${fmt(a + b + 1000)} ${what[0]}`, `${fmt(a + b - 100)} ${what[0]}`, `${fmt(a + b + 10)} ${what[0]}`], `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}.`)
    : n(r, `Một ${what[1]} có ${fmt(a)} ${what[0]}, đã xuất đi ${fmt(b)} ${what[0]}. Còn lại bao nhiêu ${what[0]}?`, `${fmt(a - b)} ${what[0]}`, [`${fmt(a + b)} ${what[0]}`, `${fmt(a - b + 1000)} ${what[0]}`, `${fmt(a - b - 10)} ${what[0]}`, `${fmt(a - b + 100)} ${what[0]}`], `${fmt(a)} − ${fmt(b)} = ${fmt(a - b)}.`);
}

// ---------- Chương 4: Đơn vị đo ----------
const CONV = [
  ["yến", "kg", 10], ["tạ", "kg", 100], ["tấn", "kg", 1000], ["tạ", "yến", 10], ["tấn", "tạ", 10],
  ["phút", "giây", 60], ["giờ", "phút", 60], ["thế kỉ", "năm", 100],
  ["m²", "dm²", 100], ["dm²", "cm²", 100], ["m²", "cm²", 10000],
];
function convert(r) {
  const [big, small, k] = r.pick(CONV);
  const a = r.int(2, 9);
  return n(r, `${a} ${big} = ... ${small}`, fmt(a * k), [fmt(a * k * 10), fmt(a * (k / 10 >= 1 ? k / 10 : k * 100)), fmt(a + k), fmt(a * k + k)], `1 ${big} = ${fmt(k)} ${small} nên ${a} ${big} = ${fmt(a * k)} ${small}.`);
}
function convertMixed(r) {
  const [big, small, k] = r.pick(CONV.filter((c) => c[2] <= 100));
  const a = r.int(1, 9), b = r.int(1, k - 1);
  return n(r, `${a} ${big} ${b} ${small} = ... ${small}`, fmt(a * k + b), [fmt(a * 10 + b), fmt(a + b), fmt(a * k), fmt(a * k + b * 10)], `${a} ${big} = ${fmt(a * k)} ${small}, cộng thêm ${b}: ${fmt(a * k + b)} ${small}.`);
}
function century(r) {
  const y = r.int(1001, 2099);
  const c = Math.ceil(y / 100);
  const R = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  return makeQ(r, `Năm ${y} thuộc thế kỉ nào?`, `Thế kỉ ${R[c]}`, [`Thế kỉ ${R[c - 1]}`, `Thế kỉ ${R[c + 1] ?? "XXII"}`, `Thế kỉ ${R[Math.floor(y / 100)] === R[c] ? R[c - 2] : R[Math.floor(y / 100)]}`], `Thế kỉ thứ ${c} gồm các năm từ ${(c - 1) * 100 + 1} đến ${c * 100}.`);
}
function weightStory(r) {
  const a = r.int(2, 9), b = r.int(10, 90);
  return n(r, `Một xe chở ${a} tạ gạo và ${b} kg ngô. Xe chở tất cả bao nhiêu ki-lô-gam?`, `${a * 100 + b} kg`, [`${a + b} kg`, `${a * 10 + b} kg`, `${a * 1000 + b} kg`, `${a * 100 - b} kg`], `${a} tạ = ${a * 100} kg; ${a * 100} + ${b} = ${a * 100 + b} kg.`);
}

// ---------- Chương 5: Nhân, chia ----------
function mul2(r) {
  const a = r.int(12, 999), b = r.int(11, 99);
  return n(r, `${fmt(a)} × ${b} = ?`, fmt(a * b), [fmt(a * (b - 1)), fmt(a * b + a), fmt(a * (b % 10) + a * Math.floor(b / 10)), fmt(a * b + 10)], `Nhân ${fmt(a)} với từng chữ số của ${b} rồi cộng hai tích riêng (tích thứ hai lùi sang trái một cột): ${fmt(a * b)}.`);
}
function mul10(r) {
  const a = r.int(12, 9999), k = r.pick([10, 100, 1000]);
  return r.next() < 0.5
    ? n(r, `${fmt(a)} × ${fmt(k)} = ?`, fmt(a * k), [fmt(a * k * 10), fmt(a * k / 10), fmt(a + k), fmt(a * k + a)], `Nhân với ${fmt(k)}: viết thêm ${String(k).length - 1} chữ số 0 vào bên phải: ${fmt(a * k)}.`)
    : n(r, `${fmt(a * k)} : ${fmt(k)} = ?`, fmt(a), [fmt(a * 10), fmt(Math.floor(a / 10) || a + 1), fmt(a * k), fmt(a + 1)], `Chia cho ${fmt(k)}: bỏ bớt ${String(k).length - 1} chữ số 0 ở bên phải: ${fmt(a)}.`);
}
function div1(r) {
  const b = r.int(2, 9), q = r.int(100, 9999), rem = r.next() < 0.4 ? r.int(1, b - 1) : 0;
  const a = b * q + rem;
  return n(r, `${fmt(a)} : ${b} = ?`, rem ? `${fmt(q)} (dư ${rem})` : fmt(q), rem ? [`${fmt(q + 1)} (dư ${rem})`, `${fmt(q)} (dư ${rem + 1 < b ? rem + 1 : rem - 1})`, `${fmt(q)}`, `${fmt(Math.floor(q / 10))} (dư ${rem})`] : [fmt(q + 1), fmt(q * 10), fmt(q - 1), fmt(q + 10)], `Chia lần lượt từ trái sang phải: ${fmt(a)} : ${b} = ${fmt(q)}${rem ? ` dư ${rem}` : ""}. Thử lại: ${fmt(q)} × ${b}${rem ? ` + ${rem}` : ""} = ${fmt(a)}.`);
}
function div2(r) {
  const b = r.int(11, 99), q = r.int(12, 999);
  return n(r, `${fmt(b * q)} : ${b} = ?`, fmt(q), [fmt(q + 1), fmt(q - 1), fmt(q * 10), fmt(q + 10)], `Thử lại: ${fmt(q)} × ${b} = ${fmt(b * q)}.`);
}
function mulProps(r) {
  const a = r.int(12, 99), b = r.pick([25, 50, 125]), c = { 25: 4, 50: 2, 125: 8 }[b];
  return n(r, `Tính thuận tiện: ${b} × ${a} × ${c} = ?`, fmt(a * b * c), [fmt(a * b), fmt(a * 100 + 1), fmt(a * b * c * 10), fmt(a * c)], `Nhóm ${b} × ${c} = ${b * c} trước: ${a} × ${b * c} = ${fmt(a * b * c)}.`);
}
function distrib(r) {
  const a = r.int(12, 99), b = r.int(11, 60), c = 100 - b;
  return n(r, `Tính thuận tiện: ${a} × ${b} + ${a} × ${c} = ?`, fmt(a * 100), [fmt(a * b), fmt(a * 10), fmt(a * 100 + a), fmt(a + 100)], `Đặt ${a} làm thừa số chung: ${a} × (${b} + ${c}) = ${a} × 100 = ${fmt(a * 100)}.`);
}
function mulStory(r) {
  const a = r.int(12, 95), b = r.int(15, 60);
  const [box, item] = r.pick([["thùng", "chai nước"], ["hộp", "cây bút"], ["xe", "bao xi măng"], ["giá", "quyển sách"]]);
  return r.next() < 0.5
    ? n(r, `Mỗi ${box} có ${a} ${item}. ${b} ${box} như thế có bao nhiêu ${item}?`, `${fmt(a * b)} ${item}`, [`${fmt(a + b)} ${item}`, `${fmt(a * b + a)} ${item}`, `${fmt(a * (b - 1))} ${item}`, `${fmt(a * b * 10)} ${item}`], `${a} × ${b} = ${fmt(a * b)} ${item}.`)
    : n(r, `Có ${fmt(a * b)} ${item} xếp đều vào ${b} ${box}. Mỗi ${box} có bao nhiêu ${item}?`, `${a} ${item}`, [`${a + 1} ${item}`, `${b} ${item}`, `${a * 10} ${item}`, `${a - 1} ${item}`], `${fmt(a * b)} : ${b} = ${a} ${item}.`);
}

// ---------- Chương 6: Trung bình cộng; tổng và hiệu ----------
function average(r) {
  const k = r.int(2, 5);
  const avg = r.int(10, 90);
  const xs = Array.from({ length: k - 1 }, () => avg + r.int(-9, 9));
  xs.push(avg * k - xs.reduce((a, b) => a + b, 0));
  if (xs.some((v) => v <= 0)) return null;
  return n(r, `Trung bình cộng của các số ${xs.join(", ")} là:`, avg, [avg * k, avg + 1, avg - 1, Math.max(...xs)], `Tổng ${xs.join(" + ")} = ${avg * k}; chia cho ${k} số: ${avg * k} : ${k} = ${avg}.`);
}
function avgStory(r) {
  const k = r.int(3, 5), avg = r.int(20, 60);
  const xs = Array.from({ length: k - 1 }, () => avg + r.int(-8, 8));
  xs.push(avg * k - xs.reduce((a, b) => a + b, 0));
  return n(r, `${k} ngày cửa hàng bán được lần lượt ${xs.join(" kg, ")} kg gạo. Trung bình mỗi ngày bán được:`, `${avg} kg`, [`${avg * k} kg`, `${avg + 2} kg`, `${avg - 2} kg`, `${xs[0]} kg`], `Tổng ${avg * k} kg chia ${k} ngày: ${avg} kg.`);
}
function sumDiff(r) {
  const big = r.int(30, 500), small = r.int(10, big - 5);
  const S = big + small, D = big - small;
  const which = r.next() < 0.5;
  return n(r, `Tổng của hai số là ${S}, hiệu của chúng là ${D}. Số ${which ? "lớn" : "bé"} là:`, which ? big : small, [which ? small : big, S / 2, D, which ? big + 1 : small + 1], which ? `Số lớn = (tổng + hiệu) : 2 = (${S} + ${D}) : 2 = ${big}.` : `Số bé = (tổng − hiệu) : 2 = (${S} − ${D}) : 2 = ${small}.`);
}
function sumDiffStory(r) {
  const a = r.int(10, 40), b = r.int(3, a - 2);
  const [x, y] = r.shuffle(NAMES).slice(0, 2);
  return n(r, `${x} và ${y} có tất cả ${a + a - b} quyển truyện. ${x} có nhiều hơn ${y} ${b} quyển. ${x} có bao nhiêu quyển?`, `${a} quyển`, [`${a - b} quyển`, `${a + b} quyển`, `${(2 * a - b) / 2} quyển`, `${a + 1} quyển`], `Số của ${x} = (${2 * a - b} + ${b}) : 2 = ${a} quyển.`);
}

// ---------- Chương 7: Hình bình hành, hình thoi ----------
const SHAPES = [
  ["Hình bình hành có:", "Hai cặp cạnh đối diện song song và bằng nhau", ["Bốn góc vuông", "Bốn cạnh bằng nhau và bốn góc vuông", "Chỉ có một cặp cạnh song song"], "Hình bình hành có các cặp cạnh đối diện song song và bằng nhau."],
  ["Hình thoi có:", "Bốn cạnh bằng nhau, hai cặp cạnh đối diện song song", ["Bốn góc vuông bắt buộc", "Chỉ hai cạnh bằng nhau", "Không có cạnh song song"], "Hình thoi có bốn cạnh bằng nhau."],
  ["Hai đường chéo của hình thoi:", "Vuông góc với nhau và cắt nhau tại trung điểm mỗi đường", ["Song song với nhau", "Không cắt nhau", "Luôn bằng nhau"], "Hai đường chéo hình thoi vuông góc và cắt nhau tại trung điểm."],
  ["Hình nào vừa là hình chữ nhật vừa là hình thoi?", "Hình vuông", ["Hình bình hành bất kì", "Hình tam giác", "Hình tròn"], "Hình vuông có 4 góc vuông và 4 cạnh bằng nhau."],
  ["Hình chữ nhật có phải là hình bình hành không?", "Có, vì có hai cặp cạnh đối diện song song và bằng nhau", ["Không, vì có góc vuông", "Không, vì cạnh không bằng nhau", "Chỉ khi là hình vuông"], "Hình chữ nhật là hình bình hành đặc biệt có 4 góc vuông."],
];
const shapeQ = (r) => { const [q, a, w, e] = r.pick(SHAPES); return makeQ(r, q, a, w, e); };
function rhombusPerim(r) {
  const a = r.int(3, 25);
  return n(r, `Hình thoi có cạnh ${a} cm. Chu vi hình thoi là:`, `${a * 4} cm`, [`${a * 2} cm`, `${a * a} cm`, `${a + 4} cm`, `${a * 4 + 4} cm`], `Hình thoi có 4 cạnh bằng nhau: ${a} × 4 = ${a * 4} cm.`);
}
function paraPerim(r) {
  const a = r.int(5, 30), b = r.int(3, a);
  return n(r, `Hình bình hành có hai cạnh kề nhau dài ${a} cm và ${b} cm. Chu vi hình bình hành là:`, `${(a + b) * 2} cm`, [`${a + b} cm`, `${a * b} cm`, `${(a + b) * 2 + 2} cm`, `${a * 4} cm`], `Chu vi = (${a} + ${b}) × 2 = ${(a + b) * 2} cm.`);
}

// ---------- Chương 8: Biểu đồ cột, dãy số liệu ----------
function chart(r) {
  const cls = ["4A", "4B", "4C", "4D"];
  const vals = cls.map(() => r.int(10, 45));
  const table = cls.map((c, i) => `${c}: ${vals[i]}`).join("; ");
  const t = r.int(0, 3);
  const max = Math.max(...vals), min = Math.min(...vals);
  if (t === 0 && vals.filter((v) => v === max).length === 1) return makeQ(r, `Biểu đồ số cây mỗi lớp trồng được – ${table}. Lớp nào trồng nhiều cây nhất?`, `Lớp ${cls[vals.indexOf(max)]}`, cls.filter((_, i) => vals[i] !== max).map((c) => `Lớp ${c}`), `Cột cao nhất ứng với ${max} cây.`);
  if (t === 1) { const s = vals.reduce((a, b) => a + b, 0); return n(r, `Biểu đồ số cây mỗi lớp trồng được – ${table}. Cả bốn lớp trồng được bao nhiêu cây?`, `${s} cây`, [`${s + 10} cây`, `${s - 1} cây`, `${max * 4} cây`, `${s + 1} cây`], `${vals.join(" + ")} = ${s} cây.`); }
  if (t === 2) return n(r, `Biểu đồ số cây mỗi lớp trồng được – ${table}. Lớp trồng nhiều nhất hơn lớp trồng ít nhất bao nhiêu cây?`, `${max - min} cây`, [`${max + min} cây`, `${max} cây`, `${max - min + 1} cây`, `${min} cây`], `${max} − ${min} = ${max - min} cây.`);
  const s = vals.reduce((a, b) => a + b, 0);
  if (s % 4) return null;
  return n(r, `Biểu đồ số cây mỗi lớp trồng được – ${table}. Trung bình mỗi lớp trồng được bao nhiêu cây?`, `${s / 4} cây`, [`${s} cây`, `${s / 4 + 1} cây`, `${max} cây`, `${s / 4 - 1} cây`], `Tổng ${s} cây chia 4 lớp: ${s / 4} cây.`);
}
function seq(r) {
  const xs = Array.from({ length: 6 }, () => r.int(1, 50));
  const t = r.int(0, 2);
  if (t === 0) return n(r, `Dãy số liệu: ${xs.join(", ")}. Dãy có bao nhiêu số liệu?`, 6, [5, 7, xs.length + 2, xs[5]], "Đếm các số trong dãy: 6 số liệu.");
  if (t === 1) { const i = r.int(1, 6); return n(r, `Dãy số liệu: ${xs.join(", ")}. Số thứ ${i} của dãy là:`, xs[i - 1], xs.filter((_, j) => j !== i - 1).concat([i]), `Đếm từ trái sang, số thứ ${i} là ${xs[i - 1]}.`); }
  const mx = Math.max(...xs);
  return n(r, `Dãy số liệu: ${xs.join(", ")}. Số lớn nhất trong dãy là:`, mx, xs.filter((v) => v !== mx).concat([mx + 1]), `So sánh các số: lớn nhất là ${mx}.`);
}

// ---------- Chương 9, 10: Phân số ----------
function fracRead(r) {
  const b = r.int(2, 12), a = r.int(1, b + 3);
  return makeQ(r, `Phân số ${frac(a, b)} có tử số và mẫu số là:`, `Tử số ${a}, mẫu số ${b}`, [`Tử số ${b}, mẫu số ${a}`, `Tử số ${a + b}, mẫu số ${b}`, `Tử số ${a}, mẫu số ${a + b}`], "Tử số viết trên gạch ngang, mẫu số viết dưới gạch ngang.");
}
function fracShade(r) {
  const b = r.int(3, 12), a = r.int(1, b - 1);
  return makeQ(r, `Một cái bánh chia thành ${b} phần bằng nhau, ăn ${a} phần. Phân số chỉ phần bánh đã ăn là:`, frac(a, b), [frac(b, a), frac(b - a, b), frac(a, b + a)], `Lấy ${a} phần trong ${b} phần bằng nhau: ${frac(a, b)}.`);
}
function simplify(r) {
  const k = r.int(2, 9), a0 = r.int(1, 9), b0 = r.int(a0 + 1, 12);
  if (gcd(a0, b0) !== 1) return null;
  return makeQ(r, `Rút gọn phân số ${frac(a0 * k, b0 * k)} được phân số tối giản:`, frac(a0, b0), [frac(a0 * k, b0), frac(a0, b0 * k), frac(a0 + 1, b0), frac(b0, a0)], `Chia cả tử và mẫu cho ${k}: ${frac(a0, b0)}.`);
}
function compareFrac(r) {
  const b = r.int(3, 12), a = r.int(1, b - 1), c = r.int(1, b - 1);
  if (a === c) return null;
  const s = a > c ? ">" : "<";
  return makeQ(r, `Điền dấu: ${frac(a, b)} ... ${frac(c, b)}`, s, ["<", ">", "=", "+"].filter((x) => x !== s), `Cùng mẫu số, phân số nào có tử lớn hơn thì lớn hơn: ${a} ${s} ${c}.`);
}
function compareOne(r) {
  const b = r.int(2, 12), a = r.int(1, 2 * b);
  const s = a > b ? ">" : a < b ? "<" : "=";
  return makeQ(r, `Điền dấu: ${frac(a, b)} ... 1`, s, ["<", ">", "=", "+"].filter((x) => x !== s), `Tử ${a > b ? "lớn hơn" : a < b ? "bé hơn" : "bằng"} mẫu nên phân số ${s} 1.`);
}
function equivFrac(r) {
  const a = r.int(1, 6), b = r.int(a + 1, 9), k = r.int(2, 6);
  if (gcd(a, b) !== 1) return null;
  return n(r, `${frac(a, b)} = ?/${b * k}. Số cần điền là:`, a * k, [a + k, a * k + 1, b * k - a, a], `Mẫu ${b} nhân ${k} được ${b * k} nên tử cũng nhân ${k}: ${a} × ${k} = ${a * k}.`);
}
function fracAdd(r) {
  const b = r.int(3, 15), a = r.int(1, b - 1), c = r.int(1, b - 1);
  const s = a + c, g = gcd(s, b);
  const ans = g > 1 ? `${frac(s / g, b / g)}` : frac(s, b);
  return makeQ(r, `${frac(a, b)} + ${frac(c, b)} = ?`, ans, [frac(s, b + b), frac(s + 1, b), frac(a * c, b), g > 1 ? frac(s, b + 1) : frac(s, 2 * b)], `Cùng mẫu số: cộng hai tử, giữ mẫu: ${frac(s, b)}${g > 1 ? ` = ${ans} (rút gọn)` : ""}.`);
}
function fracSub(r) {
  const b = r.int(3, 15), a = r.int(2, b), c = r.int(1, a - 1);
  const s = a - c, g = gcd(s, b);
  const ans = g > 1 ? frac(s / g, b / g) : frac(s, b);
  return makeQ(r, `${frac(a, b)} − ${frac(c, b)} = ?`, ans, [frac(s, 0 || b * 2), frac(a + c, b), frac(s + 1, b), frac(s, b + 1)], `Cùng mẫu số: trừ hai tử, giữ mẫu: ${frac(s, b)}${g > 1 ? ` = ${ans} (rút gọn)` : ""}.`);
}
function fracDiffDen(r) {
  const b = r.int(2, 6), d = b * r.int(2, 3), a = r.int(1, b - 1), c = r.int(1, d - 1);
  const top = a * (d / b) + c, g = gcd(top, d);
  const ans = frac(top / g, d / g);
  return makeQ(r, `${frac(a, b)} + ${frac(c, d)} = ?`, ans, [frac(a + c, b + d), frac(a + c, d), frac(top + 1, d), frac(top, b)], `Quy đồng: ${frac(a, b)} = ${frac(a * (d / b), d)}; ${frac(a * (d / b), d)} + ${frac(c, d)} = ${frac(top, d)}${g > 1 ? ` = ${ans}` : ""}.`);
}
function fracMul(r) {
  const a = r.int(1, 6), b = r.int(2, 9), c = r.int(1, 6), d = r.int(2, 9);
  const t = a * c, m = b * d, g = gcd(t, m);
  return makeQ(r, `${frac(a, b)} × ${frac(c, d)} = ?`, frac(t / g, m / g), [frac(a + c, b + d), frac(a * d, b * c), frac(t, b + d), frac(t + 1, m)], `Nhân tử với tử, mẫu với mẫu: ${frac(t, m)}${g > 1 ? ` = ${frac(t / g, m / g)}` : ""}.`);
}
function fracDiv(r) {
  const a = r.int(1, 6), b = r.int(2, 9), c = r.int(1, 6), d = r.int(2, 9);
  const t = a * d, m = b * c, g = gcd(t, m);
  return makeQ(r, `${frac(a, b)} : ${frac(c, d)} = ?`, frac(t / g, m / g), [frac(a * c, b * d), frac(m / g, t / g) === frac(t / g, m / g) ? frac(t + 1, m) : frac(m / g, t / g), frac(t + 1, m), frac(a + d, b + c)], `Chia cho một phân số là nhân với phân số đảo ngược: ${frac(a, b)} × ${frac(d, c)} = ${frac(t, m)}${g > 1 ? ` = ${frac(t / g, m / g)}` : ""}.`);
}
function fracOf(r) {
  const b = r.int(2, 9), a = r.int(1, b - 1), k = r.int(2, 12);
  const total = b * k;
  return n(r, `${frac(a, b)} của ${total} là:`, a * k, [k, total - a * k, a * k + 1, total / a > 0 ? Math.round(total / a) : 1], `${total} : ${b} × ${a} = ${a * k}.`);
}

export const TOAN4 = {
  c1: [readBig, writeBig, digitValue, whichPlace, compareBig, roundNum, evenOdd],
  c2: [angleKind, clockAngle, lineQ, compareAngle],
  c3: [bigAdd, bigSub, addProps, findX, storyBig],
  c4: [convert, convertMixed, century, weightStory],
  c5: [mul2, mul10, div1, div2, mulProps, distrib, mulStory],
  c6: [average, avgStory, sumDiff, sumDiffStory],
  c7: [shapeQ, rhombusPerim, paraPerim],
  c8: [chart, seq],
  c9: [fracRead, fracShade, simplify, compareFrac, compareOne, equivFrac],
  c10: [fracAdd, fracSub, fracDiffDen, fracMul, fracDiv, fracOf],
  "tong-hop": [readBig, bigAdd, bigSub, mul2, div1, convert, average, sumDiff, simplify, fracAdd, fracMul, angleKind, chart],
};
