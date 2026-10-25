// Sinh câu Toán lớp 3 (KNTT/GDPT 2018) cho từng chương.
import { NAMES, fmt, makeQ, numWrong, readVN } from "./common.mjs";

const n = (r, q, c, w, e) => makeQ(r, q, c, w, e, () => fmt(Math.max(0, Number(String(c).replace(/\D/g, "")) + r.int(-20, 20))));
const sign = (a, b) => (a > b ? ">" : a < b ? "<" : "=");
const cmp = (r, a, b, la = fmt(a), lb = fmt(b), why = "") => {
  const s = sign(a, b);
  return makeQ(r, `Điền dấu: ${la} ... ${lb}`, s, ["<", ">", "="].filter((x) => x !== s).concat(["Không so sánh được"]), why || `${la} ${s} ${lb}.`);
};

// ---------- Ôn tập, bảng nhân chia ----------
function addSub1000(r) {
  const a = r.int(100, 899), b = r.int(10, 999 - a);
  return r.next() < 0.5
    ? n(r, `${a} + ${b} = ?`, a + b, [a + b + 10, a + b - 10, a + b + 100, a + b - 1], `Đặt tính rồi cộng từ hàng đơn vị: ${a + b}.`)
    : n(r, `${a + b} − ${b} = ?`, a, [a + 10, a - 10, a + 100, a + 1], `Đặt tính rồi trừ từ hàng đơn vị: ${a}.`);
}
function table(r) {
  const a = r.int(2, 9), b = r.int(2, 10);
  return r.next() < 0.6
    ? n(r, `${a} × ${b} = ?`, a * b, [a * b + a, a * b - a, a + b, a * (b + 1) + 1], `Bảng nhân ${a}: ${a} × ${b} = ${a * b}.`)
    : n(r, `${a * b} : ${a} = ?`, b, [b + 1, b - 1, a, a * b - a], `Vì ${a} × ${b} = ${a * b} nên ${a * b} : ${a} = ${b}.`);
}
function tableMissing(r) {
  const a = r.int(2, 9), b = r.int(2, 10);
  return n(r, `${a} × ... = ${a * b}. Số cần điền là:`, b, [b + 1, b - 1, a * b - a, a], `${a * b} : ${a} = ${b}.`);
}
function timesStory(r) {
  const a = r.int(3, 9), b = r.int(3, 9);
  const t = r.int(0, 2);
  const [box, item] = r.pick([["hộp", "cái bánh"], ["túi", "quả cam"], ["bàn", "bạn"], ["hàng", "cây"], ["đĩa", "quả táo"]]);
  if (t === 0) return n(r, `Mỗi ${box} có ${a} ${item}. ${b} ${box} có bao nhiêu ${item}?`, `${a * b} ${item.split(" ")[0]}`, [`${a + b} ${item.split(" ")[0]}`, `${a * b + a} ${item.split(" ")[0]}`, `${a * b - b} ${item.split(" ")[0]}`, `${a * b + 1} ${item.split(" ")[0]}`], `${a} × ${b} = ${a * b}.`);
  if (t === 1) return n(r, `Có ${a * b} ${item} chia đều vào ${b} ${box}. Mỗi ${box} có mấy ${item}?`, `${a} ${item.split(" ")[0]}`, [`${b} ${item.split(" ")[0]}`, `${a + 1} ${item.split(" ")[0]}`, `${a * b - b} ${item.split(" ")[0]}`, `${a - 1} ${item.split(" ")[0]}`], `${a * b} : ${b} = ${a}.`);
  return n(r, `Có ${a * b} ${item}, xếp mỗi ${box} ${a} ${item}. Được mấy ${box}?`, `${b} ${box}`, [`${a} ${box}`, `${b + 1} ${box}`, `${a * b - a} ${box}`, `${b - 1} ${box}`], `${a * b} : ${a} = ${b} ${box}.`);
}
function timesLess(r) {
  const a = r.int(2, 9), k = r.int(2, 6);
  return r.next() < 0.5
    ? n(r, `Gấp ${a} lên ${k} lần được:`, a * k, [a + k, a * k + k, a * (k - 1), a * k - 1], `Gấp lên ${k} lần thì nhân với ${k}: ${a} × ${k} = ${a * k}.`)
    : n(r, `Giảm ${a * k} đi ${k} lần được:`, a, [a * k - k, a + 1, a * k + k, k], `Giảm đi ${k} lần thì chia cho ${k}: ${a * k} : ${k} = ${a}.`);
}

// ---------- Hình ----------
const SHAPES3 = [
  ["Khối lập phương có mấy mặt?", "6 mặt", ["4 mặt", "8 mặt", "12 mặt"], "Khối lập phương có 6 mặt là hình vuông."],
  ["Khối lập phương có mấy đỉnh?", "8 đỉnh", ["6 đỉnh", "4 đỉnh", "12 đỉnh"], "Khối lập phương có 8 đỉnh."],
  ["Khối lập phương có mấy cạnh?", "12 cạnh", ["8 cạnh", "6 cạnh", "10 cạnh"], "Khối lập phương có 12 cạnh."],
  ["Khối hộp chữ nhật có mấy mặt?", "6 mặt", ["4 mặt", "5 mặt", "8 mặt"], "Khối hộp chữ nhật có 6 mặt là hình chữ nhật."],
  ["Hình chữ nhật có mấy góc vuông?", "4 góc vuông", ["2 góc vuông", "3 góc vuông", "1 góc vuông"], "Bốn góc của hình chữ nhật đều vuông."],
  ["Hình tam giác có mấy đỉnh?", "3 đỉnh", ["4 đỉnh", "2 đỉnh", "6 đỉnh"], "Tam giác có 3 đỉnh, 3 cạnh."],
  ["Hình tứ giác có mấy góc?", "4 góc", ["3 góc", "5 góc", "6 góc"], "Tứ giác có 4 góc."],
  ["Dụng cụ để kiểm tra góc vuông là:", "Ê-ke", ["Com-pa", "Thước dây", "Cân"], "Ê-ke có một góc vuông."],
  ["Dụng cụ để vẽ hình tròn là:", "Com-pa", ["Ê-ke", "Thước đo góc", "Cân đĩa"], "Com-pa vẽ đường tròn."],
  ["Đường kính của hình tròn dài gấp mấy lần bán kính?", "2 lần", ["3 lần", "4 lần", "Bằng nhau"], "Đường kính = 2 × bán kính."],
  ["M là trung điểm của đoạn AB thì:", "M nằm giữa A, B và MA = MB", ["M nằm ngoài đoạn AB", "MA gấp đôi MB", "M trùng với A"], "Trung điểm chia đoạn thẳng thành hai phần bằng nhau."],
  ["Mặt của quả xúc xắc có dạng hình gì?", "Hình vuông", ["Hình tròn", "Hình tam giác", "Hình chữ nhật dài"], "Xúc xắc là khối lập phương, mặt là hình vuông."],
];
const shape3 = (r) => { const [q, a, w, e] = r.pick(SHAPES3); return makeQ(r, q, a, w, e); };
function radius(r) {
  const d = r.int(2, 20) * 2;
  return r.next() < 0.5
    ? n(r, `Hình tròn có đường kính ${d} cm. Bán kính là:`, `${d / 2} cm`, [`${d * 2} cm`, `${d} cm`, `${d / 2 + 1} cm`, `${d - 2} cm`], `Bán kính = đường kính : 2 = ${d / 2} cm.`)
    : n(r, `Hình tròn có bán kính ${d / 2} cm. Đường kính là:`, `${d} cm`, [`${d / 4 >= 1 ? d / 4 : d + 2} cm`, `${d / 2} cm`, `${d + 1} cm`, `${d * 2} cm`], `Đường kính = bán kính × 2 = ${d} cm.`);
}
function midpoint(r) {
  const ab = r.int(2, 20) * 2;
  return n(r, `M là trung điểm của đoạn AB dài ${ab} cm. Độ dài đoạn AM là:`, `${ab / 2} cm`, [`${ab} cm`, `${ab * 2} cm`, `${ab / 2 + 2} cm`, `${ab - 2} cm`], `AM = AB : 2 = ${ab / 2} cm.`);
}

// ---------- Nhân chia phạm vi 100 ----------
function mul2x1(r) {
  const a = r.int(11, 49), b = r.int(2, 9);
  if (a * b > 99 && r.next() < 0.5) return null;
  return n(r, `${a} × ${b} = ?`, a * b, [a * b + 10, a * b - 10, (a % 10) * b + Math.floor(a / 10), a + b], `Nhân từ hàng đơn vị: ${a % 10} × ${b} = ${(a % 10) * b}, rồi ${Math.floor(a / 10)} × ${b} = ${Math.floor(a / 10) * b} (cộng phần nhớ). Kết quả ${a * b}.`);
}
function divRem(r) {
  const b = r.int(2, 9), q = r.int(3, 12), rem = r.int(0, b - 1);
  const a = b * q + rem;
  if (a > 99) return null;
  return makeQ(r, `${a} : ${b} = ?`, rem ? `${q} (dư ${rem})` : `${q}`, rem ? [`${q + 1} (dư ${rem})`, `${q} (dư ${b})`, `${q - 1} (dư ${rem + b})`, `${q}`] : [`${q + 1}`, `${q - 1}`, `${q} (dư 1)`, `${b}`], `${b} × ${q} = ${b * q}${rem ? `, ${a} − ${b * q} = ${rem} (số dư bé hơn số chia)` : ""}.`);
}
function remainderMax(r) {
  const b = r.int(2, 9);
  return n(r, `Trong phép chia cho ${b}, số dư lớn nhất có thể là:`, b - 1, [b, b + 1, b - 2, 1], `Số dư luôn bé hơn số chia nên lớn nhất là ${b - 1}.`);
}
function fractionOf(r) {
  const k = r.int(2, 9), q = r.int(2, 10);
  return n(r, `1/${k} của ${k * q} là:`, q, [k * q - k, q + 1, k, k * q * k], `Lấy ${k * q} chia ${k} phần bằng nhau: ${k * q} : ${k} = ${q}.`);
}

// ---------- Đơn vị đo ----------
const UNITS3 = [["cm", "mm", 10], ["dm", "cm", 10], ["m", "cm", 100], ["m", "dm", 10], ["m", "mm", 1000], ["km", "m", 1000], ["kg", "g", 1000], ["l", "ml", 1000]];
function unit3(r) {
  const [big, small, k] = r.pick(UNITS3);
  const a = r.int(2, 9);
  return n(r, `${a} ${big} = ... ${small}`, fmt(a * k), [fmt(a * k * 10), fmt(a * (k === 10 ? 100 : k / 10)), fmt(a + k), fmt(a * k + a)], `1 ${big} = ${fmt(k)} ${small} nên ${a} ${big} = ${fmt(a * k)} ${small}.`);
}
function unitMixed(r) {
  const [big, small, k] = r.pick(UNITS3.filter((u) => u[2] >= 100));
  const a = r.int(1, 5), b = r.int(5, k / 2);
  return n(r, `${a} ${big} ${b} ${small} = ... ${small}`, fmt(a * k + b), [fmt(a * 10 + b), fmt(a + b), fmt(a * k), fmt(a * k + b * 10)], `${a} ${big} = ${fmt(a * k)} ${small}; cộng thêm ${b}: ${fmt(a * k + b)} ${small}.`);
}
function unitCompare(r) {
  const [big, small, k] = r.pick(UNITS3);
  const a = r.int(1, 6), b = a * k + r.pick([-k / 2, 0, k / 2, -1, 1]);
  return cmp(r, a * k, b, `${a} ${big}`, `${fmt(b)} ${small}`, `${a} ${big} = ${fmt(a * k)} ${small}, so với ${fmt(b)} ${small}.`);
}
function temp(r) {
  const t = r.pick([[37, "Nhiệt độ cơ thể người khỏe mạnh khoảng"], [100, "Nước sôi ở nhiệt độ"], [0, "Nước đông thành đá ở nhiệt độ"]]);
  return n(r, `${t[1]}:`, `${t[0]} °C`, [`${t[0] + 10} °C`, `${Math.abs(t[0] - 37) || 50} °C`, `${t[0] + 63} °C`, `${t[0] + 1} °C`], `${t[1].toLowerCase()} ${t[0]} °C.`);
}
function weightStory(r) {
  const a = r.int(200, 800), b = r.int(100, 1000 - a);
  return n(r, `Quả dưa nặng ${a} g, quả bưởi nặng ${b} g. Cả hai quả nặng bao nhiêu gam?`, `${a + b} g`, [`${Math.abs(a - b)} g`, `${a + b} kg`, `${a + b + 100} g`, `${a + b - 10} g`], `${a} + ${b} = ${a + b} g.`);
}

// ---------- Nhân chia phạm vi 1000, biểu thức ----------
function mul3x1(r) {
  const a = r.int(101, 333), b = r.int(2, 3);
  return n(r, `${a} × ${b} = ?`, a * b, [a * b + 10, a * b - 100, a + b, a * b + 1], `Nhân lần lượt từ hàng đơn vị: ${a * b}.`);
}
function div3by1(r) {
  const b = r.int(2, 9), q = r.int(101, Math.floor(999 / b));
  return n(r, `${b * q} : ${b} = ?`, q, [q + 1, q - 1, q * 10, q + 10], `Chia lần lượt từ trái sang phải. Thử lại: ${q} × ${b} = ${b * q}.`);
}
function expr(r) {
  const a = r.int(10, 99), b = r.int(2, 9), c = r.int(2, 9);
  const t = r.int(0, 2);
  if (t === 0) return n(r, `Giá trị của biểu thức ${a} + ${b} × ${c} là:`, a + b * c, [(a + b) * c, a + b + c, a * b + c, a + b * c + 1], `Nhân trước, cộng sau: ${b} × ${c} = ${b * c}; ${a} + ${b * c} = ${a + b * c}.`);
  if (t === 1) return n(r, `Giá trị của biểu thức (${a} + ${b}) × ${c} là:`, (a + b) * c, [a + b * c, a + b + c, (a + b) * c + c, (a - b) * c], `Trong ngoặc trước: ${a} + ${b} = ${a + b}; × ${c} = ${(a + b) * c}.`);
  const big = b * c * r.int(2, 5);
  return n(r, `Giá trị của biểu thức ${big} : ${b} − ${c} là:`, big / b - c, [big / (b - c || 1), big / b + c, big - b - c, big / b - c + 1], `Chia trước, trừ sau: ${big} : ${b} = ${big / b}; ${big / b} − ${c} = ${big / b - c}.`);
}

// ---------- Số đến 10 000, 100 000 ----------
function readN(r, lo, hi) {
  const x = r.int(lo, hi);
  return makeQ(r, `Số ${fmt(x)} đọc là:`, readVN(x), [x + 1000, x + 10, x + 100, Math.floor(x / 10) * 10 + ((x % 10) + 1) % 10].filter((v) => v !== x).map(readVN), `Đọc theo từng hàng: ${readVN(x).toLowerCase()}.`);
}
function writeN(r, lo, hi) {
  const x = r.int(lo, hi);
  return n(r, `Số "${readVN(x).toLowerCase()}" viết là:`, fmt(x), [fmt(x + 1000), fmt(x * 10), fmt(Math.floor(x / 10)), fmt(x + 10)], `Viết lần lượt các hàng: ${fmt(x)}.`);
}
function place(r, lo, hi) {
  const x = r.int(lo, hi);
  const s = String(x);
  const names = ["đơn vị", "chục", "trăm", "nghìn", "chục nghìn"];
  const pos = r.int(0, s.length - 1);
  const d = Number(s[s.length - 1 - pos]);
  if (!d) return null;
  return n(r, `Trong số ${fmt(x)}, chữ số ${d} ở hàng ${names[pos]} có giá trị là:`, fmt(d * 10 ** pos), [fmt(d), fmt(d * 10 ** (pos + 1)), fmt(d * 10 ** Math.max(0, pos - 1) === d * 10 ** pos ? d * 10 ** (pos + 2) : d * 10 ** Math.max(0, pos - 1)), fmt(d * 10 ** pos + 1)], `Chữ số ${d} ở hàng ${names[pos]}: ${fmt(d * 10 ** pos)}.`);
}
function cmpN(r, lo, hi) {
  const a = r.int(lo, hi), b = r.next() < 0.4 ? a + r.pick([1, -1, 10, 100, -100, 1000]) : r.int(lo, hi);
  return cmp(r, a, b);
}
function roundN(r, lo, hi) {
  const x = r.int(lo, hi);
  const [k, name] = r.pick([[10, "chục"], [100, "trăm"], [1000, "nghìn"]]);
  const rd = Math.round(x / k) * k;
  return n(r, `Làm tròn số ${fmt(x)} đến hàng ${name} được:`, fmt(rd), [fmt(Math.floor(x / k) * k === rd ? rd + k : Math.floor(x / k) * k), fmt(rd + k * 2), fmt(Math.round(x / (k * 10)) * k * 10 === rd ? rd - k : Math.round(x / (k * 10)) * k * 10), fmt(x)], `Xét chữ số ngay sau hàng ${name}: bé hơn 5 thì làm tròn xuống, từ 5 trở lên thì làm tròn lên. Kết quả ${fmt(rd)}.`);
}
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
function roman(r) {
  const x = r.int(1, 20);
  return r.next() < 0.5
    ? makeQ(r, `Số La Mã ${ROMAN[x]} là số:`, x, [x + 1, x - 1 || 21, x + 5, x + 10].filter((v) => v <= 20 || v === 21), `${ROMAN[x]} = ${x}.`, () => r.int(1, 20))
    : makeQ(r, `Số ${x} viết bằng chữ số La Mã là:`, ROMAN[x], [ROMAN[(x % 20) + 1], ROMAN[Math.max(1, x - 1)] === ROMAN[x] ? ROMAN[x + 2] : ROMAN[Math.max(1, x - 1)], ROMAN[(x + 4) % 20 + 1], ROMAN[(x + 9) % 20 + 1]], `${x} = ${ROMAN[x]}. Nhớ: I = 1, V = 5, X = 10.`);
}

// ---------- Chu vi, diện tích ----------
function perimRect(r) {
  const a = r.int(3, 30), b = r.int(2, a - 1);
  return r.next() < 0.5
    ? n(r, `Hình chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm. Chu vi là:`, `${(a + b) * 2} cm`, [`${a + b} cm`, `${a * b} cm`, `${a * 2 + b} cm`, `${(a + b) * 2 + 2} cm`], `Chu vi = (dài + rộng) × 2 = (${a} + ${b}) × 2 = ${(a + b) * 2} cm.`)
    : n(r, `Hình chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm. Diện tích là:`, `${a * b} cm²`, [`${(a + b) * 2} cm²`, `${a + b} cm²`, `${a * b} cm`, `${a * b + a} cm²`], `Diện tích = dài × rộng = ${a} × ${b} = ${a * b} cm².`);
}
function perimSquare(r) {
  const a = r.int(2, 25);
  return r.next() < 0.5
    ? n(r, `Hình vuông có cạnh ${a} cm. Chu vi là:`, `${a * 4} cm`, [`${a * a} cm`, `${a * 2} cm`, `${a + 4} cm`, `${a * 4 + 4} cm`], `Chu vi hình vuông = cạnh × 4 = ${a * 4} cm.`)
    : n(r, `Hình vuông có cạnh ${a} cm. Diện tích là:`, `${a * a} cm²`, [`${a * 4} cm²`, `${a * 2} cm²`, `${a * a} cm`, `${a * a + a} cm²`], `Diện tích hình vuông = cạnh × cạnh = ${a * a} cm².`);
}
function sideFromPerim(r) {
  const a = r.int(2, 25);
  return n(r, `Hình vuông có chu vi ${a * 4} cm. Cạnh hình vuông dài:`, `${a} cm`, [`${a * 2} cm`, `${a * 4} cm`, `${a + 4} cm`, `${a - 1} cm`], `Cạnh = chu vi : 4 = ${a * 4} : 4 = ${a} cm.`);
}
function perimTri(r) {
  const a = r.int(3, 20), b = r.int(3, 20), c = r.int(Math.abs(a - b) + 1, a + b - 1);
  return n(r, `Hình tam giác có ba cạnh ${a} cm, ${b} cm, ${c} cm. Chu vi là:`, `${a + b + c} cm`, [`${a + b} cm`, `${a * b} cm`, `${a + b + c + 1} cm`, `${(a + b + c) * 2} cm`], `Chu vi = tổng ba cạnh = ${a + b + c} cm.`);
}

// ---------- Cộng trừ 10 000, 100 000 ----------
function addBig(r, max) {
  const a = r.int(max / 10, max / 2), b = r.int(max / 20, max - a - 1);
  return r.next() < 0.5
    ? n(r, `${fmt(a)} + ${fmt(b)} = ?`, fmt(a + b), [fmt(a + b + 10), fmt(a + b - 100), fmt(a + b + 1000), fmt(a + b - 1)], `Đặt tính thẳng hàng, cộng từ phải sang trái: ${fmt(a + b)}.`)
    : n(r, `${fmt(a + b)} − ${fmt(b)} = ?`, fmt(a), [fmt(a + 10), fmt(a - 100), fmt(a + 1000), fmt(a + 2 * b)], `Đặt tính thẳng hàng, trừ từ phải sang trái: ${fmt(a)}.`);
}
function roundThousands(r, max) {
  const a = r.int(1, max / 1000 - 1) * 1000, b = r.int(1, (max - a) / 1000) * 1000;
  return n(r, `Tính nhẩm: ${fmt(a)} + ${fmt(b)} = ?`, fmt(a + b), [fmt(a + b + 1000), fmt((a + b) / 10), fmt(a + b - 1000), fmt(a + b + 100)], `${a / 1000} nghìn + ${b / 1000} nghìn = ${(a + b) / 1000} nghìn.`);
}
function bigStory(r, max) {
  const a = r.int(max / 10, max / 2), b = r.int(max / 20, a - 1);
  const [x, y] = r.pick([["Thư viện có", "quyển sách, đã cho mượn"], ["Nhà máy sản xuất được", "chai nước, đã bán"], ["Trang trại có", "con gà, đã bán"]]);
  return n(r, `${x} ${fmt(a)} ${y} ${fmt(b)}. Còn lại bao nhiêu?`, fmt(a - b), [fmt(a + b), fmt(a - b + 1000), fmt(a - b - 10), fmt(a - b + 100)], `${fmt(a)} − ${fmt(b)} = ${fmt(a - b)}.`);
}

// ---------- Đồng hồ, tháng năm, tiền ----------
const DAYS_IN = [["tháng 1", 31], ["tháng 3", 31], ["tháng 4", 30], ["tháng 5", 31], ["tháng 6", 30], ["tháng 7", 31], ["tháng 8", 31], ["tháng 9", 30], ["tháng 10", 31], ["tháng 11", 30], ["tháng 12", 31]];
function clock3(r) {
  const t = r.int(0, 4);
  if (t === 0) { const [m, d] = r.pick(DAYS_IN); return makeQ(r, `${m[0].toUpperCase() + m.slice(1)} có bao nhiêu ngày?`, `${d} ngày`, [`${d === 31 ? 30 : 31} ngày`, "28 ngày", "29 ngày", "32 ngày"].slice(0, 3), `${m} có ${d} ngày.`); }
  if (t === 1) { const h = r.int(1, 11), m = r.pick([5, 10, 20, 25, 35, 40, 50, 55]); return makeQ(r, `Kim giờ chỉ quá số ${h} một chút, kim phút chỉ vào số ${m / 5}. Đồng hồ chỉ:`, `${h} giờ ${m} phút`, [`${m / 5} giờ ${h * 5} phút`, `${h} giờ ${m / 5} phút`, `${h + 1} giờ ${m} phút`], `Kim phút chỉ số ${m / 5} là ${m} phút; kim giờ quá số ${h} là ${h} giờ.`); }
  if (t === 2) { const h = r.int(1, 11), m = r.pick([45, 50, 55]); return makeQ(r, `${h} giờ ${m} phút còn gọi là:`, `${h + 1} giờ kém ${60 - m} phút`, [`${h} giờ kém ${60 - m} phút`, `${h + 1} giờ ${60 - m} phút`, `${h - 1 || 12} giờ kém ${60 - m} phút`], `Còn ${60 - m} phút nữa là ${h + 1} giờ.`); }
  if (t === 3) { const a = r.int(6, 10), d = r.int(15, 50); return n(r, `Em bắt đầu học lúc ${a} giờ và học trong ${d} phút. Em học xong lúc:`, `${a} giờ ${d} phút`, [`${a + 1} giờ ${d} phút`, `${a} giờ ${60 - d} phút`, `${a} giờ ${d + 5} phút`, `${d} giờ ${a} phút`], `${a} giờ + ${d} phút = ${a} giờ ${d} phút.`); }
  const y = r.int(2, 10);
  return n(r, `${y} năm có bao nhiêu tháng?`, `${y * 12} tháng`, [`${y * 10} tháng`, `${y + 12} tháng`, `${y * 12 + 12} tháng`, `${y * 7} tháng`], `1 năm có 12 tháng: ${y} × 12 = ${y * 12} tháng.`);
}
function money3(r) {
  const notes = [1000, 2000, 5000, 10000, 20000, 50000];
  const t = r.int(0, 2);
  if (t === 0) { const a = r.pick(notes), b = r.pick(notes), c = r.pick(notes); return n(r, `Em có các tờ tiền ${fmt(a)} đồng, ${fmt(b)} đồng và ${fmt(c)} đồng. Em có tất cả:`, `${fmt(a + b + c)} đồng`, [`${fmt(a + b)} đồng`, `${fmt(a + b + c + 1000)} đồng`, `${fmt(a + b + c - 1000)} đồng`, `${fmt(a + c)} đồng`], `${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ${fmt(a + b + c)} đồng.`); }
  if (t === 1) { const pay = r.pick([20000, 50000, 100000]); const p = r.int(1, pay / 1000 - 1) * 1000; return n(r, `Mua đồ hết ${fmt(p)} đồng, đưa tờ ${fmt(pay)} đồng. Được trả lại:`, `${fmt(pay - p)} đồng`, [`${fmt(pay + p)} đồng`, `${fmt(pay - p + 1000)} đồng`, `${fmt(p)} đồng`, `${fmt(Math.abs(pay - p - 1000))} đồng`], `${fmt(pay)} − ${fmt(p)} = ${fmt(pay - p)} đồng.`); }
  const price = r.int(2, 9) * 1000, k = r.int(2, 6);
  return n(r, `Một quyển vở giá ${fmt(price)} đồng. Mua ${k} quyển vở hết:`, `${fmt(price * k)} đồng`, [`${fmt(price + k)} đồng`, `${fmt(price * (k + 1))} đồng`, `${fmt(price * k / 10)} đồng`, `${fmt(price * k + 1000)} đồng`], `${fmt(price)} × ${k} = ${fmt(price * k)} đồng.`);
}

// ---------- Nhân chia phạm vi 100 000 ----------
function mulBig(r) {
  const a = r.int(1001, 25000), b = r.int(2, 4);
  return n(r, `${fmt(a)} × ${b} = ?`, fmt(a * b), [fmt(a * b + 10), fmt(a * b - 1000), fmt(a * (b + 1)), fmt(a + b)], `Nhân lần lượt từ hàng đơn vị: ${fmt(a * b)}.`);
}
function divBig(r) {
  const b = r.int(2, 9), q = r.int(1001, Math.floor(99999 / b)), rem = r.next() < 0.3 ? r.int(1, b - 1) : 0;
  return makeQ(r, `${fmt(b * q + rem)} : ${b} = ?`, rem ? `${fmt(q)} (dư ${rem})` : fmt(q), rem ? [`${fmt(q + 1)} (dư ${rem})`, fmt(q), `${fmt(q)} (dư ${rem === b - 1 ? 1 : rem + 1})`, `${fmt(q - 1)} (dư ${rem})`] : [fmt(q + 1), fmt(q - 1), fmt(q * 10), fmt(q + 10)], `Chia lần lượt từ trái sang phải. Thử lại: ${fmt(q)} × ${b}${rem ? ` + ${rem}` : ""} = ${fmt(b * q + rem)}.`);
}
function unitPrice(r) {
  const each = r.int(2, 20) * 500, k = r.int(2, 8);
  return n(r, `Mua ${k} cái bút hết ${fmt(each * k)} đồng. Mua 1 cái bút như thế hết:`, `${fmt(each)} đồng`, [`${fmt(each * 2)} đồng`, `${fmt(each + 500)} đồng`, `${fmt(each * k - each)} đồng`, `${fmt(each - 500)} đồng`], `${fmt(each * k)} : ${k} = ${fmt(each)} đồng.`);
}

// ---------- Thống kê, xác suất ----------
function stats3(r) {
  const items = r.shuffle(["Bóng đá", "Cầu lông", "Bơi", "Cờ vua", "Nhảy dây"]).slice(0, 4);
  const v = items.map(() => r.int(3, 20));
  const t = r.int(0, 2);
  const tab = items.map((s, i) => `${s}: ${v[i]}`).join("; ");
  const mx = Math.max(...v), mn = Math.min(...v);
  if (t === 0 && v.filter((x) => x === mx).length === 1) return makeQ(r, `Số bạn thích mỗi môn – ${tab}. Môn nào được nhiều bạn thích nhất?`, items[v.indexOf(mx)], items.filter((_, i) => v[i] !== mx), `${mx} bạn là nhiều nhất.`);
  if (t === 1) { const s = v.reduce((a, b) => a + b, 0); return n(r, `Số bạn thích mỗi môn – ${tab}. Có tất cả bao nhiêu bạn được hỏi?`, s, numWrong(r, s), `${v.join(" + ")} = ${s}.`); }
  return n(r, `Số bạn thích mỗi môn – ${tab}. Môn được thích nhiều nhất hơn môn ít nhất bao nhiêu bạn?`, mx - mn, [mx + mn, mx, mn, mx - mn + 1], `${mx} − ${mn} = ${mx - mn}.`);
}
const CHANCE3 = [
  ["Hộp có 5 bi đỏ. Lấy ra 1 viên được bi đỏ là:", "Chắc chắn", "Hộp chỉ có bi đỏ."],
  ["Hộp có 5 bi đỏ. Lấy ra 1 viên được bi xanh là:", "Không thể", "Không có bi xanh trong hộp."],
  ["Hộp có 3 bi đỏ và 2 bi xanh. Lấy ra 1 viên được bi xanh là:", "Có thể", "Có bi xanh nhưng cũng có bi đỏ."],
  ["Tung đồng xu, được mặt sấp là:", "Có thể", "Có thể sấp, có thể ngửa."],
  ["Gieo xúc xắc được mặt có số chấm nhỏ hơn 7 là:", "Chắc chắn", "Mọi mặt đều có từ 1 đến 6 chấm."],
  ["Gieo xúc xắc được mặt 0 chấm là:", "Không thể", "Xúc xắc không có mặt 0 chấm."],
  ["Gieo xúc xắc được mặt 6 chấm là:", "Có thể", "Mặt 6 chấm có thể xuất hiện."],
  ["Rút 1 thẻ trong các thẻ số 1, 3, 5, 7 được số lẻ là:", "Chắc chắn", "Mọi thẻ đều là số lẻ."],
  ["Rút 1 thẻ trong các thẻ số 1, 3, 5, 7 được số chẵn là:", "Không thể", "Không có thẻ số chẵn."],
  ["Rút 1 thẻ trong các thẻ số 2, 3, 4 được số chẵn là:", "Có thể", "Có thẻ chẵn (2, 4) và thẻ lẻ (3)."],
];
const chance3 = (r) => { const [q, a, e] = r.pick(CHANCE3); return makeQ(r, q, a, ["Chắc chắn", "Có thể", "Không thể"].filter((x) => x !== a).concat(["Không biết được"]), e); };

export const TOAN3 = {
  c1: [addSub1000, (r) => readN(r, 100, 999), (r) => cmpN(r, 100, 999), (r) => place(r, 100, 999)],
  c2: [table, tableMissing, timesStory, timesLess],
  c3: [shape3, radius, midpoint],
  c4: [mul2x1, divRem, remainderMax, fractionOf, timesLess, timesStory],
  c5: [unit3, unitMixed, unitCompare, temp, weightStory],
  c6: [mul3x1, div3by1, expr, divRem],
  c8: [(r) => readN(r, 1000, 9999), (r) => writeN(r, 1000, 9999), (r) => place(r, 1000, 9999), (r) => cmpN(r, 1000, 9999), (r) => roundN(r, 1000, 9999), roman],
  c9: [perimRect, perimSquare, sideFromPerim, perimTri],
  c10: [(r) => addBig(r, 10000), (r) => roundThousands(r, 10000), (r) => bigStory(r, 10000)],
  c11: [(r) => readN(r, 10000, 99999), (r) => writeN(r, 10000, 99999), (r) => place(r, 10000, 99999), (r) => cmpN(r, 10000, 99999), (r) => roundN(r, 10000, 99999)],
  c12: [(r) => addBig(r, 100000), (r) => roundThousands(r, 100000), (r) => bigStory(r, 100000)],
  c13: [clock3, money3],
  c14: [mulBig, divBig, unitPrice],
  c15: [stats3, chance3],
};
