import type { Chapter, Course } from "./curriculum";

/**
 * Mục lục các lớp, môn còn lại, soạn theo chủ đề của Chương trình GDPT 2018.
 * Mỗi chương: [tên, nội dung trọng tâm gửi cho AI]. Id chương tự đánh c1, c2...
 */
type Raw = [string, string][];

const GDPT = "Chương trình GDPT 2018";
const TONG_HOP = (subject: string, grade: number): [string, string] => ["Ôn tập tổng hợp cả năm", `tổng hợp toàn bộ chương trình ${subject} lớp ${grade}`];

function course(book: string, raw: Raw): Course {
  const chapters: Chapter[] = raw.map(([name, topics], i) => ({
    id: name.startsWith("Ôn tập tổng hợp") ? "tong-hop" : `c${i + 1}`,
    name,
    topics,
  }));
  return { book, chapters };
}

// ---------- Toán ----------

const TOAN: Record<number, Raw> = {
  1: [
    ["Các số từ 0 đến 10", "đếm, đọc, viết các số từ 0 đến 10; so sánh số (lớn hơn, bé hơn, bằng nhau); dấu >, <, =; tách và gộp số"],
    ["Hình phẳng và khối hình quen thuộc", "nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật; khối lập phương, khối hộp chữ nhật; vị trí trên dưới, trái phải, trước sau"],
    ["Phép cộng, phép trừ trong phạm vi 10", "cộng, trừ trong phạm vi 10; bảng cộng, bảng trừ; viết phép tính thích hợp với tình huống"],
    ["Các số đến 100", "đọc, viết, so sánh các số đến 100; chục và đơn vị; số tròn chục; sắp xếp thứ tự"],
    ["Độ dài và đo độ dài", "dài hơn, ngắn hơn; đo bằng gang tay, sải tay; xăng-ti-mét (cm)"],
    ["Cộng, trừ (không nhớ) trong phạm vi 100", "cộng, trừ số có hai chữ số với số có một chữ số và số có hai chữ số (không nhớ); bài toán có lời văn đơn giản"],
    ["Thời gian: xem giờ, các ngày trong tuần", "xem giờ đúng trên đồng hồ; các ngày trong tuần; xem lịch tờ"],
    TONG_HOP("Toán", 1),
  ],
  2: [
    ["Ôn tập và bổ sung", "ôn số đến 100; số liền trước, liền sau; tia số; số hạng, tổng, số bị trừ, số trừ, hiệu; nhiều hơn, ít hơn"],
    ["Cộng, trừ có nhớ trong phạm vi 20", "phép cộng qua 10, phép trừ qua 10 trong phạm vi 20; bảng cộng, bảng trừ; bài toán về thêm, bớt"],
    ["Đơn vị ki-lô-gam, lít", "nặng hơn, nhẹ hơn; ki-lô-gam (kg); lít (l); tính với đơn vị đo"],
    ["Cộng, trừ có nhớ trong phạm vi 100", "phép cộng, trừ có nhớ số có hai chữ số; tính nhẩm; bài toán có lời văn một bước"],
    ["Hình phẳng: đường thẳng, đường cong, hình tứ giác", "điểm, đoạn thẳng, đường thẳng, đường cong, đường gấp khúc; ba điểm thẳng hàng; hình tứ giác"],
    ["Ngày – giờ, giờ – phút, ngày – tháng", "xem đồng hồ (giờ, giờ rưỡi, giờ kém); ngày, tháng; xem lịch"],
    ["Phép nhân, phép chia", "phép nhân, phép chia; thừa số, tích, số bị chia, số chia, thương; bảng nhân 2, 5; bảng chia 2, 5"],
    ["Các số trong phạm vi 1000", "đơn vị, chục, trăm, nghìn; đọc, viết, so sánh số có ba chữ số; số tròn trăm, tròn chục"],
    ["Độ dài: đề-xi-mét, mét, ki-lô-mét", "đơn vị dm, m, km; đổi đơn vị; độ dài đường gấp khúc"],
    ["Cộng, trừ trong phạm vi 1000", "phép cộng, trừ (không nhớ và có nhớ) các số có ba chữ số"],
    ["Làm quen với thống kê, xác suất; tiền Việt Nam", "thu thập, kiểm đếm số liệu; biểu đồ tranh; chắc chắn, có thể, không thể; tiền Việt Nam"],
    TONG_HOP("Toán", 2),
  ],
  4: [
    ["Số có nhiều chữ số", "lớp triệu; đọc, viết, so sánh số tự nhiên; hàng và lớp; làm tròn số đến hàng trăm nghìn"],
    ["Góc và đường thẳng", "góc nhọn, góc tù, góc bẹt; đo góc bằng thước đo góc (độ); hai đường thẳng vuông góc, song song"],
    ["Phép cộng, phép trừ", "cộng, trừ số có nhiều chữ số; tính chất giao hoán, kết hợp; tìm thành phần chưa biết; bài toán liên quan đến rút về đơn vị"],
    ["Đơn vị đo đại lượng", "yến, tạ, tấn; giây, thế kỉ; đề-xi-mét vuông, mét vuông, mi-li-mét vuông; đổi đơn vị"],
    ["Phép nhân, phép chia", "nhân với số có một, hai chữ số; chia cho số có một, hai chữ số; tính chất phép nhân; nhân, chia với 10, 100, 1000"],
    ["Số trung bình cộng; tổng và hiệu", "tìm số trung bình cộng; tìm hai số khi biết tổng và hiệu; tổng và tỉ số"],
    ["Hình bình hành, hình thoi", "nhận biết hình bình hành, hình thoi; đặc điểm các cạnh, góc"],
    ["Biểu đồ cột, dãy số liệu", "đọc, mô tả biểu đồ cột; dãy số liệu thống kê; số lần xuất hiện của một sự kiện"],
    ["Phân số", "khái niệm phân số; phân số bằng nhau; rút gọn, quy đồng mẫu số; so sánh phân số"],
    ["Các phép tính với phân số", "cộng, trừ, nhân, chia phân số; tìm phân số của một số; bài toán có lời văn"],
    TONG_HOP("Toán", 4),
  ],
  5: [
    ["Ôn tập và bổ sung về phân số", "phân số thập phân; hỗn số; các phép tính với phân số; tỉ số"],
    ["Số thập phân", "đọc, viết, so sánh số thập phân; hàng của số thập phân; làm tròn số thập phân; viết số đo dưới dạng số thập phân"],
    ["Các phép tính với số thập phân", "cộng, trừ, nhân, chia số thập phân; nhân, chia nhẩm với 10, 100, 0,1; tính giá trị biểu thức"],
    ["Tỉ số phần trăm", "tỉ số phần trăm; tìm tỉ số phần trăm của hai số; tìm giá trị phần trăm của một số; bài toán thực tế (lãi, giảm giá)"],
    ["Hình tam giác, hình thang, hình tròn", "diện tích hình tam giác, hình thang; chu vi, diện tích hình tròn (số pi 3,14)"],
    ["Thể tích; hình hộp chữ nhật, hình lập phương", "xăng-ti-mét khối, đề-xi-mét khối, mét khối; diện tích xung quanh, toàn phần và thể tích hình hộp chữ nhật, hình lập phương"],
    ["Số đo thời gian; toán chuyển động đều", "cộng, trừ, nhân, chia số đo thời gian; vận tốc, quãng đường, thời gian; hai vật chuyển động"],
    ["Một số yếu tố thống kê và xác suất", "biểu đồ hình quạt tròn; tỉ số mô tả số lần lặp lại của một kết quả; tỉ lệ bản đồ"],
    TONG_HOP("Toán", 5),
  ],
  6: [
    ["Tập hợp các số tự nhiên", "tập hợp, phần tử; ghi số tự nhiên, số La Mã; các phép tính; lũy thừa với số mũ tự nhiên; thứ tự thực hiện phép tính"],
    ["Tính chia hết trong tập hợp số tự nhiên", "quan hệ chia hết; dấu hiệu chia hết cho 2, 3, 5, 9; số nguyên tố, hợp số; phân tích ra thừa số nguyên tố; ƯC, BC, ƯCLN, BCNN"],
    ["Số nguyên", "tập hợp số nguyên; so sánh; phép cộng, trừ, nhân, chia hết số nguyên; quy tắc dấu ngoặc; bội và ước của số nguyên"],
    ["Một số hình phẳng trong thực tiễn", "tam giác đều, hình vuông, lục giác đều; hình chữ nhật, hình thoi, hình bình hành, hình thang cân; chu vi và diện tích"],
    ["Tính đối xứng của hình phẳng", "hình có trục đối xứng, hình có tâm đối xứng; đối xứng trong thực tiễn"],
    ["Phân số", "mở rộng phân số; phân số bằng nhau; so sánh phân số; các phép tính với phân số; hai bài toán về phân số"],
    ["Số thập phân", "số thập phân; tính toán với số thập phân; làm tròn và ước lượng; tỉ số và tỉ số phần trăm"],
    ["Những hình hình học cơ bản", "điểm, đường thẳng; điểm nằm giữa hai điểm, tia; đoạn thẳng, độ dài; trung điểm; góc, số đo góc"],
    ["Dữ liệu và xác suất thực nghiệm", "thu thập, phân loại dữ liệu; bảng thống kê, biểu đồ tranh, biểu đồ cột, cột kép; kết quả có thể và sự kiện; xác suất thực nghiệm"],
    TONG_HOP("Toán", 6),
  ],
  8: [
    ["Đa thức", "đơn thức, đa thức nhiều biến; cộng, trừ, nhân đa thức; chia đa thức cho đơn thức"],
    ["Hằng đẳng thức đáng nhớ và ứng dụng", "bình phương của tổng, hiệu; hiệu hai bình phương; lập phương của tổng, hiệu; tổng, hiệu hai lập phương; phân tích đa thức thành nhân tử"],
    ["Tứ giác", "tứ giác; hình thang cân; hình bình hành; hình chữ nhật; hình thoi; hình vuông: tính chất và dấu hiệu nhận biết"],
    ["Định lí Thalès", "định lí Thalès trong tam giác; đường trung bình của tam giác; tính chất đường phân giác của tam giác"],
    ["Dữ liệu và biểu đồ", "thu thập, phân loại dữ liệu; biểu diễn bằng bảng, biểu đồ; phân tích số liệu"],
    ["Phân thức đại số", "phân thức; tính chất cơ bản; cộng, trừ, nhân, chia phân thức"],
    ["Phương trình bậc nhất và hàm số bậc nhất", "phương trình bậc nhất một ẩn và cách giải; giải bài toán bằng cách lập phương trình; hàm số, đồ thị hàm số y = ax + b; hệ số góc"],
    ["Tam giác đồng dạng", "hai tam giác đồng dạng; các trường hợp đồng dạng; định lí Pythagore và ứng dụng; hình đồng dạng"],
    ["Một số hình khối trong thực tiễn", "hình chóp tam giác đều, hình chóp tứ giác đều: diện tích xung quanh, thể tích"],
    ["Mở đầu về xác suất", "kết quả thuận lợi; tính xác suất bằng tỉ số; xác suất thực nghiệm và ứng dụng"],
    TONG_HOP("Toán", 8),
  ],
  9: [
    ["Phương trình và hệ hai phương trình bậc nhất hai ẩn", "phương trình bậc nhất hai ẩn; hệ hai phương trình; giải bằng phương pháp thế, cộng đại số; giải bài toán bằng cách lập hệ phương trình"],
    ["Phương trình và bất phương trình bậc nhất một ẩn", "phương trình quy về bậc nhất (phương trình tích, chứa ẩn ở mẫu); bất đẳng thức; bất phương trình bậc nhất một ẩn"],
    ["Căn bậc hai và căn bậc ba", "căn bậc hai, căn thức bậc hai; khai căn tích, thương; biến đổi đơn giản biểu thức chứa căn; căn bậc ba"],
    ["Hệ thức lượng trong tam giác vuông", "tỉ số lượng giác của góc nhọn (sin, cos, tan, cot); hệ thức giữa cạnh và góc; giải tam giác vuông"],
    ["Đường tròn", "đường tròn; cung và dây; độ dài cung, diện tích hình quạt; vị trí tương đối của đường thẳng và đường tròn; tiếp tuyến"],
    ["Đường tròn ngoại tiếp, nội tiếp; đa giác đều", "góc nội tiếp; đường tròn ngoại tiếp, nội tiếp tam giác; tứ giác nội tiếp; đa giác đều; phép quay"],
    ["Hàm số y = ax² và phương trình bậc hai một ẩn", "đồ thị hàm số y = ax²; phương trình bậc hai, công thức nghiệm, biệt thức delta; định lí Viète; giải bài toán bằng cách lập phương trình"],
    ["Tần số và tần số tương đối", "bảng tần số, biểu đồ tần số; tần số tương đối; tần số ghép nhóm"],
    ["Xác suất của biến cố trong mô hình xác suất đơn giản", "phép thử, không gian mẫu; biến cố; tính xác suất trong các mô hình đơn giản"],
    ["Hình trụ, hình nón, hình cầu", "diện tích xung quanh, thể tích hình trụ, hình nón; diện tích mặt cầu, thể tích hình cầu"],
    TONG_HOP("Toán", 9),
  ],
};

// ---------- Tiếng Việt, Ngữ văn ----------

const TIENGVIET: Record<number, Raw> = {
  1: [
    ["Âm và chữ cái", "nhận biết các chữ cái và âm: a, b, c, d, đ, e, ê, g, h, i, k, l, m, n, o, ô, ơ, p, q, r, s, t, u, ư, v, x, y; âm ghép ch, gh, ng, ngh, nh, ph, th, tr, kh, gi, qu"],
    ["Dấu thanh", "thanh huyền, sắc, hỏi, ngã, nặng; nhận biết tiếng có dấu thanh"],
    ["Vần", "các vần thường gặp: an, at, am, ap, ăn, ăt, anh, ach, ong, oc, uông, ươn, oa, oe, uy..."],
    ["Chính tả", "quy tắc c/k, g/gh, ng/ngh; viết hoa chữ đầu câu, tên riêng"],
    ["Từ và câu", "từ chỉ người, con vật, đồ vật, cây cối; từ chỉ hoạt động; câu đơn giản; dấu chấm, dấu chấm hỏi"],
    ["Đọc hiểu đoạn ngắn", "đọc hiểu đoạn văn, bài thơ ngắn về gia đình, trường học, thiên nhiên (tự soạn, 2–4 câu)"],
    TONG_HOP("Tiếng Việt", 1),
  ],
  2: [
    ["Từ chỉ sự vật, hoạt động, đặc điểm", "nhận biết và phân loại từ chỉ sự vật, hoạt động, đặc điểm (màu sắc, hình dáng, tính tình)"],
    ["Câu giới thiệu, câu nêu hoạt động, câu nêu đặc điểm", "câu kiểu Ai là gì?, Ai làm gì?, Ai thế nào?; đặt câu hỏi cho bộ phận câu"],
    ["Dấu câu", "dấu chấm, dấu phẩy, dấu chấm hỏi, dấu chấm than"],
    ["Từ ngữ theo chủ đề", "từ ngữ về gia đình, trường học, bạn bè, nghề nghiệp, quê hương, đất nước"],
    ["Từ có nghĩa giống nhau, trái nghĩa", "tìm từ cùng nghĩa, trái nghĩa"],
    ["Chính tả", "phân biệt s/x, l/n, tr/ch, r/d/gi, iu/ưu, ao/au, ai/ay; viết hoa tên riêng"],
    ["Đọc hiểu", "đọc hiểu đoạn văn, bài thơ ngắn tự soạn: nhân vật, sự việc, ý chính"],
    TONG_HOP("Tiếng Việt", 2),
  ],
  3: [
    ["Từ chỉ sự vật, hoạt động, đặc điểm", "phân loại từ; mở rộng vốn từ theo chủ đề (trường học, gia đình, cộng đồng, thiên nhiên, quê hương)"],
    ["Biện pháp so sánh", "nhận biết hình ảnh so sánh; từ so sánh (như, như là, giống như, hơn, kém)"],
    ["Các kiểu câu", "câu kể, câu hỏi, câu cảm, câu khiến; công dụng và dấu câu tương ứng"],
    ["Dấu câu", "dấu chấm, dấu phẩy, dấu hai chấm, dấu gạch ngang, dấu ngoặc kép"],
    ["Từ có nghĩa giống nhau, trái nghĩa", "tìm và dùng từ cùng nghĩa, trái nghĩa trong câu"],
    ["Chính tả", "phân biệt s/x, l/n, ch/tr, r/d/gi, an/ang, en/eng, ui/uôi; viết hoa tên người, tên địa lí Việt Nam"],
    ["Đọc hiểu", "đọc hiểu đoạn văn, đoạn thơ ngắn tự soạn: nội dung, nhân vật, bài học"],
    TONG_HOP("Tiếng Việt", 3),
  ],
  4: [
    ["Danh từ", "danh từ chung, danh từ riêng; viết hoa danh từ riêng (tên người, tên địa lí, tên cơ quan)"],
    ["Động từ, tính từ", "nhận biết động từ, tính từ; từ chỉ mức độ"],
    ["Câu và thành phần câu", "chủ ngữ, vị ngữ; trạng ngữ (thời gian, nơi chốn, nguyên nhân, mục đích, phương tiện)"],
    ["Biện pháp nhân hóa", "nhận biết và tác dụng của nhân hóa; so sánh"],
    ["Dấu câu", "dấu gạch ngang, dấu ngoặc kép, dấu ngoặc đơn, dấu hai chấm"],
    ["Thành ngữ, tục ngữ, mở rộng vốn từ", "thành ngữ, tục ngữ quen thuộc và ý nghĩa; từ ngữ về ước mơ, ý chí, cái đẹp, sức khỏe"],
    ["Đọc hiểu", "đọc hiểu đoạn văn, đoạn thơ ngắn tự soạn: ý chính, chi tiết, thông điệp"],
    TONG_HOP("Tiếng Việt", 4),
  ],
  5: [
    ["Từ đồng nghĩa, trái nghĩa", "từ đồng nghĩa hoàn toàn và không hoàn toàn; từ trái nghĩa; dùng từ phù hợp ngữ cảnh"],
    ["Từ đồng âm, từ nhiều nghĩa", "phân biệt từ đồng âm và từ nhiều nghĩa; nghĩa gốc, nghĩa chuyển"],
    ["Đại từ, kết từ", "đại từ xưng hô, đại từ thay thế; kết từ (và, với, của, nhưng, vì, nên...)"],
    ["Câu ghép", "câu đơn, câu ghép; cách nối các vế câu ghép bằng kết từ, cặp kết từ, dấu câu"],
    ["Liên kết câu", "liên kết bằng lặp từ ngữ, thay thế từ ngữ, từ ngữ nối"],
    ["Biện pháp tu từ, dấu câu", "điệp từ, điệp ngữ; so sánh, nhân hóa; dấu gạch ngang, dấu ngoặc kép, dấu hai chấm"],
    ["Đọc hiểu", "đọc hiểu văn bản ngắn tự soạn: chủ đề, chi tiết, ý nghĩa"],
    TONG_HOP("Tiếng Việt", 5),
  ],
};

const NGUVAN: Record<number, Raw> = {
  6: [
    ["Truyện truyền thuyết, cổ tích", "đặc điểm truyện truyền thuyết, cổ tích; nhân vật, cốt truyện, chi tiết kì ảo; ngôi kể"],
    ["Thơ lục bát và thơ có yếu tố tự sự, miêu tả", "đặc điểm thể thơ lục bát (số tiếng, vần, nhịp); thơ có yếu tố tự sự, miêu tả"],
    ["Kí: hồi kí, du kí", "đặc điểm hồi kí, du kí; người kể chuyện ngôi thứ nhất"],
    ["Văn bản nghị luận, văn bản thông tin", "ý kiến, lí lẽ, bằng chứng; văn bản thuật lại sự kiện; nhan đề, sa pô, đề mục"],
    ["Từ và cấu tạo từ", "từ đơn, từ phức (từ ghép, từ láy); nghĩa của từ; từ mượn; từ đa nghĩa, từ đồng âm"],
    ["Biện pháp tu từ", "so sánh, nhân hóa, ẩn dụ, hoán dụ, điệp ngữ: nhận biết và tác dụng"],
    ["Cụm từ và dấu câu", "cụm danh từ, cụm động từ, cụm tính từ; dấu chấm phẩy, dấu ngoặc kép; trạng ngữ; thành ngữ"],
    TONG_HOP("Ngữ văn", 6),
  ],
  7: [
    ["Truyện ngắn, tiểu thuyết", "đề tài, chủ đề, nhân vật, ngôi kể, chi tiết tiêu biểu; tính cách nhân vật"],
    ["Thơ bốn chữ, năm chữ", "đặc điểm thơ bốn chữ, năm chữ (vần, nhịp, hình ảnh)"],
    ["Truyện ngụ ngôn, tục ngữ", "đặc điểm truyện ngụ ngôn, bài học; tục ngữ về thiên nhiên, lao động, con người"],
    ["Văn bản nghị luận, văn bản thông tin", "luận đề, luận điểm, lí lẽ, bằng chứng; văn bản giới thiệu quy tắc, luật lệ trò chơi"],
    ["Tùy bút, tản văn", "đặc điểm tùy bút, tản văn; cái tôi của tác giả"],
    ["Từ loại và thành phần câu", "số từ, phó từ; mở rộng thành phần chính và trạng ngữ bằng cụm từ"],
    ["Biện pháp tu từ và nghĩa của từ", "nói quá, nói giảm nói tránh; từ Hán Việt; ngữ cảnh và nghĩa của từ; thuật ngữ; liên kết và mạch lạc"],
    TONG_HOP("Ngữ văn", 7),
  ],
  8: [
    ["Truyện lịch sử, tiểu thuyết", "đặc điểm truyện lịch sử; cốt truyện, bối cảnh, nhân vật"],
    ["Thơ Đường luật", "thơ thất ngôn bát cú, tứ tuyệt Đường luật: bố cục, niêm, luật, vần, đối"],
    ["Hài kịch, truyện cười", "đặc điểm hài kịch, truyện cười; mâu thuẫn, tiếng cười, thủ pháp trào phúng"],
    ["Văn bản nghị luận, văn bản thông tin", "luận đề, luận điểm; văn bản giải thích một hiện tượng tự nhiên"],
    ["Từ ngữ", "từ tượng hình, từ tượng thanh; biệt ngữ xã hội, từ ngữ địa phương; từ Hán Việt"],
    ["Câu và đoạn văn", "đoạn văn diễn dịch, quy nạp, song song, phối hợp; câu hỏi tu từ; câu khẳng định, phủ định; đảo ngữ"],
    ["Nghĩa của câu và các từ loại khác", "nghĩa tường minh, hàm ý; trợ từ, thán từ; thành phần biệt lập"],
    TONG_HOP("Ngữ văn", 8),
  ],
  9: [
    ["Truyện truyền kì, truyện trinh thám", "đặc điểm truyện truyền kì; truyện trinh thám: cốt truyện, nhân vật thám tử, chi tiết"],
    ["Truyện thơ Nôm", "đặc điểm truyện thơ Nôm; thể lục bát; nghệ thuật tả người, tả cảnh ngụ tình"],
    ["Thơ song thất lục bát, thơ tám chữ", "đặc điểm thể thơ song thất lục bát, thơ tám chữ"],
    ["Văn bản nghị luận và thông tin", "nghị luận xã hội, nghị luận văn học; văn bản thông tin giải thích, thuyết minh"],
    ["Bi kịch", "đặc điểm bi kịch: xung đột, hành động, nhân vật"],
    ["Từ ngữ và biện pháp tu từ", "điển tích, điển cố; biện pháp chơi chữ; từ Hán Việt; sự phát triển nghĩa của từ"],
    ["Câu", "câu rút gọn, câu đặc biệt; câu ghép và các kiểu quan hệ giữa các vế; cách dẫn trực tiếp, gián tiếp"],
    TONG_HOP("Ngữ văn", 9),
  ],
};

// ---------- Tiếng Anh ----------

const unitsList = (units: string[]): Raw =>
  units.map((u, i) => [`Unit ${i + 1}: ${u}`, `từ vựng và mẫu câu thuộc chủ đề "${u}"`]);

const TIENGANH: Record<number, Raw> = {
  1: [
    ["Chào hỏi và giới thiệu", "hello, hi, goodbye; What's your name? – I'm...; chữ cái tiếng Anh"],
    ["Đồ dùng học tập và lớp học", "book, pen, pencil, bag, ruler; This is a..."],
    ["Màu sắc và số đếm 1–10", "red, blue, yellow, green...; one to ten; How many...?"],
    ["Gia đình", "mother, father, brother, sister, baby; This is my..."],
    ["Con vật", "cat, dog, bird, fish, duck, cow; It's a..."],
    ["Đồ chơi và đồ ăn", "ball, doll, car, kite; cake, apple, milk, banana; I like..."],
    TONG_HOP("Tiếng Anh", 1),
  ],
  2: [
    ["Trường học và lớp học", "classroom, teacher, desk, board; Sit down, Stand up; What's this?"],
    ["Gia đình và ngôi nhà", "family members; rooms in the house: kitchen, bedroom, bathroom"],
    ["Màu sắc, hình dạng, số đếm 1–20", "colours, shapes (circle, square, triangle), numbers 1–20"],
    ["Đồ ăn, đồ uống", "bread, rice, egg, juice, water; I want..., Do you like...?"],
    ["Con vật và thiên nhiên", "animals at the farm and the zoo; tree, flower, sun, rain"],
    ["Hoạt động và thời tiết", "run, jump, swim, sing, dance; I can...; sunny, rainy, windy"],
    TONG_HOP("Tiếng Anh", 2),
  ],
  4: [
    ...unitsList([
      "My friends", "Time and daily routines", "My week", "My birthday party", "Things we can do", "Our school facilities", "Our timetables",
      "My favourite subjects", "Our sports day", "Our summer holidays", "My home", "Jobs", "Appearance", "Daily activities",
      "My family's weekends", "Weather", "In the city", "At the shopping centre", "The animal world", "At summer camp",
    ]),
    TONG_HOP("Tiếng Anh", 4),
  ],
  5: [
    ...unitsList([
      "All about me!", "Our homes", "My foreign friends", "Our free-time activities", "My future job", "Our school rooms",
      "Our favourite school activities", "In our classroom", "Our outdoor activities", "Our school trip", "Family time", "Our Tet holiday",
      "Our special days", "Staying healthy", "Our health", "Seasons and the weather", "Stories for children", "Means of transport",
      "Places of interest", "Our summer holidays",
    ]),
    TONG_HOP("Tiếng Anh", 5),
  ],
  6: [
    ...unitsList([
      "My new school", "My house", "My friends", "My neighbourhood", "Natural wonders of Viet Nam", "Our Tet holiday", "Television",
      "Sports and games", "Cities of the world", "Our houses in the future", "Our greener world", "Robots",
    ]),
    TONG_HOP("Tiếng Anh", 6),
  ],
  8: [
    ...unitsList([
      "Leisure time", "Life in the countryside", "Teenagers", "Ethnic groups of Viet Nam", "Our customs and traditions", "Lifestyles",
      "Environmental protection", "Shopping", "Natural disasters", "Communication in the future", "Science and technology", "Life on other planets",
    ]),
    TONG_HOP("Tiếng Anh", 8),
  ],
  9: [
    ...unitsList([
      "Local community", "City life", "Healthy living for teens", "Remembering the past", "Our experiences", "Vietnamese lifestyle: then and now",
      "Natural wonders of the world", "Tourism", "World Englishes", "Planet Earth", "Electronic devices", "Career choices",
    ]),
    TONG_HOP("Tiếng Anh", 9),
  ],
};

// ---------- Tự nhiên và Xã hội (lớp 1–3) ----------

const TNXH: Record<number, Raw> = {
  1: [
    ["Gia đình", "thành viên trong gia đình; nhà ở; đồ dùng trong nhà; an toàn khi ở nhà"],
    ["Trường học", "lớp học, trường học; hoạt động ở trường; an toàn khi ở trường"],
    ["Cộng đồng địa phương", "nơi em sống; công việc của mọi người; đường phố, an toàn giao thông"],
    ["Thực vật và động vật", "các bộ phận của cây, của con vật; chăm sóc, bảo vệ cây và vật nuôi"],
    ["Con người và sức khỏe", "các bộ phận cơ thể, giác quan; giữ vệ sinh; ăn uống lành mạnh"],
    ["Trái Đất và bầu trời", "bầu trời ban ngày, ban đêm; thời tiết; trang phục phù hợp thời tiết"],
    TONG_HOP("Tự nhiên và Xã hội", 1),
  ],
  2: [
    ["Gia đình", "các thế hệ trong gia đình; nghề nghiệp của người lớn; phòng tránh ngộ độc khi ở nhà"],
    ["Trường học", "hoạt động kỉ niệm các ngày lễ ở trường; giữ vệ sinh trường học; an toàn khi tham gia hoạt động"],
    ["Cộng đồng địa phương", "hàng hóa, mua bán; đường giao thông, biển báo; an toàn khi đi các phương tiện"],
    ["Thực vật và động vật", "môi trường sống của thực vật, động vật (trên cạn, dưới nước); bảo vệ môi trường sống"],
    ["Con người và sức khỏe", "cơ quan vận động, hô hấp, bài tiết nước tiểu; giữ gìn sức khỏe"],
    ["Trái Đất và bầu trời", "các mùa trong năm; thiên tai (bão, lũ, lốc, sét) và cách phòng tránh"],
    TONG_HOP("Tự nhiên và Xã hội", 2),
  ],
  3: [
    ["Gia đình", "họ nội, họ ngoại; phòng tránh hỏa hoạn khi ở nhà; giữ vệ sinh xung quanh nhà"],
    ["Trường học", "truyền thống nhà trường; giữ an toàn và vệ sinh khi tham gia hoạt động ở trường"],
    ["Cộng đồng địa phương", "hoạt động sản xuất nông nghiệp, công nghiệp, thủ công; di tích, cảnh quan"],
    ["Thực vật và động vật", "đặc điểm bên ngoài của thực vật, động vật; chức năng các bộ phận; thực vật và động vật cần gì để sống"],
    ["Con người và sức khỏe", "cơ quan tiêu hóa, tuần hoàn, thần kinh; dinh dưỡng; chất gây nghiện cần tránh"],
    ["Trái Đất và bầu trời", "phương hướng (Đông, Tây, Nam, Bắc); Mặt Trời, Trái Đất, Mặt Trăng; các đới khí hậu; bề mặt Trái Đất"],
    TONG_HOP("Tự nhiên và Xã hội", 3),
  ],
};

// ---------- Khoa học (4–5), Khoa học tự nhiên (6–9) ----------

const KHOAHOC: Record<number, Raw> = {
  4: [
    ["Nước", "tính chất của nước; sự chuyển thể; vòng tuần hoàn của nước; vai trò, ô nhiễm và bảo vệ nguồn nước"],
    ["Không khí", "thành phần, tính chất của không khí; vai trò; ô nhiễm và bảo vệ bầu không khí; gió, bão"],
    ["Năng lượng: ánh sáng, âm thanh, nhiệt", "nguồn sáng, vật cho ánh sáng truyền qua, bóng của vật; âm thanh và sự truyền âm; nhiệt độ, vật dẫn nhiệt tốt, kém"],
    ["Thực vật và động vật", "nhu cầu sống của thực vật, động vật; chăm sóc cây trồng, vật nuôi"],
    ["Nấm", "đặc điểm của nấm; nấm ăn, nấm men trong chế biến thực phẩm; nấm mốc, bảo quản thực phẩm"],
    ["Con người và sức khỏe", "các nhóm chất dinh dưỡng; chế độ ăn cân bằng; bệnh do thiếu dinh dưỡng; an toàn thực phẩm; phòng tránh đuối nước"],
    ["Sinh vật và môi trường", "chuỗi thức ăn; vai trò của thực vật trong chuỗi thức ăn"],
    TONG_HOP("Khoa học", 4),
  ],
  5: [
    ["Chất", "đất và thành phần của đất; hỗn hợp và dung dịch; sự biến đổi trạng thái và biến đổi hóa học của chất"],
    ["Năng lượng", "năng lượng điện, mạch điện đơn giản, vật dẫn điện và cách điện; năng lượng mặt trời, gió, nước chảy; sử dụng năng lượng tiết kiệm, an toàn"],
    ["Thực vật và động vật", "sinh sản của thực vật có hoa (hoa, hạt, quả); cây mọc từ thân, rễ, lá; sinh sản và vòng đời của động vật"],
    ["Vi khuẩn", "vi khuẩn có ích, vi khuẩn gây bệnh; phòng tránh bệnh do vi khuẩn"],
    ["Con người và sức khỏe", "sự sinh sản ở người; các giai đoạn phát triển; tuổi dậy thì; chăm sóc sức khỏe; phòng tránh bị xâm hại"],
    ["Sinh vật và môi trường", "vai trò của môi trường với sinh vật; tác động của con người; bảo vệ môi trường"],
    TONG_HOP("Khoa học", 5),
  ],
};

const KHTN: Record<number, Raw> = {
  6: [
    ["Mở đầu và các phép đo", "an toàn trong phòng thực hành; kính lúp, kính hiển vi; đo chiều dài, khối lượng, thời gian, nhiệt độ"],
    ["Các thể của chất", "chất quanh ta; sự chuyển thể (nóng chảy, đông đặc, bay hơi, ngưng tụ); oxygen và không khí"],
    ["Vật liệu, nhiên liệu, nguyên liệu, lương thực – thực phẩm", "tính chất và ứng dụng; sử dụng an toàn, hiệu quả"],
    ["Hỗn hợp và tách chất", "chất tinh khiết, hỗn hợp; dung dịch, huyền phù, nhũ tương; tách chất (lọc, cô cạn, chiết)"],
    ["Tế bào và cơ thể", "tế bào là đơn vị cơ sở của sự sống; cấu tạo tế bào; sự lớn lên và sinh sản của tế bào; cơ thể đơn bào, đa bào; mô, cơ quan, hệ cơ quan"],
    ["Đa dạng thế giới sống", "phân loại sinh vật; virus, vi khuẩn; nguyên sinh vật; nấm; thực vật; động vật; đa dạng sinh học"],
    ["Lực", "lực và biểu diễn lực; tác dụng của lực; lực tiếp xúc, không tiếp xúc; lực ma sát; trọng lượng, lực hấp dẫn; biến dạng của lò xo"],
    ["Năng lượng", "các dạng năng lượng; sự chuyển hóa năng lượng; định luật bảo toàn năng lượng; năng lượng hao phí; năng lượng tái tạo"],
    ["Trái Đất và bầu trời", "chuyển động nhìn thấy của Mặt Trời; các pha của Mặt Trăng; hệ Mặt Trời; Ngân Hà"],
    TONG_HOP("Khoa học tự nhiên", 6),
  ],
  7: [
    ["Nguyên tử, nguyên tố hóa học", "cấu tạo nguyên tử (proton, neutron, electron); nguyên tố hóa học, kí hiệu; sơ lược bảng tuần hoàn"],
    ["Phân tử và liên kết hóa học", "đơn chất, hợp chất, phân tử; liên kết ion, cộng hóa trị; hóa trị; công thức hóa học"],
    ["Tốc độ", "tốc độ chuyển động; đo tốc độ; đồ thị quãng đường – thời gian; tốc độ và an toàn giao thông"],
    ["Âm thanh", "mô tả sóng âm; độ to và độ cao của âm; phản xạ âm, chống ô nhiễm tiếng ồn"],
    ["Ánh sáng", "năng lượng ánh sáng, tia sáng, vùng tối; sự phản xạ ánh sáng; ảnh của vật qua gương phẳng"],
    ["Từ", "nam châm; từ trường; từ trường Trái Đất, la bàn; nam châm điện"],
    ["Trao đổi chất và chuyển hóa năng lượng", "quang hợp ở thực vật; hô hấp tế bào; trao đổi khí; trao đổi nước và chất dinh dưỡng ở thực vật, động vật"],
    ["Cảm ứng, sinh trưởng và sinh sản ở sinh vật", "cảm ứng; tập tính ở động vật; sinh trưởng và phát triển; sinh sản vô tính, hữu tính"],
    TONG_HOP("Khoa học tự nhiên", 7),
  ],
  8: [
    ["Phản ứng hóa học", "biến đổi vật lí, hóa học; mol, khối lượng mol, tỉ khối chất khí; nồng độ dung dịch; định luật bảo toàn khối lượng; phương trình hóa học; tốc độ phản ứng"],
    ["Acid, base, pH, oxide, muối", "tính chất của acid, base; thang pH; oxide; muối; phân bón hóa học"],
    ["Khối lượng riêng và áp suất", "khối lượng riêng; áp suất trên bề mặt; áp suất chất lỏng, áp suất khí quyển; lực đẩy Archimedes"],
    ["Tác dụng làm quay của lực", "moment lực; đòn bẩy và ứng dụng"],
    ["Điện", "hiện tượng nhiễm điện; dòng điện, nguồn điện; mạch điện đơn giản; tác dụng của dòng điện; cường độ dòng điện, hiệu điện thế"],
    ["Nhiệt", "năng lượng nhiệt, nội năng; dẫn nhiệt, đối lưu, bức xạ nhiệt; sự nở vì nhiệt"],
    ["Sinh học cơ thể người", "hệ vận động, tiêu hóa, tuần hoàn, hô hấp, bài tiết, thần kinh và giác quan, nội tiết, sinh sản; da và điều hòa thân nhiệt; dinh dưỡng và an toàn thực phẩm"],
    ["Sinh vật và môi trường", "môi trường và nhân tố sinh thái; quần thể, quần xã, hệ sinh thái; cân bằng tự nhiên; bảo vệ môi trường"],
    TONG_HOP("Khoa học tự nhiên", 8),
  ],
  9: [
    ["Năng lượng cơ học", "động năng, thế năng, cơ năng; công và công suất"],
    ["Ánh sáng", "khúc xạ ánh sáng; phản xạ toàn phần; lăng kính, màu sắc ánh sáng; thấu kính, kính lúp"],
    ["Điện", "điện trở, định luật Ohm; đoạn mạch nối tiếp, song song; năng lượng và công suất điện"],
    ["Điện từ và năng lượng với cuộc sống", "cảm ứng điện từ; dòng điện xoay chiều; các nguồn năng lượng, sử dụng năng lượng hiệu quả"],
    ["Kim loại", "tính chất của kim loại; dãy hoạt động hóa học; tách kim loại; hợp kim; sự khác nhau giữa kim loại và phi kim"],
    ["Hợp chất hữu cơ, hydrocarbon và nhiên liệu", "hợp chất hữu cơ; alkane, alkene; nguồn nhiên liệu"],
    ["Ethylic alcohol, acetic acid, lipid, carbohydrate, protein, polymer", "tính chất và ứng dụng; glucose, saccharose, tinh bột, cellulose; protein; polymer"],
    ["Di truyền", "gene, DNA, nhiễm sắc thể; nguyên phân, giảm phân; đột biến; thí nghiệm của Mendel; di truyền học với con người"],
    ["Tiến hóa", "khái niệm tiến hóa; chọn lọc tự nhiên; sự phát sinh sự sống"],
    TONG_HOP("Khoa học tự nhiên", 9),
  ],
};

// ---------- Lịch sử và Địa lí (4–9) ----------

const LSDL: Record<number, Raw> = {
  4: [
    ["Địa phương em", "thiên nhiên, lịch sử, văn hóa của địa phương; tỉnh, thành phố nơi em sống"],
    ["Trung du và miền núi Bắc Bộ", "thiên nhiên (địa hình, khí hậu, sông ngòi); dân cư và hoạt động sản xuất; Đền Hùng và lễ giỗ Tổ Hùng Vương"],
    ["Đồng bằng Bắc Bộ", "sông Hồng, sông Thái Bình; dân cư; Thăng Long – Hà Nội; Văn Miếu – Quốc Tử Giám"],
    ["Duyên hải miền Trung", "thiên nhiên; dân cư, hoạt động kinh tế biển; Cố đô Huế; phố cổ Hội An"],
    ["Tây Nguyên", "thiên nhiên (cao nguyên, đất đỏ badan); dân cư; văn hóa cồng chiêng"],
    ["Nam Bộ", "đồng bằng sông Cửu Long; Thành phố Hồ Chí Minh; địa đạo Củ Chi"],
    TONG_HOP("Lịch sử và Địa lí", 4),
  ],
  5: [
    ["Đất nước và con người Việt Nam", "vị trí địa lí, lãnh thổ, biển đảo; địa hình, khí hậu, sông ngòi; dân cư và các dân tộc"],
    ["Những quốc gia đầu tiên trên lãnh thổ Việt Nam", "nước Văn Lang, Âu Lạc; vương quốc Phù Nam; vương quốc Chăm-pa"],
    ["Xây dựng và bảo vệ đất nước (thời phong kiến)", "khởi nghĩa Hai Bà Trưng; chiến thắng Bạch Đằng năm 938; nhà Lý dời đô; nhà Trần chống quân Mông – Nguyên; khởi nghĩa Lam Sơn; Quang Trung đại phá quân Thanh"],
    ["Xây dựng và bảo vệ đất nước (thời hiện đại)", "Cách mạng tháng Tám năm 1945; chiến dịch Điện Biên Phủ năm 1954; thống nhất đất nước năm 1975; công cuộc Đổi mới"],
    ["Các nước láng giềng", "Trung Quốc, Lào, Cam-pu-chia; Hiệp hội các quốc gia Đông Nam Á (ASEAN)"],
    ["Tìm hiểu thế giới", "các châu lục và đại dương; dân số thế giới; một số nền văn minh nổi tiếng; xây dựng thế giới hòa bình"],
    TONG_HOP("Lịch sử và Địa lí", 5),
  ],
  6: [
    ["Lịch sử: xã hội nguyên thủy và cổ đại", "học lịch sử để làm gì, cách tính thời gian; xã hội nguyên thủy; Ai Cập, Lưỡng Hà, Ấn Độ, Trung Quốc, Hy Lạp, La Mã cổ đại"],
    ["Lịch sử: Đông Nam Á cổ đại", "các quốc gia sơ kì ở Đông Nam Á; giao lưu văn hóa"],
    ["Lịch sử: Việt Nam từ nguồn gốc đến thế kỉ X", "nhà nước Văn Lang, Âu Lạc; thời Bắc thuộc; khởi nghĩa Hai Bà Trưng, Bà Triệu, Lý Bí, Mai Thúc Loan, Phùng Hưng; Ngô Quyền và chiến thắng Bạch Đằng 938; Chăm-pa, Phù Nam"],
    ["Địa lí: bản đồ và Trái Đất", "kinh tuyến, vĩ tuyến, tọa độ địa lí; bản đồ, kí hiệu, tỉ lệ; Trái Đất trong hệ Mặt Trời; chuyển động tự quay và quanh Mặt Trời"],
    ["Địa lí: cấu tạo Trái Đất, vỏ Trái Đất", "cấu tạo Trái Đất; mảng kiến tạo; núi lửa, động đất; các dạng địa hình; khoáng sản"],
    ["Địa lí: khí hậu và nước trên Trái Đất", "khí quyển, khối khí, khí áp, gió; thời tiết, khí hậu, biến đổi khí hậu; sông, hồ; biển và đại dương"],
    ["Địa lí: đất, sinh vật và con người", "lớp đất; rừng nhiệt đới; đới thiên nhiên; dân số thế giới; con người và thiên nhiên"],
    TONG_HOP("Lịch sử và Địa lí", 6),
  ],
  7: [
    ["Lịch sử: châu Âu và thế giới thời trung đại", "Tây Âu thời trung đại; phát kiến địa lí; văn hóa Phục hưng, cải cách tôn giáo; Trung Quốc, Ấn Độ thời trung đại"],
    ["Lịch sử: Đông Nam Á thế kỉ X–XVI", "các quốc gia Đông Nam Á; vương quốc Lào, Cam-pu-chia"],
    ["Lịch sử: Việt Nam thế kỉ X–XV", "Ngô, Đinh, Tiền Lê; nhà Lý và kháng chiến chống Tống; nhà Trần và ba lần chống Mông – Nguyên; nhà Hồ; khởi nghĩa Lam Sơn; Đại Việt thời Lê sơ"],
    ["Địa lí: châu Âu", "vị trí, địa hình, khí hậu; dân cư, đô thị hóa; Liên minh châu Âu (EU)"],
    ["Địa lí: châu Á", "vị trí, địa hình, khí hậu; dân cư; các khu vực của châu Á"],
    ["Địa lí: châu Phi, châu Mỹ, châu Đại Dương, châu Nam Cực", "đặc điểm tự nhiên, dân cư, khai thác thiên nhiên của từng châu lục"],
    TONG_HOP("Lịch sử và Địa lí", 7),
  ],
  8: [
    ["Lịch sử: thế giới thế kỉ XVI–XIX", "cách mạng tư sản Anh, Mỹ, Pháp; Cách mạng công nghiệp; Đông Nam Á thế kỉ XVI–XIX; chủ nghĩa đế quốc"],
    ["Lịch sử: Việt Nam thế kỉ XVI–XVIII", "nhà Mạc; Đàng Trong, Đàng Ngoài; khởi nghĩa nông dân; phong trào Tây Sơn"],
    ["Lịch sử: thế giới đầu thế kỉ XX", "Chiến tranh thế giới thứ nhất; Cách mạng tháng Mười Nga; khoa học kĩ thuật thế kỉ XVIII–XIX"],
    ["Lịch sử: Việt Nam thế kỉ XIX – đầu thế kỉ XX", "nhà Nguyễn; kháng chiến chống thực dân Pháp; phong trào Cần Vương; phong trào yêu nước đầu thế kỉ XX"],
    ["Địa lí: tự nhiên Việt Nam", "vị trí, phạm vi lãnh thổ; địa hình; khoáng sản; khí hậu; thủy văn; đất; sinh vật"],
    ["Địa lí: biển đảo Việt Nam", "vùng biển, đảo và quần đảo (Hoàng Sa, Trường Sa); môi trường và tài nguyên biển; chủ quyền biển đảo"],
    TONG_HOP("Lịch sử và Địa lí", 8),
  ],
  9: [
    ["Lịch sử: thế giới 1918–1945", "nước Nga và Liên Xô; châu Âu, Mỹ, châu Á giữa hai cuộc chiến; Chiến tranh thế giới thứ hai"],
    ["Lịch sử: Việt Nam 1918–1945", "phong trào dân tộc; Nguyễn Ái Quốc; Đảng Cộng sản Việt Nam ra đời năm 1930; Cách mạng tháng Tám năm 1945"],
    ["Lịch sử: thế giới 1945 – nay", "Chiến tranh lạnh; Liên hợp quốc; châu Á, ASEAN; xu thế toàn cầu hóa; cách mạng khoa học – công nghệ"],
    ["Lịch sử: Việt Nam 1945 – nay", "kháng chiến chống Pháp 1946–1954, Điện Biên Phủ; kháng chiến chống Mỹ 1954–1975; thống nhất đất nước; công cuộc Đổi mới từ 1986"],
    ["Địa lí: dân cư và các ngành kinh tế Việt Nam", "dân tộc, dân số, phân bố dân cư; nông nghiệp, lâm nghiệp, thủy sản; công nghiệp; dịch vụ"],
    ["Địa lí: các vùng kinh tế", "Trung du và miền núi Bắc Bộ; Đồng bằng sông Hồng; Bắc Trung Bộ và Duyên hải Nam Trung Bộ; Tây Nguyên; Đông Nam Bộ; Đồng bằng sông Cửu Long; kinh tế biển"],
    TONG_HOP("Lịch sử và Địa lí", 9),
  ],
};

// ---------- Tin học (3–9) ----------

const TINHOC: Record<number, Raw> = {
  3: [
    ["Máy tính và em", "các bộ phận của máy tính (màn hình, bàn phím, chuột, thân máy); làm quen với chuột, bàn phím; tư thế ngồi đúng"],
    ["Thông tin và xử lí thông tin", "thông tin quanh em; xử lí thông tin; dữ liệu"],
    ["Mạng máy tính và Internet", "xem tin tức, giải trí trên Internet; thông tin phù hợp và không phù hợp với lứa tuổi"],
    ["Tổ chức lưu trữ và tìm kiếm", "sắp xếp để dễ tìm; sơ đồ hình cây; thư mục, tệp"],
    ["Đạo đức, pháp luật khi dùng máy tính", "bảo vệ thông tin cá nhân; sử dụng máy tính an toàn, đúng giờ"],
    ["Ứng dụng tin học", "luyện gõ bàn phím; làm quen với phần mềm trình chiếu"],
    ["Giải quyết vấn đề với máy tính", "thực hiện công việc theo các bước; công việc có điều kiện"],
    TONG_HOP("Tin học", 3),
  ],
  4: [
    ["Phần cứng và phần mềm", "phần cứng, phần mềm; các thiết bị vào, ra; sử dụng đúng cách"],
    ["Tìm kiếm thông tin trên Internet", "trang web, siêu liên kết; tìm kiếm thông tin bằng máy tìm kiếm"],
    ["Tổ chức và lưu trữ", "tạo, đổi tên, xóa thư mục, tệp; sao chép, di chuyển"],
    ["Bản quyền và đạo đức", "bản quyền phần mềm; không sử dụng phần mềm vi phạm bản quyền"],
    ["Soạn thảo văn bản và trình chiếu", "gõ tiếng Việt, định dạng văn bản; tạo bài trình chiếu, hiệu ứng"],
    ["Lập trình trực quan (Scratch)", "nhân vật, sân khấu; sự kiện; câu lệnh di chuyển, lặp"],
    TONG_HOP("Tin học", 4),
  ],
  5: [
    ["Máy tính trong đời sống", "những việc máy tính giúp con người; lợi ích và tác hại"],
    ["Tìm kiếm và chọn lọc thông tin", "tìm kiếm thông tin; đánh giá thông tin tìm được; thông tin đáng tin cậy"],
    ["Tổ chức lưu trữ, ứng xử trên mạng", "cây thư mục; ứng xử văn minh khi giao tiếp trên mạng"],
    ["Soạn thảo văn bản", "chèn bảng, hình ảnh; định dạng đoạn văn; sao chép, di chuyển văn bản"],
    ["Lập trình trực quan (Scratch)", "biến; cấu trúc rẽ nhánh (nếu... thì...); lặp có điều kiện; chương trình có nhiều nhân vật"],
    TONG_HOP("Tin học", 5),
  ],
  6: [
    ["Máy tính và cộng đồng", "thông tin và dữ liệu; xử lí thông tin; biểu diễn thông tin, bit, byte; đơn vị đo dung lượng"],
    ["Mạng máy tính và Internet", "mạng máy tính; Internet và lợi ích"],
    ["Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin", "World Wide Web, trình duyệt; máy tìm kiếm; thư điện tử"],
    ["Đạo đức, pháp luật và văn hóa số", "an toàn thông tin trên Internet; bảo vệ thông tin cá nhân; tác hại của bắt nạt trên mạng"],
    ["Ứng dụng tin học", "sơ đồ tư duy; soạn thảo văn bản: định dạng, bảng, tìm kiếm và thay thế"],
    ["Giải quyết vấn đề với máy tính", "thuật toán và mô tả thuật toán; cấu trúc tuần tự, rẽ nhánh, lặp"],
    TONG_HOP("Tin học", 6),
  ],
  7: [
    ["Máy tính và cộng đồng", "thiết bị vào ra; phần mềm máy tính; hệ điều hành; quản lí tệp và thư mục"],
    ["Mạng xã hội và giao tiếp trên mạng", "mạng xã hội; ứng xử có văn hóa; phòng tránh rủi ro"],
    ["Bảng tính điện tử", "ô, hàng, cột; nhập dữ liệu; công thức; hàm SUM, AVERAGE, MAX, MIN, COUNT; định dạng; in"],
    ["Phần mềm trình chiếu", "tạo bài trình chiếu có cấu trúc; hiệu ứng; trình bày thông tin"],
    ["Giải quyết vấn đề: tìm kiếm và sắp xếp", "thuật toán tìm kiếm tuần tự, tìm kiếm nhị phân; thuật toán sắp xếp nổi bọt, sắp xếp chọn"],
    TONG_HOP("Tin học", 7),
  ],
  8: [
    ["Lịch sử máy tính và thế giới số", "sơ lược lịch sử phát triển máy tính; thông tin trong môi trường số; độ tin cậy của thông tin"],
    ["Đạo đức, pháp luật và văn hóa số", "sử dụng công nghệ kĩ thuật số có đạo đức; bản quyền, quyền riêng tư"],
    ["Bảng tính nâng cao", "địa chỉ tương đối, tuyệt đối; sắp xếp, lọc dữ liệu; biểu đồ"],
    ["Soạn thảo và trình chiếu nâng cao", "danh sách, đầu trang, chân trang, đánh số trang; bố cục trang chiếu, bản mẫu"],
    ["Lập trình trực quan", "biến, kiểu dữ liệu, biểu thức; cấu trúc điều khiển rẽ nhánh, lặp; chương trình có cấu trúc"],
    TONG_HOP("Tin học", 8),
  ],
  9: [
    ["Thế giới kĩ thuật số", "vai trò của máy tính trong đời sống; thiết bị thông minh; khai thác thông tin số"],
    ["Tìm kiếm và đánh giá thông tin", "chiến lược tìm kiếm; đánh giá chất lượng thông tin trong giải quyết vấn đề"],
    ["Đạo đức, pháp luật và văn hóa số", "quyền riêng tư; tác động của công nghệ đối với môi trường; ứng xử trong môi trường số"],
    ["Bảng tính nâng cao", "hàm IF, COUNTIF, SUMIF; xác thực dữ liệu; xử lí dữ liệu thực tế"],
    ["Phần mềm mô phỏng và video", "phần mềm mô phỏng; biên tập video đơn giản"],
    ["Giải quyết vấn đề với sự trợ giúp của máy tính", "bài toán và thuật toán; các bước giải quyết vấn đề; ngôn ngữ lập trình bậc cao (Python cơ bản)"],
    TONG_HOP("Tin học", 9),
  ],
};

const build = (subject: string, map: Record<number, Raw>) =>
  Object.fromEntries(Object.entries(map).map(([g, raw]) => [`${g}|${subject}`, course(GDPT, raw)]));

export const MORE_COURSES: Record<string, Course> = {
  ...build("toan", TOAN),
  ...build("tiengviet", TIENGVIET),
  ...build("nguvan", NGUVAN),
  ...build("tienganh", TIENGANH),
  ...build("tnxh", TNXH),
  ...build("khoahoc", KHOAHOC),
  ...build("khtn", KHTN),
  ...build("lsdl", LSDL),
  ...build("tinhoc", TINHOC),
};
