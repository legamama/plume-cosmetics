-- Seed Data for About Page
BEGIN;

DO $$
DECLARE
    v_page_vi_id UUID;
    v_page_en_id UUID;
    v_page_ko_id UUID;
BEGIN
    -- 1. Setup Page Definitions (VI, EN, KO)
    -- Clean up existing 'About' pages
    DELETE FROM page_sections WHERE page_id IN (SELECT id FROM page_definitions WHERE slug = '/about');
    DELETE FROM page_definitions WHERE slug = '/about';

    -- VIETNAMESE
    INSERT INTO page_definitions (slug, locale, title, is_published, page_type)
    VALUES ('/about', 'vi', 'Về Chúng Tôi', true, 'standard')
    RETURNING id INTO v_page_vi_id;

    -- ENGLISH
    INSERT INTO page_definitions (slug, locale, title, is_published, page_type)
    VALUES ('/about', 'en', 'About Us', true, 'standard')
    RETURNING id INTO v_page_en_id;

    -- KOREAN
    INSERT INTO page_definitions (slug, locale, title, is_published, page_type)
    VALUES ('/about', 'ko', '회사 소개', true, 'standard')
    RETURNING id INTO v_page_ko_id;

    -- =============================================
    -- SECTIONS FOR VIETNAMESE PAGE
    -- =============================================
    
    -- 1. Hero
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'custom_content', 0, true, '{
        "html_content": "<section class=\"py-24 bg-gradient-to-b from-plume-cream to-white\"><div class=\"max-w-4xl mx-auto px-6 text-center\"><span class=\"text-5xl mb-6 block\">🌸</span><h1 class=\"text-4xl font-serif text-plume-charcoal mb-4\">Vẻ đẹp khởi nguồn từ thiên nhiên</h1><p class=\"text-lg text-neutral-500\">Hành trình đánh thức vẻ đẹp tiềm ẩn của bạn</p></div></section>"
    }');

    -- 2. Mission
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'custom_content', 1, true, '{
        "html_content": "<section class=\"py-24 bg-white\"><div class=\"max-w-4xl mx-auto px-6 text-center\"><h2 class=\"text-3xl font-serif text-plume-charcoal mb-6\">Sứ Mệnh Của Chúng Tôi</h2><p class=\"text-lg text-neutral-600 max-w-3xl mx-auto\">Plumé cam kết mang đến những sản phẩm chăm sóc da tinh khiết nhất, kết hợp giữa bí quyết làm đẹp truyền thống Hàn Quốc và công nghệ hiện đại.</p></div></section>"
    }');

    -- 3. Values
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'custom_content', 2, true, '{
        "html_content": "<section class=\"py-24 bg-plume-cream\"><div class=\"max-w-7xl mx-auto px-6\"><div class=\"text-center mb-16\"><h2 class=\"text-3xl font-serif text-plume-charcoal mb-4\">Giá Trị Cốt Lõi</h2></div><div class=\"grid md:grid-cols-3 gap-8\"><div class=\"bg-white rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]\"><span class=\"text-4xl mb-4 block\">🛡️</span><h3 class=\"text-xl font-semibold text-plume-charcoal mb-2\">An Toàn Tuyệt Đối</h3><p class=\"text-neutral-500\">Không chứa hóa chất độc hại, an toàn cho mọi loại da.</p></div><div class=\"bg-white rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]\"><span class=\"text-4xl mb-4 block\">🔬</span><h3 class=\"text-xl font-semibold text-plume-charcoal mb-2\">Công Nghệ Tiên Tiến</h3><p class=\"text-neutral-500\">Nghiên cứu và phát triển bởi các chuyên gia hàng đầu.</p></div><div class=\"bg-white rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]\"><span class=\"text-4xl mb-4 block\">✨</span><h3 class=\"text-xl font-semibold text-plume-charcoal mb-2\">Hiệu Quả Cao</h3><p class=\"text-neutral-500\">Đã được kiểm chứng lâm sàng về hiệu quả dưỡng da.</p></div></div></div></section>"
    }');

    -- 4. Origin
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'custom_content', 3, true, '{
        "html_content": "<section class=\"py-24 bg-white\"><div class=\"max-w-4xl mx-auto px-6 text-center\"><div class=\"inline-block mb-6 p-4 bg-plume-blush rounded-full\"><span class=\"text-3xl\">🇰🇷</span></div><h2 class=\"text-3xl font-serif text-plume-charcoal mb-6\">Xuất Xứ Hàn Quốc</h2><p class=\"text-lg text-neutral-500 mb-8\">100% nguyên liệu và quy trình sản xuất được thực hiện tại Hàn Quốc, cái nôi của ngành công nghiệp mỹ phẩm Châu Á.</p><a href=\"/products\" class=\"inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-plume-charcoal text-white hover:bg-plume-charcoal/90 h-11 px-8\">Khám phá ngay</a></div></section>"
    }');

    -- =============================================
    -- SECTIONS FOR ENGLISH PAGE (Simplified COPY)
    -- =============================================
    
    -- 1. Hero
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'custom_content', 0, true, '{
        "html_content": "<section class=\"py-24 bg-gradient-to-b from-plume-cream to-white\"><div class=\"max-w-4xl mx-auto px-6 text-center\"><span class=\"text-5xl mb-6 block\">🌸</span><h1 class=\"text-4xl font-serif text-plume-charcoal mb-4\">Beauty Inspired by Nature</h1><p class=\"text-lg text-neutral-500\">A journey to awaken your hidden beauty</p></div></section>"
    }');

     -- 2. Mission
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'custom_content', 1, true, '{
        "html_content": "<section class=\"py-24 bg-white\"><div class=\"max-w-4xl mx-auto px-6 text-center\"><h2 class=\"text-3xl font-serif text-plume-charcoal mb-6\">Our Mission</h2><p class=\"text-lg text-neutral-600 max-w-3xl mx-auto\">Plumé is committed to bringing the purest skincare products, combining traditional Korean beauty secrets with modern technology.</p></div></section>"
    }');

     -- 3. Values
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'custom_content', 2, true, '{
        "html_content": "<section class=\"py-24 bg-plume-cream\"><div class=\"max-w-7xl mx-auto px-6\"><div class=\"text-center mb-16\"><h2 class=\"text-3xl font-serif text-plume-charcoal mb-4\">Core Values</h2></div><div class=\"grid md:grid-cols-3 gap-8\"><div class=\"bg-white rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]\"><span class=\"text-4xl mb-4 block\">🛡️</span><h3 class=\"text-xl font-semibold text-plume-charcoal mb-2\">Absolute Safety</h3><p class=\"text-neutral-500\">No harmful chemicals, safe for all skin types.</p></div><div class=\"bg-white rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]\"><span class=\"text-4xl mb-4 block\">🔬</span><h3 class=\"text-xl font-semibold text-plume-charcoal mb-2\">Advanced Technology</h3><p class=\"text-neutral-500\">Researched and developed by top experts.</p></div><div class=\"bg-white rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]\"><span class=\"text-4xl mb-4 block\">✨</span><h3 class=\"text-xl font-semibold text-plume-charcoal mb-2\">High Efficiency</h3><p class=\"text-neutral-500\">Clinically proven skincare effectiveness.</p></div></div></div></section>"
    }');

     -- 4. Origin
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'custom_content', 3, true, '{
        "html_content": "<section class=\"py-24 bg-white\"><div class=\"max-w-4xl mx-auto px-6 text-center\"><div class=\"inline-block mb-6 p-4 bg-plume-blush rounded-full\"><span class=\"text-3xl\">🇰🇷</span></div><h2 class=\"text-3xl font-serif text-plume-charcoal mb-6\">Made in Korea</h2><p class=\"text-lg text-neutral-500 mb-8\">100% ingredients and production process are done in Korea, the cradle of Asian cosmetics industry.</p><a href=\"/en/products\" class=\"inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-plume-charcoal text-white hover:bg-plume-charcoal/90 h-11 px-8\">Shop Now</a></div></section>"
    }');

    RAISE NOTICE 'Seeded Complete About page for VI and EN';
END $$;

COMMIT;
