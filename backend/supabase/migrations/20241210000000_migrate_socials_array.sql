-- Migration: Convert socials from object to array
-- Transforms: {"facebook": "url"} -> [{"id": "uuid", "platform": "facebook", "url": "url", "icon": "facebook", "isEnabled": true, "order": 1}]

DO $$
DECLARE
    socials_json JSONB;
    new_socials_json JSONB := '[]'::jsonb;
    key text;
    val text;
    counter integer := 1;
BEGIN
    -- Get current value
    SELECT value INTO socials_json
    FROM site_settings
    WHERE setting_key = 'socials';

    -- If it's already an array, do nothing (idempotency checks could be more robust but this is simple)
    IF jsonb_typeof(socials_json) = 'object' THEN
        
        -- Iterate over keys
        FOR key, val IN SELECT * FROM jsonb_each_text(socials_json)
        LOOP
            -- Construct new object
            new_socials_json := new_socials_json || jsonb_build_object(
                'id', gen_random_uuid(),
                'platform', key,
                'url', val,
                'label', initcap(key),
                'icon', key, -- default icon to platform name
                'isEnabled', true,
                'order', counter
            );
            counter := counter + 1;
        END LOOP;

        -- Update the record
        UPDATE site_settings
        SET value = new_socials_json
        WHERE setting_key = 'socials';
        
    END IF;
END $$;
