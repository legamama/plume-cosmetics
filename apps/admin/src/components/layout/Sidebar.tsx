// Sidebar navigation component

import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FileText,
    Image,
    Settings,
    ChevronLeft,
    ChevronRight,
    ArrowLeftRight,
    Palette,
    Archive,
    Film,
} from 'lucide-react';
import { useState } from 'react';
import { GlassPanel } from '@/components/ui/glass/GlassPanel';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/blog', label: 'Blog', icon: FileText },
    { path: '/plasmic-pages', label: 'Plasmic Pages', icon: Palette },
    { path: '/pages', label: 'Legacy Pages', icon: Archive },
    { path: '/static-pages', label: 'Static Content', icon: FileText },
    { path: '/media', label: 'Media', icon: Image },
    { path: '/redirects', label: 'Redirects', icon: ArrowLeftRight },
    { path: '/tiktok-feed', label: 'TikTok Feed', icon: Film },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <GlassPanel
            variant="sidebar"
            className={`
                flex flex-col h-screen z-20
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-16' : 'w-64'}
            `}
        >
            {/* Logo/Brand */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/20">
                {!isCollapsed && (
                    <div className="flex items-center gap-2 px-2">
                        <img
                            src="/images/logo.png"
                            alt="Plumé Admin"
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-white/50 text-gray-500 transition-colors"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2">
                <ul className="space-y-1">
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-plume-rose/10 text-plume-rose font-medium shadow-sm backdrop-blur-sm'
                                        : 'text-gray-500 hover:bg-white/40 hover:text-gray-900'
                                    }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                                title={isCollapsed ? label : undefined}
                            >
                                <Icon size={20} />
                                {!isCollapsed && <span>{label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-white/20">
                    <div className="text-xs text-gray-400">
                        © 2024 Plumé Cosmetics
                    </div>
                </div>
            )}
        </GlassPanel>
    );
}
