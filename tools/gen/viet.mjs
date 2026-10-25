// Sinh câu Tiếng Việt lớp 2 và lớp 4 từ dữ liệu ngôn ngữ.
import { makeQ } from "./common.mjs";
import * as V from "./viet-data.mjs";
import * as V4 from "./viet-data4.mjs";
import { DOC_HIEU_2 } from "./viet-doc2.mjs";

const others = (lists, skip) => lists.filter((_, i) => i !== skip).flat();

// ---------- Từ loại lớp 2: sự vật, hoạt động, đặc điểm ----------
const TYPES2 = [["sự vật", V.SU_VAT], ["hoạt động", V.HOAT_DONG], ["đặc điểm", V.DAC_DIEM]];
function pickType(r) {
  const i = r.int(0, 2);
  const [name, list] = TYPES2[i];
  const w = r.pick(list);
  return makeQ(r, `Từ nào là từ chỉ ${name}?`, w, others(TYPES2.map((t) => t[1]), i), `"${w}" là từ chỉ ${name}; các từ còn lại chỉ ${TYPES2.filter((_, j) => j !== i).map((t) => t[0]).join(" hoặc ")}.`);
}
function whatType(r) {
  const i = r.int(0, 2);
  const w = r.pick(TYPES2[i][1]);
  return makeQ(r, `Từ "${w}" là từ chỉ:`, `${TYPES2[i][0][0].toUpperCase() + TYPES2[i][0].slice(1)}`, TYPES2.filter((_, j) => j !== i).map((t) => t[0][0].toUpperCase() + t[0].slice(1)).concat(["Số lượng"]), `"${w}" là từ chỉ ${TYPES2[i][0]}.`);
}

// ---------- Kiểu câu lớp 2 ----------
const SENT = [["Câu giới thiệu", V.CAU_GIOI_THIEU, "Là gì?"], ["Câu nêu hoạt động", V.CAU_HOAT_DONG, "Làm gì?"], ["Câu nêu đặc điểm", V.CAU_DAC_DIEM, "Thế nào?"]];
function sentType(r) {
  const i = r.int(0, 2);
  const [cn, rest] = r.pick(SENT[i][1]);
  return makeQ(r, `Câu "${cn} ${rest}." là:`, SENT[i][0], SENT.filter((_, j) => j !== i).map((s) => s[0]).concat(["Câu hỏi"]), `Bộ phận "${rest}" trả lời câu hỏi ${SENT[i][2]} nên đây là ${SENT[i][0].toLowerCase()}.`);
}
function whoPart(r) {
  const i = r.int(0, 2);
  const [cn, rest] = r.pick(SENT[i][1]);
  const words = rest.split(" ");
  return makeQ(r, `Bộ phận trả lời câu hỏi "Ai (cái gì, con gì)?" trong câu "${cn} ${rest}." là:`, cn, [rest, words.slice(0, 2).join(" "), `${cn} ${words[0]}`], `Hỏi: Ai (cái gì, con gì) ${rest}? → ${cn}.`);
}
function restPart(r) {
  const i = r.int(0, 2);
  const [cn, rest] = r.pick(SENT[i][1]);
  return makeQ(r, `Bộ phận trả lời câu hỏi "${SENT[i][2]}" trong câu "${cn} ${rest}." là:`, rest, [cn, `${cn} ${rest.split(" ")[0]}`, rest.split(" ").slice(-1)[0]], `${cn} ${SENT[i][2].toLowerCase().replace("?", "")}? → ${rest}.`);
}
function findSent(r) {
  const i = r.int(0, 2);
  const right = r.pick(SENT[i][1]);
  const wrong = SENT.filter((_, j) => j !== i).flatMap((s) => s[1]).map(([a, b]) => `${a} ${b}.`);
  return makeQ(r, `Câu nào là ${SENT[i][0].toLowerCase()}?`, `${right[0]} ${right[1]}.`, wrong, `Bộ phận "${right[1]}" trả lời câu hỏi ${SENT[i][2]}`);
}

// ---------- Dấu câu ----------
function endMark(r) {
  const [s, mark, why] = r.pick(V.DAU_CUOI);
  const names = { "?": "Dấu chấm hỏi", "!": "Dấu chấm than", ".": "Dấu chấm" };
  return makeQ(r, `Cuối câu "${s}" cần đặt dấu gì?`, names[mark], Object.values(names).filter((n) => n !== names[mark]).concat(["Dấu phẩy"]), `${why} nên dùng ${names[mark].toLowerCase()}.`);
}
function comma(r) {
  const [ok, bad] = r.pick(V.DAU_PHAY);
  return makeQ(r, "Câu nào đặt dấu phẩy đúng?", ok, bad, "Dấu phẩy ngăn cách các từ cùng loại (liệt kê) hoặc ngăn cách bộ phận chỉ thời gian, nơi chốn với phần còn lại.");
}

// ---------- Chủ đề ----------
const TOPICS = Object.entries(V.CHU_DE);
function topicWord(r) {
  const i = r.int(0, TOPICS.length - 1);
  const [name, words] = TOPICS[i];
  return makeQ(r, `Từ nào thuộc chủ đề "${name}"?`, r.pick(words), others(TOPICS.map((t) => t[1]), i), `Từ này nói về ${name}.`);
}
function topicGroup(r) {
  const i = r.int(0, TOPICS.length - 1);
  const [name, words] = TOPICS[i];
  const group = r.shuffle(words).slice(0, 3).join(", ");
  const wrongs = [0, 1, 2].map(() => {
    const mix = r.shuffle(words).slice(0, 2);
    mix.push(r.pick(others(TOPICS.map((t) => t[1]), i)));
    return r.shuffle(mix).join(", ");
  });
  return makeQ(r, `Nhóm từ nào đều thuộc chủ đề "${name}"?`, group, wrongs, `Cả ba từ "${group}" đều nói về ${name}.`);
}

// ---------- Đồng nghĩa, trái nghĩa ----------
/** Hai từ có chung một tiếng (dễ gây hiểu nhầm nghĩa) */
const shareSyllable = (a, b) => a.split(" ").some((s) => b.split(" ").includes(s));
const SYN_WORDS = new Set(V.DONG_NGHIA.flat());
function synonym(r) {
  const [a, b] = r.pick(V.DONG_NGHIA);
  const [x, y] = r.next() < 0.5 ? [a, b] : [b, a];
  const anti = V.TRAI_NGHIA.filter((p) => p[0] === x || p[1] === x).map((p) => (p[0] === x ? p[1] : p[0]));
  const pool = V.TRAI_NGHIA.flat().filter((w) => !SYN_WORDS.has(w) && !shareSyllable(w, x) && !shareSyllable(w, y));
  return makeQ(r, `Từ nào cùng nghĩa (đồng nghĩa) với "${x}"?`, y, [...anti, ...pool], `"${x}" và "${y}" có nghĩa giống nhau.`);
}
function antonym(r) {
  const [a, b] = r.pick(V.TRAI_NGHIA);
  const [x, y] = r.next() < 0.5 ? [a, b] : [b, a];
  const syn = V.DONG_NGHIA.filter((p) => p[0] === x || p[1] === x).map((p) => (p[0] === x ? p[1] : p[0]));
  // Nhiễu: từ đồng nghĩa với x, hoặc từ không liên quan (không phải từ trái nghĩa khác của x)
  const antiOfX = new Set(V.TRAI_NGHIA.filter((p) => p.includes(x)).flat());
  const pool = V.TRAI_NGHIA.flat().filter((w) => !antiOfX.has(w) && !SYN_WORDS.has(w) && !shareSyllable(w, x) && !shareSyllable(w, y));
  return makeQ(r, `Từ nào trái nghĩa với "${x}"?`, y, [...syn, ...pool], `"${x}" và "${y}" có nghĩa trái ngược nhau.`);
}
function pairKind(r) {
  const syn = r.next() < 0.5;
  const [a, b] = r.pick(syn ? V.DONG_NGHIA : V.TRAI_NGHIA);
  return makeQ(r, `Cặp từ "${a} – ${b}" là cặp từ:`, syn ? "Đồng nghĩa (cùng nghĩa)" : "Trái nghĩa", [syn ? "Trái nghĩa" : "Đồng nghĩa (cùng nghĩa)", "Không liên quan đến nhau", "Đồng âm"], syn ? `"${a}" và "${b}" có nghĩa giống nhau.` : `"${a}" và "${b}" có nghĩa trái ngược.`);
}

// ---------- Chính tả ----------
function spelling(r) {
  const [ok, ...bad] = r.pick(V.CHINH_TA);
  return makeQ(r, "Từ nào viết đúng chính tả?", ok, bad, `Viết đúng là "${ok}".`);
}
function spellingWrong(r) {
  const picks = r.shuffle(V.CHINH_TA).slice(0, 4);
  const badOne = r.pick(picks[0].slice(1));
  return makeQ(r, "Từ nào viết SAI chính tả?", badOne, picks.slice(1).map((p) => p[0]), `"${badOne}" viết sai, đúng phải là "${picks[0][0]}".`);
}

// ---------- Đọc hiểu ----------
const reading = (passages) =>
  passages.flatMap((p) => p.qs.map(([q, a, w, e]) => (r) => makeQ(r, `Đọc đoạn văn:\n«${p.text}»\n\n${q}`, a, w, e)));

// ---------- Lớp 4: danh từ, động từ, tính từ ----------
const POS = [["Danh từ", [...V4.DANH_TU_CHUNG, ...V4.DANH_TU_RIENG]], ["Động từ", V4.DONG_TU], ["Tính từ", V4.TINH_TU]];
function pos4(r) {
  const i = r.int(0, 2);
  return makeQ(r, `Từ nào là ${POS[i][0].toLowerCase()}?`, r.pick(POS[i][1]), others(POS.map((p) => p[1]), i), `${POS[i][0]}: ${POS[i][0] === "Danh từ" ? "chỉ người, vật, hiện tượng, khái niệm" : POS[i][0] === "Động từ" ? "chỉ hoạt động, trạng thái" : "chỉ đặc điểm, tính chất"}.`);
}
function whatPos(r) {
  const i = r.int(0, 2);
  const w = r.pick(POS[i][1]);
  return makeQ(r, `Từ "${w}" thuộc từ loại nào?`, POS[i][0], POS.filter((_, j) => j !== i).map((p) => p[0]).concat(["Đại từ"]), `"${w}" là ${POS[i][0].toLowerCase()}.`);
}
function properNoun(r) {
  return r.next() < 0.5
    ? makeQ(r, "Từ nào là danh từ riêng?", r.pick(V4.DANH_TU_RIENG), V4.DANH_TU_CHUNG, "Danh từ riêng là tên riêng của người, địa danh... và phải viết hoa.")
    : makeQ(r, "Từ nào là danh từ chung?", r.pick(V4.DANH_TU_CHUNG), V4.DANH_TU_RIENG, "Danh từ chung là tên gọi chung của một loại sự vật, không viết hoa.");
}
function nounKind(r) {
  const proper = r.next() < 0.5;
  const w = r.pick(proper ? V4.DANH_TU_RIENG : V4.DANH_TU_CHUNG);
  return makeQ(r, `"${w}" là danh từ chung hay danh từ riêng?`, proper ? "Danh từ riêng" : "Danh từ chung", [proper ? "Danh từ chung" : "Danh từ riêng", "Động từ", "Tính từ"], proper ? `"${w}" là tên riêng nên là danh từ riêng, viết hoa.` : `"${w}" là tên gọi chung của sự vật.`);
}

// ---------- Lớp 4: thành phần câu ----------
function subject4(r) {
  const [cn, vn] = r.pick(V4.CN_VN);
  return makeQ(r, `Chủ ngữ của câu "${cn} ${vn}." là:`, cn, [vn, `${cn} ${vn.split(" ")[0]}`, vn.split(" ").slice(-2).join(" ")], `Chủ ngữ trả lời câu hỏi Ai? Cái gì? Con gì? → ${cn}.`);
}
function predicate4(r) {
  const [cn, vn] = r.pick(V4.CN_VN);
  return makeQ(r, `Vị ngữ của câu "${cn} ${vn}." là:`, vn, [cn, `${cn.split(" ").slice(-1)[0]} ${vn}`, vn.split(" ").slice(0, 2).join(" ")], `Vị ngữ trả lời câu hỏi Làm gì? Thế nào? Là gì? → ${vn}.`);
}
function adverbial(r) {
  const [tn, rest] = r.pick(V4.TRANG_NGU);
  return makeQ(r, `Trạng ngữ trong câu "${tn}, ${rest}." là:`, tn, [rest, rest.split(" ")[0], `${tn}, ${rest.split(" ")[0]}`], `Trạng ngữ đứng đầu câu, ngăn cách bằng dấu phẩy: "${tn}".`);
}
function adverbialKind(r) {
  const [tn, rest, kind] = r.pick(V4.TRANG_NGU);
  return makeQ(r, `Trạng ngữ "${tn}" trong câu "${tn}, ${rest}." chỉ:`, kind[0].toUpperCase() + kind.slice(1), ["Thời gian", "Nơi chốn", "Nguyên nhân", "Mục đích"].filter((k) => k.toLowerCase() !== kind), `"${tn}" chỉ ${kind}.`);
}

// ---------- Lớp 4: nhân hóa ----------
function personify(r) {
  return makeQ(r, "Câu nào có sử dụng biện pháp nhân hóa?", r.pick(V4.NHAN_HOA), [...V4.SO_SANH, ...V4.CAU_THUONG], "Nhân hóa: gọi hoặc tả sự vật bằng từ ngữ dùng cho người.");
}
function figureOf(r) {
  const t = r.int(0, 2);
  const s = r.pick([V4.NHAN_HOA, V4.SO_SANH, V4.CAU_THUONG][t]);
  const ans = ["Nhân hóa", "So sánh", "Không dùng biện pháp tu từ"][t];
  return makeQ(r, `Câu "${s}" sử dụng biện pháp gì?`, ans, ["Nhân hóa", "So sánh", "Không dùng biện pháp tu từ", "Điệp từ"].filter((x) => x !== ans), t === 0 ? "Sự vật được gọi, tả như con người." : t === 1 ? "Có từ so sánh 'như' giữa hai sự vật." : "Câu kể bình thường, không có so sánh hay nhân hóa.");
}

// ---------- Lớp 4: thành ngữ, tục ngữ, dấu câu ----------
function proverb(r) {
  const [p, mean, wrong] = r.pick(V4.THANH_NGU);
  return makeQ(r, `Câu "${p}" có nghĩa là:`, mean, wrong, `"${p}": ${mean.toLowerCase()}.`);
}
function proverbFind(r) {
  const [p, mean] = r.pick(V4.THANH_NGU);
  return makeQ(r, `Câu thành ngữ, tục ngữ nào có nghĩa "${mean.toLowerCase()}"?`, p, V4.THANH_NGU.filter((x) => x[0] !== p).map((x) => x[0]), `"${p}" mang nghĩa ${mean.toLowerCase()}.`);
}
const punct4 = V4.DAU_CAU_4.map(([q, a, w, e]) => (r) => makeQ(r, q, a, w, e));

export const VIET = {
  "2-tiengviet": {
    c1: [pickType, whatType],
    c2: [sentType, whoPart, restPart, findSent],
    c3: [endMark, comma],
    c4: [topicWord, topicGroup],
    c5: [synonym, antonym, pairKind],
    c6: [spelling, spellingWrong],
    c7: reading(DOC_HIEU_2),
    "tong-hop": [pickType, sentType, endMark, topicWord, synonym, antonym, spelling, ...reading(DOC_HIEU_2)],
  },
  "4-tiengviet": {
    c1: [pos4, properNoun, nounKind],
    c2: [pos4, whatPos],
    c3: [subject4, predicate4, adverbial, adverbialKind],
    c4: [personify, figureOf],
    c5: [...punct4, endMark, comma],
    c6: [proverb, proverbFind, synonym, antonym],
    c7: reading(V4.DOC_HIEU_4),
    "tong-hop": [pos4, whatPos, subject4, adverbial, personify, proverb, spelling, ...punct4, ...reading(V4.DOC_HIEU_4)],
  },
};
