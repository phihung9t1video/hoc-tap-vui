import type { Question, Subject } from "./types";

/**
 * Kho đề có sẵn (soạn sẵn, đóng gói trong app, cập nhật theo các bản phát hành).
 * File public/bank/<lớp>-<môn>.json có dạng:
 *   { "<id chương>": [[câu hỏi, [đáp án ĐÚNG, sai, sai, sai], lời giải], ...] }
 * Đáp án đúng luôn viết ở vị trí đầu; app tự xáo trộn khi hiển thị.
 */
type RawQ = [string, string[], string];
type RawFile = Record<string, RawQ[]>;

const cache = new Map<string, Promise<RawFile>>();
const REPORTED_KEY = "hoctap_reported_builtin_v1";

function loadFile(grade: number, subject: Subject): Promise<RawFile> {
  const key = `${grade}-${subject}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(`/bank/${key}.json`)
        .then((r) => (r.ok ? (r.json() as Promise<RawFile>) : {}))
        .catch(() => ({})),
    );
  }
  return cache.get(key)!;
}

function reported(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(REPORTED_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function reportBuiltin(id: string) {
  const s = reported();
  s.add(id);
  try {
    localStorage.setItem(REPORTED_KEY, JSON.stringify([...s]));
  } catch {
    // bỏ qua
  }
}

export const isBuiltinId = (id: string) => id.startsWith("kho-");

function toQuestion(id: string, [question, options, explanation]: RawQ): Question {
  const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  return { id, question, options: order.map((i) => options[i]), answerIndex: order.indexOf(0), explanation, difficulty: "thong_hieu", verified: true };
}

/** Các câu có sẵn của một chương (đã bỏ câu bị báo sai trên máy này) */
export async function builtinQuestions(grade: number, subject: Subject, chapterId: string): Promise<Question[]> {
  const file = await loadFile(grade, subject);
  const bad = reported();
  return (file[chapterId] ?? [])
    .map((raw, i) => ({ id: `kho-${grade}-${subject}-${chapterId}-${i}`, raw }))
    .filter(({ id, raw }) => !bad.has(id) && raw[1]?.length === 4)
    .map(({ id, raw }) => toQuestion(id, raw));
}

/** Thỉnh thoảng (khoảng 2 bài thì 1 bài) chèn một câu thử thách nâng cao vào giữa bài */
export async function withChallenge<T extends Question & { bankKey: string; bonus?: boolean }>(
  items: T[],
  grade: number,
  subject: Subject,
  seen: Record<string, boolean>,
  chance = 0.45,
): Promise<T[]> {
  if (items.length < 3 || Math.random() > chance) return items;
  const pool = await builtinQuestions(grade, subject, "thu-thach");
  if (!pool.length) return items;
  const fresh = pool.filter((q) => !seen[q.id]);
  const from = fresh.length ? fresh : pool;
  const q = from[Math.floor(Math.random() * from.length)];
  const at = 2 + Math.floor(Math.random() * (items.length - 1));
  const bonus = { ...q, bankKey: `${grade}|${subject}|thu-thach`, bonus: true } as T;
  return [...items.slice(0, at), bonus, ...items.slice(at)];
}

/** Số câu có sẵn theo từng chương (để hiện trên danh sách chương) */
export async function builtinCounts(grade: number, subject: Subject): Promise<Record<string, number>> {
  const file = await loadFile(grade, subject);
  return Object.fromEntries(Object.entries(file).map(([k, v]) => [k, v.length]));
}

/** Tìm lại một câu có sẵn theo id (dùng khi ôn câu sai) */
export async function findBuiltin(id: string): Promise<Question | undefined> {
  const m = /^kho-(\d+)-([a-z]+)-(.+)-(\d+)$/.exec(id);
  if (!m) return undefined;
  const [, g, s, chapterId, n] = m;
  const file = await loadFile(Number(g), s as Subject);
  const raw = file[chapterId]?.[Number(n)];
  return raw && !reported().has(id) ? toQuestion(id, raw) : undefined;
}
