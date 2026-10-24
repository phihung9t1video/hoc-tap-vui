import type { AppData, Question } from "./types";

const DATA_KEY = "hoctap_data_v1";
const BANK_KEY = "hoctap_bank_v1";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Bộ nhớ trình duyệt đầy hoặc bị chặn: bỏ qua, app vẫn chạy trong phiên này
  }
}

export const loadData = (): AppData => loadJSON<AppData>(DATA_KEY, { profiles: [], settings: { dailyCap: 400 } });
export const saveData = (d: AppData) => saveJSON(DATA_KEY, d);

// ---------- Ngân hàng câu hỏi (dùng chung cho các con cùng lớp) ----------

type Bank = Record<string, Question[]>;

const getBank = () => loadJSON<Bank>(BANK_KEY, {});
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export const bankKey = (grade: number, subject: string, chapterId: string) => `${grade}|${subject}|${chapterId}`;

export function getQuestions(key: string): Question[] {
  return (getBank()[key] ?? []).filter((q) => !q.reported);
}

export function findQuestion(key: string, id: string): Question | undefined {
  return getBank()[key]?.find((q) => q.id === id && !q.reported);
}

export function addQuestions(key: string, qs: Question[]) {
  const bank = getBank();
  const existing = bank[key] ?? [];
  const texts = new Set(existing.map((q) => norm(q.question)));
  bank[key] = [...existing, ...qs.filter((q) => !texts.has(norm(q.question)))];
  saveJSON(BANK_KEY, bank);
}

export function reportQuestion(key: string, id: string) {
  const bank = getBank();
  const q = bank[key]?.find((x) => x.id === id);
  if (q) {
    q.reported = true;
    saveJSON(BANK_KEY, bank);
  }
}
