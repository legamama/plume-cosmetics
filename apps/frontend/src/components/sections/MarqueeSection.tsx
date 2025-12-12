"use client";

import { useTranslations } from "next-intl";

interface MarqueeSectionProps {
    text?: string;
    velocity?: number; // Not used in CSS version but kept for API compatibility if needed
    className?: string;
}

export function MarqueeSection({
    text,
    className
}: MarqueeSectionProps) {
    const t = useTranslations("home.marquee");
    // Use passed text, or translation, or fallback
    const displayText = text || t("text") || "Tự tin khoe da xinh, Plumé luôn bên bạn";

    return (
        <section className={`overflow-hidden bg-plume-rose text-white py-4 md:py-6 relative z-10 border-y border-white/10 ${className}`}>
            <div className="flex gap-8 group w-full max-w-[100vw]">
                {/* 
                   We need enough copies to ensure no gap on large screens.
                   2 containers, each with multiple text repetitions.
                   Animation moves the container -100% of its width.
                */}
                <div className="flex gap-8 animate-infinite-scroll min-w-full shrink-0 items-center justify-around">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="text-lg md:text-2xl font-medium tracking-wide inline-flex items-center gap-8 whitespace-nowrap">
                            {displayText}
                            <span className="w-2 h-2 rounded-full bg-white/40 block" />
                        </span>
                    ))}
                </div>
                {/* Second Copy for seamless look */}
                <div className="flex gap-8 animate-infinite-scroll min-w-full shrink-0 items-center justify-around" aria-hidden="true">
                    {[...Array(6)].map((_, i) => (
                        <span key={`dup-${i}`} className="text-lg md:text-2xl font-medium tracking-wide inline-flex items-center gap-8 whitespace-nowrap">
                            {displayText}
                            <span className="w-2 h-2 rounded-full bg-white/40 block" />
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .animate-infinite-scroll {
                    /* Slowed down to 50s as requested (50% slower than typical 20-30s) */
                    animation: infinite-scroll 50s linear infinite;
                }
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
            `}</style>
        </section>
    );
}

export default MarqueeSection;

