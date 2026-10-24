import { ACHIEVEMENTS, type Achievement } from "./achievements";
import { ITEMS } from "./items";
import type { AnswerLog, Profile, Settings, Subject } from "./types";

export interface RewardLine {
  label: string;
  coins: number;
}

export interface QuizOutcome {
  score: number;
  correct: number;
  total: number;
  lines: RewardLine[];
  coins: number;
  capped: boolean;
  tooFast: boolean;
  chestItemId?: string;
  chestCoins?: number;
  newAchievements: Achievement[];
  streak: number;
}

const STREAK_BONUS: Record<number, number> = { 3: 30, 7: 70, 14: 150, 30: 300 };
/** Trung bình dưới mức này mỗi câu thì coi như bấm đoán bừa */
const TOO_FAST_MS = 2500;

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function pickChestItem(owned: Set<string>): string | undefined {
  const pool = ITEMS.filter((i) => !i.starter && !i.achievement && !owned.has(i.id) && (i.rarity === "hiem" || i.rarity === "suthi"));
  if (!pool.length) return undefined;
  const epic = pool.filter((i) => i.rarity === "suthi");
  const rare = pool.filter((i) => i.rarity === "hiem");
  const from = epic.length && (!rare.length || Math.random() < 0.25) ? epic : rare;
  return from[Math.floor(Math.random() * from.length)].id;
}

export function applyQuiz(
  p: Profile,
  settings: Settings,
  subject: Subject,
  chapterId: string,
  answers: AnswerLog[],
): { profile: Profile; outcome: QuizOutcome } {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const score = total ? Math.round((correct / total) * 100) / 10 : 0;
  const avgMs = total ? answers.reduce((s, a) => s + a.ms, 0) / total : 0;
  const tooFast = total >= 3 && avgMs < TOO_FAST_MS;  const review = chapterId === "review";

  const lines: RewardLine[] = [];
  let chest = false;
  if (tooFast) {
    lines.push({ label: "Hoàn thành bài", coins: 5 });
  } else {
    lines.push({ label: "Hoàn thành bài", coins: 10 });
    if (review) {
      if (correct) lines.push({ label: `Tiến bộ: sửa đúng ${correct} câu từng sai`, coins: correct * 8 });
    } else {
      const fresh = answers.filter((a) => a.correct && !a.seenBefore).length;
      const repeat = correct - fresh;
      if (fresh) lines.push({ label: `${fresh} câu mới làm đúng`, coins: fresh * 5 });
      if (repeat) lines.push({ label: `${repeat} câu làm lại đúng`, coins: repeat * 2 });
    }
    if (score >= 8) lines.push({ label: "Điểm giỏi (từ 8 trở lên)", coins: 20 });
    if (score === 10 && total >= 5) {
      lines.push({ label: "Điểm 10 tuyệt đối!", coins: 30 });
      chest = true;
    }
  }

  // Chuỗi ngày học
  const today = dayKey();
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  let streak = p.streak;
  if (p.lastDay !== today) {
    streak = p.lastDay === yesterday ? p.streak + 1 : 1;
    if (STREAK_BONUS[streak]) lines.push({ label: `Chuỗi ${streak} ngày học liên tục 🔥`, coins: STREAK_BONUS[streak] });
  }

  // Giới hạn xu mỗi ngày
  const earnedToday = p.earnedDay === today ? p.earnedToday : 0;
  const sum = lines.reduce((s, l) => s + l.coins, 0);
  const allowed = Math.max(0, settings.dailyCap - earnedToday);
  const coins = Math.min(sum, allowed);

  const wrong = { ...p.wrong };
  const seen = { ...p.seen };
  for (const a of answers) {
    seen[a.qid] = true;
    if (a.correct) delete wrong[a.qid];
    else wrong[a.qid] = a.bankKey;
  }

  const owned = new Set(p.owned);
  let chestItemId: string | undefined;
  let chestCoins: number | undefined;
  if (chest) {
    chestItemId = pickChestItem(owned);
    if (chestItemId) owned.add(chestItemId);
    else chestCoins = 100;
  }

  let next: Profile = {
    ...p,
    seen,
    wrong,
    streak,
    bestStreak: Math.max(p.bestStreak, streak),
    lastDay: today,
    earnedDay: today,
    earnedToday: earnedToday + coins,
    coins: p.coins + coins + (chestCoins ?? 0),
    history: [...p.history, { at: Date.now(), subject, chapterId, correct, total, coins, perfect: chest }],
  };

  // Thành tích mới: thưởng không tính vào giới hạn ngày
  const newAchievements = ACHIEVEMENTS.filter((a) => !next.achievements.includes(a.id) && a.check(next));
  for (const a of newAchievements) {
    if (a.item) owned.add(a.item);
    next.coins += a.coins ?? 0;
  }
  next = { ...next, owned: [...owned], achievements: [...next.achievements, ...newAchievements.map((a) => a.id)] };

  return {
    profile: next,
    outcome: { score, correct, total, lines, coins, capped: coins < sum, tooFast, chestItemId, chestCoins, newAchievements, streak },
  };
}
