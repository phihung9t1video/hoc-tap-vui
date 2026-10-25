// Sinh câu Toán lớp 7 (KNTT/GDPT 2018) cho từng chương.
import { fmt, makeQ } from "./common.mjs";

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** Phân số tối giản dạng chuỗi: -3/4, 5, 0 */
function fr(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1;
  p /= g; q /= g;
  const s = q === 1 ? `${Math.abs(p)}` : `${Math.abs(p)}/${q}`;
  return p < 0 ? `−${s}` : s;
}
const num = (x) => (x < 0 ? `−${fmt(-x)}` : fmt(x));
const par = (x) => (x < 0 ? `(${num(x)})` : num(x));
const W = (r, q, c, w, e) => makeQ(r, q, c, w, e, () => String(r.int(-30, 30)));

// ---------- Chương 1: Số hữu tỉ ----------
function ratAdd(r) {
  const b = r.int(2, 9), d = r.int(2, 9), a = r.int(-9, 9) || 1, c = r.int(-9, 9) || -1;
  const op = r.pick(["+", "−"]);
  const P = op === "+" ? a * d + c * b : a * d - c * b, Q = b * d;
  return W(r, `Tính: ${fr(a, b)} ${op} ${c < 0 ? `(${fr(c, d)})` : fr(c, d)}`, fr(P, Q), [fr(op === "+" ? a + c : a - c, b + d), fr(-P, Q), fr(P + Q, Q), fr(op === "+" ? a * d - c * b : a * d + c * b, Q)], `Quy đồng mẫu ${Q}: ${fr(a * d, Q)} ${op} ${fr(c * b, Q)} = ${fr(P, Q)}.`);
}
function ratMul(r) {
  const a = r.int(-9, 9) || 2, b = r.int(2, 9), c = r.int(-9, 9) || -3, d = r.int(2, 9);
  const div = r.next() < 0.5;
  const P = div ? a * d : a * c, Q = div ? b * c : b * d;
  if (Q === 0) return null;
  return W(r, `Tính: ${fr(a, b)} ${div ? ":" : "·"} ${c < 0 ? `(${fr(c, d)})` : fr(c, d)}`, fr(P, Q), [fr(-P, Q), fr(div ? a * c : a * d, div ? b * d : b * c), fr(a + c, b + d), fr(P, Q + 1)], div ? `Chia là nhân với số nghịch đảo: ${fr(a, b)} · ${fr(d, c)} = ${fr(P, Q)}.` : `Nhân tử với tử, mẫu với mẫu: ${fr(P, Q)}.`);
}
function ratCompare(r) {
  const a = r.int(-9, 9), b = r.int(2, 9), c = r.int(-9, 9), d = r.int(2, 9);
  const x = a * d, y = c * b;
  if (fr(a, b) === fr(c, d)) return null;
  const s = x > y ? ">" : "<";
  return makeQ(r, `So sánh: ${fr(a, b)} ... ${fr(c, d)}`, s, ["<", ">", "="].filter((v) => v !== s).concat(["Không so sánh được"]), `Quy đồng: ${fr(a * d, b * d)} và ${fr(c * b, b * d)}; so sánh tử ${x} ${s} ${y}.`);
}
function power(r) {
  const a = r.int(-3, 5) || 2, n = r.int(2, a > 3 ? 3 : 4);
  const v = a ** n;
  return W(r, `Tính: ${par(a)}${["", "", "²", "³", "⁴"][n]} = ?`, num(v), [num(-v), num(a * n), num(v + a), num(a ** (n + 1))], `${par(a)}${["", "", "²", "³", "⁴"][n]} = ${Array(n).fill(par(a)).join(" · ")} = ${num(v)}.`);
}
function powerRules(r) {
  const a = r.int(2, 9), m = r.int(2, 6), n = r.int(2, 5);
  const t = r.int(0, 2);
  const sup = (k) => String(k).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("");
  if (t === 0) return makeQ(r, `Viết gọn: ${a}${sup(m)} · ${a}${sup(n)} = ?`, `${a}${sup(m + n)}`, [`${a}${sup(m * n)}`, `${a * a}${sup(m + n)}`, `${a}${sup(Math.abs(m - n) || m + n + 1)}`], `Nhân hai lũy thừa cùng cơ số: giữ cơ số, cộng số mũ.`);
  if (t === 1) return makeQ(r, `Viết gọn: ${a}${sup(m + n)} : ${a}${sup(n)} = ?`, `${a}${sup(m)}`, [`${a}${sup(m + 2 * n)}`, `${a}${sup((m + n) * n)}`, `1${sup(m)}`], `Chia hai lũy thừa cùng cơ số: giữ cơ số, trừ số mũ.`);
  return makeQ(r, `Viết gọn: (${a}${sup(m)})${sup(n)} = ?`, `${a}${sup(m * n)}`, [`${a}${sup(m + n)}`, `${a * n}${sup(m)}`, `${a}${sup(m * n + 1)}`], `Lũy thừa của lũy thừa: nhân hai số mũ.`);
}
function findXrat(r) {
  const x = r.int(-12, 12), a = r.int(-15, 15) || 4;
  return W(r, `Tìm x biết x + ${par(a)} = ${num(x + a)}`, num(x), [num(x + 2 * a), num(-x), num(x + 1), num(a)], `x = ${num(x + a)} − ${par(a)} = ${num(x)}.`);
}

// ---------- Chương 2: Số thực ----------
const SQ = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
function sqrtQ(r) {
  const v = r.pick(SQ), s = Math.sqrt(v);
  return W(r, `√${v} = ?`, String(s), [String(v / 2).replace(".", ","), String(s + 1), String(-s), String(s * 2)], `${s}² = ${v} và ${s} ≥ 0 nên √${v} = ${s}.`);
}
function irrational(r) {
  const irr = r.pick(["√2", "√3", "√5", "√7", "π", "√11"]);
  const rat = r.shuffle(["0,5", "−3/4", "√9", "0,(3)", "√16", "1,25", "−7", "√25"]).slice(0, 3);
  return makeQ(r, "Số nào là số vô tỉ?", irr, rat, `${irr} viết được dưới dạng số thập phân vô hạn không tuần hoàn.`);
}
function absQ(r) {
  const a = r.int(-30, 30);
  return W(r, `|${num(a)}| = ?`, num(Math.abs(a)), [num(-Math.abs(a) || 1), num(a + 1), "0", num(Math.abs(a) * 2 || 2)], `Giá trị tuyệt đối là khoảng cách đến 0, luôn không âm: ${num(Math.abs(a))}.`);
}
function absEq(r) {
  const a = r.int(1, 15), b = r.int(-10, 10);
  return makeQ(r, `Tìm x biết |x − ${par(b)}| = ${a}`, `x = ${num(b + a)} hoặc x = ${num(b - a)}`, [`x = ${num(b + a)}`, `x = ${num(a - b)} hoặc x = ${num(-a - b)}`, `x = ${num(b - a)}`], `x − ${par(b)} = ${a} hoặc x − ${par(b)} = −${a}.`);
}
function rounding(r) {
  const x = r.int(100000, 999999) / 10000;
  const [d, name] = r.pick([[1, "phần mười"], [2, "phần trăm"], [3, "phần nghìn"]]);
  const s = (v) => v.toFixed(d).replace(".", ",");
  const up = Math.round(x * 10 ** d) / 10 ** d;
  return makeQ(r, `Làm tròn số ${String(x).replace(".", ",")} đến hàng ${name} được:`, s(up), [s(up + 10 ** -d), s(up - 10 ** -d), (Math.round(x * 10 ** (d + 1)) / 10 ** (d + 1)).toFixed(d + 1).replace(".", ",")], `Xét chữ số ngay sau hàng ${name} để làm tròn: ${s(up)}.`);
}
function decimalKind(r) {
  const [f, kind] = r.pick([["1/4", "thập phân hữu hạn"], ["3/8", "thập phân hữu hạn"], ["7/20", "thập phân hữu hạn"], ["1/3", "thập phân vô hạn tuần hoàn"], ["2/9", "thập phân vô hạn tuần hoàn"], ["5/6", "thập phân vô hạn tuần hoàn"], ["1/7", "thập phân vô hạn tuần hoàn"], ["3/5", "thập phân hữu hạn"]]);
  return makeQ(r, `Phân số ${f} viết được dưới dạng số:`, `Số ${kind}`, ["Số thập phân hữu hạn", "Số thập phân vô hạn tuần hoàn", "Số vô tỉ", "Số nguyên"].filter((k) => k !== `Số ${kind}`), "Mẫu (tối giản) chỉ có ước nguyên tố 2 và 5 thì là thập phân hữu hạn; ngược lại là vô hạn tuần hoàn.");
}

// ---------- Chương 3: Góc, song song ----------
function angles(r) {
  const a = r.int(15, 165);
  const t = r.int(0, 3);
  if (t === 0) return W(r, `Hai góc kề bù, một góc bằng ${a}°. Góc còn lại bằng:`, `${180 - a}°`, [`${a}°`, `${90 - a > 0 ? 90 - a : 360 - a}°`, `${180 + a}°`, `${180 - a + 10}°`], `Hai góc kề bù có tổng 180°: 180° − ${a}° = ${180 - a}°.`);
  if (t === 1) { const b = a % 90 || 45; return W(r, `Hai góc phụ nhau, một góc bằng ${b}°. Góc còn lại bằng:`, `${90 - b}°`, [`${180 - b}°`, `${b}°`, `${90 + b}°`, `${90 - b + 5}°`], `Hai góc phụ nhau có tổng 90°.`); }
  if (t === 2) return W(r, `Hai đường thẳng cắt nhau tạo thành một góc ${a}°. Góc đối đỉnh với nó bằng:`, `${a}°`, [`${180 - a}°`, `${90}°`, `${a * 2 > 360 ? a / 2 : a * 2}°`, `${360 - a}°`], "Hai góc đối đỉnh thì bằng nhau.");
  return W(r, `Đường thẳng c cắt hai đường thẳng song song a và b. Nếu một góc so le trong bằng ${a}° thì góc so le trong còn lại bằng:`, `${a}°`, [`${180 - a}°`, `${90}°`, `${a + 10}°`, `${360 - a}°`], "Hai đường thẳng song song tạo các cặp góc so le trong bằng nhau.");
}
const PARA = [
  ["Tiên đề Ơ-clít: Qua một điểm ở ngoài một đường thẳng có:", "Chỉ một đường thẳng song song với đường thẳng đó", ["Vô số đường thẳng song song", "Không có đường song song nào", "Hai đường thẳng song song"], "Đó là nội dung tiên đề Ơ-clít."],
  ["Hai đường thẳng cùng vuông góc với một đường thẳng thứ ba thì:", "Song song với nhau", ["Vuông góc với nhau", "Cắt nhau", "Trùng nhau"], "Tính chất từ vuông góc đến song song."],
  ["Một đường thẳng vuông góc với một trong hai đường thẳng song song thì:", "Vuông góc với đường thẳng còn lại", ["Song song với đường còn lại", "Không cắt đường còn lại", "Tạo góc 45°"], "Tính chất của hai đường thẳng song song."],
  ["Tia phân giác của một góc là tia:", "Nằm giữa hai cạnh và chia góc thành hai góc bằng nhau", ["Vuông góc với một cạnh", "Trùng với một cạnh", "Nằm ngoài góc"], "Định nghĩa tia phân giác."],
  ["Định lí gồm hai phần là:", "Giả thiết và kết luận", ["Đề bài và lời giải", "Hình vẽ và kí hiệu", "Câu hỏi và đáp án"], "Giả thiết (điều cho biết) và kết luận (điều cần chứng minh)."],
];
const para = (r) => { const [q, a, w, e] = r.pick(PARA); return makeQ(r, q, a, w, e); };
function bisector(r) {
  const a = r.int(10, 85) * 2;
  return W(r, `Góc xOy = ${a}°, Ot là tia phân giác. Góc xOt bằng:`, `${a / 2}°`, [`${a}°`, `${a * 2 > 180 ? 180 - a : a * 2}°`, `${90 - a / 2}°`, `${a / 2 + 10}°`], `Tia phân giác chia đôi góc: ${a}° : 2 = ${a / 2}°.`);
}

// ---------- Chương 4, 9: Tam giác ----------
function triAngle(r) {
  const a = r.int(20, 100), b = r.int(20, 160 - a - 1);
  return W(r, `Tam giác ABC có Â = ${a}°, B̂ = ${b}°. Góc C bằng:`, `${180 - a - b}°`, [`${a + b}°`, `${180 - a}°`, `${360 - a - b}°`, `${190 - a - b}°`], `Tổng ba góc tam giác bằng 180°: 180° − ${a}° − ${b}° = ${180 - a - b}°.`);
}
function isoAngle(r) {
  const top = r.int(10, 80) * 2;
  return r.next() < 0.5
    ? W(r, `Tam giác ABC cân tại A có Â = ${top}°. Góc B bằng:`, `${(180 - top) / 2}°`, [`${top}°`, `${180 - top}°`, `${top / 2}°`, `${(180 - top) / 2 + 10}°`], `B̂ = Ĉ = (180° − ${top}°) : 2 = ${(180 - top) / 2}°.`)
    : W(r, `Tam giác ABC cân tại A có B̂ = ${(180 - top) / 2}°. Góc A bằng:`, `${top}°`, [`${(180 - top) / 2}°`, `${180 - (180 - top) / 2}°`, `${top + 10}°`, `${90}°`], `Â = 180° − 2 · ${(180 - top) / 2}° = ${top}°.`);
}
function rightTri(r) {
  const a = r.int(10, 80);
  return W(r, `Tam giác ABC vuông tại A có B̂ = ${a}°. Góc C bằng:`, `${90 - a}°`, [`${180 - a}°`, `${a}°`, `${90 + a}°`, `${90 - a + 5}°`], "Hai góc nhọn của tam giác vuông phụ nhau.");
}
function exterior(r) {
  const a = r.int(20, 80), b = r.int(20, 80);
  return W(r, `Tam giác ABC có Â = ${a}°, B̂ = ${b}°. Góc ngoài tại đỉnh C bằng:`, `${a + b}°`, [`${180 - a - b}°`, `${180 - a}°`, `${a + b + 10}°`, `${360 - a - b}°`], "Góc ngoài bằng tổng hai góc trong không kề với nó.");
}
const CONG = [
  ["Hai tam giác bằng nhau theo trường hợp c.c.c khi:", "Ba cạnh của tam giác này bằng ba cạnh của tam giác kia", ["Có ba góc bằng nhau", "Có hai cạnh bằng nhau", "Có một cạnh bằng nhau"], "Cạnh – cạnh – cạnh."],
  ["Trường hợp bằng nhau c.g.c yêu cầu góc bằng nhau phải là:", "Góc xen giữa hai cạnh", ["Góc bất kì", "Góc đối diện một cạnh", "Góc vuông"], "Cạnh – góc xen giữa – cạnh."],
  ["Trường hợp bằng nhau g.c.g yêu cầu cạnh bằng nhau phải là:", "Cạnh xen giữa hai góc", ["Cạnh bất kì", "Cạnh huyền", "Cạnh đối diện góc lớn nhất"], "Góc – cạnh xen giữa – góc."],
  ["Hai tam giác có ba góc tương ứng bằng nhau thì:", "Chưa chắc đã bằng nhau", ["Chắc chắn bằng nhau", "Có ba cạnh bằng nhau", "Là tam giác đều"], "Ví dụ tam giác đều cạnh 1 cm và cạnh 2 cm."],
  ["Tam giác đều có mỗi góc bằng:", "60°", ["90°", "45°", "30°"], "180° : 3 = 60°."],
  ["Trong tam giác cân, hai góc ở đáy:", "Bằng nhau", ["Bù nhau", "Phụ nhau", "Luôn bằng 90°"], "Tính chất tam giác cân."],
  ["Trong tam giác, đối diện với cạnh lớn nhất là:", "Góc lớn nhất", ["Góc nhỏ nhất", "Góc vuông", "Góc bằng 60°"], "Quan hệ giữa góc và cạnh đối diện."],
  ["Trong tam giác vuông, cạnh lớn nhất là:", "Cạnh huyền", ["Cạnh góc vuông", "Đường cao", "Đường trung tuyến"], "Cạnh huyền đối diện góc vuông."],
  ["Ba đường trung tuyến của tam giác cắt nhau tại:", "Trọng tâm", ["Trực tâm", "Tâm đường tròn ngoại tiếp", "Trung điểm một cạnh"], "Giao điểm ba trung tuyến là trọng tâm."],
  ["Trọng tâm tam giác cách mỗi đỉnh một khoảng bằng:", "2/3 độ dài đường trung tuyến đi qua đỉnh đó", ["1/2 trung tuyến", "1/3 trung tuyến", "Bằng trung tuyến"], "Tính chất trọng tâm."],
  ["Ba đường phân giác của tam giác cắt nhau tại một điểm:", "Cách đều ba cạnh của tam giác", ["Cách đều ba đỉnh", "Là trọng tâm", "Nằm ngoài tam giác"], "Tính chất ba đường phân giác."],
  ["Ba đường trung trực của tam giác cắt nhau tại một điểm:", "Cách đều ba đỉnh của tam giác", ["Cách đều ba cạnh", "Là trọng tâm", "Là trực tâm"], "Tâm đường tròn ngoại tiếp."],
];
const cong = (r) => { const [q, a, w, e] = r.pick(CONG); return makeQ(r, q, a, w, e); };
function triIneq(r) {
  const a = r.int(2, 12), b = r.int(2, 12), c = r.int(1, 25);
  const ok = a + b > c && a + c > b && b + c > a;
  return makeQ(r, `Ba đoạn thẳng ${a} cm, ${b} cm, ${c} cm có tạo thành một tam giác không?`, ok ? "Có" : "Không", [ok ? "Không" : "Có", "Chỉ khi là tam giác vuông", "Không xác định được"], ok ? "Tổng hai cạnh bất kì đều lớn hơn cạnh còn lại." : `Vi phạm bất đẳng thức tam giác (tổng hai cạnh nhỏ không lớn hơn cạnh lớn nhất).`);
}
function thirdSide(r) {
  const a = r.int(3, 12), b = r.int(1, a - 1);
  return makeQ(r, `Tam giác có hai cạnh ${a} cm và ${b} cm. Độ dài cạnh thứ ba có thể là:`, `${a + b - 1} cm`, [`${a + b} cm`, `${a - b} cm`, `${a + b + 2} cm`], `Cạnh thứ ba phải lớn hơn ${a - b} cm và nhỏ hơn ${a + b} cm.`);
}
function centroid(r) {
  const m = r.int(2, 15) * 3;
  return W(r, `G là trọng tâm tam giác ABC, trung tuyến AM = ${m} cm. Độ dài AG là:`, `${(m * 2) / 3} cm`, [`${m / 3} cm`, `${m / 2} cm`, `${m} cm`, `${(m * 2) / 3 + 1} cm`], `AG = 2/3 AM = ${(m * 2) / 3} cm.`);
}

// ---------- Chương 5: Dữ liệu ----------
function mean7(r) {
  const k = r.int(4, 6), avg = r.int(5, 9);
  const xs = Array.from({ length: k - 1 }, () => avg + r.int(-2, 2));
  xs.push(avg * k - xs.reduce((a, b) => a + b, 0));
  if (xs.some((v) => v < 0 || v > 10)) return null;
  return W(r, `Điểm kiểm tra của một nhóm: ${xs.join("; ")}. Điểm trung bình là:`, String(avg), [String(avg * k), String(avg + 1), String(Math.max(...xs)), String(avg - 1)], `Tổng ${avg * k} chia ${k} = ${avg}.`);
}
const DATA = [
  ["Dữ liệu 'màu sắc yêu thích của các bạn' là loại dữ liệu:", "Không phải là số (định tính)", ["Là số", "Liên tục", "Không phân loại được"], "Màu sắc là dữ liệu không phải số."],
  ["Dữ liệu 'chiều cao của các bạn (cm)' là loại dữ liệu:", "Là số", ["Không phải là số", "Là văn bản", "Không xác định"], "Chiều cao đo bằng số."],
  ["Biểu đồ thích hợp để biểu diễn tỉ lệ các phần trong tổng thể là:", "Biểu đồ hình quạt tròn", ["Biểu đồ đoạn thẳng", "Bảng thống kê thời gian", "Biểu đồ tranh duy nhất"], "Hình quạt tròn thể hiện tỉ lệ phần trăm."],
  ["Biểu đồ thích hợp để biểu diễn sự thay đổi nhiệt độ theo thời gian là:", "Biểu đồ đoạn thẳng", ["Biểu đồ hình quạt tròn", "Biểu đồ tranh", "Bảng tên học sinh"], "Biểu đồ đoạn thẳng cho thấy xu hướng theo thời gian."],
  ["Tổng các phần trăm trong biểu đồ hình quạt tròn bằng:", "100%", ["50%", "360%", "180%"], "Cả hình tròn là 100%."],
];
const data7 = (r) => { const [q, a, w, e] = r.pick(DATA); return makeQ(r, q, a, w, e); };
function pie(r) {
  const a = r.int(10, 40), b = r.int(10, 45), c = 100 - a - b;
  const total = r.pick([40, 50, 200, 400]);
  return W(r, `Biểu đồ hình quạt: Bóng đá ${a}%, Cầu lông ${b}%, Bơi ${c}%. Lớp có ${total} học sinh. Số học sinh thích Bơi là:`, String((total * c) / 100), [String(c), String((total * a) / 100), String((total * b) / 100), String((total * c) / 100 + 1)], `${c}% của ${total} = ${total} · ${c} : 100 = ${(total * c) / 100}.`);
}

// ---------- Chương 6: Tỉ lệ thức ----------
function proportion(r) {
  const a = r.int(2, 12), b = r.int(2, 12), k = r.int(2, 6);
  return W(r, `Tìm x biết x/${a * k} = ${b}/${a}`, String(b * k), [String(b * a), String(a * k), String(b + k), String(b * k + 1)], `x = ${a * k} · ${b} : ${a} = ${b * k}.`);
}
function equalRatios(r) {
  const p = r.int(2, 7), q = r.int(2, 7), k = r.int(2, 9);
  return W(r, `Cho x/${p} = y/${q} và x + y = ${(p + q) * k}. Giá trị của x là:`, String(p * k), [String(q * k), String(k), String((p + q) * k - q), String(p * k + p)], `x/${p} = y/${q} = (x + y)/(${p} + ${q}) = ${k}, nên x = ${p * k}.`);
}
function direct(r) {
  const k = r.int(2, 9), x1 = r.int(2, 9), x2 = r.int(2, 12);
  return W(r, `y tỉ lệ thuận với x, khi x = ${x1} thì y = ${k * x1}. Khi x = ${x2} thì y bằng:`, String(k * x2), [String(k * x1), String((k * x1) / x2 % 1 === 0 ? (k * x1) / x2 : x2 + k), String(k + x2), String(k * x2 + k)], `Hệ số tỉ lệ k = ${k * x1} : ${x1} = ${k}, y = ${k} · ${x2} = ${k * x2}.`);
}
function inverse(r) {
  const a = r.pick([12, 24, 36, 48, 60, 72]), x1 = r.pick([2, 3, 4, 6]), x2 = r.pick([2, 3, 4, 6, 12].filter((v) => v !== x1));
  return W(r, `y tỉ lệ nghịch với x, khi x = ${x1} thì y = ${a / x1}. Khi x = ${x2} thì y bằng:`, String(a / x2), [String((a / x1) * x2), String(a), String(a / x2 + 1), String(a / x1)], `x · y = ${a}, nên y = ${a} : ${x2} = ${a / x2}.`);
}
function workers(r) {
  const p1 = r.pick([4, 6, 8, 10, 12]), d1 = r.pick([6, 9, 12, 15]), p2 = r.pick([3, 5, 6, 9, 18].filter((v) => (p1 * d1) % v === 0 && v !== p1));
  if (!p2) return null;
  return W(r, `${p1} công nhân làm xong một công việc trong ${d1} ngày. Với ${p2} công nhân (năng suất như nhau) thì làm xong trong bao nhiêu ngày?`, `${(p1 * d1) / p2} ngày`, [`${(d1 * p2) / p1} ngày`, `${d1} ngày`, `${p1 * d1} ngày`, `${(p1 * d1) / p2 + 1} ngày`], `Số người và số ngày tỉ lệ nghịch: ${p1} · ${d1} : ${p2} = ${(p1 * d1) / p2} ngày.`);
}
function shareRatio(r) {
  const p = r.int(2, 5), q = r.int(2, 6), k = r.int(10, 50) * 10;
  return W(r, `Chia ${fmt((p + q) * k)} đồng cho hai bạn theo tỉ lệ ${p} : ${q}. Bạn thứ nhất nhận:`, `${fmt(p * k)} đồng`, [`${fmt(q * k)} đồng`, `${fmt(((p + q) * k) / 2)} đồng`, `${fmt(p * k + k)} đồng`, `${fmt(k)} đồng`], `Mỗi phần ${fmt(k)} đồng; bạn thứ nhất ${p} phần = ${fmt(p * k)} đồng.`);
}

// ---------- Chương 7: Biểu thức, đa thức ----------
const term = (c, e) => {
  if (c === 0) return "";
  const cc = Math.abs(c) === 1 && e > 0 ? "" : String(Math.abs(c));
  const xx = e === 0 ? "" : e === 1 ? "x" : `x${"⁰¹²³⁴"[e]}`;
  return `${c < 0 ? "−" : "+"} ${cc}${xx}`;
};
const poly = (cs) => {
  const s = cs.map((c, i) => term(c, cs.length - 1 - i)).filter(Boolean).join(" ").trim();
  return s.startsWith("+ ") ? s.slice(2) : s.replace(/^− /, "−");
};
function evalPoly(r) {
  const cs = [r.int(1, 4), r.int(-5, 5), r.int(-9, 9)];
  const x = r.int(-3, 3);
  const v = cs[0] * x * x + cs[1] * x + cs[2];
  return W(r, `Giá trị của P(x) = ${poly(cs)} tại x = ${num(x)} là:`, num(v), [num(cs[0] * x * x - cs[1] * x + cs[2]), num(v + 1), num(-v || 2), num(cs[0] * x + cs[1] * x + cs[2])], `Thay x = ${num(x)}: ${cs[0]}·${par(x)}² ${cs[1] < 0 ? "−" : "+"} ${Math.abs(cs[1])}·${par(x)} ${cs[2] < 0 ? "−" : "+"} ${Math.abs(cs[2])} = ${num(v)}.`);
}
function degree(r) {
  const deg = r.int(1, 4);
  const cs = [r.int(1, 5) * (r.next() < 0.5 ? -1 : 1), ...Array.from({ length: deg }, () => r.int(-6, 6))];
  return W(r, `Bậc của đa thức ${poly(cs)} là:`, String(deg), [String(deg + 1), String(Math.max(0, deg - 1) || 5), String(cs.filter(Boolean).length + 4), String(cs[0])], `Số mũ cao nhất của x (hệ số khác 0) là ${deg}.`);
}
function addPoly(r) {
  const a = [r.int(1, 5), r.int(-6, 6), r.int(-9, 9)], b = [r.int(-4, 4), r.int(-6, 6), r.int(-9, 9)];
  const s = a.map((v, i) => v + b[i]), d = a.map((v, i) => v - b[i]);
  const minus = r.next() < 0.5;
  const ans = minus ? d : s;
  if (ans[0] === 0) return null;
  return makeQ(r, `Cho A = ${poly(a)}, B = ${poly(b)}. Tính A ${minus ? "−" : "+"} B.`, poly(ans), [poly(minus ? s : d), poly(ans.map((v, i) => (i === 2 ? v + 1 : v))), poly(ans.map((v, i) => (i === 1 ? -v || 1 : v)))], `Cộng (trừ) các hạng tử đồng dạng: ${poly(ans)}.`);
}
function root(r) {
  const p = r.int(-5, 5), q = r.int(-5, 5);
  if (p === q) return null;
  const cs = [1, -(p + q), p * q];
  const isRoot = r.next() < 0.6;
  const x = isRoot ? r.pick([p, q]) : r.pick([p + 1, q - 1, p + q, -p].filter((v) => v !== p && v !== q));
  return makeQ(r, `x = ${num(x)} có phải là nghiệm của đa thức ${poly(cs)} không?`, isRoot ? "Có" : "Không", [isRoot ? "Không" : "Có", "Chỉ khi x dương", "Không xác định được"], `Thay x = ${num(x)} được giá trị ${num(x * x + cs[1] * x + cs[2])}${isRoot ? " = 0 nên là nghiệm." : " ≠ 0 nên không phải nghiệm."}`);
}
function linearRoot(r) {
  const a = r.int(-6, 6) || 2, x = r.int(-8, 8);
  return W(r, `Nghiệm của đa thức ${poly([a, -a * x])} là:`, `x = ${num(x)}`, [`x = ${num(-x || 1)}`, `x = ${num(a)}`, `x = ${num(a * x)}`, `x = ${num(x + 1)}`], `${a}x ${-a * x < 0 ? "−" : "+"} ${Math.abs(a * x)} = 0 ⇒ x = ${num(x)}.`);
}
function mono(r) {
  const a = r.int(-5, 5) || 2, b = r.int(-5, 5) || 3, m = r.int(1, 3), n = r.int(1, 3);
  const sup = (k) => "⁰¹²³⁴⁵⁶"[k];
  return makeQ(r, `Tính: (${a}x${m > 1 ? sup(m) : ""}) · (${b}x${n > 1 ? sup(n) : ""})`, `${num(a * b)}x${sup(m + n)}`, [`${num(a + b)}x${sup(m + n)}`, `${num(a * b)}x${sup(m * n) ?? "⁶"}`, `${num(-a * b)}x${sup(m + n)}`], `Nhân hệ số với hệ số, cộng số mũ: ${num(a * b)}x${sup(m + n)}.`);
}

// ---------- Chương 8: Xác suất ----------
function prob(r) {
  const t = r.int(0, 3);
  if (t === 0) { const red = r.int(1, 8), blue = r.int(1, 8); return makeQ(r, `Hộp có ${red} bi đỏ và ${blue} bi xanh. Lấy ngẫu nhiên 1 viên. Xác suất lấy được bi đỏ là:`, fr(red, red + blue), [fr(blue, red + blue), fr(red, blue), fr(1, red + blue), "1"].filter((v) => v !== fr(red, red + blue)), `Có ${red} kết quả thuận lợi trên ${red + blue}: ${fr(red, red + blue)}.`); }
  if (t === 1) { const [cond, k] = r.pick([["chẵn", 3], ["lẻ", 3], ["lớn hơn 4", 2], ["chia hết cho 3", 2], ["là số nguyên tố", 3], ["nhỏ hơn 3", 2]]); return makeQ(r, `Gieo một con xúc xắc. Xác suất ra mặt có số chấm ${cond} là:`, fr(k, 6), [fr(1, 6), fr(k + 1, 6), fr(6 - k + (k === 3 ? 1 : 0), 6), "1"].filter((v) => v !== fr(k, 6)), `Có ${k} mặt thuận lợi trên 6 mặt: ${fr(k, 6)}.`); }
  if (t === 2) return makeQ(r, "Gieo một con xúc xắc. Biến cố 'ra mặt 7 chấm' là:", "Biến cố không thể", ["Biến cố chắc chắn", "Biến cố ngẫu nhiên", "Có xác suất 1/6"], "Không có mặt 7 chấm, xác suất bằng 0.");
  return makeQ(r, "Tung một đồng xu cân đối. Xác suất xuất hiện mặt ngửa là:", "1/2", ["1", "0", "1/4"], "Hai mặt có khả năng như nhau.");
}

// ---------- Chương 10: Hình khối ----------
function box(r) {
  const a = r.int(4, 15), b = r.int(2, a - 1), c = r.int(2, 10);
  const t = r.int(0, 2);
  if (t === 0) return W(r, `Hình hộp chữ nhật có ba kích thước ${a} cm, ${b} cm, ${c} cm. Thể tích là:`, `${a * b * c} cm³`, [`${a + b + c} cm³`, `${2 * (a * b + b * c + a * c)} cm³`, `${a * b * c} cm²`, `${a * b} cm³`], `V = ${a} · ${b} · ${c} = ${a * b * c} cm³.`);
  if (t === 1) return W(r, `Hình hộp chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm, chiều cao ${c} cm. Diện tích xung quanh là:`, `${2 * (a + b) * c} cm²`, [`${a * b * c} cm²`, `${(a + b) * c} cm²`, `${2 * (a * b + b * c + a * c)} cm²`, `${2 * (a + b) * c} cm³`], `Sxq = 2 · (${a} + ${b}) · ${c} = ${2 * (a + b) * c} cm².`);
  return W(r, `Hình lập phương có cạnh ${a} cm. Thể tích là:`, `${a ** 3} cm³`, [`${a * a} cm³`, `${6 * a * a} cm³`, `${a * 3} cm³`, `${a ** 3} cm²`], `V = ${a}³ = ${a ** 3} cm³.`);
}
function prism(r) {
  const s = r.int(3, 12), h = r.int(4, 15), base = r.int(6, 40);
  return r.next() < 0.5
    ? W(r, `Lăng trụ đứng có diện tích đáy ${base} cm², chiều cao ${h} cm. Thể tích là:`, `${base * h} cm³`, [`${base + h} cm³`, `${(base * h) / 2} cm³`, `${base * h} cm²`, `${2 * base + h} cm³`], `V = S đáy · h = ${base} · ${h} = ${base * h} cm³.`)
    : W(r, `Lăng trụ đứng tam giác đều có cạnh đáy ${s} cm, chiều cao ${h} cm. Diện tích xung quanh là:`, `${3 * s * h} cm²`, [`${s * h} cm²`, `${3 * s + h} cm²`, `${3 * s * h} cm³`, `${2 * s * h} cm²`], `Sxq = chu vi đáy · h = ${3 * s} · ${h} = ${3 * s * h} cm².`);
}
const SOLIDS = [
  ["Hình lập phương có mấy mặt?", "6", ["4", "8", "12"], "6 mặt là các hình vuông bằng nhau."],
  ["Hình lăng trụ đứng tam giác có mấy mặt?", "5", ["6", "3", "4"], "2 mặt đáy tam giác + 3 mặt bên."],
  ["Các mặt bên của hình lăng trụ đứng là:", "Hình chữ nhật", ["Hình tam giác", "Hình tròn", "Hình thoi bất kì"], "Mặt bên lăng trụ đứng là hình chữ nhật."],
  ["Hình hộp chữ nhật có mấy cạnh?", "12", ["8", "6", "10"], "12 cạnh, 8 đỉnh, 6 mặt."],
];
const solid = (r) => { const [q, a, w, e] = r.pick(SOLIDS); return makeQ(r, q, a, w, e); };

export const TOAN7 = {
  c1: [ratAdd, ratMul, ratCompare, power, powerRules, findXrat],
  c2: [sqrtQ, irrational, absQ, absEq, rounding, decimalKind],
  c3: [angles, para, bisector],
  c4: [triAngle, isoAngle, rightTri, exterior, cong],
  c5: [mean7, data7, pie],
  c6: [proportion, equalRatios, direct, inverse, workers, shareRatio],
  c7: [evalPoly, degree, addPoly, root, linearRoot, mono],
  c8: [prob],
  c9: [triIneq, thirdSide, centroid, cong],
  c10: [box, prism, solid],
};
