import type { Question, Subject } from "./types";

/**
 * Kho câu hỏi chung trên Supabase: câu đã soạn được lưu theo lớp, môn, chương
 * để máy nào cũng dùng lại được. Không cấu hình thì app chỉ dùng kho trên máy.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const cloudEnabled = !!(URL && ANON);

/** Số lần bị báo sai đề thì câu bị ẩn khỏi kho chung */
const HIDE_AFTER_REPORTS = 2;

interface Row {
  id: string;
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
  difficulty: string;
  verified: boolean;
}

async function call(path: string, init: RequestInit = {}) {
  return fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    // Khóa publishable chỉ gửi qua header apikey (không phải JWT nên không đặt vào Authorization)
    headers: { apikey: ANON!, "Content-Type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(10000),
  });
}

export async function fetchCloudQuestions(grade: number, subject: Subject, chapterId: string): Promise<Question[]> {
  if (!cloudEnabled) return [];
  try {
    const q = new URLSearchParams({
      select: "id,question,options,answer_index,explanation,difficulty,verified",
      grade: `eq.${grade}`,
      subject: `eq.${subject}`,
      chapter_id: `eq.${chapterId}`,
      reports: `lt.${HIDE_AFTER_REPORTS}`,
      order: "created_at.desc",
      limit: "300",
    });
    const res = await call(`questions?${q}`);
    if (!res.ok) return [];
    const rows = (await res.json()) as Row[];
    return rows.map((r) => ({
      id: r.id,
      question: r.question,
      options: r.options,
      answerIndex: r.answer_index,
      explanation: r.explanation,
      difficulty: r.difficulty,
      verified: r.verified,
    }));
  } catch {
    return [];
  }
}

export async function pushCloudQuestions(grade: number, subject: Subject, chapterId: string, qs: Question[]) {
  if (!cloudEnabled || !qs.length) return;
  const rows = qs.map((q) => ({
    id: q.id,
    grade,
    subject,
    chapter_id: chapterId,
    question: q.question,
    options: q.options,
    answer_index: q.answerIndex,
    explanation: q.explanation,
    difficulty: q.difficulty,
    verified: q.verified,
  }));
  try {
    await call("questions?on_conflict=grade,subject,chapter_id,question", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    });
  } catch {
    // Mất mạng: câu vẫn nằm trong kho trên máy
  }
}

export async function reportCloudQuestion(id: string) {
  if (!cloudEnabled) return;
  try {
    await call("rpc/report_question", { method: "POST", body: JSON.stringify({ qid: id }) });
  } catch {
    // bỏ qua
  }
}
