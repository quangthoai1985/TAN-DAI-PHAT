"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/storage";

interface GalleryImage {
    id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
}

interface ProductGalleryProps {
    images: GalleryImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    // Sort images by display_order, primary first
    const sortedImages = [...images].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.display_order - b.display_order;
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const lastTouchDistance = useRef<number | null>(null);

    const activeImage = sortedImages[activeIndex];

    // Auto-slideshow functionality
    useEffect(() => {
        // Only autoplay if:
        // 1. There is more than 1 image
        // 2. Not currently hovering over the gallery
        // 3. Lightbox is not open
        if (sortedImages.length <= 1 || isHovered || isLightboxOpen) return;

        const interval = setInterval(() => {
            // Trigger fade out
            setIsFading(true);
            // Change image after fade out, then fade in
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % sortedImages.length);
                // Small delay to allow React to update, then fade in
                setTimeout(() => setIsFading(false), 50);
            }, 300); // 300ms for fade out
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [sortedImages.length, isHovered, isLightboxOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;

            switch (e.key) {
                case "Escape":
                    closeLightbox();
                    break;
                case "ArrowLeft":
                    goToPrev();
                    break;
                case "ArrowRight":
                    goToNext();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen, activeIndex]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLightboxOpen]);

    const openLightbox = useCallback(() => {
        setIsLightboxOpen(true);
        setIsAnimating(true);
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setTimeout(() => setIsAnimating(false), 300);
    }, []);

    const closeLightbox = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsLightboxOpen(false);
            setIsAnimating(false);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }, 200);
    }, []);

    const goToNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % sortedImages.length);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [sortedImages.length]);

    const goToPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [sortedImages.length]);

    // Pinch-to-zoom handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            lastTouchDistance.current = distance;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && lastTouchDistance.current) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const delta = distance / lastTouchDistance.current;
            setScale((prev) => Math.min(Math.max(prev * delta, 1), 4));
            lastTouchDistance.current = distance;
        }
    };

    const handleTouchEnd = () => {
        lastTouchDistance.current = null;
    };

    // Double tap to zoom
    const lastTap = useRef<number>(0);
    const handleDoubleTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            setScale((prev) => (prev > 1 ? 1 : 2));
            setPosition({ x: 0, y: 0 });
        }
        lastTap.current = now;
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Không có hình ảnh</p>
                </div>
            </div>
        );
    }

    // Use centralized helper
    const getImageUrl = (url: string, variant: 'thumb' | 'medium' | 'full' = 'medium') => {
        return getOptimizedImageUrl(url, variant);
    };

    return (
        <>
            <div className="flex flex-col gap-3 sm:gap-4">
                {/* Main Image */}
                <div
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group shadow-lg transition-shadow duration-300 hover:shadow-xl"
                    onClick={openLightbox}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Image
                        src={getImageUrl(activeImage.image_url, 'medium')}
                        alt="Product image"
                        fill
                        className={`object-contain transition-all duration-300 ease-in-out group-hover:scale-105 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority={activeImage.is_primary}
                        onError={(e) => {
                            // Fallback to original URL if variant doesn't exist (old images)
                            const target = e.target as HTMLImageElement;
                            if (target.src !== activeImage.image_url) {
                                target.src = activeImage.image_url;
                            }
                        }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                    {/* Zoom hint */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        Phóng to
                    </div>

                    {/* Image counter */}
                    {sortedImages.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white">
                            {activeIndex + 1} / {sortedImages.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {sortedImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {sortedImages.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveIndex(index)}
                                className={`
                                    relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden
                                    transition-all duration-200 ease-out touch-target
                                    ${activeIndex === index
                                        ? "ring-2 ring-indigo-500 ring-offset-2 shadow-lg scale-105"
                                        : "opacity-60 hover:opacity-100 border border-gray-200 hover:border-gray-300"
                                    }
                                `}
                            >
                                <Image
                                    src={getImageUrl(img.image_url, 'thumb')}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (target.src !== img.image_url) {
                                            target.src = img.image_url;
                                        }
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div
                    ref={lightboxRef}
                    className={`
                        fixed inset-0 z-50 bg-black/95 flex items-center justify-center
                        transition-opacity duration-300
                        ${isAnimating ? (isLightboxOpen ? "opacity-0" : "opacity-100") : "opacity-100"}
                    `}
                    onClick={closeLightbox}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ animation: isLightboxOpen ? "fadeIn 0.3s ease-out forwards" : "" }}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white backdrop-blur-sm touch-target"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeLightbox();
                        }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                        {activeIndex + 1} / {sortedImages.length}
                    </div>

                    {/* Prev button */}
                    {sortedImages.length > 1 && (
                        <button
                            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white backdrop-blur-sm touch-target hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrev();
                            }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Next button */}
                    {sortedImages.length > 1 && (
                        <button
                            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white backdrop-blur-sm touch-target hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative w-full h-[80vh] sm:h-[90vh] max-w-[95vw] sm:max-w-[90vw] m-4"
                        onClick={(e) => e.stopPropagation()}
                        onTouchEnd={handleDoubleTap}
                        style={{ animation: "scaleIn 0.3s ease-out forwards" }}
                    >
                        <Image
                            src={getImageUrl(activeImage.image_url, 'full')}
                            alt="Product image fullscreen"
                            fill
                            className="object-contain transition-transform duration-200"
                            style={{
                                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                            }}
                            sizes="100vw"
                            priority
                            unoptimized
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== activeImage.image_url) {
                                    target.src = activeImage.image_url;
                                }
                            }}
                        />
                    </div>

                    {/* Lightbox Thumbnails */}
                    {sortedImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-3 bg-black/40 backdrop-blur-sm rounded-2xl max-w-[90vw] overflow-x-auto scrollbar-hide">
                            {sortedImages.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveIndex(index);
                                        setScale(1);
                                        setPosition({ x: 0, y: 0 });
                                    }}
                                    className={`
                                        relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden
                                        transition-all duration-200 ease-out
                                        ${activeIndex === index
                                            ? "ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-110 shadow-lg"
                                            : "opacity-50 hover:opacity-80 border border-white/20"
                                        }
                                    `}
                                >
                                    <Image
                                        src={getImageUrl(img.image_url, 'thumb')}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="56px"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (target.src !== img.image_url) {
                                                target.src = img.image_url;
                                            }
                                        }}
                                    />
                                    {/* Active indicator dot */}
                                    {activeIndex === index && (
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Zoom hint on mobile - adjusted position */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm md:hidden">
                        Chạm 2 lần để phóng to
                    </div>
                </div>
            )}
        </>
    );
}
