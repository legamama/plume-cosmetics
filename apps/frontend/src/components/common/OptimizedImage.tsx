"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    containerClassName?: string;
    sizes?: string;
    quality?: number;
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    fill = false,
    priority = false,
    className,
    containerClassName,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality = 85,
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn("overflow-hidden", containerClassName)}>
            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                quality={quality}
                sizes={sizes}
                className={cn(
                    "transition-all duration-500",
                    isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
                    className
                )}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
