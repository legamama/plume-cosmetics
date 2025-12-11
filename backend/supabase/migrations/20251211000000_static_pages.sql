-- Create static_pages table
CREATE TABLE IF NOT EXISTS static_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create static_page_translations table
CREATE TABLE IF NOT EXISTS static_page_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES static_pages(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image_url TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, locale)
);

-- Enable RLS
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_page_translations ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Admin Write)
CREATE POLICY "Public Read static_pages" ON static_pages
  FOR SELECT USING (true);

CREATE POLICY "Public Read static_page_translations" ON static_page_translations
  FOR SELECT USING (true);

CREATE POLICY "Admin Write static_pages" ON static_pages
  USING (auth.role() = 'service_role'); -- Simplified for local/demo, ideally specific admin role check

CREATE POLICY "Admin Write static_page_translations" ON static_page_translations
  USING (auth.role() = 'service_role');

-- Seed Data: Home Page
INSERT INTO static_pages (slug, name)
VALUES ('home', 'Landing Page')
ON CONFLICT (slug) DO NOTHING;

-- Seed Data: About Page
INSERT INTO static_pages (slug, name)
VALUES ('about', 'About Us')
ON CONFLICT (slug) DO NOTHING;
