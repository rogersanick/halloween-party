# Halloween Party RSVP

This app now includes an RSVP form and attendee list powered by Supabase.

## Setup

1. Install deps:

```bash
npm install
```

2. Create a `.env` file with:

```bash
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. Supabase table (SQL):

```sql
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  costume text,
  coming boolean not null default true,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS and allow inserts/selects
alter table public.rsvps enable row level security;
create policy "Allow public inserts" on public.rsvps
  for insert to public with check (true);
create policy "Allow public reads" on public.rsvps
  for select to public using (true);
```

4. Start dev server:

```bash
npm run dev
```

The RSVP section includes fields for name, costume, and whether you’re coming. It shows a live list of those attending.
