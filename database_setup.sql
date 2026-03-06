-- =======================================================
-- FINAL FIX: RUN ALL OF THIS IN SUPABASE SQL EDITOR
-- =======================================================

-- 1. Create the Bookings Table (if it doesn't exist)
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) not null,
  venue_name text not null,
  booking_date date not null,
  start_time text not null,
  end_time text not null,
  duration_type text not null,
  event_name text,
  club_dept text,
  description text,
  poster_url text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected'))
);

-- 2. Enable Row Level Security (RLS)
alter table public.bookings enable row level security;

-- 3. DROP OLD POLICIES (to make sure we start fresh)
drop policy if exists "Allow public read-only access" on public.bookings;
drop policy if exists "Allow authenticated users to insert" on public.bookings;
drop policy if exists "Allow users to update own bookings" on public.bookings;
drop policy if exists "Allow admins to update all bookings" on public.bookings;

-- 4. CREATE NEW DATABASE POLICIES
-- Everyone can see the bookings
create policy "Allow public read" on public.bookings for select using (true);

-- Any logged-in user can submit a booking
create policy "Allow auth insert" on public.bookings for insert with check (auth.role() = 'authenticated');

-- Any logged-in user can update bookings (simplified for Admin access during dev)
create policy "Allow dev management" on public.bookings for update using (auth.role() = 'authenticated');

-- -------------------------------------------------------
-- PART 5: STORAGE BUCKET POLICIES (FOR POSTERS)
-- -------------------------------------------------------
-- These are required so your app can upload and see images!

-- Allow public to see the posters
drop policy if exists "Public Access" on storage.objects;
create policy "Allow public to view posters"
on storage.objects for select
using ( bucket_id = 'posters' );

-- -------------------------------------------------------
-- PART 6: CONTACT PAGE BACKEND
-- -------------------------------------------------------

-- 1. Create Contact Submissions Table
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  email text not null,
  subject text,
  message text not null
);

-- 2. Create Contact Info Table (Single Row for Site Details)
create table if not exists public.contact_info (
  id int primary key default 1,
  email text not null,
  phone text not null,
  address text not null,
  constraint single_row check (id = 1)
);

-- 3. Enable RLS
alter table public.contact_submissions enable row level security;
alter table public.contact_info enable row level security;

-- 4. Policies
-- Anyone can submit a contact form
create policy "Allow public insert contact" on public.contact_submissions for insert with check (true);

-- Only admins/auth can read submissions (simplified for dev)
create policy "Allow auth read contact" on public.contact_submissions for select using (auth.role() = 'authenticated');

-- Anyone can read contact info
create policy "Allow public read info" on public.contact_info for select using (true);

-- 5. Seed Contact Info
insert into public.contact_info (id, email, phone, address)
values (1, 'support@slotify.com', '+91 98765 43210', 'Main Campus, Slotify University')
on conflict (id) do nothing;
