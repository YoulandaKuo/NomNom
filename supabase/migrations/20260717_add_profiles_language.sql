-- Adds a per-account language preference (EN / zh-Hant) so it follows the
-- user across devices instead of living only in localStorage.
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor).

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'en',
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = user_id);
