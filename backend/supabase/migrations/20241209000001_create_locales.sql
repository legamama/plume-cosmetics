-- Migration: 20241209000001_create_locales.sql
-- Description: Create locales table for multilingual support

CREATE TABLE locales (
    code        VARCHAR(5) PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    is_default  BOOLEAN DEFAULT FALSE,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default locales
INSERT INTO locales (code, name, native_name, is_default) VALUES
    ('vi', 'Vietnamese', 'Tiếng Việt', TRUE),
    ('en', 'English', 'English', FALSE),
    ('ko', 'Korean', '한국어', FALSE);

-- RLS
ALTER TABLE locales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active locales"
    ON locales FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage locales"
    ON locales FOR ALL
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
