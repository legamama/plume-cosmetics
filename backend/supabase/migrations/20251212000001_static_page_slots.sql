-- Create static_page_slots table
CREATE TABLE IF NOT EXISTS static_page_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES static_pages(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  slot_key TEXT NOT NULL,
  content_value TEXT,
  rich_content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, locale, slot_key)
);

-- Enable RLS
ALTER TABLE static_page_slots ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public Read static_page_slots" ON static_page_slots;
CREATE POLICY "Public Read static_page_slots" ON static_page_slots
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Write static_page_slots" ON static_page_slots;
CREATE POLICY "Admin Write static_page_slots" ON static_page_slots
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- Migrate Data Function
CREATE OR REPLACE FUNCTION migrate_page_content(page_slug TEXT, locale_code TEXT) RETURNS VOID AS $$
DECLARE
  p_id UUID;
  c JSONB;
BEGIN
  SELECT id INTO p_id FROM static_pages WHERE slug = page_slug;
  SELECT content INTO c FROM static_page_translations WHERE page_id = p_id AND locale = locale_code;
  
  IF c IS NULL THEN RETURN; END IF;

  IF page_slug = 'home' THEN
    INSERT INTO static_page_slots (page_id, locale, slot_key, content_value) VALUES
    (p_id, locale_code, 'hero.title', c->'hero'->>'title'),
    (p_id, locale_code, 'hero.subtitle', c->'hero'->>'subtitle'),
    (p_id, locale_code, 'hero.ctaLabel', c->'hero'->>'ctaLabel'),
    (p_id, locale_code, 'hero.ctaLink', c->'hero'->>'ctaLink'),
    (p_id, locale_code, 'marquee', c->>'marquee'),
    (p_id, locale_code, 'bestSellers.title', c->'bestSellers'->>'title'),
    (p_id, locale_code, 'bestSellers.subtitle', c->'bestSellers'->>'subtitle'),
    (p_id, locale_code, 'brandStory.heading', c->'brandStory'->>'heading'),
    (p_id, locale_code, 'brandStory.body', c->'brandStory'->>'body'),
    (p_id, locale_code, 'ctaBanner.heading', c->'ctaBanner'->>'heading'),
    (p_id, locale_code, 'ctaBanner.subheading', c->'ctaBanner'->>'subheading'),
    (p_id, locale_code, 'ctaBanner.button_label', c->'ctaBanner'->>'button_label'),
    (p_id, locale_code, 'ctaBanner.button_url', c->'ctaBanner'->>'button_url')
    ON CONFLICT (page_id, locale, slot_key) DO UPDATE SET content_value = EXCLUDED.content_value;
  
  ELSIF page_slug = 'about' THEN
    INSERT INTO static_page_slots (page_id, locale, slot_key, content_value) VALUES
    (p_id, locale_code, 'hero.title', c->'hero'->>'title'),
    (p_id, locale_code, 'hero.subtitle', c->'hero'->>'subtitle'),
    (p_id, locale_code, 'mission.heading', c->'mission'->>'heading'),
    (p_id, locale_code, 'mission.subtitle', c->'mission'->>'subtitle'),
    (p_id, locale_code, 'mission.body', c->'mission'->>'body'),
    (p_id, locale_code, 'origin.heading', c->'origin'->>'heading'),
    (p_id, locale_code, 'origin.subtitle', c->'origin'->>'subtitle'),
    (p_id, locale_code, 'origin.body', c->'origin'->>'body'),
    (p_id, locale_code, 'ctaBanner.heading', c->'ctaBanner'->>'heading'),
    (p_id, locale_code, 'ctaBanner.subheading', c->'ctaBanner'->>'subheading'),
    (p_id, locale_code, 'ctaBanner.button_label', c->'ctaBanner'->>'button_label'),
    (p_id, locale_code, 'ctaBanner.button_url', c->'ctaBanner'->>'button_url')
    ON CONFLICT (page_id, locale, slot_key) DO UPDATE SET content_value = EXCLUDED.content_value;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute Migration for all locales
SELECT migrate_page_content('home', 'vi');
SELECT migrate_page_content('home', 'en');
SELECT migrate_page_content('home', 'ko');
SELECT migrate_page_content('about', 'vi');
SELECT migrate_page_content('about', 'en');
SELECT migrate_page_content('about', 'ko');

-- Clean up
DROP FUNCTION migrate_page_content;

-- Drop obsolete column
ALTER TABLE static_page_translations DROP COLUMN content;
