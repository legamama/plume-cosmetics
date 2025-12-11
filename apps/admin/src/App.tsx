// Main Application Component

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingPage } from './components/ui/LoadingSpinner';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProductsListPage, ProductEditorPage } from './pages/products';
import { BlogListPage, BlogEditorPage } from './pages/blog';
import { PagesListPage, PageEditorPage } from './pages/pages';
import { PlasmicPagesListPage } from './pages/plasmic';
import { MediaPage } from './pages/media/MediaPage';
import { RedirectsPage } from './pages/Redirects';
import { TikTokFeedPage } from './pages/content/TikTokFeedPage';
import { StaticPagesListPage } from './pages/static-pages/StaticPagesListPage';
import { StaticPageEditorPage } from './pages/static-pages/StaticPageEditorPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />

        {/* Products */}
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/new" element={<ProductEditorPage />} />
        <Route path="/products/:id" element={<ProductEditorPage />} />

        {/* Blog */}
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/new" element={<BlogEditorPage />} />
        <Route path="/blog/:id" element={<BlogEditorPage />} />

        {/* Plasmic Pages - Visual page builder */}
        <Route path="/plasmic-pages" element={<PlasmicPagesListPage />} />

        {/* Legacy Pages - Supabase-based page builder (deprecated for marketing) */}
        <Route path="/pages" element={<PagesListPage />} />
        {/* Legacy Pages - Supabase-based page builder (deprecated for marketing) */}
        <Route path="/pages" element={<PagesListPage />} />
        <Route path="/pages/:id" element={<PageEditorPage />} />

        {/* Static Content - Managing hand-coded pages */}
        <Route path="/static-pages" element={<StaticPagesListPage />} />
        <Route path="/static-pages/:id" element={<StaticPageEditorPage />} />

        {/* Media */}
        <Route path="/media" element={<MediaPage />} />

        {/* TikTok Feed */}
        <Route path="/tiktok-feed" element={<TikTokFeedPage />} />

        {/* Redirects */}
        <Route path="/redirects" element={<RedirectsPage />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
