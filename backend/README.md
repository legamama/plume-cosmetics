# Plumé Backend

Supabase backend architecture for the Plumé cosmetics platform. This package provides:

- **SQL Migrations**: Complete database schema with 13 tables
- **TypeScript Types**: Full type definitions for all entities
- **API Functions**: Public read and admin CRUD operations
- **RLS Policies**: Secure row-level security for all tables

## Features

- 🌐 **Multilingual Support**: Vietnamese (default), English, Korean
- 💰 **Per-locale Pricing**: VND and AUD currencies
- 🔗 **SEO Ready**: Meta titles, descriptions, OG images per locale
- 📦 **Products**: Categories, translations, media, external e-commerce links
- 📝 **Blog**: Posts with rich content, translations, media
- 🏗️ **Page Builder**: Dynamic pages with configurable sections
- 🧭 **Navigation**: Hierarchical site navigation management

## Setup

### 1. Environment Variables

Create a `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Run Migrations

Apply migrations to your Supabase project using the Supabase CLI:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Or apply them manually via the Supabase Dashboard SQL Editor in order:

1. `20241209000001_create_locales.sql`
2. `20241209000002_create_product_categories.sql`
3. `20241209000003_create_products.sql`
4. `20241209000004_create_product_translations.sql`
5. `20241209000005_create_product_media.sql`
6. `20241209000006_create_product_external_links.sql`
7. `20241209000007_create_blog_posts.sql`
8. `20241209000008_create_blog_translations.sql`
9. `20241209000009_create_blog_media.sql`
10. `20241209000010_create_page_definitions.sql`
11. `20241209000011_create_page_sections.sql`
12. `20241209000012_create_navigation_items.sql`
13. `20241209000013_create_helper_functions.sql`
14. `20241209000014_create_rpc_functions.sql`

### 3. Set up Admin Users

To create admin users, set the `role` claim in their JWT:

```sql
-- Via Supabase Dashboard > Authentication > Users
-- Or programmatically:
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

## Usage

### Public API (Frontend)

```typescript
import { 
  getProducts, 
  getProductBySlug,
  getBlogPosts,
  getPageContent,
  getNavigation 
} from '@plume/backend';

// Get products in Vietnamese
const products = await getProducts({ locale: 'vi', limit: 20 });

// Get product detail
const product = await getProductBySlug('vi', 'son-moi-dep');

// Get page content for home page
const homePage = await getPageContent('vi', '/');

// Get main navigation
const nav = await getNavigation('vi', 'main');
```

### Admin API (Server-side)

```typescript
import { 
  adminProducts,
  adminBlog,
  adminPages,
  adminNavigation 
} from '@plume/backend';

// Create a product
const product = await adminProducts.createProduct({
  sku: 'PLM-001',
  is_featured: true,
  translations: [
    {
      locale: 'vi',
      name: 'Son môi đẹp',
      description: 'Mô tả sản phẩm...',
      price: 350000,
      currency: 'VND',
    },
  ],
  media: [
    { url: 'https://cdn.plume.vn/products/son-moi.jpg', is_primary: true }
  ],
});

// Create a page with sections
const page = await adminPages.createPage({
  slug: '/',
  locale: 'vi',
  page_type: 'home',
  title: 'Trang chủ',
  is_published: true,
  sections: [
    {
      section_type: 'hero',
      position: 0,
      config_json: {
        title: 'Chào mừng đến với Plumé',
        subtitle: 'Mỹ phẩm cao cấp',
        primaryCta: { label: 'Xem sản phẩm', href: '/products' },
      },
    },
  ],
});
```

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `locales` | Language configuration (vi, en, ko) |
| `product_categories` | Category hierarchy |
| `product_category_translations` | Category names per locale |
| `products` | Base product data |
| `product_translations` | Product content + pricing per locale |
| `product_media` | Product images/videos |
| `product_external_links` | E-commerce platform links |
| `blog_posts` | Blog post metadata |
| `blog_translations` | Blog content per locale |
| `blog_media` | Blog images/videos |
| `page_definitions` | Page routing and SEO |
| `page_sections` | Dynamic content blocks |
| `navigation_items` | Site navigation structure |

### Page Section Types

| Type | Description |
|------|-------------|
| `hero` | Hero banner with CTAs |
| `usp_grid` | Unique selling points |
| `best_sellers` | Product carousel |
| `faq` | FAQ accordion |
| `blog_teaser` | Featured blog posts |
| `cta_banner` | Call to action |
| `testimonials` | Customer reviews |
| `tiktok_video_feed` | TikTok videos |
| `facebook_post_feed` | Facebook posts |
| `rich_text` | TipTap content |
| `image_gallery` | Image gallery |
| `contact_form` | Contact section |

## RLS Policies

- **Public**: Read-only access to published/active content
- **Admin**: Full CRUD access for users with `role: admin` in JWT
- **Draft Content**: Hidden from public, visible to admins

## RPC Functions

- `get_page_content(locale, slug)` - Fetch page with sections
- `get_navigation(locale, nav_group)` - Fetch navigation tree
- `get_all_pages(locale)` - List all pages for sitemap
- `get_product_by_slug(locale, slug)` - Fetch product detail
- `get_blog_post_by_slug(locale, slug)` - Fetch blog post detail

## File Structure

```
backend/
├── supabase/
│   └── migrations/      # 14 SQL migration files
├── lib/
│   ├── index.ts         # Main export
│   ├── types.ts         # TypeScript types
│   ├── supabaseClient.ts
│   ├── products.ts      # Public product API
│   ├── blog.ts          # Public blog API
│   ├── categories.ts    # Public category API
│   ├── pages.ts         # Public page builder API
│   └── admin/
│       ├── index.ts
│       ├── products.ts  # Admin product CRUD
│       ├── blog.ts      # Admin blog CRUD
│       ├── pages.ts     # Admin page builder CRUD
│       └── navigation.ts # Admin navigation CRUD
└── README.md
```

## License

Private - Plumé Cosmetics
