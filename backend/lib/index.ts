/**
 * Plumé Backend Library - Index
 * 
 * Re-exports all public API functions and types
 */

// Supabase client
export { supabase, supabaseAdmin, getAdminClient, createUserClient } from './supabaseClient';

// Types
export * from './types';

// Public API functions
export * from './products';
export * from './blog';
export * from './categories';
export * from './pages';
export * from './redirects';

// Admin API functions (re-export under admin namespace)
export * as adminProducts from './admin/products';
export * as adminBlog from './admin/blog';
export * as adminPages from './admin/pages';
export * as adminNavigation from './admin/navigation';
