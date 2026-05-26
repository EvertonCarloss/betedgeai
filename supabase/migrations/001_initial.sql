-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  bankroll numeric default 1000,
  default_stake numeric default 50,
  odds_api_key text,
  region text default 'eu',
  settings jsonb default '{
    "auto_analyze": false,
    "value_bet": true,
    "high_conf_only": false,
    "stop_loss_alert": true
  }'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bets table
create table public.bets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  items jsonb not null,           -- Array of BetItem
  total_odd numeric not null,
  stake numeric not null,
  potential_return numeric not null,
  outcome text default 'pending' check (outcome in ('pending', 'won', 'lost', 'void')),
  real_return numeric,
  sport_icon text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.bets enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can view own bets"
  on public.bets for select using (auth.uid() = user_id);

create policy "Users can insert own bets"
  on public.bets for insert with check (auth.uid() = user_id);

create policy "Users can update own bets"
  on public.bets for update using (auth.uid() = user_id);

create policy "Users can delete own bets"
  on public.bets for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger bets_updated_at before update on public.bets
  for each row execute procedure public.handle_updated_at();
