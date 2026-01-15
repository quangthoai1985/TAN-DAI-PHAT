"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

export default function ProductCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(8);

            if (error) throw error;
            if (data) setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = direction === "left" ? -container.clientWidth : container.clientWidth;
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 sm:py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-red-600 uppercase tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        Vật liệu xây dựng mới
                    </h2>
                    <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-red-50 hover:text-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none"
                        aria-label="Previous slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-red-50 hover:text-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none"
                        aria-label="Next slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Scroll Area */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => {
                            const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url || "/placeholder-image.jpg";
                            const categoryName = product.type === "PAINT" ? "NƯỚC SƠN" : "GẠCH ỐP LÁT";

                            return (
                                <div
                                    key={product.id}
                                    className="flex-none w-[280px] sm:w-[320px] snap-center bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group/card"
                                >
                                    {/* Image */}
                                    <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={primaryImage}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider shadow-sm">
                                            {categoryName}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3
                                            className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] mb-4 group-hover/card:text-red-600 transition-colors"
                                            style={{ fontFamily: "var(--font-montserrat)" }}
                                        >
                                            <Link href={`/san-pham/${product.slug}`} className="hover:underline decoration-red-600/30 underline-offset-4">
                                                {product.name}
                                            </Link>
                                        </h3>

                                        <Link
                                            href="tel:0907970889"
                                            className="block w-full py-3 text-center bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors uppercase text-sm tracking-wide shadow-red-200 shadow-lg transform active:scale-95 duration-200"
                                        >
                                            Liên hệ
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white text-base font-bold rounded-full shadow-lg shadow-red-600/30 hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider"
                    >
                        <span>Xem tất cả sản phẩm</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
