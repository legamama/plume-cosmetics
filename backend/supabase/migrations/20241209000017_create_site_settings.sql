-- site_settings table for configurable site-wide settings
-- Stores socials, floating actions, and other configuration

CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_site_settings_updated_at();

-- Seed default settings
INSERT INTO site_settings (setting_key, value, description) VALUES
(
    'socials',
    '{
        "facebook": "https://www.facebook.com/giadinhlegamamaouc/",
        "tiktok": "https://www.tiktok.com/@legamama",
        "youtube": "https://www.youtube.com/@giadinhlegamamaouc",
        "instagram": "https://www.instagram.com/legamama.official"
    }'::jsonb,
    'Social media profile URLs'
),
(
    'floating_actions',
    '[
        {
            "id": "1",
            "iconKey": "facebook",
            "label": "Follow on Facebook",
            "href": "https://www.facebook.com/giadinhlegamamaouc/",
            "backgroundColor": "#E8A598",
            "hoverColor": "#D4847A",
            "isEnabled": true,
            "order": 1
        },
        {
            "id": "2",
            "iconKey": "tiktok",
            "label": "Follow on TikTok",
            "href": "https://www.tiktok.com/@legamama",
            "backgroundColor": "#E8A598",
            "hoverColor": "#D4847A",
            "isEnabled": true,
            "order": 2
        },
        {
            "id": "3",
            "iconKey": "instagram",
            "label": "Follow on Instagram",
            "href": "https://www.instagram.com/legamama.official",
            "backgroundColor": "#E8A598",
            "hoverColor": "#D4847A",
            "isEnabled": true,
            "order": 3
        }
    ]'::jsonb,
    'Floating action buttons configuration'
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read all settings
CREATE POLICY "site_settings_public_read"
    ON site_settings
    FOR SELECT
    USING (true);

-- Authenticated users can update settings
CREATE POLICY "site_settings_authenticated_update"
    ON site_settings
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can insert settings
CREATE POLICY "site_settings_authenticated_insert"
    ON site_settings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Create index for fast key lookups
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);

-- Grant permissions
GRANT SELECT ON site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON site_settings TO authenticated;

COMMENT ON TABLE site_settings IS 'Site-wide configuration settings stored as key-value pairs with JSONB values';
COMMENT ON COLUMN site_settings.setting_key IS 'Unique identifier for the setting (e.g., socials, floating_actions)';
COMMENT ON COLUMN site_settings.value IS 'JSON value containing the setting data';
