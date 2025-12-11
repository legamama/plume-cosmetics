-- Migration: 20241211000002_add_external_link_styling.sql
-- Description: Add styling fields (icon, color, hover_color) to product_external_links table

BEGIN;

ALTER TABLE product_external_links
ADD COLUMN IF NOT EXISTS icon VARCHAR(50),
ADD COLUMN IF NOT EXISTS color VARCHAR(50),
ADD COLUMN IF NOT EXISTS hover_color VARCHAR(50);

COMMIT;
