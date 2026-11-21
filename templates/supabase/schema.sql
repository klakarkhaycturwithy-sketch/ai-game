-- schema.sql
-- รันใน Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ปรับชื่อตาราง/คอลัมน์ตามเกมของคุณได้

-- ========== PROFILES ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- trigger: สร้าง profile อัตโนมัติเมื่อสมัคร
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'player_' || substr(new.id::text, 1, 6)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========== SCORES (LEADERBOARD) ==========
create table if not exists public.scores (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  score int not null check (score >= 0),
  mode text default 'classic',
  duration_sec int,
  created_at timestamptz default now()
);

create index if not exists scores_score_desc_idx on public.scores (score desc);
create index if not exists scores_user_id_idx on public.scores (user_id);

alter table public.scores enable row level security;

create policy "scores readable by everyone"
  on public.scores for select using (true);

create policy "users insert own scores"
  on public.scores for insert with check (auth.uid() = user_id);

-- ไม่มี policy update/delete → default deny (ป้องกันแก้ score เก่า)

-- ========== SAVES (VERSIONED) ==========
create table if not exists public.saves (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  slot int default 1,
  data jsonb not null,
  version int default 1,
  updated_at timestamptz default now(),
  unique (user_id, slot)
);

alter table public.saves enable row level security;

create policy "users manage own saves"
  on public.saves for all using (auth.uid() = user_id);

-- ========== STORAGE BUCKET (AVATARS) ==========
-- รันใน Storage → New bucket: "avatars" (public)
-- หรือผ่าน SQL:
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "users upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);