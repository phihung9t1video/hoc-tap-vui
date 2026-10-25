-- Kho câu hỏi chung cho app Học Tập Vui.
-- Chạy một lần trong Supabase: SQL Editor > New query > dán toàn bộ file này > Run.

create table if not exists public.questions (
  id uuid primary key,
  grade smallint not null check (grade between 1 and 12),
  subject text not null check (subject in ('toan', 'tiengviet', 'nguvan', 'tienganh', 'tnxh', 'khoahoc', 'khtn', 'lsdl', 'tinhoc')),
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

-- =====================================================================
-- KHU PHỐ CHUNG: người chơi, mảnh đất, ngôi nhà
-- Các bảng không cho app đọc/ghi trực tiếp (RLS bật, không có policy).
-- App chỉ dùng các hàm bên dưới, luôn phải kèm đúng MÃ KHU PHỐ.
-- =====================================================================

create table if not exists public.town_players (
  town text not null check (char_length(town) between 4 and 40),
  id uuid not null,
  name text not null check (char_length(name) <= 40),
  look jsonb not null default '{}'::jsonb,
  coins_earned integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (town, id)
);

create table if not exists public.town_plots (
  town text not null check (char_length(town) between 4 and 40),
  plot smallint not null check (plot between 0 and 999),
  owner uuid not null,
  house text,
  rooms jsonb check (rooms is null or pg_column_size(rooms) < 300000),
  updated_at timestamptz not null default now(),
  primary key (town, plot)
);

create unique index if not exists town_plots_one_per_owner on public.town_plots (town, owner);

alter table public.town_players enable row level security;
alter table public.town_plots enable row level security;

-- Toàn bộ khu phố theo mã: danh sách người chơi và các mảnh đất đã có chủ
create or replace function public.town_state(p_town text)
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'players', coalesce((select json_agg(json_build_object('id', id, 'name', name, 'look', look, 'coins', coins_earned))
                         from town_players where town = p_town), '[]'::json),
    'plots', coalesce((select json_agg(json_build_object('plot', plot, 'owner', owner, 'house', house, 'rooms', rooms, 'updatedAt', updated_at))
                       from town_plots where town = p_town), '[]'::json)
  );
$$;

-- Vào khu phố / cập nhật tên, trang phục, tổng xu đã kiếm
create or replace function public.town_join(p_town text, p_id uuid, p_name text, p_look jsonb, p_coins integer)
returns void
language sql
security definer
set search_path = public
as $$
  insert into town_players (town, id, name, look, coins_earned, updated_at)
  values (p_town, p_id, left(p_name, 40), coalesce(p_look, '{}'::jsonb), greatest(coalesce(p_coins, 0), 0), now())
  on conflict (town, id) do update
    set name = excluded.name, look = excluded.look, coins_earned = excluded.coins_earned, updated_at = now();
$$;

-- Mua đất: chỉ thành công nếu mảnh đất còn trống và người này chưa có đất
create or replace function public.town_claim(p_town text, p_plot smallint, p_owner uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into town_plots (town, plot, owner) values (p_town, p_plot, p_owner)
  on conflict do nothing;
  return found;
end;
$$;

-- Xây/nâng cấp nhà và lưu nội thất: chỉ chủ đất mới sửa được
create or replace function public.town_save_house(p_town text, p_plot smallint, p_owner uuid, p_house text, p_rooms jsonb)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update town_plots set house = p_house, rooms = p_rooms, updated_at = now()
  where town = p_town and plot = p_plot and owner = p_owner;
  return found;
end;
$$;

revoke all on function public.town_state(text) from public;
revoke all on function public.town_join(text, uuid, text, jsonb, integer) from public;
revoke all on function public.town_claim(text, smallint, uuid) from public;
revoke all on function public.town_save_house(text, smallint, uuid, text, jsonb) from public;
grant execute on function public.town_state(text) to anon;
grant execute on function public.town_join(text, uuid, text, jsonb, integer) to anon;
grant execute on function public.town_claim(text, smallint, uuid) to anon;
grant execute on function public.town_save_house(text, smallint, uuid, text, jsonb) to anon;
