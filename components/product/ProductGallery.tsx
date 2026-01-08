"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

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
    const lightboxRef = useRef<HTMLDivElement>(null);
    const lastTouchDistance = useRef<number | null>(null);

    const activeImage = sortedImages[activeIndex];

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
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    const closeLightbox = useCallback(() => {
        setIsLightboxOpen(false);
        setScale(1);
        setPosition({ x: 0, y: 0 });
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
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Không có hình ảnh
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* Main Image */}
                <div
                    className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in group shadow-lg"
                    onClick={openLightbox}
                >
                    <Image
                        src={activeImage.image_url}
                        alt="Product image"
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority={activeImage.is_primary}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        Phóng to
                    </div>
                </div>

                {/* Thumbnails */}
                {sortedImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                        {sortedImages.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveIndex(index)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeIndex === index
                                        ? "border-indigo-500 ring-2 ring-indigo-200 shadow-md"
                                        : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300"
                                    }`}
                            >
                                <Image
                                    src={img.image_url}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover"
                                    sizes="80px"
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
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                        onClick={closeLightbox}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
                        {activeIndex + 1} / {sortedImages.length}
                    </div>

                    {/* Prev button */}
                    {sortedImages.length > 1 && (
                        <button
                            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
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
                            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
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
                        className="relative w-full h-full max-w-5xl max-h-[90vh] m-4"
                        onClick={(e) => e.stopPropagation()}
                        onTouchEnd={handleDoubleTap}
                    >
                        <Image
                            src={activeImage.image_url}
                            alt="Product image fullscreen"
                            fill
                            className="object-contain transition-transform duration-200"
                            style={{
                                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                            }}
                            sizes="100vw"
                            priority
                        />
                    </div>

                    {/* Zoom hint on mobile */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm md:hidden">
                        Chạm 2 lần để phóng to
                    </div>
                </div>
            )}
        </>
    );
}
