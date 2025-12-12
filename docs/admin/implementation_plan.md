# Admin Dashboard - Liquid Glass Design System Implementation Plan

## Goal Description
Update the Admin Dashboard UI to match the Plumé "Liquid Glass" design system (iOS 26 inspired), ensuring visual consistency with the Marketing Site.
Transforms the data-heavy admin interface into a premium, polished workspace using subtle transparency, blur, and fluid motion.

## User Review Required
- **Visual Strategy**: "Liquid Glass" applied to Sidebar, Topbar, and Panels. Backgrounds will be neutral/soft to allow content focus.
- **Shared System**: We will duplicate the core design logic from Frontend (GlassPanel, Tokens) into `apps/admin/src/components/ui/glass` to maintain independence while ensuring consistency.

## Proposed Changes

### 1. Design System Adoption
- **Port Glass Components**:
  - `GlassPanel`: Background blur container.
  - `GlassInput`: Form inputs with glass aesthetic.
  - `GlassButton`: Buttons with subtle gradients and shine.
- **Motion System**:
  - Implement shared Framer Motion variants (`src/lib/motion.ts`) for "Liquid Entrance" and "Lift".

### 2. Layout Updates (`src/layouts/AdminLayout.tsx`)
- **Sidebar**:
  - Convert to `GlassNav` vertical variant.
  - Sticky, translucent background.
  - Active state: Soft glow + scale lift.
- **Topbar**:
  - Minimal glass strip for search/notifications.
- **Page Container**:
  - Soft neutral background (`bg-neutral-50`) to contrast with glass elements.

### 3. Page Builder UI
- **Sections List**:
  - Use `GlassPanel` for section items.
  - Drag-and-drop handles with motion feedback.
- **Config Panels**:
  - Floating glass sidebar for editing section properties.

### 4. Settings Pages
- **Site Settings**:
  - Forms wrapped in `GlassPanel`.
  - Toggle switches and inputs using Plumé design tokens.

### 5. Media Gallery
**Goal**: Centralized asset management integrated into all editors.

- **UI Components**:
  - `MediaLibraryModal`: Main interface for selecting/uploading.
    - **Tabs**: "All Media", "Upload".
    - **View**: Grid of thumbnails with infinite scroll or pagination.
    - **Search**: Filter by filename or alt text.
  - `MediaUploader`: Drag-and-drop zone.
    - Visual feedback (upload progress, success/error).
    - Auto-selects uploaded item.
  - `MediaItemDetail`: Sidebar/Modal to edit `alt_text`, `credits` and see metadata.
  - `ImagePicker`: Form input component that triggers the `MediaLibraryModal` and stores the selected URL.

- **Integration Points**:
  - **Product Editor**: Replace URL text inputs with `ImagePicker`.
  - **Page Builder**: Update `config_json` schemas to use `image_picker` type fields.
  - **TipTap**: Custom image button opens `MediaLibraryModal` -> insert node with Bunny URL.

## Redirects Management
### Goal
Enable admins to manage URL redirects and publish them to Netlify.

### Backend (`backend/lib/redirects.ts`)
- **Schema**: `redirects` table (id, from_path, to_url, status_code, is_enabled, updated_at).
- **Functions**:
  - `listRedirects()`: Returns all redirects ordered by `from_path`.
  - `upsertRedirect(data)`: Creates or updates a redirect.
  - `deleteRedirect(id)`: Removes a redirect.
  - `publishRedirects()`: Triggers Netlify build hook (via server function or direct fetch if key is exposed/proxied).

### Admin UI (`apps/admin`)
- **Page**: `src/pages/Redirects.tsx`
  - Table view of redirects.
  - "Add Redirect" button (opens Modal/GlassPanel).
  - "Publish Redirects" button (header action).
- **Components**:
  - `RedirectTable`: Data grid with search/filter.
  - `RedirectForm`: Form with validation (from_path must start with /).
- **Navigation**:
  - Add to "Settings" group in Sidebar.

### Data Flow
1. **Load**: UI calls `listRedirects` (Supabase).
2. **Mutate**: UI calls `upsert/deleteRedirect` (Supabase).
3. **Publish**: UI calls `publishRedirects` -> Calls Netlify Webhook -> Triggers Build -> `_redirects` updated.

## Verification Plan
1. **Visual Comparison**: Open Admin and Frontend side-by-side. Verify "Glass" effect opacity/blur matches.
2. **Motion Check**: Verify sidebar items have the same "liquid" feel as frontend nav items.
4. **Performance**: Ensure heavy admin tables (Products list) scroll smoothly under glass overlays.

---

## Plasmic Pages Management

> [!IMPORTANT]
> **December 2024**: Plasmic is now the primary visual page builder for marketing/content pages. The legacy `page_sections` builder remains available for system pages only.

### Division of Responsibilities

| Layer | Handles |
|-------|---------|
| **Plasmic** | Visual composition, page layout, marketing content, locale variants, per-page SEO |
| **Supabase** | Products, blog posts, media library (Bunny CDN), redirects, structured data |

### Admin UX

#### Plasmic Pages List (`/plasmic-pages`)
- Table showing all Plasmic-managed pages
- Columns: Page Name, Description, Locales (badges), Status, Actions
- "Edit in Plasmic" button → opens Plasmic Studio in new tab
- "View Page" button → opens frontend preview in selected locale
- Info panel explaining what Plasmic vs Supabase handles

#### Configuration
Pages are configured in `apps/admin/src/lib/plasmic-config.ts`:
```typescript
export const plasmicPagesConfig: PlasmicPageConfig[] = [
  { id: 'home', slug: '/', name: 'Home Page', locales: ['vi', 'en', 'ko'], ... },
  { id: 'about', slug: '/about', name: 'About Page', ... },
];
```

For a dynamic registry, this can be replaced with a Supabase table or Plasmic API fetch.

### Multi-Language Strategy
- **Recommended**: Use locale variants within one Plasmic project
- Editors switch variants in Plasmic Studio to manage vi/en/ko content
- Each page shows locale badges indicating available translations

---

## Browser Dialog Refactor

> [!IMPORTANT]
> **December 2024**: Replacing native browser dialogs (`window.confirm`, `window.alert`, `prompt`) with custom React modals and toasts. Native dialogs are unreliable in some environments.

### Goal
Remove all browser dialog usage from the admin app and replace with accessible, styled React components for confirmations and status messages.

### Current Browser Dialog Usage

| File | Line | Type | Action |
|------|------|------|--------|
| `MediaGrid.tsx` | 78 | `confirm()` | Delete asset confirmation |
| `MediaViewerModal.tsx` | 76 | `confirm()` | Delete media confirmation |
| `PagesListPage.tsx` | 43 | `alert()` | Seed content error notification |
| `Redirects.tsx` | 137 | `confirm()` | Delete redirect confirmation |
| `PlasmicPagesListPage.tsx` | 21 | `alert()` | Missing Plasmic config notification |

### New Components

#### [NEW] [ConfirmDialog.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/components/ui/ConfirmDialog.tsx)
Reusable confirmation modal with:
- Title, message, and optional details
- Primary ("Confirm") and secondary ("Cancel") actions
- Variant support: `danger` (red styling for deletes), `warning`, `default`
- ARIA roles: `role="alertdialog"`, `aria-modal="true"`
- Focus trapping and ESC to close
- Auto-focus on primary action for quick keyboard confirmation

#### [NEW] [ConfirmDialogContext.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/context/ConfirmDialogContext.tsx)
Context provider with `useConfirmDialog` hook:
```typescript
const { confirm } = useConfirmDialog();

// Returns a Promise<boolean> - true if confirmed, false if cancelled
const confirmed = await confirm({
  title: 'Delete Asset',
  message: 'This action cannot be undone.',
  confirmText: 'Delete',
  variant: 'danger'
});

if (confirmed) {
  // proceed with deletion
}
```

### Files to Modify

#### [MODIFY] [MediaGrid.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/components/media/MediaGrid.tsx)
- Import and use `useConfirmDialog`
- Replace `if (confirm('Delete this asset?'))` with async confirm dialog

#### [MODIFY] [MediaViewerModal.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/components/media/MediaViewerModal.tsx)
- Import and use `useConfirmDialog`
- Replace `if (confirm('Are you sure...'))` with async confirm dialog

#### [MODIFY] [PagesListPage.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/pages/pages/PagesListPage.tsx)
- Import and use existing `useToast`
- Replace `alert('Failed to seed...')` with `toast.error(...)`

#### [MODIFY] [Redirects.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/pages/Redirects.tsx)
- Import and use `useConfirmDialog`
- Replace `if (confirm('Are you sure...'))` with async confirm dialog

#### [MODIFY] [PlasmicPagesListPage.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/pages/plasmic/PlasmicPagesListPage.tsx)
- Import and use existing `useToast`
- Replace `alert('Plasmic project ID...')` with `toast.error(...)`

#### [MODIFY] [index.ts](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/components/ui/index.ts)
- Export `ConfirmDialog` component

#### [MODIFY] [App.tsx](file:///Volumes/home/Documents/App/09Dec25/apps/admin/src/App.tsx)
- Wrap app with `ConfirmDialogProvider` (alongside existing `ToastProvider`)

### Accessibility Requirements
- **Focus trapping**: Tab cycles within modal when open
- **ESC to close**: Already handled by base Modal component
- **ARIA roles**: `alertdialog` for confirmations, proper labeling
- **Visible focus**: Clear focus indicators on buttons
- **Destructive actions**: Always require explicit confirmation click

### Verification Plan

#### Manual Testing (Browser)
1. **Media Library Delete**:
   - Navigate to `/media` in admin
   - Hover over an image and click the delete (trash) icon
   - Verify: Custom modal appears with "Delete" and "Cancel" buttons
   - Verify: Pressing ESC closes the modal without deleting
   - Verify: Clicking "Cancel" closes without deleting
   - Verify: Clicking "Delete" removes the asset and shows success toast

2. **Media Viewer Delete**:
   - Click on a media item to open the full viewer
   - Click the "Delete" button in the sidebar
   - Verify: Same confirmation flow as above

3. **Redirects Delete**:
   - Navigate to `/settings/redirects`
   - Click the delete icon on any redirect row
   - Verify: Confirmation modal appears
   - Verify: Delete only proceeds on explicit confirmation

4. **Pages Seed Error** (simulate failure):
   - Navigate to `/pages` when empty
   - Click "Seed Default Content"
   - If seed fails, verify a toast notification appears (not browser alert)

5. **Plasmic Config Error**:
   - Temporarily unset `VITE_PLASMIC_PROJECT_ID`
   - Navigate to `/plasmic-pages`
   - Click "Edit in Plasmic" on any page
   - Verify: Toast error appears explaining the missing config


6. **Keyboard Accessibility**:
   - Open any confirmation dialog
   - Verify: Tab cycles between Cancel and Confirm buttons
   - Verify: ESC closes the dialog
   - Verify: Enter on focused button activates it

---

## TikTok Feed Management

### Goal
Enable admins to curate a feed of TikTok videos for the landing page.

### Backend (`backend/supabase/migrations`)
- **Schema**: `tiktok_videos` table
  - `id` (uuid)
  - `url` (text)
  - `order` (int)
  - `is_enabled` (boolean)

### Admin UI (`apps/admin`)
- **Page**: `src/pages/content/TikTokFeed.tsx`
- **Features**:
  - Add Video: Validate URL format (tiktok.com/...)
  - Reorder: Drag and drop interface for sorting
  - Toggle: Enable/Disable videos without deleting
  - Delete: Remove video permanently
- **Navigation**:

---

## Static Page Content Management

### Goal
Enable admins to edit text and SEO content for hard-coded React pages (Home, About) without touching the code.

### Backend (`supabase`)
- **Table**: `static_pages` (id, slug, name)
- **Table**: `static_page_translations` (id, page_id, locale, seo_title, seo_description, seo_og_image_url) -> *Keeps SEO only*
- **Table**: `static_page_slots` (id, page_id, locale, slot_key, content_value, rich_content) -> *New*

### Admin UI (`apps/admin`)
- **List Page**: `/static-pages`
  - Lists "Landing Page" (/), "About Us" (/about)
- **Editor**: `/static-pages/[id]`
  - Tabbed interface for Locales (VI, EN, KO)
  - **Slot-Based Editor**:
    - Fetches all slots for the page/locale.
    - **Groups** slots by prefix (e.g., "Hero" group for `hero.title`, `hero.subtitle`).
    - **Dynamic Inputs**: Text inputs for simple values, Rich Text for complex ones.
    - **SEO Panel**: Separate panel for editing SEO fields from `static_page_translations`.
- **Service**: `staticContentService.ts` refactored to handle `getStaticSlots` and `updateStaticSlot`.

### Data Flow
1. **Load**: `staticContentService.getStaticSlots(pageId, locale)` + `getSeo(pageId, locale)`
2. **Edit**: Form updates local state for individual slots.
3. **Save**: Upserts into `static_page_slots` and `static_page_translations`.

