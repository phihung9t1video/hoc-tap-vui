// Tạo thư mục MAU-CAU-LENH: mỗi lớp – môn một tệp câu lệnh mẫu cho Gemini (điền sẵn lớp, môn, mã, danh sách chương).
// Chạy lại khi mục lục thay đổi: node tools/make-prompts.mjs
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("tools/muc-luc.json", "utf8"));
const SUB = { toan: "Toán", tiengviet: "Tiếng Việt", nguvan: "Ngữ văn", tienganh: "Tiếng Anh", tnxh: "Tự nhiên và Xã hội", khoahoc: "Khoa học", khtn: "Khoa học tự nhiên", lsdl: "Lịch sử và Địa lí", tinhoc: "Tin học" };
const ASCII = { toan: "Toan", tiengviet: "Tieng Viet", nguvan: "Ngu van", tienganh: "Tieng Anh", tnxh: "TNXH", khoahoc: "Khoa hoc", khtn: "KHTN", lsdl: "Lich su Dia li", tinhoc: "Tin hoc" };
const out = "MAU-CAU-LENH";
if (existsSync(out)) for (const f of readdirSync(out)) rmSync(`${out}/${f}`);
else mkdirSync(out);

for (const [key, chapters] of Object.entries(catalog)) {
  const [g, s] = key.split("-");
  const ids = Object.keys(chapters).filter((c) => c !== "tong-hop");
  const first = ids[0];
  const english = s === "tienganh";
  const math = s === "toan" || s === "khtn" || s === "khoahoc";
  const extra = [
    english ? "- Câu hỏi và đáp án bằng tiếng Anh, lời giải bằng tiếng Việt (giải thích nghĩa, ngữ pháp)." : "",
    english ? "- Gồm cả từ vựng, ngữ pháp, mẫu câu, chọn từ khác loại, phát âm – trọng âm (nếu hợp lớp)." : "",
    math ? "- Viết số kiểu Việt Nam: dấu phẩy thập phân (2,5), dấu cách hàng nghìn (12 345); nhân ×, chia :." : "",
    s === "tiengviet" || s === "nguvan" ? "- Có thể có câu đọc hiểu: ghi đoạn văn ngắn ngay trong câu hỏi rồi hỏi về đoạn đó." : "",
  ].filter(Boolean);
  const text = `CÂU LỆNH MẪU – ${SUB[s].toUpperCase()} LỚP ${g}  (mã ${key})
=====================================================================
CÁCH DÙNG
1. Chọn một chương trong danh sách bên dưới, sửa DÒNG CHƯƠNG trong câu
   lệnh (chép nguyên mã và tên chương, ví dụ "${first} – ${chapters[first]}").
2. Chép toàn bộ phần giữa hai dòng "-----" đưa vào Gemini.
3. Gemini trả lời xong: chép toàn bộ câu trả lời, dán vào một tệp .txt
   mới trong thư mục NHAP-DE (đặt tên tùy ý, ví dụ ${key}-${first}.txt).
4. Gom đủ vài tệp thì nhấp đúp 5-NHAP-DE.bat để nhập vào kho.

CÁC CHƯƠNG (mã – tên)
${Object.entries(chapters).map(([id, n]) => `   ${id.padEnd(9)} ${n}`).join("\n")}

---------------------- CHÉP TỪ DÒNG DƯỚI ----------------------------
Bạn là giáo viên giỏi ở Việt Nam. Hãy soạn câu hỏi trắc nghiệm theo
chương trình GDPT 2018 (sách Kết nối tri thức với cuộc sống${english ? " / Global Success" : ""}).

LỚP: ${g}
MÔN – MÃ: ${SUB[s]} – ${key}
CHƯƠNG: ${first} – ${chapters[first]}
SỐ CÂU: 25 (40% nhận biết, 40% thông hiểu, 20% vận dụng)

YÊU CẦU BẮT BUỘC:
1. Mỗi câu có ĐÚNG 4 đáp án khác nhau và CHỈ MỘT đáp án đúng.
2. Đáp án ĐÚNG luôn đặt ở VỊ TRÍ ĐẦU TIÊN (app sẽ tự xáo trộn).
3. Đáp án sai phải hợp lí (lỗi học sinh hay mắc), không vô lí.
4. Lời giải ngắn 1–2 câu, dễ hiểu với học sinh lớp ${g}.
${extra.map((e) => `   ${e}`).join("\n")}${extra.length ? "\n" : ""}5. Không dùng hình vẽ, bảng biểu; không có đáp án "cả A và B", "tất cả
   các đáp án trên".
6. KHÔNG dùng LaTeX, không dùng dấu $ hay dấu \\. Viết công thức bằng chữ
   thường: phân số 3/5, mũ x², căn √9, góc ∠xOy, độ 60°.
7. Tự giải lại từng câu để chắc chắn đáp án đầu tiên là đúng.
8. CHỈ trả về JSON đúng mẫu dưới, không viết thêm chữ nào khác. Giữ
   nguyên "${key}"; thay MÃ_CHƯƠNG bằng mã ở dòng CHƯƠNG (ví dụ ${first}):

{"${key}": {"MÃ_CHƯƠNG": [
  ["Câu hỏi 1", ["Đáp án ĐÚNG", "Sai 1", "Sai 2", "Sai 3"], "Lời giải 1"],
  ["Câu hỏi 2", ["Đáp án ĐÚNG", "Sai 1", "Sai 2", "Sai 3"], "Lời giải 2"]
]}}
---------------------- CHÉP ĐẾN DÒNG TRÊN ---------------------------
`;
  writeFileSync(`${out}/Lop ${g} - ${ASCII[s]} (${key}).txt`, "﻿" + text.replace(/\n/g, "\r\n"));
}
console.log(`Đã tạo ${Object.keys(catalog).length} tệp mẫu trong ${out}`);
