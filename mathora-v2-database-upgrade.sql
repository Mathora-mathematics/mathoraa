-- MATHORA V2 DATABASE UPGRADE
-- Run once in Supabase SQL Editor.

alter table public.attempts
  add column if not exists test_key text,
  add column if not exists total_time_seconds integer,
  add column if not exists time_limit_seconds integer;

alter table public.answers
  add column if not exists selected_option text,
  add column if not exists correct_option text,
  add column if not exists is_correct boolean,
  add column if not exists question_time_seconds integer,
  add column if not exists working_method text;

grant usage on schema public to anon, authenticated;
grant insert on public.attempts to anon, authenticated;
grant insert on public.answers to anon, authenticated;
grant insert on public.submission_files to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

alter table public.attempts enable row level security;
alter table public.answers enable row level security;
alter table public.submission_files enable row level security;

drop policy if exists "Allow assessment submissions" on public.attempts;
create policy "Allow assessment submissions"
on public.attempts for insert to anon, authenticated with check (true);

drop policy if exists "Allow answer submissions" on public.answers;
create policy "Allow answer submissions"
on public.answers for insert to anon, authenticated with check (true);

drop policy if exists "Allow submission file records" on public.submission_files;
create policy "Allow submission file records"
on public.submission_files for insert to anon, authenticated with check (true);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('mathora-workings','mathora-workings',false,6291456,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Allow Mathora working uploads" on storage.objects;
create policy "Allow Mathora working uploads"
on storage.objects for insert to anon, authenticated
with check(bucket_id='mathora-workings');

drop policy if exists "Allow Mathora working updates" on storage.objects;
create policy "Allow Mathora working updates"
on storage.objects for update to anon, authenticated
using(bucket_id='mathora-workings')
with check(bucket_id='mathora-workings');
