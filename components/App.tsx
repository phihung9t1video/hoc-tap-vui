"use client";

import { useCallback, useEffect, useState } from "react";
import { builtinQuestions, findBuiltin, isBuiltinId } from "@/lib/builtin";
import { fetchCloudQuestions, pushCloudQuestions } from "@/lib/cloud";
import { SUBJECTS, findChapter } from "@/lib/curriculum";
import { HOME_STARTER_IDS, defaultHome } from "@/lib/home";
import { ITEM_MAP, STARTER_IDS } from "@/lib/items";
import { applyQuiz, type QuizOutcome } from "@/lib/rewards";
import { addQuestions, bankKey, findQuestion, getQuestions, loadData, saveData } from "@/lib/storage";
import type { AnswerLog, AppData, Profile, QuizItem, Subject } from "@/lib/types";
import { generateQuestions } from "@/lib/gemini";
import { applyUpdateNow, checkForUpdate, openApkDownload, type UpdateState } from "@/lib/updater";
import { newId, shuffle } from "@/lib/util";
import { Achievements } from "./Achievements";
import { Avatar } from "./Avatar";
import { AvatarEditor } from "./AvatarEditor";
import { ChooseLesson } from "./ChooseLesson";
import { CreateProfile } from "./CreateProfile";
import { TownScreen } from "./TownScreen";
import { Lobby } from "./Lobby";
import { ParentSettings } from "./ParentSettings";
import { Profiles } from "./Profiles";
import { Quiz } from "./Quiz";
import { Result } from "./Result";

const QUIZ_SIZE = 10;
/** Nguồn đề của lần làm bài gần nhất, để nút "Làm bài nữa" dùng lại */
let lastSource: "kho" | "ai" = "kho";
const WELCOME_COINS = 50;

type Screen =
  | { name: "profiles" }
  | { name: "create" }
  | { name: "lobby" }
  | { name: "wardrobe" }
  | { name: "achievements" }
  | { name: "home" }
  | { name: "settings" }
  | { name: "choose"; subject: Subject }
  | { name: "loading"; subject: Subject }
  | { name: "error"; subject: Subject; message: string }
  | { name: "quiz"; subject: Subject; chapterId: string; items: QuizItem[]; demo: boolean; notice?: string }
  | { name: "result"; subject: Subject; chapterId: string; outcome: QuizOutcome };

export function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: "profiles" });
  const [update, setUpdate] = useState<UpdateState>({ kind: "none" });

  const beta = !!data?.settings.betaChannel;
  const runUpdateCheck = useCallback(() => {
    checkForUpdate(beta).then(setUpdate);
  }, [beta]);
  useEffect(() => {
    if (data) runUpdateCheck();
    // Chỉ kiểm tra khi mở app hoặc khi đổi kênh nhận bản cập nhật
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!data, runUpdateCheck]);

  useEffect(() => {
    const d = loadData();
    setData(d);
    if (d.profiles.some((p) => p.id === d.currentId)) setScreen({ name: "lobby" });
  }, []);

  useEffect(() => {
    if (data) saveData(data);
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen.name]);

  if (!data) return null;
  const profile = data.profiles.find((p) => p.id === data.currentId);

  /** Luôn cập nhật dựa trên dữ liệu mới nhất, để hai lần cập nhật liên tiếp (mua rồi mặc) không ghi đè nhau. */
  const patchProfile = (fn: (p: Profile) => Profile) =>
    setData((d) => d && { ...d, profiles: d.profiles.map((p) => (p.id === d.currentId ? fn(p) : p)) });

  async function startQuiz(p: Profile, subject: Subject, chapterId: string, source: "kho" | "ai" = "ai") {
    setScreen({ name: "loading", subject });
    lastSource = source;

    if (chapterId === "review") {
      const prefix = `${p.grade}|${subject}|`;
      const found = await Promise.all(
        Object.entries(p.wrong)
          .filter(([, key]) => key.startsWith(prefix))
          .map(async ([id, key]) => {
            const q = isBuiltinId(id) ? await findBuiltin(id) : findQuestion(key, id);
            return q ? { ...q, bankKey: key } : null;
          }),
      );
      const items = found.filter((q): q is QuizItem => q !== null);
      if (!items.length) return setScreen({ name: "error", subject, message: "Không còn câu sai nào để ôn. Giỏi quá! 🎉" });
      return setScreen({ name: "quiz", subject, chapterId, items: shuffle(items).slice(0, QUIZ_SIZE), demo: false });
    }

    const key = bankKey(p.grade, subject, chapterId);

    if (source === "kho") {
      const all = await builtinQuestions(p.grade, subject, chapterId);
      if (!all.length) return setScreen({ name: "error", subject, message: "Chương này chưa có câu trong kho đề. Con chọn Đề mới AI soạn nhé!" });
      const fresh = shuffle(all.filter((q) => !p.seen[q.id]));
      const old = shuffle(all.filter((q) => p.seen[q.id]));
      const items = [...fresh, ...old].slice(0, QUIZ_SIZE).map((q) => ({ ...q, bankKey: key }));
      return setScreen({ name: "quiz", subject, chapterId, items, demo: false });
    }

    let pool = getQuestions(key);
    let notice: string | undefined;

    const unseen = () => pool.filter((q) => !p.seen[q.id]).length;

    // Lấy thêm câu từ kho chung trước, thiếu mới nhờ AI soạn
    if (unseen() < QUIZ_SIZE) {
      const cloud = await fetchCloudQuestions(p.grade, subject, chapterId);
      if (cloud.length) {
        addQuestions(key, cloud);
        pool = getQuestions(key);
      }
    }

    if (unseen() < QUIZ_SIZE) {
      const keys = data?.settings.geminiKeys ?? [];
      const res = await generateQuestions(keys, { grade: p.grade, subject, chapterId, count: QUIZ_SIZE, avoid: pool.map((q) => q.question) });
      if (res.demo && res.questions) {
        return setScreen({ name: "quiz", subject, chapterId, items: res.questions.map((q) => ({ ...q, bankKey: key })), demo: true });
      }
      if (res.questions?.length) {
        addQuestions(key, res.questions);
        void pushCloudQuestions(p.grade, subject, chapterId, res.questions);
        pool = getQuestions(key);
      } else if (pool.length >= 5) {
        notice = `${res.error ?? "Chưa soạn được đề mới."} Tạm thời con làm lại các câu cũ nhé.`;
      } else {
        return setScreen({ name: "error", subject, message: res.error ?? "Chưa soạn được đề, con thử lại nhé." });
      }
    }

    const fresh = shuffle(pool.filter((q) => !p.seen[q.id]));
    const old = shuffle(pool.filter((q) => p.seen[q.id]));
    const items = [...fresh, ...old].slice(0, QUIZ_SIZE).map((q) => ({ ...q, bankKey: key }));
    setScreen({ name: "quiz", subject, chapterId, items, demo: false, notice });
  }

  function finishQuiz(p: Profile, subject: Subject, chapterId: string, answers: AnswerLog[]) {
    if (!answers.length) return setScreen({ name: "choose", subject });
    const { profile: next, outcome } = applyQuiz(p, data!.settings, subject, chapterId, answers);
    patchProfile(() => next);
    setScreen({ name: "result", subject, chapterId, outcome });
  }

  function createProfile(info: Pick<Profile, "name" | "grade" | "gender" | "look">) {
    const p: Profile = {
      ...info,
      id: newId(),
      coins: WELCOME_COINS,
      owned: [...STARTER_IDS, ...HOME_STARTER_IDS],
      home: defaultHome(),
      seen: {},
      wrong: {},
      history: [],
      achievements: [],
      streak: 0,
      bestStreak: 0,
      lastDay: "",
      earnedDay: "",
      earnedToday: 0,
      createdAt: Date.now(),
    };
    setData((d) => d && { ...d, profiles: [...d.profiles, p], currentId: p.id });
    setScreen({ name: "lobby" });
  }

  let content: React.ReactNode;
  const saveSettings = (settings: AppData["settings"]) => setData((d) => d && { ...d, settings });

  if (!data.settings.setupDone) {
    content = <ParentSettings settings={data.settings} firstRun onSave={saveSettings} />;
  } else if (screen.name === "settings") {
    content = (
      <ParentSettings
        settings={data.settings}
        firstRun={false}
        onSave={saveSettings}
        onClose={() => setScreen({ name: "profiles" })}
        onCheckUpdate={runUpdateCheck}
      />
    );
  } else if (screen.name === "create" || (!data.profiles.length && screen.name === "profiles")) {
    content = <CreateProfile onDone={createProfile} onCancel={data.profiles.length ? () => setScreen({ name: "profiles" }) : undefined} />;
  } else if (screen.name === "profiles" || !profile) {
    content = (
      <Profiles
        profiles={data.profiles}
        onPick={(id) => {
          setData({ ...data, currentId: id });
          setScreen({ name: "lobby" });
        }}
        onCreate={() => setScreen({ name: "create" })}
        onSettings={() => setScreen({ name: "settings" })}
        onDelete={(id) => setData({ ...data, profiles: data.profiles.filter((p) => p.id !== id), currentId: data.currentId === id ? undefined : data.currentId })}
      />
    );
  } else if (screen.name === "lobby") {
    content = (
      <Lobby
        profile={profile}
        onPlay={(subject) => setScreen({ name: "choose", subject })}
        onWardrobe={() => setScreen({ name: "wardrobe" })}
        onAchievements={() => setScreen({ name: "achievements" })}
        onHome={() => setScreen({ name: "home" })}
        onSwitch={() => {
          setData({ ...data, currentId: undefined });
          setScreen({ name: "profiles" });
        }}
      />
    );
  } else if (screen.name === "wardrobe") {
    content = (
      <div className="stack">
        <div className="topbar">
          <button className="btn" onClick={() => setScreen({ name: "lobby" })}>
            ← Sảnh
          </button>
          <span className="pill pill-coin">⭐ {profile.coins}</span>
        </div>
        <h1>👕 Tủ đồ</h1>
        <div className="banner">🛍️ Muốn mua đồ mới? Ra <strong>🏘️ Khu phố</strong>, đi tới các cửa hàng quanh công viên nhé!</div>
        <AvatarEditor
          look={profile.look}
          owned={new Set(profile.owned)}
          coins={profile.coins}
          shop={false}
          onChange={(look) => patchProfile((p) => ({ ...p, look }))}
          onBuy={(item) =>
            patchProfile((p) =>
              p.coins >= item.price && !p.owned.includes(item.id) ? { ...p, coins: p.coins - item.price, owned: [...p.owned, item.id] } : p,
            )
          }
        />
      </div>
    );
  } else if (screen.name === "home") {
    content = (
      <TownScreen
        me={profile}
        profiles={data.profiles}
        onChange={patchProfile}
        onBack={() => setScreen({ name: "lobby" })}
      />
    );
  } else if (screen.name === "achievements") {
    content = <Achievements profile={profile} onBack={() => setScreen({ name: "lobby" })} />;
  } else if (screen.name === "choose") {
    content = (
      <ChooseLesson
        profile={profile}
        subject={screen.subject}
        onStart={(chapterId, source) => startQuiz(profile, screen.subject, chapterId, source)}
        hasAI={(data.settings.geminiKeys ?? []).length > 0}
        onBack={() => setScreen({ name: "lobby" })}
      />
    );
  } else if (screen.name === "loading") {
    content = (
      <div className="stack center" style={{ alignItems: "center", paddingTop: 40 }}>
        <Avatar look={profile.look} size={180} className="jump" />
        <h2 className="loading-dots">Thầy AI đang soạn đề cho con</h2>
        <p className="muted">Chờ một chút xíu nhé (khoảng 10–30 giây)</p>
      </div>
    );
  } else if (screen.name === "error") {
    content = (
      <div className="stack center" style={{ alignItems: "center", paddingTop: 40 }}>
        <Avatar look={profile.look} size={160} />
        <div className="error">{screen.message}</div>
        <button className="btn btn-primary" onClick={() => setScreen({ name: "choose", subject: screen.subject })}>
          ← Quay lại chọn bài
        </button>
      </div>
    );
  } else if (screen.name === "quiz") {
    const chapterName = screen.chapterId === "review" ? "Ôn lại câu sai" : findChapter(profile.grade, screen.subject, screen.chapterId)?.name;
    content = (
      <Quiz
        key={screen.items.map((q) => q.id).join()}
        profile={profile}
        items={screen.items}
        demo={screen.demo}
        notice={screen.notice}
        title={`${SUBJECTS[screen.subject].icon} ${SUBJECTS[screen.subject].name} · ${chapterName}`}
        onFinish={(answers) => finishQuiz(profile, screen.subject, screen.chapterId, answers)}
        onQuit={() => setScreen({ name: "choose", subject: screen.subject })}
      />
    );
  } else if (screen.name === "result") {
    content = (
      <Result
        outcome={screen.outcome}
        profile={profile}
        onHome={() => setScreen({ name: "lobby" })}
        onAgain={() => startQuiz(profile, screen.subject, screen.chapterId, lastSource)}
        onWear={(itemId) => {
          const item = ITEM_MAP[itemId];
          if (!item) return setScreen({ name: "home" });
          patchProfile((p) => ({ ...p, look: { ...p.look, [item.slot]: itemId } }));
        }}
      />
    );
  }

  return (
    <main className="app">
      {update.kind === "ready" && screen.name !== "quiz" && (
        <div className="banner row between" style={{ marginBottom: 12 }}>
          <span>🎉 Đã có bản mới {update.version}!</span>
          <button className="btn btn-gold" onClick={() => applyUpdateNow(update.bundleId)}>
            Cập nhật ngay
          </button>
        </div>
      )}
      {update.kind === "apk" && screen.name !== "quiz" && (
        <div className="banner row between" style={{ marginBottom: 12 }}>
          <span>📲 Có bản app mới {update.version}, bố mẹ bấm để tải và cài.</span>
          <button className="btn btn-gold" onClick={() => openApkDownload(update.url)}>
            Tải về
          </button>
        </div>
      )}
      {content}
    </main>
  );
}
