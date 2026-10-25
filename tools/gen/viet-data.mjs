// Dữ liệu Tiếng Việt tiểu học để sinh câu hỏi (lớp 2–5).

// ---------- Từ loại ----------
export const SU_VAT = ["cái bàn", "quyển sách", "bông hoa", "con mèo", "cây bàng", "học sinh", "cô giáo", "ngôi nhà", "dòng sông", "bầu trời", "chiếc xe đạp", "cái cặp", "con đường", "quả cam", "cánh đồng", "ông mặt trời", "cái ghế", "bác nông dân", "chú bộ đội", "con trâu", "lớp học", "cái bảng", "đám mây", "con thuyền", "ngọn núi", "cây bút", "chiếc áo", "con chim", "quả bóng", "cái nón"];
export const HOAT_DONG = ["chạy", "nhảy", "đọc sách", "viết bài", "quét nhà", "tưới cây", "hát", "múa", "bơi", "đá bóng", "nấu cơm", "học bài", "vẽ tranh", "rửa bát", "gấp quần áo", "leo núi", "câu cá", "trồng cây", "đi học", "kể chuyện", "chăn trâu", "cày ruộng", "nhặt rác", "lau bàn", "bay", "hót", "ăn", "ngủ", "chơi", "giặt"];
export const DAC_DIEM = ["xanh", "đỏ thắm", "cao", "thấp", "to lớn", "nhỏ xíu", "chăm chỉ", "thông minh", "hiền lành", "ngoan ngoãn", "nhanh nhẹn", "dịu dàng", "tròn xoe", "mềm mại", "thơm ngát", "ngọt lịm", "sạch sẽ", "vui vẻ", "dũng cảm", "trong veo", "rộng lớn", "nóng bức", "lạnh giá", "xinh xắn", "chậm chạp", "siêng năng", "trắng muốt", "vàng óng", "cao vút", "tươi tốt"];

// ---------- Kiểu câu lớp 2, 3: [chủ ngữ (Ai/Cái gì), phần còn lại] ----------
export const CAU_GIOI_THIEU = [["Em", "là học sinh lớp Hai"], ["Bố em", "là bác sĩ"], ["Mẹ em", "là giáo viên"], ["Đây", "là lớp học của em"], ["Bạn Lan", "là lớp trưởng"], ["Ông em", "là bộ đội về hưu"], ["Con mèo", "là bạn thân của bé"], ["Hà Nội", "là thủ đô của nước ta"], ["Cây phượng", "là cây hoa học trò"], ["Chị Mai", "là học sinh giỏi"], ["Bác Tư", "là nông dân"], ["Thư viện", "là nơi em hay đến đọc sách"]];
export const CAU_HOAT_DONG = [["Mẹ em", "đang nấu cơm"], ["Các bạn", "chơi nhảy dây"], ["Bé", "tưới cây"], ["Chú chim", "hót líu lo"], ["Ông em", "đọc báo"], ["Đàn gà", "mổ thóc"], ["Cô giáo", "giảng bài"], ["Em", "quét nhà giúp mẹ"], ["Bố", "sửa xe đạp"], ["Đàn cá", "bơi lội tung tăng"], ["Bác nông dân", "cày ruộng"], ["Chị gái em", "gấp quần áo"]];
export const CAU_DAC_DIEM = [["Bầu trời", "xanh trong"], ["Bông hồng", "đỏ thắm"], ["Chú mèo", "rất lười"], ["Bạn Nam", "rất chăm chỉ"], ["Dòng sông", "hiền hòa"], ["Cánh đồng lúa", "vàng óng"], ["Bà em", "hiền hậu"], ["Quả cam", "ngọt lịm"], ["Cây cau", "cao vút"], ["Mái tóc của mẹ", "mềm mượt"], ["Nước suối", "trong veo"], ["Con đường làng", "nhỏ và quanh co"]];

// ---------- Dấu câu: [câu chưa có dấu cuối, dấu đúng, lí do] ----------
export const DAU_CUOI = [
  ["Bạn tên là gì", "?", "Câu hỏi"], ["Hôm nay bạn có đi học không", "?", "Câu hỏi"], ["Nhà bạn ở đâu", "?", "Câu hỏi"], ["Ai đang hát vậy", "?", "Câu hỏi"], ["Vì sao lá cây màu xanh", "?", "Câu hỏi"],
  ["Ôi, bông hoa đẹp quá", "!", "Câu bộc lộ cảm xúc"], ["Chà, con diều bay cao quá", "!", "Câu bộc lộ cảm xúc"], ["A, mẹ về rồi", "!", "Câu bộc lộ cảm xúc"], ["Trời ơi, lạnh quá", "!", "Câu bộc lộ cảm xúc"], ["Các em hãy giữ trật tự", "!", "Câu yêu cầu, đề nghị"],
  ["Em đi học lúc sáu giờ", ".", "Câu kể"], ["Mẹ em là bác sĩ", ".", "Câu kể"], ["Con mèo nằm sưởi nắng", ".", "Câu kể"], ["Sân trường rợp bóng cây", ".", "Câu kể"], ["Bé giúp bà nhặt rau", ".", "Câu kể"],
];
/** Câu cần một dấu phẩy: [câu đặt đúng, các cách đặt sai] */
export const DAU_PHAY = [
  ["Vườn nhà em có cam, quýt, bưởi.", ["Vườn nhà em, có cam quýt bưởi.", "Vườn nhà em có, cam quýt bưởi.", "Vườn, nhà em có cam quýt bưởi."]],
  ["Em thích đọc truyện, vẽ tranh và đá bóng.", ["Em thích, đọc truyện vẽ tranh và đá bóng.", "Em, thích đọc truyện vẽ tranh và đá bóng.", "Em thích đọc truyện vẽ tranh, và, đá bóng."]],
  ["Trong lớp, các bạn đang chăm chú nghe giảng.", ["Trong, lớp các bạn đang chăm chú nghe giảng.", "Trong lớp các bạn, đang chăm chú nghe giảng.", "Trong lớp các bạn đang chăm chú, nghe giảng."]],
  ["Sáng nay, em dậy sớm tập thể dục.", ["Sáng, nay em dậy sớm tập thể dục.", "Sáng nay em, dậy sớm tập thể dục.", "Sáng nay em dậy, sớm tập thể dục."]],
  ["Bà em trồng rau, nuôi gà và chăm sóc vườn cây.", ["Bà em, trồng rau nuôi gà và chăm sóc vườn cây.", "Bà, em trồng rau nuôi gà và chăm sóc vườn cây.", "Bà em trồng, rau nuôi gà và chăm sóc vườn cây."]],
  ["Hoa hồng, hoa cúc, hoa lan đua nhau nở.", ["Hoa hồng hoa cúc, hoa lan, đua nhau nở.", "Hoa, hồng hoa cúc hoa lan đua nhau nở.", "Hoa hồng hoa cúc hoa lan, đua, nhau nở."]],
];

// ---------- Từ ngữ theo chủ đề ----------
export const CHU_DE = {
  "trường học": ["lớp học", "bảng đen", "sân trường", "thầy giáo", "bạn học", "giờ ra chơi", "thư viện", "bài tập"],
  "gia đình": ["ông bà", "bố mẹ", "anh chị", "em bé", "sum họp", "yêu thương", "chăm sóc", "hiếu thảo"],
  "nghề nghiệp": ["bác sĩ", "kĩ sư", "nông dân", "công nhân", "phi công", "đầu bếp", "thợ may", "cảnh sát"],
  "thời tiết": ["nắng", "mưa phùn", "gió mùa", "sương mù", "giông bão", "oi bức", "rét buốt", "mát mẻ"],
  "cây cối": ["rễ cây", "thân cây", "cành lá", "nụ hoa", "quả chín", "hạt giống", "mầm non", "gốc cây"],
  "con vật": ["con trâu", "con hổ", "con sóc", "chim sẻ", "cá chép", "con voi", "con ong", "con kiến"],
  "đồ dùng học tập": ["bút chì", "thước kẻ", "cục tẩy", "hộp bút", "quyển vở", "com-pa", "cặp sách", "bút màu"],
};

// ---------- Đồng nghĩa, trái nghĩa ----------
export const DONG_NGHIA = [["chăm chỉ", "siêng năng"], ["to lớn", "khổng lồ"], ["đẹp", "xinh"], ["hiền", "hiền lành"], ["bé", "nhỏ"], ["vui", "mừng"], ["nhanh", "mau"], ["thông minh", "sáng dạ"], ["yêu thương", "yêu quý"], ["dũng cảm", "gan dạ"], ["siêng", "cần cù"], ["ăn", "xơi"], ["cho", "biếu"], ["nhà", "ngôi nhà"], ["giỏi", "tài"], ["lặng lẽ", "im lặng"], ["vắng vẻ", "hiu quạnh"], ["mênh mông", "bao la"], ["xanh biếc", "xanh thẳm"]];
export const TRAI_NGHIA = [["cao", "thấp"], ["to", "nhỏ"], ["dài", "ngắn"], ["nóng", "lạnh"], ["vui", "buồn"], ["khỏe", "yếu"], ["sáng", "tối"], ["nhanh", "chậm"], ["đen", "trắng"], ["chăm chỉ", "lười biếng"], ["già", "trẻ"], ["xa", "gần"], ["mới", "cũ"], ["đầy", "vơi"], ["ngày", "đêm"], ["thật thà", "dối trá"], ["hiền", "dữ"], ["sạch", "bẩn"], ["rộng", "hẹp"], ["dũng cảm", "hèn nhát"], ["thắng", "thua"], ["mở", "đóng"], ["lên", "xuống"], ["khô", "ướt"], ["đắng", "ngọt"], ["nặng", "nhẹ"], ["giàu", "nghèo"], ["đến", "đi"]];

// ---------- Chính tả: [đúng, sai, sai, sai] ----------
export const CHINH_TA = [
  ["sạch sẽ", "xạch sẽ", "sạch xẽ", "xạch xẽ"], ["xinh xắn", "sinh xắn", "xinh sắn", "sinh sắn"], ["sắp xếp", "xắp sếp", "sắp sếp", "xắp xếp"], ["xuất sắc", "suất sắc", "xuất xắc", "suất xắc"],
  ["trung thực", "chung thực", "trung thựt", "chung thựt"], ["chăm chỉ", "trăm chỉ", "chăm trỉ", "trăm trỉ"], ["trong trẻo", "chong chẻo", "trong chẻo", "chong trẻo"], ["che chở", "tre trở", "che trở", "tre chở"],
  ["lo lắng", "no nắng", "lo nắng", "no lắng"], ["nóng nực", "lóng lực", "nóng lực", "lóng nực"], ["lung linh", "nung ninh", "lung ninh", "nung linh"], ["nặng nề", "lặng lề", "nặng lề", "lặng nề"],
  ["giữ gìn", "dữ dìn", "giữ dìn", "rữ gìn"], ["dạy dỗ", "giạy giỗ", "dạy giỗ", "rạy dỗ"], ["rung rinh", "dung dinh", "rung dinh", "giung rinh"], ["gió thổi", "dó thổi", "ró thổi", "gió thỗi"],
  ["nghỉ ngơi", "ngỉ ngơi", "nghỉ nghơi", "nghĩ ngơi"], ["ghi nhớ", "gi nhớ", "ghi nhở", "ghi nhỡ"], ["con nghé", "con ngé", "con nghẽ", "con ghé"], ["cái kéo", "cái céo", "cái quéo", "cái kẽo"],
  ["suy nghĩ", "suy nghỉ", "xuy nghĩ", "suy ngĩ"], ["vẽ tranh", "vẻ tranh", "vẽ chanh", "vẻ chanh"], ["mỏi mệt", "mõi mệt", "mỏi mệc", "mõi mệc"], ["sữa chua", "sửa chua", "sữa trua", "sửa trua"],
  ["bánh chưng", "bánh trưng", "bánh chưn", "bánh trưn"], ["quả chuối", "quả truối", "quả chúi", "quả chuốy"], ["con kiến", "con kiếng", "con cến", "con kến"], ["cái thang", "cái than", "cái thanh", "cái tang"],
  ["ngoằn ngoèo", "ngoằng ngoèo", "ngằn ngoèo", "ngoằn ngèo"], ["khuyên bảo", "khiên bảo", "khuyêng bảo", "khuyên bão"], ["luyện tập", "luiện tập", "luyệng tập", "luyện tạp"], ["bâng khuâng", "bân khuâng", "bâng khuân", "bân khuân"],
];
