// Dữ liệu Tiếng Việt lớp 3–5: từ loại, thành phần câu, biện pháp tu từ, thành ngữ, đọc hiểu.

// ---------- Danh từ, động từ, tính từ ----------
export const DANH_TU_CHUNG = ["học sinh", "sông", "thành phố", "con mèo", "quyển sách", "ngọn núi", "cây lúa", "bác sĩ", "trường học", "bầu trời", "cơn mưa", "tình bạn", "niềm vui", "lòng dũng cảm", "nỗi buồn", "kỉ niệm", "giấc mơ", "con đường"];
export const DANH_TU_RIENG = ["Hà Nội", "sông Hồng", "Lê Lợi", "Việt Nam", "núi Bà Đen", "Trần Hưng Đạo", "Đà Nẵng", "hồ Gươm", "Phú Quốc", "Hạ Long", "Nguyễn Trãi", "Cần Thơ", "Trường Sơn", "Huế"];
export const DONG_TU = ["chạy", "học", "suy nghĩ", "mơ ước", "đọc", "viết", "trồng", "xây", "bay", "lắng nghe", "yêu thương", "giúp đỡ", "hát", "nhảy", "chơi", "ngủ", "đi", "nói", "nhớ", "hi vọng"];
export const TINH_TU = ["xanh biếc", "cao lớn", "thông minh", "hiền lành", "nhanh nhẹn", "ngọt ngào", "rực rỡ", "yên tĩnh", "mềm mại", "chăm chỉ", "dũng cảm", "trong xanh", "ấm áp", "lấp lánh", "tươi tốt", "khéo léo", "thật thà", "sừng sững"];

// ---------- Chủ ngữ – vị ngữ, trạng ngữ ----------
export const CN_VN = [["Những chú chim sẻ", "đang ríu rít trên cành cây"], ["Cô giáo của em", "rất hiền và dịu dàng"], ["Dòng sông quê em", "uốn lượn quanh làng"], ["Đàn trâu", "thung thăng gặm cỏ"], ["Bạn Minh", "là lớp trưởng lớp em"], ["Mặt trời", "đỏ rực như quả cầu lửa"], ["Các bạn học sinh", "đang tập thể dục giữa giờ"], ["Cánh đồng lúa chín", "vàng óng ả"], ["Chiếc xe đạp của em", "đã cũ nhưng vẫn chạy tốt"], ["Ông nội em", "thường dậy sớm tưới cây"], ["Những bông hoa phượng", "nở đỏ rực cả sân trường"], ["Tiếng ve", "râm ran khắp các vòm cây"]];
export const TRANG_NGU = [["Sáng sớm", "chim hót líu lo", "thời gian"], ["Trên cành cây", "đàn chim ríu rít", "nơi chốn"], ["Vì trời mưa to", "chúng em nghỉ tập thể dục", "nguyên nhân"], ["Để đạt điểm cao", "Lan chăm chỉ ôn bài", "mục đích"], ["Ngoài sân trường", "các bạn đang chơi đá cầu", "nơi chốn"], ["Mùa xuân", "cây cối đâm chồi nảy lộc", "thời gian"], ["Nhờ chăm chỉ luyện tập", "Nam đã bơi giỏi", "nguyên nhân"], ["Trong vườn", "hoa hồng nở rộ", "nơi chốn"], ["Tối qua", "cả nhà em xem phim", "thời gian"], ["Để giữ gìn sức khỏe", "em tập thể dục mỗi sáng", "mục đích"], ["Dưới gốc đa", "các cụ già ngồi trò chuyện", "nơi chốn"], ["Vì mải chơi", "Tí bị lỡ chuyến xe buýt", "nguyên nhân"]];

// ---------- Biện pháp tu từ ----------
export const NHAN_HOA = ["Ông mặt trời thức dậy, vươn vai chào ngày mới.", "Chị gió đùa nghịch với những tán lá.", "Bác chổi tre chăm chỉ quét sạch sân nhà.", "Cây bàng giang tay che mát cho chúng em.", "Những chú gà con líu ríu gọi mẹ.", "Cô mây trắng thong thả dạo chơi trên bầu trời.", "Dòng sông mặc áo xanh hiền hòa.", "Chú mèo mướp nằm lim dim mơ màng.", "Anh đom đóm lên đèn đi gác.", "Bông hoa hướng dương mỉm cười với nắng."];
export const SO_SANH = ["Mặt trời đỏ như quả cầu lửa.", "Trăng tròn như cái đĩa bạc.", "Đôi mắt em bé tròn như hai hòn bi.", "Tiếng suối trong như tiếng hát xa.", "Cánh đồng lúa như một tấm thảm vàng.", "Lá bàng đỏ như ngọn lửa.", "Mái tóc bà trắng như cước.", "Công cha như núi Thái Sơn."];
export const CAU_THUONG = ["Mẹ em đang nấu cơm trong bếp.", "Hôm nay trời mưa to.", "Em đi học lúc bảy giờ.", "Cây bàng ở sân trường rất cao.", "Bố em làm việc ở nhà máy.", "Lớp em có ba mươi lăm bạn."];

// ---------- Thành ngữ, tục ngữ: [câu, nghĩa đúng, nghĩa sai] ----------
export const THANH_NGU = [
  ["Ăn quả nhớ kẻ trồng cây", "Biết ơn người đã tạo ra thành quả cho mình", ["Phải trồng nhiều cây", "Ăn quả phải rửa sạch", "Chỉ ăn quả nhà mình"]],
  ["Uống nước nhớ nguồn", "Biết ơn cội nguồn, người đi trước", ["Phải uống nhiều nước", "Nước suối rất sạch", "Tiết kiệm nước"]],
  ["Có công mài sắt, có ngày nên kim", "Kiên trì, nhẫn nại thì sẽ thành công", ["Nghề rèn rất vất vả", "Sắt quý hơn kim", "Làm việc phải nhanh"]],
  ["Lá lành đùm lá rách", "Giúp đỡ, đùm bọc người gặp khó khăn", ["Lá cây hay bị rách", "Phải giữ gìn quần áo", "Lá non tốt hơn lá già"]],
  ["Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao", "Đoàn kết tạo nên sức mạnh", ["Trồng cây trên núi", "Núi cao hơn cây", "Một mình làm tốt hơn"]],
  ["Đi một ngày đàng, học một sàng khôn", "Đi nhiều nơi giúp ta học hỏi được nhiều điều", ["Đi bộ rất mệt", "Chỉ nên ở nhà học", "Học phải dùng cái sàng"]],
  ["Thương người như thể thương thân", "Yêu thương người khác như yêu thương chính mình", ["Chỉ thương bản thân", "Không cần giúp ai", "Thương người thì thiệt"]],
  ["Gần mực thì đen, gần đèn thì rạng", "Gần người tốt học điều tốt, gần người xấu dễ nhiễm thói xấu", ["Mực làm bẩn tay", "Đèn sáng hơn mực", "Nên mua đèn và mực"]],
  ["Chị ngã em nâng", "Anh chị em giúp đỡ nhau khi khó khăn", ["Chị hay bị ngã", "Em khỏe hơn chị", "Không nên chạy nhảy"]],
  ["Tốt gỗ hơn tốt nước sơn", "Phẩm chất bên trong quan trọng hơn vẻ ngoài", ["Gỗ đắt hơn sơn", "Nên sơn đồ gỗ", "Vẻ ngoài là quan trọng nhất"]],
  ["Học thầy không tày học bạn", "Học hỏi từ bạn bè cũng rất quan trọng", ["Không cần học thầy", "Bạn giỏi hơn thầy", "Chỉ nên học một mình"]],
  ["Nước chảy đá mòn", "Kiên trì bền bỉ thì việc khó cũng làm được", ["Đá rất cứng", "Nước chảy rất nhanh", "Không nên đứng gần suối"]],
  ["Chậm như rùa", "Rất chậm chạp", ["Rất nhanh nhẹn", "Rất khỏe mạnh", "Sống rất lâu"]],
  ["Khỏe như voi", "Rất khỏe", ["Rất to béo", "Rất chậm", "Ăn rất nhiều"]],
  ["Hiền như bụt", "Rất hiền lành", ["Rất nghiêm khắc", "Rất giàu có", "Rất thông minh"]],
  ["Nhanh như cắt", "Rất nhanh", ["Rất sắc", "Rất chậm", "Rất cẩn thận"]],
  ["Ở hiền gặp lành", "Sống tốt sẽ gặp điều tốt", ["Hiền thì bị bắt nạt", "Phải ở một mình", "Lành thì phải ăn kiêng"]],
  ["Tiên học lễ, hậu học văn", "Trước hết học lễ phép, đạo đức rồi mới học kiến thức", ["Chỉ cần học văn", "Học văn trước, học lễ sau", "Không cần lễ phép"]],
  ["Một con ngựa đau, cả tàu bỏ cỏ", "Thương xót, đồng cảm khi người cùng tập thể gặp nạn", ["Ngựa không thích ăn cỏ", "Phải chăm sóc ngựa", "Cỏ không ngon"]],
  ["Ăn vóc học hay", "Ăn uống để khỏe, học tập để giỏi", ["Ăn nhiều thì học giỏi", "Chỉ cần ăn no", "Học xong mới được ăn"]],
];

// ---------- Dấu câu lớp 4 ----------
export const DAU_CAU_4 = [
  ["Dấu gạch ngang trong câu sau dùng để làm gì? – Con đi học đi! – Mẹ dặn.", "Đánh dấu chỗ bắt đầu lời nói của nhân vật", ["Nối các từ trong liên danh", "Đánh dấu phần chú thích", "Kết thúc câu"], "Gạch ngang đầu dòng đánh dấu lời nói nhân vật trong đối thoại."],
  ["Dấu gạch ngang trong 'chuyến tàu Hà Nội – Lào Cai' dùng để:", "Nối các từ ngữ trong một liên danh", ["Đánh dấu lời nói", "Đánh dấu phần chú thích", "Liệt kê"], "Gạch ngang nối Hà Nội và Lào Cai thành một tuyến."],
  ["Dấu ngoặc kép trong câu: Bác dạy: \"Học, học nữa, học mãi.\" dùng để:", "Đánh dấu lời nói trực tiếp", ["Đánh dấu tên riêng", "Kết thúc câu", "Đánh dấu từ dùng với nghĩa đặc biệt"], "Ngoặc kép dẫn lời nói trực tiếp của Bác."],
  ["Dấu hai chấm trong câu: Vườn nhà em có nhiều loại cây: cam, bưởi, nhãn. dùng để:", "Báo hiệu phần liệt kê", ["Báo hiệu lời nói", "Kết thúc câu", "Nối hai từ"], "Sau dấu hai chấm là các loại cây được liệt kê."],
  ["Dấu hai chấm trong câu: Mẹ bảo: \"Con nhớ mang áo mưa.\" dùng để:", "Báo hiệu lời nói của nhân vật", ["Báo hiệu phần liệt kê", "Nối các vế câu", "Kết thúc câu"], "Hai chấm dẫn tới lời nói của mẹ."],
  ["Dấu ngoặc đơn trong câu: Hà Nội (thủ đô của Việt Nam) có nhiều hồ đẹp. dùng để:", "Đánh dấu phần chú thích", ["Đánh dấu lời nói", "Nối liên danh", "Liệt kê"], "Phần trong ngoặc đơn giải thích thêm cho Hà Nội."],
  ["Câu nào dùng dấu gạch ngang để đánh dấu các ý liệt kê?", "Em cần chuẩn bị: – sách vở; – bút thước; – áo mưa.", ["– Chào cô ạ! – Lan nói.", "Tuyến xe Hà Nội – Hải Phòng.", "Bạn ấy (lớp trưởng) rất giỏi."], "Mỗi ý liệt kê bắt đầu bằng gạch ngang."],
  ["Câu khiến thường kết thúc bằng dấu:", "Dấu chấm than hoặc dấu chấm", ["Dấu chấm hỏi", "Dấu phẩy", "Dấu hai chấm"], "Câu khiến (yêu cầu, đề nghị) kết thúc bằng dấu chấm than hoặc dấu chấm."],
];

// ---------- Đọc hiểu lớp 4 ----------
export const DOC_HIEU_4 = [
  { text: "Hồi nhỏ, Lương Thế Vinh rất ham học và thông minh. Một lần chơi đùa, quả bưởi của các bạn lăn xuống hố sâu. Ai cũng loay hoay không lấy được. Vinh bảo các bạn đổ nước vào hố. Nước dâng lên, quả bưởi nổi lên miệng hố. Các bạn reo hò thán phục.", qs: [
    ["Quả bưởi bị rơi vào đâu?", "Một cái hố sâu", ["Ao nước", "Bụi cây", "Giếng nước"], "Quả bưởi lăn xuống hố sâu."],
    ["Lương Thế Vinh nghĩ ra cách gì?", "Đổ nước vào hố cho bưởi nổi lên", ["Trèo xuống hố", "Dùng gậy khều", "Đào hố rộng ra"], "Đổ nước cho bưởi nổi lên."],
    ["Vì sao cách đó lấy được quả bưởi?", "Vì quả bưởi nổi trên mặt nước", ["Vì nước làm vỡ hố", "Vì quả bưởi chìm xuống", "Vì có người kéo lên"], "Bưởi nổi trên nước nên nước dâng thì bưởi lên theo."],
    ["Câu chuyện ca ngợi Lương Thế Vinh điều gì?", "Thông minh, sáng tạo từ nhỏ", ["Khỏe mạnh", "Giàu có", "Nghịch ngợm"], "Vinh thông minh, nhanh trí."],
    ["Từ 'thán phục' có nghĩa là:", "Khen ngợi và phục tài", ["Buồn bã", "Ghen tị", "Sợ hãi"], "Thán phục = khen ngợi, kính phục."],
  ] },
  { text: "Trên đường đi học về, Hùng nhặt được một chiếc ví. Trong ví có tiền và giấy tờ. Hùng mang chiếc ví đến đồn công an gần nhất. Hôm sau, người mất ví đến tận trường cảm ơn Hùng. Cô giáo khen Hùng trước lớp.", qs: [
    ["Hùng nhặt được gì?", "Một chiếc ví có tiền và giấy tờ", ["Một quyển sách", "Một con chó con", "Một chiếc đồng hồ"], "Hùng nhặt được chiếc ví."],
    ["Hùng đã làm gì với chiếc ví?", "Mang đến đồn công an", ["Giữ làm của riêng", "Vứt đi", "Mua quà bằng tiền trong ví"], "Hùng mang ví đến đồn công an."],
    ["Việc làm của Hùng thể hiện đức tính gì?", "Thật thà, trung thực", ["Lười biếng", "Tham lam", "Nhút nhát"], "Trả lại của rơi là trung thực."],
    ["Ai đến trường cảm ơn Hùng?", "Người mất ví", ["Chú công an", "Bố mẹ Hùng", "Bạn của Hùng"], "Người mất ví đến cảm ơn."],
    ["Trong câu 'Hùng mang chiếc ví đến đồn công an gần nhất.', chủ ngữ là:", "Hùng", ["chiếc ví", "đồn công an", "mang chiếc ví"], "Ai mang ví? → Hùng."],
  ] },
  { text: "Rừng Trường Sơn mùa xuân thật đẹp. Hoa ban trắng nở khắp sườn núi. Những dòng suối róc rách chảy qua khe đá. Tiếng chim hót vang cả cánh rừng. Các anh bộ đội hành quân, lòng rộn ràng niềm vui.", qs: [
    ["Bài văn tả cảnh ở đâu?", "Rừng Trường Sơn", ["Biển Hạ Long", "Đồng bằng Nam Bộ", "Phố cổ Hội An"], "Câu đầu: Rừng Trường Sơn mùa xuân."],
    ["Hoa ban màu gì?", "Trắng", ["Đỏ", "Vàng", "Tím"], "Hoa ban trắng nở khắp sườn núi."],
    ["Từ 'róc rách' gợi tả:", "Âm thanh của suối chảy", ["Màu của nước", "Hình dáng con suối", "Tiếng chim"], "Róc rách tả tiếng nước chảy."],
    ["Từ 'Trường Sơn' là:", "Danh từ riêng", ["Danh từ chung", "Động từ", "Tính từ"], "Tên riêng của dãy núi nên viết hoa, là danh từ riêng."],
    ["Từ 'rộn ràng' là từ loại gì?", "Tính từ", ["Danh từ", "Động từ", "Đại từ"], "Rộn ràng tả trạng thái, đặc điểm: tính từ."],
  ] },
  { text: "Ngày xưa, có một cậu bé chăn cừu hay nói dối. Cậu hét lên \"Sói! Sói!\" để mọi người chạy đến rồi cười vang. Lần thứ ba, sói đến thật. Cậu kêu cứu nhưng không ai tin nữa. Đàn cừu bị sói ăn thịt.", qs: [
    ["Cậu bé chăn cừu có tật xấu gì?", "Hay nói dối", ["Hay ngủ quên", "Lười chăn cừu", "Hay đánh nhau"], "Cậu bé hay nói dối."],
    ["Vì sao lần cuối không ai đến giúp?", "Vì mọi người không còn tin cậu", ["Vì mọi người đi vắng", "Vì sói quá to", "Vì cậu không kêu"], "Nói dối nhiều lần nên mất lòng tin."],
    ["Câu chuyện khuyên em điều gì?", "Không nên nói dối", ["Không nên chăn cừu", "Phải chạy thật nhanh", "Nên nuôi chó"], "Nói dối sẽ mất lòng tin của mọi người."],
    ["Câu chuyện thuộc thể loại:", "Truyện ngụ ngôn", ["Truyện lịch sử", "Bài thơ", "Văn miêu tả"], "Truyện ngắn mượn chuyện để khuyên răn một bài học."],
  ] },
  { text: "Bác Hồ rất yêu thiếu nhi. Mỗi dịp Tết Trung thu, Bác thường viết thư gửi các cháu. Bác khuyên các cháu: \"Yêu Tổ quốc, yêu đồng bào, học tập tốt, lao động tốt\". Thiếu nhi cả nước luôn ghi nhớ lời dạy của Bác.", qs: [
    ["Bác Hồ thường viết thư cho thiếu nhi vào dịp nào?", "Tết Trung thu", ["Tết Nguyên đán", "Ngày khai trường", "Ngày sinh nhật Bác"], "Mỗi dịp Tết Trung thu, Bác viết thư."],
    ["Lời khuyên của Bác trong bài gồm mấy điều?", "Bốn điều", ["Hai điều", "Năm điều", "Ba điều"], "Yêu Tổ quốc, yêu đồng bào, học tập tốt, lao động tốt."],
    ["Dấu ngoặc kép trong bài dùng để:", "Đánh dấu lời nói được dẫn trực tiếp của Bác", ["Đánh dấu tên riêng", "Kết thúc câu", "Liệt kê sự vật"], "Ngoặc kép dẫn lời nói trực tiếp."],
    ["Từ 'đồng bào' nghĩa là:", "Người cùng một nước, cùng giống nòi", ["Bạn cùng lớp", "Người trong gia đình", "Người nước ngoài"], "Đồng bào = những người cùng nòi giống, cùng đất nước."],
  ] },
  { text: "Mỗi buổi sáng, chợ quê lại họp dưới gốc đa đầu làng. Các bà, các chị gánh rau xanh, trứng gà, cá tươi ra chợ. Tiếng mời chào, tiếng cười nói rộn rã cả một góc làng. Đến trưa, chợ vãn, chỉ còn mấy chú chim sẻ nhặt hạt thóc rơi.", qs: [
    ["Chợ quê họp ở đâu?", "Dưới gốc đa đầu làng", ["Trong sân đình", "Bên bờ sông", "Giữa cánh đồng"], "Chợ họp dưới gốc đa đầu làng."],
    ["Người ta mang những gì ra chợ?", "Rau xanh, trứng gà, cá tươi", ["Quần áo, giày dép", "Sách vở, bút thước", "Bàn ghế, tủ giường"], "Câu thứ hai liệt kê rau, trứng, cá."],
    ["Từ 'rộn rã' gợi tả điều gì?", "Âm thanh vui vẻ, náo nhiệt", ["Cảnh vắng lặng", "Màu sắc tươi sáng", "Mùi thơm"], "Rộn rã tả âm thanh vui, nhộn nhịp."],
    ["Khi chợ vãn, cảnh vật thế nào?", "Vắng vẻ, chỉ còn chim sẻ nhặt thóc", ["Đông vui hơn", "Có mưa to", "Mọi người mới đến"], "Chợ vãn: chỉ còn chim sẻ."],
    ["Trạng ngữ trong câu 'Đến trưa, chợ vãn.' chỉ:", "Thời gian", ["Nơi chốn", "Nguyên nhân", "Mục đích"], "Đến trưa trả lời câu hỏi Khi nào?"],
  ] },
];

// ---------- Lớp 3: so sánh [câu, từ so sánh, sự vật 1, sự vật 2] ----------
export const SO_SANH_3 = [
  ["Trẻ em như búp trên cành.", "như", "Trẻ em", "búp trên cành"],
  ["Mặt trời đỏ như quả cầu lửa.", "như", "Mặt trời", "quả cầu lửa"],
  ["Ông trăng tròn như cái đĩa.", "như", "Ông trăng", "cái đĩa"],
  ["Cô giáo em hiền như mẹ.", "như", "Cô giáo", "mẹ"],
  ["Tiếng mưa rơi lộp độp tựa tiếng trống.", "tựa", "Tiếng mưa", "tiếng trống"],
  ["Những ngôi sao lấp lánh giống như những ngọn đèn.", "giống như", "Những ngôi sao", "những ngọn đèn"],
  ["Mắt bé tròn như hai hạt nhãn.", "như", "Mắt bé", "hai hạt nhãn"],
  ["Quê hương là chùm khế ngọt.", "là", "Quê hương", "chùm khế ngọt"],
  ["Cánh diều như con chim bay lượn.", "như", "Cánh diều", "con chim"],
  ["Lá cờ đỏ thắm như máu.", "như", "Lá cờ", "máu"],
  ["Bạn Lan cao hơn bạn Hoa.", "hơn", "Bạn Lan", "bạn Hoa"],
  ["Sân trường rộng như một cánh đồng.", "như", "Sân trường", "một cánh đồng"],
  ["Hoa mai vàng rực như nắng.", "như", "Hoa mai", "nắng"],
  ["Tiếng chim hót trong veo như tiếng sáo.", "như", "Tiếng chim hót", "tiếng sáo"],
];

// ---------- Lớp 3, 4: câu kể, câu hỏi, câu cảm, câu khiến ----------
export const KIEU_CAU = [
  ["Bạn có thích đọc truyện không?", "Câu hỏi"], ["Vì sao trời lại mưa?", "Câu hỏi"], ["Ai là lớp trưởng lớp mình?", "Câu hỏi"], ["Khi nào chúng ta được nghỉ hè?", "Câu hỏi"],
  ["Ôi, cảnh biển đẹp quá!", "Câu cảm"], ["Chà, bạn giỏi thật!", "Câu cảm"], ["Trời ơi, con mèo đáng yêu quá!", "Câu cảm"], ["A, mẹ đã về!", "Câu cảm"],
  ["Em hãy đóng cửa sổ lại!", "Câu khiến"], ["Các con đi ngủ sớm nhé!", "Câu khiến"], ["Bạn cho mình mượn cái bút nhé!", "Câu khiến"], ["Đừng vứt rác ra sân trường!", "Câu khiến"],
  ["Em là học sinh lớp Ba.", "Câu kể"], ["Hôm nay trời nắng đẹp.", "Câu kể"], ["Mẹ em đang nấu cơm.", "Câu kể"], ["Con mèo nằm ngủ dưới hiên nhà.", "Câu kể"],
];
