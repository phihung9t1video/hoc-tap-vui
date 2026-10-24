import type { HomeState } from "./home";

export type Subject = "toan" | "tiengviet" | "nguvan" | "tienganh" | "tnxh" | "khoahoc" | "khtn" | "lsdl" | "tinhoc";
export type Gender = "nam" | "nu";

export type Slot =
  | "skin"
  | "hairColor"
  | "hair"
  | "eyes"
  | "mouth"
  | "shirt"
  | "pants"
  | "shoes"
  | "glasses"
  | "hat"
  | "back"
  | "pet"
  | "petAcc"
  | "petToy"
  | "petHome";

export type Look = Record<Slot, string>;

export interface Question {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: string;
  verified: boolean;
  reported?: boolean;
}

/** Câu hỏi trong một lượt làm bài, kèm khóa ngân hàng để biết nó thuộc chương nào. */
export interface QuizItem extends Question {
  bankKey: string;
}

export interface AnswerLog {
  qid: string;
  bankKey: string;
  correct: boolean;
  ms: number;
  seenBefore: boolean;
}

export interface QuizRecord {
  at: number;
  subject: Subject;
  chapterId: string;
  correct: number;
  total: number;
  coins: number;
  perfect: boolean;
}

export interface Profile {
  id: string;
  name: string;
  grade: number;
  gender: Gender;
  look: Look;
  coins: number;
  owned: string[];
  /** id câu hỏi -> đã từng làm */
  seen: Record<string, true>;
  /** id câu hỏi làm sai -> khóa ngân hàng */
  wrong: Record<string, string>;
  history: QuizRecord[];
  achievements: string[];
  streak: number;
  bestStreak: number;
  lastDay: string;
  earnedDay: string;
  earnedToday: number;
  createdAt: number;
  /** Ngôi nhà của con (đồ đã đặt, giấy dán tường, sàn) */
  home?: HomeState;
}

export interface Settings {
  /** Số xu tối đa kiếm được mỗi ngày từ làm bài */
  dailyCap: number;
  /** Khóa Gemini bố mẹ nhập, chỉ lưu trên máy này. Khóa đầu là khóa chính. */
  geminiKeys?: string[];
  /** Đã qua màn hình cài đặt lần đầu */
  setupDone?: boolean;
  /** Máy của bố mẹ: nhận bản thử nghiệm trước khi duyệt cho các con */
  betaChannel?: boolean;
}

export interface AppData {
  profiles: Profile[];
  currentId?: string;
  settings: Settings;
}
