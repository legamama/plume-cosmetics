// Top navigation bar component

import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../../hooks';
import { useState, useRef, useEffect } from 'react';

export function Topbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
            {/* Left side - Page title or breadcrumbs could go here */}
            <div className="flex items-center gap-4">
                {/* Placeholder for breadcrumbs or page title */}
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                    className="p-2 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors relative"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-plume-coral rounded-full" />
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-plume-rose flex items-center justify-center">
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt={user.user_metadata?.full_name || 'User'}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <User size={18} className="text-plume-coral-dark" />
                            )}
                        </div>
                        <div className="hidden sm:block text-left">
                            <div className="text-sm font-medium text-text-primary">
                                {user?.user_metadata?.full_name || 'Admin'}
                            </div>
                            <div className="text-xs text-text-muted">
                                {user?.email || 'admin@plume.vn'}
                            </div>
                        </div>
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-lg shadow-medium border border-border py-1 z-50">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                            >
                                <LogOut size={16} />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
