import type { Question } from "./types";

type Raw = [string, string[], number, string];

/** Câu hỏi mẫu dùng khi chưa cài khóa Gemini, để thử giao diện. */
const DEMO: Record<string, Raw[]> = {
  "3|toan": [
    ["7 × 8 = ?", ["54", "56", "63", "48"], 1, "Bảng nhân 7: 7 × 8 = 56."],
    ["72 : 9 = ?", ["7", "8", "9", "6"], 1, "Vì 9 × 8 = 72 nên 72 : 9 = 8."],
    ["Số liền sau của 999 là số nào?", ["1000", "998", "1001", "990"], 0, "Số liền sau thì thêm 1: 999 + 1 = 1000."],
    ["Một hình vuông có cạnh 5 cm. Chu vi hình vuông đó là bao nhiêu?", ["20 cm", "25 cm", "10 cm", "15 cm"], 0, "Chu vi hình vuông = cạnh × 4 = 5 × 4 = 20 (cm)."],
    ["Mẹ có 24 quả cam, chia đều vào 4 đĩa. Mỗi đĩa có mấy quả cam?", ["6 quả", "5 quả", "8 quả", "4 quả"], 0, "24 : 4 = 6. Mỗi đĩa có 6 quả cam."],
  ],
  "7|toan": [
    ["Kết quả của phép tính (−2/3) + 1/3 là:", ["−1/3", "1/3", "−1", "1"], 0, "(−2/3) + 1/3 = (−2 + 1)/3 = −1/3."],
    ["√49 bằng:", ["7", "14", "49", "24,5"], 0, "Căn bậc hai số học của 49 là 7 vì 7² = 49 và 7 > 0."],
    ["Hai góc đối đỉnh thì:", ["bằng nhau", "bù nhau", "phụ nhau", "kề nhau"], 0, "Tính chất: hai góc đối đỉnh thì bằng nhau."],
    ["Tìm x, biết x/4 = 3/2.", ["x = 6", "x = 8", "x = 3", "x = 12"], 0, "x = 4 × 3/2 = 6."],
    ["Bậc của đa thức 3x³ − 2x + 5 là:", ["3", "2", "1", "5"], 0, "Số mũ lớn nhất của x là 3 nên đa thức có bậc 3."],
  ],
  "3|tienganh": [
    ["Hello! My name ___ Nam.", ["is", "am", "are", "be"], 0, "Đi với 'My name' (số ít) ta dùng 'is'."],
    ["Chọn từ chỉ màu sắc:", ["red", "pen", "cat", "run"], 0, "'red' nghĩa là màu đỏ."],
    ["How old are you? – I'm ___.", ["eight years old", "fine", "Nam", "a student"], 0, "Hỏi tuổi thì trả lời bằng số tuổi: I'm eight years old."],
    ["Từ nào là đồ dùng học tập?", ["ruler", "apple", "dog", "kite"], 0, "'ruler' là cái thước kẻ."],
    ["This is my ___. She is a teacher.", ["mother", "father", "brother", "grandfather"], 0, "'She' chỉ người nữ nên chọn 'mother' (mẹ)."],
  ],
  "7|tienganh": [
    ["My brother enjoys ___ models.", ["making", "make", "to makes", "made"], 0, "Sau 'enjoy' dùng V-ing: enjoys making."],
    ["How often do you go swimming? – ___ a week.", ["Twice", "Two", "Second", "Double"], 0, "'Twice a week' = hai lần một tuần."],
    ["We ___ to Hue last summer.", ["went", "go", "goes", "going"], 0, "'last summer' là dấu hiệu thì quá khứ đơn: go → went."],
    ["You ___ eat too much fast food. It's not good for your health.", ["shouldn't", "should", "must", "can"], 0, "Lời khuyên không nên làm gì: shouldn't."],
    ["There ___ a lot of traffic in this city.", ["is", "are", "be", "were"], 0, "'traffic' là danh từ không đếm được nên dùng 'is'."],
  ],
};

export function demoQuestions(grade: number, subject: string): Question[] {
  return (DEMO[`${grade}|${subject}`] ?? []).map(([question, options, answerIndex, explanation], i) => ({
    id: `demo-${grade}-${subject}-${i}`,
    question,
    options,
    answerIndex,
    explanation,
    difficulty: "thong_hieu",
    verified: true,
  }));
}
