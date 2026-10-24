import { MORE_COURSES } from "./courses";
import type { Subject } from "./types";

export interface Chapter {
  id: string;
  name: string;
  /** Nội dung trọng tâm, gửi kèm cho AI để ra đề sát chương trình */
  topics: string;
}

export interface Course {
  book: string;
  chapters: Chapter[];
}

export const SUBJECTS: Record<Subject, { name: string; icon: string; color: string }> = {
  toan: { name: "Toán", icon: "📐", color: "#3b82f6" },
  tiengviet: { name: "Tiếng Việt", icon: "✏️", color: "#f97316" },
  nguvan: { name: "Ngữ văn", icon: "📖", color: "#f97316" },
  tienganh: { name: "Tiếng Anh", icon: "🔤", color: "#10b981" },
  tnxh: { name: "Tự nhiên và Xã hội", icon: "🌳", color: "#65a30d" },
  khoahoc: { name: "Khoa học", icon: "🔬", color: "#0891b2" },
  khtn: { name: "Khoa học tự nhiên", icon: "🧪", color: "#0891b2" },
  lsdl: { name: "Lịch sử và Địa lí", icon: "🌏", color: "#a16207" },
  tinhoc: { name: "Tin học", icon: "💻", color: "#7c3aed" },
};

export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Các môn có mục lục cho một lớp, theo thứ tự hiển thị */
export function subjectsForGrade(grade: number): Subject[] {
  return (Object.keys(SUBJECTS) as Subject[]).filter((s) => COURSES[`${grade}|${s}`]);
}

const BOOK_COURSES: Record<string, Course> = {
  "3|toan": {
    book: "Toán 3 – Kết nối tri thức với cuộc sống",
    chapters: [
      { id: "c1", name: "Ôn tập và bổ sung", topics: "ôn tập các số đến 1000; cộng, trừ có nhớ trong phạm vi 1000; tìm thành phần chưa biết của phép cộng, phép trừ; ôn bảng nhân 2, bảng nhân 5; mốc thời gian" },
      { id: "c2", name: "Bảng nhân, bảng chia", topics: "bảng nhân và bảng chia 3, 4, 5, 6, 7, 8, 9; một phần mấy (1/2, 1/3, ...); bài toán có lời văn một bước, hai bước" },
      { id: "c3", name: "Làm quen với hình phẳng, hình khối", topics: "điểm ở giữa, trung điểm của đoạn thẳng; hình tròn: tâm, bán kính, đường kính; góc vuông, góc không vuông; hình tam giác, hình tứ giác, hình chữ nhật, hình vuông; khối lập phương, khối hộp chữ nhật" },
      { id: "c4", name: "Phép nhân, phép chia trong phạm vi 100", topics: "nhân số có hai chữ số với số có một chữ số; phép chia hết và phép chia có dư; gấp một số lên nhiều lần; giảm một số đi một số lần; so sánh số lớn gấp mấy lần số bé" },
      { id: "c5", name: "Đơn vị đo độ dài, khối lượng, dung tích, nhiệt độ", topics: "mi-li-mét (mm); gam (g); mi-li-lít (ml); nhiệt độ, độ C; đổi đơn vị đo; giải toán có đơn vị đo" },
      { id: "c6", name: "Phép nhân, phép chia trong phạm vi 1000", topics: "nhân số có ba chữ số với số có một chữ số; chia số có hai, ba chữ số cho số có một chữ số; biểu thức số, tính giá trị biểu thức (có và không có dấu ngoặc); so sánh số lớn gấp mấy lần số bé" },
      { id: "c8", name: "Các số đến 10 000", topics: "đọc, viết, so sánh các số có bốn chữ số; cấu tạo số; số La Mã (I đến XX); làm tròn số đến hàng chục, hàng trăm" },
      { id: "c9", name: "Chu vi, diện tích một số hình phẳng", topics: "chu vi hình tam giác, tứ giác, hình chữ nhật, hình vuông; diện tích, xăng-ti-mét vuông (cm²); diện tích hình chữ nhật, hình vuông" },
      { id: "c10", name: "Cộng, trừ trong phạm vi 10 000", topics: "phép cộng, phép trừ các số có bốn chữ số (có nhớ); bài toán hai bước tính" },
      { id: "c11", name: "Các số đến 100 000", topics: "đọc, viết, so sánh các số có năm chữ số; làm tròn số đến hàng nghìn, hàng chục nghìn" },
      { id: "c12", name: "Cộng, trừ trong phạm vi 100 000", topics: "phép cộng, phép trừ các số có năm chữ số; tính nhẩm; bài toán có lời văn" },
      { id: "c13", name: "Xem đồng hồ. Tháng – năm. Tiền Việt Nam", topics: "xem đồng hồ chính xác đến phút; các tháng trong năm, số ngày trong tháng; các tờ tiền Việt Nam, tính tiền" },
      { id: "c14", name: "Nhân, chia trong phạm vi 100 000", topics: "nhân số có năm chữ số với số có một chữ số; chia số có năm chữ số cho số có một chữ số; bài toán liên quan đến rút về đơn vị" },
      { id: "c15", name: "Làm quen với thống kê, xác suất", topics: "thu thập, phân loại, ghi chép số liệu; bảng số liệu; khả năng xảy ra của một sự kiện: chắc chắn, có thể, không thể" },
      { id: "tong-hop", name: "Ôn tập tổng hợp cả năm", topics: "tổng hợp toàn bộ chương trình Toán lớp 3" },
    ],
  },
  "7|toan": {
    book: "Toán 7 – Kết nối tri thức với cuộc sống",
    chapters: [
      { id: "c1", name: "Số hữu tỉ", topics: "tập hợp số hữu tỉ Q; so sánh số hữu tỉ; cộng, trừ, nhân, chia số hữu tỉ; lũy thừa với số mũ tự nhiên của số hữu tỉ; thứ tự thực hiện phép tính, quy tắc chuyển vế" },
      { id: "c2", name: "Số thực", topics: "số thập phân vô hạn tuần hoàn; căn bậc hai số học; số vô tỉ; số thực, giá trị tuyệt đối; làm tròn và ước lượng" },
      { id: "c3", name: "Góc và đường thẳng song song", topics: "góc ở vị trí đặc biệt (kề bù, đối đỉnh); tia phân giác; hai đường thẳng song song và dấu hiệu nhận biết; tiên đề Euclid; định lí và chứng minh định lí" },
      { id: "c4", name: "Tam giác bằng nhau", topics: "tổng các góc trong một tam giác; hai tam giác bằng nhau; các trường hợp bằng nhau c.c.c, c.g.c, g.c.g; tam giác vuông; tam giác cân; đường trung trực của đoạn thẳng" },
      { id: "c5", name: "Thu thập và biểu diễn dữ liệu", topics: "thu thập, phân loại dữ liệu; biểu đồ hình quạt tròn; biểu đồ đoạn thẳng; đọc và phân tích số liệu" },
      { id: "c6", name: "Tỉ lệ thức và đại lượng tỉ lệ", topics: "tỉ lệ thức; tính chất dãy tỉ số bằng nhau; đại lượng tỉ lệ thuận; đại lượng tỉ lệ nghịch; bài toán chia theo tỉ lệ" },
      { id: "c7", name: "Biểu thức đại số và đa thức một biến", topics: "biểu thức đại số, giá trị biểu thức; đa thức một biến, bậc, hệ số, nghiệm của đa thức; cộng, trừ, nhân, chia đa thức một biến" },
      { id: "c8", name: "Biến cố và xác suất", topics: "biến cố chắc chắn, không thể, ngẫu nhiên; xác suất của biến cố trong các trò chơi đơn giản (gieo xúc xắc, tung đồng xu, rút thẻ)" },
      { id: "c9", name: "Quan hệ giữa các yếu tố trong tam giác", topics: "quan hệ giữa góc và cạnh đối diện; đường vuông góc và đường xiên; bất đẳng thức tam giác; sự đồng quy của ba đường trung tuyến, ba đường phân giác, ba đường trung trực, ba đường cao" },
      { id: "c10", name: "Một số hình khối trong thực tiễn", topics: "hình hộp chữ nhật, hình lập phương: diện tích xung quanh, thể tích; hình lăng trụ đứng tam giác, tứ giác: diện tích xung quanh, thể tích" },
      { id: "tong-hop", name: "Ôn tập tổng hợp cả năm", topics: "tổng hợp toàn bộ chương trình Toán lớp 7" },
    ],
  },
  "3|tienganh": {
    book: "Tiếng Anh 3 – Global Success",
    chapters: [
      { id: "u1", name: "Unit 1: Hello", topics: "chào hỏi: hello, hi, goodbye, bye; How are you? – I'm fine, thank you." },
      { id: "u2", name: "Unit 2: Our names", topics: "What's your name? – My name's...; How old are you? – I'm ... years old; số đếm 1–10" },
      { id: "u3", name: "Unit 3: Our friends", topics: "giới thiệu bạn: This is ...; Is this ...? – Yes, it is / No, it isn't; Who's that? – It's ..." },
      { id: "u4", name: "Unit 4: Our bodies", topics: "bộ phận cơ thể: face, eyes, ears, nose, mouth, hands; What's this? – It's ...; Touch your ..." },
      { id: "u5", name: "Unit 5: My hobbies", topics: "sở thích: singing, dancing, drawing, painting, running, swimming, cooking, walking; What's your hobby? – I like ..." },
      { id: "u6", name: "Unit 6: Our school", topics: "phòng ở trường: classroom, library, gym, computer room, music room, art room, playground; Let's go to the ...; Is your school big?" },
      { id: "u7", name: "Unit 7: Classroom instructions", topics: "câu mệnh lệnh: stand up, sit down, open your book, close your book, come in, go out; May I ...? – Yes, you can / No, you can't" },
      { id: "u8", name: "Unit 8: My school things", topics: "đồ dùng học tập: book, pen, pencil, ruler, eraser, school bag, pencil case; I have a ...; Do you have a ...?; số nhiều" },
      { id: "u9", name: "Unit 9: Colours", topics: "màu sắc: red, blue, green, yellow, black, white, brown, orange, pink; What colour is it? – It's ...; What colour are they? – They're ..." },
      { id: "u10", name: "Unit 10: Break time activities", topics: "hoạt động giờ ra chơi: chess, football, volleyball, basketball, badminton, chat, play word puzzles; What do you do at break time? – I play ..." },
      { id: "u11", name: "Unit 11: My family", topics: "thành viên gia đình: father, mother, brother, sister, grandfather, grandmother; Who's this? – It's my ...; How old is he/she?" },
      { id: "u12", name: "Unit 12: Jobs", topics: "nghề nghiệp: teacher, doctor, nurse, farmer, driver, worker, cook, singer; What's his/her job? – He's/She's a ..." },
      { id: "u13", name: "Unit 13: My house", topics: "phòng và đồ vật trong nhà: living room, kitchen, bedroom, bathroom; Where's the ...? – It's here/there; Where are the ...?" },
      { id: "u14", name: "Unit 14: My bedroom", topics: "đồ trong phòng ngủ: bed, chair, desk, lamp, door, window; There's a ...; There are ...; big, small, old, new" },
      { id: "u15", name: "Unit 15: At the dining table", topics: "đồ ăn uống: bread, rice, meat, fish, eggs, milk, juice, water; Would you like some ...? – Yes, please / No, thanks; What would you like to eat/drink?" },
      { id: "u16", name: "Unit 16: My pets", topics: "thú cưng: cat, dog, rabbit, parrot, goldfish; Do you have any ...? – Yes, I do / No, I don't; How many ... do you have?" },
      { id: "u17", name: "Unit 17: Our toys", topics: "đồ chơi: doll, ball, car, robot, kite, teddy bear, ship, plane; I have ...; He has / She has ..." },
      { id: "u18", name: "Unit 18: Playing and doing", topics: "hiện tại tiếp diễn: What are you doing? – I'm reading/drawing/listening to music/writing; What's he/she doing?" },
      { id: "u19", name: "Unit 19: Outdoor activities", topics: "hoạt động ngoài trời: cycling, flying a kite, skating, skipping, walking, painting; What's he/she doing? – He's/She's ..." },
      { id: "u20", name: "Unit 20: At the zoo", topics: "con vật ở sở thú: monkey, elephant, tiger, giraffe, horse, peacock, parrot; What can you see? – I can see ...; What's the ... doing?" },
      { id: "tong-hop", name: "Ôn tập tổng hợp cả năm", topics: "tổng hợp từ vựng và mẫu câu Tiếng Anh lớp 3 (Unit 1–20)" },
    ],
  },
  "7|tienganh": {
    book: "Tiếng Anh 7 – Global Success",
    chapters: [
      { id: "u1", name: "Unit 1: Hobbies", topics: "sở thích: building dollhouses, gardening, horse riding, making models, collecting; thì hiện tại đơn; động từ chỉ sự yêu thích + V-ing (like, love, enjoy, hate)" },
      { id: "u2", name: "Unit 2: Healthy living", topics: "lối sống lành mạnh, các bệnh thường gặp (sunburn, spots, flu, sore throat); câu đơn (simple sentences); should/shouldn't" },
      { id: "u3", name: "Unit 3: Community service", topics: "hoạt động tình nguyện: donate, volunteer, clean up, recycle, help the elderly; thì quá khứ đơn (động từ có quy tắc và bất quy tắc)" },
      { id: "u4", name: "Unit 4: Music and arts", topics: "âm nhạc và nghệ thuật: instruments, painting, musician, artist; so sánh: like, different from, (not) as ... as" },
      { id: "u5", name: "Unit 5: Food and drink", topics: "món ăn, đồ uống, công thức nấu ăn; danh từ đếm được/không đếm được; how much/how many; some, a lot of, lots of" },
      { id: "u6", name: "Unit 6: A visit to a school", topics: "trường học, cơ sở vật chất, lịch sử trường; giới từ chỉ thời gian và nơi chốn (at, in, on)" },
      { id: "u7", name: "Unit 7: Traffic", topics: "giao thông, biển báo, an toàn giao thông; It indicating distance (It is about ... km from ... to ...); should/shouldn't" },
      { id: "u8", name: "Unit 8: Films", topics: "thể loại phim: comedy, horror, documentary, science fiction, animated; tính từ miêu tả phim; although/though, however" },
      { id: "u9", name: "Unit 9: Festivals around the world", topics: "lễ hội trên thế giới: Easter, Christmas, Halloween, Thanksgiving, Cannes Film Festival; câu hỏi Yes/No và câu hỏi Wh- (thì quá khứ đơn)" },
      { id: "u10", name: "Unit 10: Energy sources", topics: "các nguồn năng lượng: renewable, non-renewable, solar, wind, hydro, nuclear; thì hiện tại tiếp diễn" },
      { id: "u11", name: "Unit 11: Travelling in the future", topics: "phương tiện tương lai: flying car, hyperloop, skyTran, bamboo-copter; thì tương lai đơn (will); đại từ sở hữu (mine, yours, ...)" },
      { id: "u12", name: "Unit 12: English-speaking countries", topics: "các nước nói tiếng Anh: the UK, the USA, Canada, Australia, New Zealand; danh lam, thủ đô, phong tục; mạo từ a, an, the" },
      { id: "tong-hop", name: "Ôn tập tổng hợp cả năm", topics: "tổng hợp từ vựng và ngữ pháp Tiếng Anh lớp 7 (Unit 1–12)" },
    ],
  },
};

export const COURSES: Record<string, Course> = { ...MORE_COURSES, ...BOOK_COURSES };

export function getCourse(grade: number, subject: Subject): Course | undefined {
  return COURSES[`${grade}|${subject}`];
}

export function findChapter(grade: number, subject: Subject, chapterId: string): Chapter | undefined {
  return getCourse(grade, subject)?.chapters.find((c) => c.id === chapterId);
}
