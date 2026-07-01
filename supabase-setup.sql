-- Nigerian Personal Income Tax Calculator - Supabase Database Setup
-- Run this in the Supabase SQL Editor

-- 1. Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone_number text,
  created_at timestamptz default now()
);

-- 2. Tax bands (Nigeria Tax Act 2025) — seeded once, editable if the law changes
create table tax_bands (
  band_id serial primary key,
  min_income numeric not null,
  max_income numeric,              -- null = no upper limit
  tax_rate numeric not null,       -- e.g. 0.15 for 15%
  band_order int not null
);

insert into tax_bands (min_income, max_income, tax_rate, band_order) values
  (0,          800000,    0.00, 1),
  (800000,     3000000,   0.15, 2),
  (3000000,    12000000,  0.18, 3),
  (12000000,   25000000,  0.21, 4),
  (25000000,   50000000,  0.23, 5),
  (50000000,   null,      0.25, 6);

-- 3. Tax calculations
create table tax_calculations (
  tax_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  gross_income numeric not null,
  pension_contribution numeric default 0,
  nhf_contribution numeric default 0,
  life_assurance_premium numeric default 0,
  total_deductions numeric not null,
  chargeable_income numeric not null,
  annual_tax numeric not null,
  monthly_tax numeric not null,
  calculation_date timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table tax_calculations enable row level security;
alter table tax_bands enable row level security;

create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);

create policy "Users manage own calculations" on tax_calculations
  for all using (auth.uid() = user_id);

create policy "Anyone can read tax bands" on tax_bands
  for select using (true);

-- Auto-create profile row on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone_number)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone_number');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
