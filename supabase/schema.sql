-- ==============================================================================
-- SUSAMBIL DIGITAL TRAVEL PLATFORM - SUPABASE DATABASE SCHEMA
-- "Discover Uzbekistan. Your Journey, One Platform."
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('traveler', 'guide', 'partner', 'admin')) default 'traveler',
  phone text,
  country text default 'Uzbekistan',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. DESTINATIONS
create table if not exists public.destinations (
  id text primary key,
  slug text unique not null,
  name_en text not null,
  name_uz text not null,
  name_ru text not null,
  region text not null check (region in ('silk_road', 'mountains', 'oasis', 'hidden_valley', 'desert')),
  tagline_en text,
  tagline_uz text,
  tagline_ru text,
  description_en text,
  description_uz text,
  description_ru text,
  image_url text not null,
  gallery jsonb default '[]'::jsonb,
  best_season text,
  must_see_en text[],
  must_see_uz text[],
  must_see_ru text[],
  local_food_en text[],
  local_food_uz text[],
  local_food_ru text[],
  estimated_daily_cost_usd numeric default 50,
  is_hidden_gem boolean default false,
  latitude double precision,
  longitude double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ACCOMMODATIONS (Hotels, Boutique Madrassahs, Guesthouses, Yurts)
create table if not exists public.accommodations (
  id text primary key,
  name_en text not null,
  name_uz text not null,
  name_ru text not null,
  type text not null check (type in ('boutique_hotel', 'madrassah_hotel', 'guesthouse', 'hostel', 'yurt_camp')),
  city text not null,
  address text not null,
  description_en text,
  description_uz text,
  description_ru text,
  price_per_night_usd numeric not null,
  rating numeric default 4.8,
  reviews_count integer default 0,
  image_url text not null,
  gallery jsonb default '[]'::jsonb,
  amenities text[],
  is_featured boolean default false,
  partner_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TRANSPORT ROUTES (Trains, Flights, Transfers, Rental Cars)
create table if not exists public.transport_routes (
  id text primary key,
  type text not null check (type in ('train', 'flight', 'bus', 'transfer', 'car_rental')),
  carrier text not null,
  carrier_code text,
  origin_city text not null,
  destination_city text not null,
  departure_time text not null,
  arrival_time text not null,
  duration text not null,
  price_usd numeric not null,
  price_uzs numeric not null,
  class_options jsonb default '[]'::jsonb,
  vehicle_type text,
  frequency text default 'Daily',
  demo_api_source text default 'Uzbekistan Transport Hub',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TOURS & EXPERIENCES
create table if not exists public.tours (
  id text primary key,
  title_en text not null,
  title_uz text not null,
  title_ru text not null,
  category text not null check (category in ('historical', 'ecotourism', 'gastronomic', 'adventure', 'workshops')),
  city text not null,
  duration_days integer not null,
  duration_label_en text,
  duration_label_uz text,
  duration_label_ru text,
  price_usd numeric not null,
  rating numeric default 4.9,
  reviews_count integer default 0,
  group_size text,
  language_codes text[],
  image_url text not null,
  gallery jsonb default '[]'::jsonb,
  overview_en text,
  overview_uz text,
  overview_ru text,
  itinerary jsonb default '[]'::jsonb,
  included_en text[],
  included_uz text[],
  included_ru text[],
  not_included_en text[],
  not_included_uz text[],
  not_included_ru text[],
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. VERIFIED GUIDES
create table if not exists public.guides (
  id text primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  title_en text,
  title_uz text,
  title_ru text,
  city text not null,
  experience_years integer default 5,
  languages text[] not null,
  rating numeric default 4.9,
  reviews_count integer default 0,
  daily_rate_usd numeric not null,
  hourly_rate_usd numeric not null,
  bio_en text,
  bio_uz text,
  bio_ru text,
  specializations_en text[],
  specializations_uz text[],
  specializations_ru text[],
  avatar_url text not null,
  is_verified boolean default true,
  license_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. BOOKINGS & INQUIRIES
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  item_type text not null check (item_type in ('transport', 'hotel', 'tour', 'guide', 'custom_itinerary')),
  item_id text not null,
  item_title text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  start_date date not null,
  end_date date,
  guests_count integer default 1,
  total_price_usd numeric not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  special_requests text,
  is_demo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CUSTOM ITINERARIES (Generated by Smart Travel Planner)
create table if not exists public.saved_itineraries (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  title text not null,
  cities text[] not null,
  duration_days integer not null,
  style text not null,
  interests text[] not null,
  mode text not null,
  estimated_cost_usd numeric not null,
  days jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. USER FAVORITES
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  item_type text not null,
  item_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, item_type, item_id)
);

-- 10. PARTNERS (Applications & Listings)
create table if not exists public.partners (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  business_name text not null,
  category text not null check (category in ('hotel', 'transport', 'tour_operator', 'guide', 'craft_workshop')),
  contact_person text not null,
  phone text not null,
  email text not null,
  city text not null,
  license_number text,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.saved_itineraries enable row level security;
alter table public.favorites enable row level security;
alter table public.partners enable row level security;

-- Public can view catalog
alter table public.destinations enable row level security;
alter table public.accommodations enable row level security;
alter table public.transport_routes enable row level security;
alter table public.tours enable row level security;
alter table public.guides enable row level security;

create policy "Public can view catalog destinations" on public.destinations for select using (true);
create policy "Public can view catalog accommodations" on public.accommodations for select using (true);
create policy "Public can view catalog transport" on public.transport_routes for select using (true);
create policy "Public can view catalog tours" on public.tours for select using (true);
create policy "Public can view catalog guides" on public.guides for select using (true);

-- Indexing for high-speed queries
create index if not exists idx_destinations_region on public.destinations(region);
create index if not exists idx_accommodations_city on public.accommodations(city);
create index if not exists idx_transport_origin_dest on public.transport_routes(origin_city, destination_city);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_favorites_user_id on public.favorites(user_id);
