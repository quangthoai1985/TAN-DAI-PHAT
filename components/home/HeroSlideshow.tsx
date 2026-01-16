"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/**
 * =====================================================
 * HƯỚNG DẪN KÍCH THƯỚC ẢNH BANNER
 * =====================================================
 * 
 * ẢNH DESKTOP (url):
 * - Tỷ lệ: 21:9 (ultrawide)
 * - Kích thước khuyến nghị: 2520 x 1080 pixels
 * - Dùng cho: Laptop, PC, màn hình lớn (≥768px)
 * 
 * ẢNH MOBILE (mobile_url):
 * - Tỷ lệ: 4:3
 * - Kích thước khuyến nghị: 1200 x 900 pixels
 * - Dùng cho: Điện thoại, màn hình nhỏ (<768px)
 * 
 * =====================================================
 */

interface StoreImage {
    id: string;
    url: string;
    mobile_url: string | null;
    display_order: number;
}

export default function HeroSlideshow() {
    const [images, setImages] = useState<StoreImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data, error } = await supabase
                    .from("store_images")
                    .select("*")
                    .order("display_order", { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    setImages(data);
                }
            } catch (error) {
                console.error("Error fetching slideshow images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    if (loading) {
        return (
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] max-h-[90vh] bg-gradient-to-b from-red-600 to-red-700 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // Default static hero if no images are found
    if (images.length === 0) {
        return (
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                {/* Gradient Orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-28">
                    <div className="max-w-2xl animate-fade-in-up">
                        <p className="text-indigo-300 font-medium mb-3 tracking-wide text-sm uppercase">
                            Vật liệu xây dựng chất lượng cao
                        </p>
                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            <span className="block text-white">Vật Liệu Xây Dựng</span>
                            <span className="block mt-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                TÂN ĐẠI PHÁT
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-indigo-100/90 max-w-xl leading-relaxed">
                            Cung cấp đa dạng các loại vật liệu xây dựng chất lượng cao với giá cả cạnh tranh.
                            Sơn nước, gạch ốp lát và nhiều sản phẩm khác.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Link
                                href="/san-pham"
                                className="group inline-flex items-center justify-center gap-3 h-14 px-8 bg-white text-indigo-700 rounded-xl font-semibold text-base shadow-xl shadow-black/20 hover:bg-indigo-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
                            >
                                <span>Xem sản phẩm</span>
                                <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <a
                                href="tel:0907970889"
                                className="group inline-flex items-center justify-center gap-3 h-14 px-8 border-2 border-indigo-400/50 text-white rounded-xl font-semibold text-base backdrop-blur-sm hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Liên hệ ngay</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-red-700 to-red-600 group">
            {/* Container with responsive aspect ratio */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[24/9] max-h-[90vh]">
                {/* Slides */}
                {images.map((img, index) => (
                    <div
                        key={img.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        {/* Responsive Picture Element */}
                        <picture className="w-full h-full">
                            {/* Mobile image (< 768px) - use mobile_url if available, fallback to url */}
                            {img.mobile_url && (
                                <source
                                    media="(max-width: 767px)"
                                    srcSet={img.mobile_url}
                                />
                            )}
                            {/* Desktop image (>= 768px) */}
                            <img
                                src={img.url}
                                alt="Store Banner"
                                className={`w-full h-full object-contain transition-transform duration-[5000ms] ${index === currentIndex ? "scale-100" : "scale-100"
                                    }`}
                            />
                        </picture>
                    </div>
                ))}

                {/* Indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-white w-6 sm:w-8"
                                    : "bg-white/40 hover:bg-white/60"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}
