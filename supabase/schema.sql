-- Kho câu hỏi chung cho app Học Tập Vui.
-- Chạy một lần trong Supabase: SQL Editor > New query > dán toàn bộ file này > Run.

create table if not exists public.questions (
  id uuid primary key,
  grade smallint not null check (grade between 1 and 12),
  subject text not null check (subject in ('toan', 'tienganh')),
  chapter_id text not null check (char_length(chapter_id) <= 40),
  question text not null check (char_length(question) between 3 and 800),
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  answer_index smallint not null check (answer_index between 0 and 3),
  explanation text not null default '' check (char_length(explanation) <= 1500),
  difficulty text not null default 'thong_hieu',
  verified boolean not null default false,
  reports integer not null default 0,
  created_at timestamptz not null default now(),
  unique (grade, subject, chapter_id, question)
);

create index if not exists questions_lookup on public.questions (grade, subject, chapter_id, reports);

alter table public.questions enable row level security;

-- App (khóa anon) được đọc và thêm câu hỏi, không được sửa hay xóa.
drop policy if exists "doc cau hoi" on public.questions;
create policy "doc cau hoi" on public.questions for select to anon using (true);

drop policy if exists "them cau hoi" on public.questions;
create policy "them cau hoi" on public.questions for insert to anon with check (reports = 0);

-- Báo câu sai đề: chỉ tăng bộ đếm, không sửa được gì khác.
create or replace function public.report_question(qid uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.questions set reports = reports + 1 where id = qid;
$$;

revoke all on function public.report_question(uuid) from public;
grant execute on function public.report_question(uuid) to anon;
