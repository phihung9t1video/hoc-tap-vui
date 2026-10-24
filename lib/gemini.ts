import { SUBJECTS, findChapter, getCourse } from "./curriculum";
import { demoQuestions } from "./demo";
import type { Question, Subject } from "./types";
import { newId } from "./util";

class GeminiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"];
/** Một lần gọi quá thời gian này thì bỏ, chuyển model hoặc khóa khác */
const CALL_TIMEOUT_MS = 45000;

async function callGemini<T>(keys: string[], prompt: string, schema: object, temperature: number): Promise<T> {
  let lastErr: GeminiError | undefined;
  // Khóa đầu dùng chính; model hoặc khóa sau chỉ dùng khi cái trước hết lượt, quá chậm hoặc lỗi
  for (const key of keys) {
    for (const model of MODELS) {
      let res: Response;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature,
              responseMimeType: "application/json",
              responseSchema: schema,
              thinkingConfig: { thinkingLevel: "low" },
            },
          }),
        });
      } catch {
        lastErr = new GeminiError(504, `Model ${model} phản hồi quá chậm`);
        continue;
      }
      if (res.status === 401 || res.status === 403) {
        lastErr = new GeminiError(res.status, await res.text());
        break;
      }
      if (res.status === 404 || res.status === 429 || res.status >= 500) {
        lastErr = new GeminiError(res.status, `${model}: ${(await res.text()).slice(0, 300)}`);
        continue;
      }
      if (!res.ok) throw new GeminiError(res.status, await res.text());
      const data = await res.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
      if (!text) throw new GeminiError(502, "Gemini không trả về nội dung");
      return JSON.parse(text) as T;
    }
  }
  throw lastErr ?? new GeminiError(500, "Không gọi được Gemini");
}

const GEN_SCHEMA = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answerIndex: { type: "INTEGER" },
          explanation: { type: "STRING" },
          difficulty: { type: "STRING", enum: ["nhan_biet", "thong_hieu", "van_dung"] },
        },
        required: ["question", "options", "answerIndex", "explanation", "difficulty"],
      },
    },
  },
  required: ["questions"],
};

const VERIFY_SCHEMA = {
  type: "OBJECT",
  properties: {
    answers: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { questionNumber: { type: "INTEGER" }, answerIndex: { type: "INTEGER" } },
        required: ["questionNumber", "answerIndex"],
      },
    },
  },
  required: ["answers"],
};

function subjectRules(subject: Subject, grade: number) {
  const young = grade <= 2 ? ["Học sinh 6–7 tuổi: mỗi câu hỏi và phương án thật ngắn (dưới 15 từ), từ ngữ quen thuộc."] : [];
  switch (subject) {
    case "toan":
      return [
        ...young,
        "Viết biểu thức bằng ký hiệu thông thường, KHÔNG dùng LaTeX: dùng × cho phép nhân, : cho phép chia, phân số viết a/b, số mũ dùng ký tự ² ³, căn bậc hai dùng √, số thập phân dùng dấu phẩy (ví dụ 2,5), số âm dùng dấu −.",
        "Có cả câu tính toán và bài toán có lời văn gắn với đời sống.",
      ];
    case "tienganh":
      return [
        grade <= 5
          ? "Câu hỏi và phương án bằng tiếng Anh đơn giản; có thể thêm hướng dẫn ngắn bằng tiếng Việt ở đầu câu (ví dụ: 'Chọn từ đúng:')."
          : "Câu hỏi và phương án bằng tiếng Anh.",
        "Các dạng bài: chọn từ hoặc cụm từ đúng điền vào chỗ trống, chọn nghĩa của từ, chọn câu trả lời phù hợp cho câu hỏi, tìm từ khác loại, ngữ pháp của bài. Không có bài nghe, không cần tranh.",
        "Chỉ dùng từ vựng và cấu trúc thuộc chương trình đã học đến chủ đề này.",
      ];
    case "tiengviet":
    case "nguvan":
      return [
        ...young,
        "Viết bằng tiếng Việt chuẩn, đúng chính tả.",
        "Nếu cần ngữ liệu đọc hiểu, tự viết đoạn văn hoặc đoạn thơ ngắn (2–5 câu) ngay trong câu hỏi; chỉ trích tối đa 1–2 câu thơ, câu văn nổi tiếng quen thuộc trong sách giáo khoa và ghi rõ tác giả.",
        "Dạng bài: nhận biết từ loại, biện pháp tu từ, chính tả, dấu câu, nghĩa của từ, thành ngữ tục ngữ, đặc điểm thể loại, đọc hiểu đoạn ngắn.",
      ];
    case "tnxh":
    case "khoahoc":
    case "khtn":
      return [
        ...young,
        "Kiến thức khoa học phải chính xác tuyệt đối, phù hợp sách giáo khoa; ưu tiên câu hỏi gắn với hiện tượng trong đời sống.",
        grade >= 6 ? "Có thể có bài tính toán đơn giản; dùng đơn vị đo chuẩn (m, kg, s, N, J, W, V, A, °C), không dùng LaTeX." : "Không có tính toán phức tạp.",
      ];
    case "lsdl":
      return [
        "Mốc thời gian, nhân vật, sự kiện, số liệu địa lí phải chính xác theo sách giáo khoa Việt Nam; tránh chi tiết còn tranh cãi.",
        "Có cả câu về Lịch sử và câu về Địa lí nếu chủ đề bao gồm cả hai.",
      ];
    case "tinhoc":
      return [
        "Kiến thức tin học phổ thông, không phụ thuộc phiên bản phần mềm cụ thể; câu hỏi gắn với tình huống sử dụng máy tính thực tế.",
        "Câu hỏi về thuật toán có thể mô tả bằng các bước hoặc đoạn mã giả rất ngắn.",
      ];
  }
}

function buildPrompt(grade: number, subject: Subject, book: string, chapterName: string, topics: string, count: number, avoid: string[]) {
  const rules = [
    `Soạn đúng ${count} câu hỏi. Mỗi câu có đúng 4 phương án và CHỈ MỘT phương án đúng. Phương án sai phải hợp lý (lỗi sai học sinh hay mắc) nhưng chắc chắn sai.`,
    "answerIndex là vị trí phương án đúng, tính từ 0.",
    `Mức độ: khoảng 40% nhận biết, 40% thông hiểu, 20% vận dụng, phù hợp học sinh lớp ${grade}.`,
    grade <= 5 ? "Câu chữ ngắn gọn, dễ hiểu với trẻ 8–9 tuổi." : "Câu chữ rõ ràng, chính xác.",
    "Không ghi A, B, C, D trước phương án. Không dùng phương án kiểu 'Tất cả đều đúng' hay 'Cả A và B'.",
    "Không cần hình vẽ; nếu cần hình thì mô tả đầy đủ bằng lời.",
    ...subjectRules(subject, grade),
    "explanation: lời giải ngắn gọn từng bước bằng tiếng Việt, giọng thân thiện, khích lệ, tối đa 3 câu.",
    "Đề phải chính xác tuyệt đối. Tự giải lại từng câu để kiểm tra đáp án trước khi trả lời.",
  ];
  const avoidText = avoid.length ? `\n\nKhông lặp lại các câu đã có sau:\n${avoid.map((q) => `- ${q}`).join("\n")}` : "";
  return `Bạn là giáo viên giỏi ở Việt Nam, soạn câu hỏi trắc nghiệm cho học sinh LỚP ${grade}, môn ${SUBJECTS[subject].name}, theo Chương trình GDPT 2018, bộ sách "${book}".
Chủ đề: ${chapterName}
Nội dung trọng tâm: ${topics}

Yêu cầu:
${rules.map((r) => `- ${r}`).join("\n")}${avoidText}`;
}

interface RawQ {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: string;
}

function clean(q: RawQ): RawQ | null {
  const options = (q.options ?? []).map((o) => String(o).replace(/^\s*[A-Da-d][.):]\s+/, "").trim());
  if (!q.question?.trim() || options.length !== 4 || options.some((o) => !o)) return null;
  if (new Set(options.map((o) => o.toLowerCase())).size !== 4) return null;
  if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3) return null;
  return { ...q, question: q.question.trim(), options };
}

export function shuffleOptions(q: Question): Question {
  const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  return { ...q, options: order.map((i) => q.options[i]), answerIndex: order.indexOf(q.answerIndex) };
}

/** Cho AI tự giải lại đề (không biết đáp án), chỉ giữ những câu hai lần khớp nhau. */
async function verify(keys: string[], qs: RawQ[], grade: number, subjectName: string): Promise<boolean[] | null> {
  const list = qs
    .map((q, i) => `Câu ${i + 1}: ${q.question}\n${q.options.map((o, j) => `  ${j}) ${o}`).join("\n")}`)
    .join("\n\n");
  const prompt = `Bạn là giáo viên kiểm tra đề. Hãy tự giải cẩn thận từng câu trắc nghiệm sau (học sinh lớp ${grade}, môn ${subjectName}) và cho biết chỉ số phương án đúng (0 là phương án đầu tiên, 3 là phương án cuối). Nếu câu sai đề, có nhiều hơn một đáp án đúng hoặc không có đáp án đúng thì trả về -1.\n\n${list}`;
  try {
    const res = await callGemini<{ answers: { questionNumber: number; answerIndex: number }[] }>(keys, prompt, VERIFY_SCHEMA, 0);
    const map = new Map(res.answers.map((a) => [a.questionNumber, a.answerIndex]));
    return qs.map((q, i) => map.get(i + 1) === q.answerIndex);
  } catch {
    return null;
  }
}

export interface GenerateResult {
  questions?: Question[];
  demo?: boolean;
  error?: string;
}

/** Soạn đề bằng Gemini, gọi thẳng từ máy với khóa bố mẹ đã nhập. Không có khóa thì trả đề mẫu. */
export async function generateQuestions(
  keys: string[],
  req: { grade: number; subject: Subject; chapterId: string; count: number; avoid: string[] },
): Promise<GenerateResult> {
  const course = getCourse(req.grade, req.subject);
  const chapter = findChapter(req.grade, req.subject, req.chapterId);
  if (!course || !chapter) return { error: "Không tìm thấy lớp, môn hoặc chương này." };
  if (!keys.length) {
    const demo = demoQuestions(req.grade, req.subject).map(shuffleOptions);
    return demo.length ? { questions: demo, demo: true } : { error: "Môn này chưa có đề mẫu. Bố mẹ vào Cài đặt nhập khóa Gemini để AI soạn đề nhé!" };
  }

  try {
    const prompt = buildPrompt(req.grade, req.subject, course.book, chapter.name, chapter.topics, req.count, req.avoid.slice(-40));
    const gen = await callGemini<{ questions: RawQ[] }>(keys, prompt, GEN_SCHEMA, 1);
    const raw = (gen.questions ?? []).map(clean).filter((q): q is RawQ => q !== null);
    if (!raw.length) throw new GeminiError(502, "AI trả về đề không hợp lệ");

    const checks = await verify(keys, raw, req.grade, SUBJECTS[req.subject].name);
    const questions = raw
      .filter((_, i) => (checks ? checks[i] : true))
      .map((q) => shuffleOptions({ ...q, id: newId(), verified: checks !== null }));
    return { questions };
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 0;
    console.error("[gemini]", status, e instanceof Error ? e.message.slice(0, 300) : e);
    if (status === 429) return { error: "AI đang nghỉ một chút vì đã dùng hết lượt miễn phí. Con đợi khoảng 1 phút rồi thử lại nhé!" };
    if (status === 400 || status === 401 || status === 403) return { error: "Khóa Gemini chưa đúng. Bố mẹ vào Cài đặt để kiểm tra lại khóa nhé." };
    if (status === 0) return { error: "Không kết nối được mạng. Con kiểm tra wifi rồi thử lại nhé." };
    return { error: "Chưa soạn được đề, con thử lại sau một lát nhé." };
  }
}

/** Kiểm tra một khóa Gemini có dùng được không. */
export async function checkKey(key: string): Promise<boolean> {
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1", {
      headers: { "x-goog-api-key": key },
      signal: AbortSignal.timeout(15000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Lấy các khóa Gemini trong đoạn bố mẹ dán vào (chấp nhận cả dạng "KEY 1: AIza..." mỗi dòng một khóa). */
export function parseKeys(text: string): string[] {
  return [...new Set(text.match(/AIza[0-9A-Za-z_-]{30,}|AQ\.[0-9A-Za-z_.-]{30,}/g) ?? [])];
}
