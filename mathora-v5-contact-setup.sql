-- MATHORA V5 CONTACT ENQUIRIES
-- Run once in Supabase SQL Editor.

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  qualification text,
  exam_board text,
  year_group text,
  current_grade text,
  target_grade text,
  service text not null,
  preferred_contact text not null,
  best_time text,
  message text not null,
  source_page text,
  status text not null default 'new'
);

alter table public.contact_enquiries enable row level security;

grant insert on public.contact_enquiries to anon, authenticated;

drop policy if exists "Allow public contact enquiries" on public.contact_enquiries;
create policy "Allow public contact enquiries"
on public.contact_enquiries
for insert
to anon, authenticated
with check (true);
