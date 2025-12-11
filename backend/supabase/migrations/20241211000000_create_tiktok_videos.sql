-- Create tiktok_videos table
create table if not exists tiktok_videos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  "order" integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table tiktok_videos enable row level security;

-- Policies

-- Public read access (only enabled videos) - used by frontend
create policy "Public can view enabled tiktok videos"
  on tiktok_videos for select
  to public
  using ( is_enabled = true );

-- Admin read access (all videos)
create policy "Authenticated users can view all tiktok videos"
  on tiktok_videos for select
  to authenticated
  using ( true );

-- Admin insert access
create policy "Authenticated users can insert tiktok videos"
  on tiktok_videos for insert
  to authenticated
  with check ( true );

-- Admin update access
create policy "Authenticated users can update tiktok videos"
  on tiktok_videos for update
  to authenticated
  using ( true );

-- Admin delete access
create policy "Authenticated users can delete tiktok videos"
  on tiktok_videos for delete
  to authenticated
  using ( true );
