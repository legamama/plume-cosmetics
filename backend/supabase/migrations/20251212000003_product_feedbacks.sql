-- Product Feedbacks Migration
-- Customer feedback/testimonials per product

-- Main feedback records
CREATE TABLE product_feedbacks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    -- Optional screenshot/image
    image_url       TEXT,
    
    -- Meta info (non-translatable)
    author_name     VARCHAR(100),           -- First name or initials
    author_context  VARCHAR(200),           -- e.g. "sau 2 tuần sử dụng" (fallback if no translation)
    
    -- Ordering
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Localized feedback content
CREATE TABLE product_feedback_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id     UUID NOT NULL REFERENCES product_feedbacks(id) ON DELETE CASCADE,
    locale          VARCHAR(5) NOT NULL REFERENCES locales(code),
    
    -- Content
    title           VARCHAR(200),           -- Short highlight/title
    body            TEXT NOT NULL,          -- Main feedback text
    context         VARCHAR(200),           -- Localized author context override
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(feedback_id, locale)
);

-- Indexes
CREATE INDEX idx_product_feedbacks_product ON product_feedbacks(product_id);
CREATE INDEX idx_product_feedbacks_active ON product_feedbacks(product_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_product_feedbacks_order ON product_feedbacks(product_id, sort_order);
CREATE INDEX idx_product_feedback_trans_feedback ON product_feedback_translations(feedback_id);
CREATE INDEX idx_product_feedback_trans_locale ON product_feedback_translations(feedback_id, locale);

-- Triggers for updated_at
CREATE TRIGGER update_product_feedbacks_updated_at
    BEFORE UPDATE ON product_feedbacks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_product_feedback_translations_updated_at
    BEFORE UPDATE ON product_feedback_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE product_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_feedback_translations ENABLE ROW LEVEL SECURITY;

-- Public read access for active feedbacks
CREATE POLICY "Public can read active feedbacks"
    ON product_feedbacks FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public can read feedback translations"
    ON product_feedback_translations FOR SELECT
    USING (true);

-- Authenticated users (admin) can manage
CREATE POLICY "Authenticated users can insert feedbacks"
    ON product_feedbacks FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update feedbacks"
    ON product_feedbacks FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete feedbacks"
    ON product_feedbacks FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert feedback translations"
    ON product_feedback_translations FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update feedback translations"
    ON product_feedback_translations FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete feedback translations"
    ON product_feedback_translations FOR DELETE
    TO authenticated
    USING (true);
