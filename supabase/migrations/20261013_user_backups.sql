-- Run in Supabase SQL Editor BEFORE deploying v0.47.
-- Authenticated users can read/write only their own backup.
create table if not exists public.user_backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint user_backups_payload_object check (jsonb_typeof(payload) = 'object'),
  constraint user_backups_payload_limit check (octet_length(payload::text) <= 3145728)
);
alter table public.user_backups enable row level security;
revoke all on public.user_backups from anon;
grant select, insert, update, delete on public.user_backups to authenticated;
drop policy if exists "Users read own backups" on public.user_backups;
drop policy if exists "Users insert own backups" on public.user_backups;
drop policy if exists "Users update own backups" on public.user_backups;
drop policy if exists "Users delete own backups" on public.user_backups;
create policy "Users read own backups" on public.user_backups for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own backups" on public.user_backups for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own backups" on public.user_backups for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete own backups" on public.user_backups for delete to authenticated using ((select auth.uid()) = user_id);
