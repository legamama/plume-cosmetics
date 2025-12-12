"use client";

import { cn } from "@/lib/cn";
import { Twitter, Linkedin, Pin, Mail, Phone, MessageCircle } from "lucide-react";
import { SocialLinkItem } from "@/lib/site-settings";

export interface SocialIconProps {
    size?: number;
    className?: string;
}

/**
 * Official-looking social media icons for Plumé
 * Uses accurate SVG paths for each platform
 * Colors are neutral by default, with brand colors on hover
 */

export function FacebookIcon({ size = 20, className }: SocialIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

export function TikTokIcon({ size = 20, className }: SocialIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

export function YouTubeIcon({ size = 20, className }: SocialIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

export function InstagramIcon({ size = 20, className }: SocialIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
    );
}

// Platform type for dynamic rendering (expanded)
export type SocialPlatform = string;

// Dynamic social icon component
interface SocialIconComponentProps extends SocialIconProps {
    platform: string;
}

export function SocialIcon({ platform, size = 20, className }: SocialIconComponentProps) {
    switch (platform.toLowerCase()) {
        case 'facebook': return <FacebookIcon size={size} className={className} />;
        case 'tiktok': return <TikTokIcon size={size} className={className} />;
        case 'youtube': return <YouTubeIcon size={size} className={className} />;
        case 'instagram': return <InstagramIcon size={size} className={className} />;
        case 'twitter': return <Twitter size={size} className={className} />;
        case 'linkedin': return <Linkedin size={size} className={className} />;
        case 'pinterest': return <Pin size={size} className={className} />;
        case 'phone': return <Phone size={size} className={className} />;
        case 'email': return <Mail size={size} className={className} />;
        case 'chat': return <MessageCircle size={size} className={className} />;
        default: return null;
    }
}

// Social link component with hover effect
interface SocialLinkProps {
    platform: string;
    href: string;
    size?: number;
    className?: string;
}

export function SocialLink({
    platform,
    href,
    size = 20,
    className,
}: SocialLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "inline-flex items-center justify-center p-2 rounded-full transition-all duration-200",
                "text-plume-charcoal hover:text-plume-rose",
                "hover:bg-plume-blush/30",
                className
            )}
            aria-label={`Follow us on ${platform}`}
        >
            <SocialIcon platform={platform} size={size} />
        </a>
    );
}

// Social links group component
interface SocialLinksProps {
    items?: SocialLinkItem[];
    // Legacy support
    links?: Record<string, string>;
    size?: number;
    className?: string;
    iconClassName?: string;
}

export function SocialLinks({ items, links, size = 20, className, iconClassName }: SocialLinksProps) {

    // Normalize to array
    let displayItems: Array<{ id: string; platform: string; url: string }> = [];

    if (items && Array.isArray(items)) {
        displayItems = items
            .filter(item => item.isEnabled)
            .sort((a, b) => a.order - b.order)
            .map(item => ({
                id: item.id,
                platform: item.icon || item.platform,
                url: item.url
            }));
    } else if (links) {
        // Legacy fallback
        displayItems = Object.entries(links).map(([platform, url]) => ({
            id: platform,
            platform,
            url
        }));
    }

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {displayItems.map((item) => (
                <SocialLink
                    key={item.id}
                    platform={item.platform}
                    href={item.url}
                    size={size}
                    className={iconClassName}
                />
            ))}
        </div>
    );
}

// For backward compatibility
export const socialIconMap = {
    facebook: FacebookIcon,
    tiktok: TikTokIcon,
    youtube: YouTubeIcon,
    instagram: InstagramIcon,
};
