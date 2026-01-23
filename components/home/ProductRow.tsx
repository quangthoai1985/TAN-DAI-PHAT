"use client";

import { useRef } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import ProductCarouselItem from "./ProductCarouselItem";
import AnimatedSection from "@/components/layout/AnimatedSection";

interface ProductRowProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
    className?: string;
}

export default function ProductRow({ title, products, viewAllLink, className = "" }: ProductRowProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = direction === "left" ? -container.clientWidth : container.clientWidth;
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (products.length === 0) return null;

    return (
        <div className={`py-6 md:py-8 ${className}`}>
            <AnimatedSection>
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-indigo-600 rounded-full block"></span>
                        {title}
                    </h3>
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
                        >
                            Xem thêm
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>
            </AnimatedSection>

            <div className="relative group">
                {/* Navigation Buttons */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none border border-gray-100"
                    aria-label="Previous slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none border border-gray-100"
                    aria-label="Next slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Scroll Area */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0 snap-start">
                            <ProductCarouselItem product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {viewAllLink && (
                <div className="mt-2 sm:hidden text-center">
                    <Link
                        href={viewAllLink}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        Xem tất cả {title}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
}
