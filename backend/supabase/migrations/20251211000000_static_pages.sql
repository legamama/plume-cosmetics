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
DROP POLICY IF EXISTS "Public Read static_pages" ON static_pages;
CREATE POLICY "Public Read static_pages" ON static_pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read static_page_translations" ON static_page_translations;
CREATE POLICY "Public Read static_page_translations" ON static_page_translations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Write static_pages" ON static_pages;
CREATE POLICY "Admin Write static_pages" ON static_pages
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

DROP POLICY IF EXISTS "Admin Write static_page_translations" ON static_page_translations;
CREATE POLICY "Admin Write static_page_translations" ON static_page_translations
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

-- Seed Data: Home Page
INSERT INTO static_pages (slug, name)
VALUES ('home', 'Landing Page')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO static_pages (slug, name)
VALUES ('about', 'About Us')
ON CONFLICT (slug) DO NOTHING;

-- Seed Data: Home Page Translations
INSERT INTO static_page_translations (page_id, locale, content)
SELECT id, 'vi', '{
  "hero": {
    "title": "Vẻ Đẹp Tự Nhiên, Rạng Ngời Mỗi Ngày",
    "subtitle": "Khám phá bộ sưu tập mỹ phẩm K-Beauty cao cấp được tuyển chọn kỹ lưỡng, mang đến làn da khỏe đẹp rạng rỡ.",
    "ctaLabel": "Khám Phá Ngay",
    "ctaLink": "/products"
  },
  "marquee": "Tự tin khoe da xinh, Plumé luôn bên bạn",
  "bestSellers": {
    "title": "Sản Phẩm Bán Chạy",
    "subtitle": "Những sản phẩm được yêu thích nhất của chúng tôi"
  },
  "brandStory": {
    "heading": "Câu Chuyện Của Chúng Tôi",
    "body": "Plumé được phát triển dành cho những người phụ nữ mong muốn cải thiện làn da rõ ràng và bền vững. Chúng tôi tin rằng: mỗi làn da đều xứng đáng được phục hồi – nuôi dưỡng – và chăm sóc theo cách khoa học."
  },
  "ctaBanner": {
    "heading": "Sẵn Sàng Cho Làn Da Mơ Ước?",
    "subheading": "Tham gia cùng hàng nghìn khách hàng hài lòng",
    "button_label": "Mua Ngay",
    "button_url": "/products"
  }
}'::jsonb FROM static_pages WHERE slug = 'home'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO static_page_translations (page_id, locale, content)
SELECT id, 'en', '{
  "hero": {
    "title": "Natural Beauty, Radiant Every Day",
    "subtitle": "Discover our curated collection of premium K-Beauty products for healthy, radiant skin.",
    "ctaLabel": "Shop Now",
    "ctaLink": "/products"
  },
  "marquee": "Confidence to show off beautiful skin, Plumé is always with you",
  "bestSellers": {
    "title": "Best Sellers",
    "subtitle": "Our most loved products"
  },
  "brandStory": {
    "heading": "Our Story",
    "body": "Plumé is developed for women who desire clear and sustainable skin improvement. We believe that every skin deserves to be restored, nourished, and cared for in a scientific way."
  },
  "ctaBanner": {
    "heading": "Ready For Your Dream Skin?",
    "subheading": "Join thousands of satisfied customers",
    "button_label": "Shop Now",
    "button_url": "/products"
  }
}'::jsonb FROM static_pages WHERE slug = 'home'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO static_page_translations (page_id, locale, content)
SELECT id, 'ko', '{
  "hero": {
    "title": "매일 빛나는 자연스러운 아름다움",
    "subtitle": "건강하고 빛나는 피부를 위해 엄선된 프리미엄 K-Beauty 컬렉션을 만나보세요.",
    "ctaLabel": "지금 쇼핑하기",
    "ctaLink": "/products"
  },
  "marquee": "자신 있게 빛나는 피부, Plumé가 항상 함께합니다",
  "bestSellers": {
    "title": "베스트셀러",
    "subtitle": "가장 사랑받는 제품들"
  },
  "brandStory": {
    "heading": "우리의 이야기",
    "body": "Plumé는 깨끗하고 지속 가능한 피부 개선을 원하는 여성을 위해 개발되었습니다. 우리는 모든 피부가 과학적인 방식으로 회복되고, 영양을 공급받으며, 보살핌을 받을 자격이 있다고 믿습니다."
  },
  "ctaBanner": {
    "heading": "꿈꾸던 피부를 위한 준비가 되셨나요?",
    "subheading": "수천 명의 만족한 고객과 함께하세요",
    "button_label": "지금 쇼핑하기",
    "button_url": "/products"
  }
}'::jsonb FROM static_pages WHERE slug = 'home'
ON CONFLICT (page_id, locale) DO NOTHING;

-- Seed Data: About Page Translations
INSERT INTO static_page_translations (page_id, locale, content)
SELECT id, 'vi', '{
  "hero": {
    "title": "Vẻ đẹp khởi nguồn từ thiên nhiên",
    "subtitle": "Hành trình đánh thức vẻ đẹp tiềm ẩn của bạn"
  },
  "mission": {
    "heading": "Sứ Mệnh Của Chúng Tôi",
    "subtitle": "Cam kết chất lượng",
    "body": "Plumé cam kết mang đến những sản phẩm chăm sóc da tinh khiết nhất, kết hợp giữa bí quyết làm đẹp truyền thống Hàn Quốc và công nghệ hiện đại."
  },
  "origin": {
    "heading": "Xuất Xứ Hàn Quốc",
    "subtitle": "Cái nôi làm đẹp",
    "body": "100% nguyên liệu và quy trình sản xuất được thực hiện tại Hàn Quốc, cái nôi của ngành công nghiệp mỹ phẩm Châu Á. Chúng tôi tự hào mang đến chất lượng chuẩn Hàn cho làn da Việt."
  },
  "ctaBanner": {
    "heading": "Sẵn Sàng Cho Làn Da Mơ Ước?",
    "subheading": "Nuôi dưỡng vẻ đẹp tự nhiên bằng sự tinh tế và khoa học.",
    "button_label": "Mua Ngay",
    "button_url": "/products"
  }
}'::jsonb FROM static_pages WHERE slug = 'about'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO static_page_translations (page_id, locale, content)
SELECT id, 'en', '{
  "hero": {
    "title": "Beauty Originates from Nature",
    "subtitle": "The journey to awaken your hidden beauty"
  },
  "mission": {
    "heading": "Our Mission",
    "subtitle": "Quality Commitment",
    "body": "Plumé is committed to delivering the purest skincare products, combining traditional Korean beauty secrets with modern technology."
  },
  "origin": {
    "heading": "Korean Origin",
    "subtitle": "The Cradle of Beauty",
    "body": "100% of ingredients and production processes are conducted in Korea, the cradle of the Asian cosmetics industry. We are proud to bring Korean standard quality to you."
  },
  "ctaBanner": {
    "heading": "Ready For Your Dream Skin?",
    "subheading": "Nurture natural beauty with sophistication and science.",
    "button_label": "Shop Now",
    "button_url": "/products"
  }
}'::jsonb FROM static_pages WHERE slug = 'about'
ON CONFLICT (page_id, locale) DO NOTHING;

INSERT INTO static_page_translations (page_id, locale, content)
SELECT id, 'ko', '{
  "hero": {
    "title": "자연에서 시작되는 아름다움",
    "subtitle": "당신의 숨겨진 아름다움을 깨우는 여정"
  },
  "mission": {
    "heading": "우리의 사명",
    "subtitle": "품질에 대한 약속",
    "body": "Plumé는 한국의 전통적인 미용 비법과 현대 기술을 결합하여 가장 순수한 스킨케어 제품을 제공하기 위해 최선을 다하고 있습니다."
  },
  "origin": {
    "heading": "한국산",
    "subtitle": "뷰티의 요람",
    "body": "100% 원료와 생산 공정이 아시아 화장품 산업의 요람인 한국에서 이루어집니다. 베트남 피부를 위해 한국 표준 품질을 제공하게 되어 자랑스럽습니다."
  },
  "ctaBanner": {
    "heading": "꿈꾸던 피부를 위한 준비가 되셨나요?",
    "subheading": "정교함과 과학으로 자연스러운 아름다움을 가꾸세요.",
    "button_label": "지금 쇼핑하기",
    "button_url": "/products"
  }
}'::jsonb FROM static_pages WHERE slug = 'about'
ON CONFLICT (page_id, locale) DO NOTHING;

