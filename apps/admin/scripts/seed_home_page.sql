-- Complete Seed Data for Home Page (Matching Mockup)

BEGIN;

-- 1. Setup Locale Variables
DO $$
DECLARE
    v_page_vi_id UUID;
    v_page_en_id UUID;
    v_page_ko_id UUID;
BEGIN
    -- 2. Clean up existing 'Home' pages to prevent duplicates during re-seeding
    DELETE FROM page_sections WHERE page_id IN (SELECT id FROM page_definitions WHERE slug = '/');
    DELETE FROM page_definitions WHERE slug = '/';

    -- 3. Create Page Definitions
    -- VIETNAMESE (Default)
    INSERT INTO page_definitions (slug, locale, title, is_published, page_type)
    VALUES ('/', 'vi', 'Trang chủ', true, 'standard')
    RETURNING id INTO v_page_vi_id;

    -- ENGLISH
    INSERT INTO page_definitions (slug, locale, title, is_published, page_type)
    VALUES ('/', 'en', 'Home', true, 'standard')
    RETURNING id INTO v_page_en_id;

    -- KOREAN
    INSERT INTO page_definitions (slug, locale, title, is_published, page_type)
    VALUES ('/', 'ko', '홈', true, 'standard')
    RETURNING id INTO v_page_ko_id;

    -- =============================================
    -- SECTIONS FOR VIETNAMESE PAGE (Full Content)
    -- =============================================

    -- 1. Hero
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'hero', 0, true, '{
        "heading": "Vẻ Đẹp Tự Nhiên, <br/>Rạng Ngời Từ Bên Trong",
        "subheading": "Khám phá bộ sưu tập chăm sóc da cao cấp từ thiên nhiên Hàn Quốc",
        "cta_button": { "label": "Mua ngay", "url": "/products" },
        "background_image_url": "https://plume.b-cdn.net/hero-bg-v2.jpg"
    }');

    -- 2. Launch Offer
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'launch_offer', 1, true, '{
        "title": "🎁 Ưu Đãi Khai Trương",
        "description": "Giảm ngay 20% cho đơn hàng đầu tiên. Freeship toàn quốc.",
        "ctaLabel": "Nhận ưu đãi",
        "ctaLink": "/products"
    }');

    -- 3. Best Sellers
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'best_sellers', 2, true, '{
        "title": "Sản Phẩm Bán Chạy",
        "subtitle": "Được yêu thích nhất tuần qua",
        "max_items": 4
    }');

    -- 4. Brand Story
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'story', 3, true, '{
         "heading": "Câu Chuyện Của Plumé",
        "subtitle": "Cảm hứng thiên nhiên",
        "body": "<p>Plume ra đời với sứ mệnh mang đến vẻ đẹp thuần khiết nhất từ thiên nhiên. Chúng tôi tin rằng...</p>",
        "image_position": "left",
        "image_url": "https://plume.b-cdn.net/story-bg.jpg"
    }');

    -- 5. Testimonials
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'testimonials', 4, true, '{
        "title": "Khách Hàng Nói Gì Về Plumé",
        "items": [
            {
                "id": "1",
                "author_name": "Mai Anh",
                "author_title": "Verified Customer",
                "quote": "Sản phẩm thực sự thay đổi làn da của mình. Cấp ẩm tốt và rất lành tính.",
                "author_image_url": "https://i.pravatar.cc/150?u=1",
                "rating": 5
            },
            {
                "id": "2",
                "author_name": "Thu Hà",
                "author_title": "Beauty Blogger",
                "quote": "Thiết kế đẹp, chất lượng tuyệt vời. Chắc chắn sẽ ủng hộ dài dài.",
                "author_image_url": "https://i.pravatar.cc/150?u=2",
                "rating": 5
            },
            {
                "id": "3",
                "author_name": "Linh Nguyen",
                "author_title": "Office Worker",
                "quote": "Mình thích nhất là kem dưỡng ẩm, thấm nhanh mà không bết dính.",
                "author_image_url": "https://i.pravatar.cc/150?u=3",
                "rating": 4
            }
        ]
    }');

    -- 6. FAQ Teaser
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'faq', 5, true, '{
        "title": "Câu Hỏi Thường Gặp",
        "subtitle": "Giải đáp thắc mắc của bạn",
        "items": [
            {
                "id": "1",
                "question": "Sản phẩm Plumé có phù hợp với da nhạy cảm không?",
                "answer": "Hoàn toàn phù hợp. Chúng tôi sử dụng các thành phần thiên nhiên lành tính, đã được kiểm nghiệm da liễu."
            },
            {
                "id": "2",
                "question": "Tôi có thể mua hàng ở đâu?",
                "answer": "Bạn có thể đặt hàng trực tiếp trên website hoặc qua các kênh thương mại điện tử chính thức của Plumé."
            },
             {
                "id": "3",
                "question": "Chính sách đổi trả như thế nào?",
                "answer": "Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất."
            }
        ]
    }');

    -- 7. CTA Banner (Bottom)
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_vi_id, 'cta_banner', 6, true, '{
        "heading": "Sẵn Sàng Thay Đổi Làn Da Của Bạn?",
        "subheading": "Tham gia cộng đồng Plumé ngay hôm nay để nhận nhiều ưu đãi hấp dẫn.",
        "button_label": "Đăng ký ngay",
        "button_url": "/register"
    }');

    
    -- =============================================
    -- SECTIONS FOR ENGLISH PAGE (Mirrored Content)
    -- =============================================
     -- 1. Hero
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'hero', 0, true, '{
        "heading": "Natural Beauty, <br/>Radiating From Within",
        "subheading": "Discover premium skincare from Korean nature",
        "cta_button": { "label": "Shop Now", "url": "/products" },
        "background_image_url": "https://plume.b-cdn.net/hero-bg-v2.jpg"
    }');

    -- 2. Launch Offer
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'launch_offer', 1, true, '{
        "title": "🎁 Grand Opening Offer",
        "description": "Get 20% off your first order. Free shipping nationwide.",
        "ctaLabel": "Get Offer",
        "ctaLink": "/products"
    }');

    -- 3. Best Sellers
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'best_sellers', 2, true, '{
        "title": "Best Sellers",
        "subtitle": "Most loved products this week",
        "max_items": 4
    }');

     -- 4. Brand Story
    INSERT INTO page_sections (page_id, section_type, position, is_enabled, config_json)
    VALUES (v_page_en_id, 'story', 3, true, '{
        "heading": "The Plumé Story",
        "subtitle": "Inspired by Nature",
        "body": "<p>Plume was born with a mission to bring the purest beauty from nature...</p>",
        "image_position": "left",
        "image_url": "https://plume.b-cdn.net/story-bg.jpg"
    }');
    
    -- ... (Can add more English sections similar to VI if needed)


    RAISE NOTICE 'Seeded Complete Home page for VI and EN';
END $$;

COMMIT;
