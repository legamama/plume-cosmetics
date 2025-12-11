import { upsertPage, createSection } from './pages';
import type { LaunchOfferConfig, BestSellersConfig, StoryConfig, HeroConfig } from '../../types';

export async function seedHomeContent() {
    console.log('Seeding Home Page content...');

    try {
        // 1. Create Page (VI default, EN/KO placeholders)
        const page = await upsertPage({
            slug: '/',
            name_vi: 'Trang chủ',
            name_en: 'Home',
            name_ko: '홈',
            is_published: true,
            id: '', // New
        } as any);

        console.log('Page created:', page);

        // We need the ID of the VI page we just created/updated.
        // upsertPage returns the VI definition.
        const pageId = page.id;

        // 2. Add Sections to VI page
        // Hero
        await createSection(pageId, 'vi', 'hero', 0, {
            heading: 'Vẻ Đẹp Tự Nhiên, <br/>Rạng Ngời Từ Bên Trong',
            subheading: 'Khám phá bộ sưu tập chăm sóc da cao cấp từ thiên nhiên Hàn Quốc',
            cta_button: { label: 'Mua ngay', url: '/products' },
            background_image_url: 'https://plume.b-cdn.net/hero-bg-v2.jpg'
        } as HeroConfig);

        // Launch Offer
        await createSection(pageId, 'vi', 'launch_offer', 1, {
            title: '🎁 Ưu Đãi Khai Trương',
            description: 'Giảm ngay 20% cho đơn hàng đầu tiên. Freeship toàn quốc.',
            ctaLabel: 'Nhận ưu đãi',
            ctaLink: '/products'
        } as LaunchOfferConfig);

        // Best Sellers
        await createSection(pageId, 'vi', 'best_sellers', 2, {
            title: 'Sản Phẩm Bán Chạy',
            subtitle: 'Được yêu thích nhất tuần qua',
            max_items: 4
        } as BestSellersConfig);

        // Brand Story
        await createSection(pageId, 'vi', 'story', 3, {
            heading: 'Câu Chuyện Của Plumé',
            subtitle: 'Cảm hứng thiên nhiên',
            body: '<p>Plume ra đời với sứ mệnh mang đến vẻ đẹp thuần khiết...</p>',
            image_position: 'left',
            image_url: 'https://plume.b-cdn.net/story-bg.jpg'
        } as StoryConfig);

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    }
}
