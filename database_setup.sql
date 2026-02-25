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

-- Allow logged-in users to upload posters
drop policy if exists "Auth Insert" on storage.objects;
create policy "Allow auth to upload posters"
on storage.objects for insert
with check ( bucket_id = 'posters' AND auth.role() = 'authenticated' );
