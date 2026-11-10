create table if not exists public.goldrush_scores (
  id bigint generated always as identity primary key,
  username text not null check (char_length(username) between 2 and 18),
  score integer not null check (score >= 0 and score <= 1000000),
  created_at timestamptz not null default now()
);

alter table public.goldrush_scores enable row level security;

grant select, insert on public.goldrush_scores to anon;

drop policy if exists "Public can read gold rush scores" on public.goldrush_scores;
create policy "Public can read gold rush scores"
on public.goldrush_scores for select to anon
using (true);

drop policy if exists "Public can submit gold rush scores" on public.goldrush_scores;
create policy "Public can submit gold rush scores"
on public.goldrush_scores for insert to anon
with check (
  char_length(username) between 2 and 18
  and score >= 0
  and score <= 1000000
);

grant usage, select on sequence public.goldrush_scores_id_seq to anon;
