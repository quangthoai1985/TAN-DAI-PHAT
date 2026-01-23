"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import ProductRow from "./ProductRow";
import AnimatedSection from "@/components/layout/AnimatedSection";

export default function ProductCarousel() {
    const [tileProducts, setTileProducts] = useState<Product[]>([]);
    const [paintProducts, setPaintProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Fetch Tiles
            const tilesQuery = supabase
                .from("products")
                .select("id, name, slug, images, type, price, code")
                .eq("type", "TILE")
                .order("created_at", { ascending: false })
                .limit(8);

            // Fetch Paints
            const paintsQuery = supabase
                .from("products")
                .select("id, name, slug, images, type, price, code")
                .eq("type", "PAINT")
                .order("created_at", { ascending: false })
                .limit(8);

            const [tilesRes, paintsRes] = await Promise.all([tilesQuery, paintsQuery]);

            if (tilesRes.data) setTileProducts(tilesRes.data as unknown as Product[]);
            if (paintsRes.data) setPaintProducts(paintsRes.data as unknown as Product[]);

        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
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

    if (tileProducts.length === 0 && paintProducts.length === 0) return null;

    return (
        <section className="py-16 sm:py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Title */}
                <AnimatedSection>
                    <div className="text-center mb-4 sm:mb-8">
                        <h2
                            className="text-3xl sm:text-4xl font-bold text-red-600 uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            Vật liệu xây dựng mới
                        </h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Cập nhật những mẫu gạch ốp lát và nước sơn mới nhất, xu hướng hot nhất hiện nay
                        </p>
                    </div>
                </AnimatedSection>

                {/* Debugging */}
                {/* 
                <div className="text-center">
                    <p>Tiles: {tileProducts.length}</p>
                    <p>Paints: {paintProducts.length}</p>
                </div>
                */}

                {/* Tile Row */}
                {tileProducts.length > 0 && (
                    <div className="mb-8 sm:mb-12">
                        <ProductRow
                            title="Gạch Ốp Lát Cao Cấp"
                            products={tileProducts}
                            viewAllLink="/gach"
                        />
                    </div>
                )}

                {/* Paint Row */}
                {paintProducts.length > 0 && (
                    <ProductRow
                        title="Nước Sơn Chất Lượng"
                        products={paintProducts}
                        viewAllLink="/nuoc-son"
                    />
                )}

                {/* General View All Button */}
                <AnimatedSection delay={200}>
                    <div className="text-center mt-12 sm:mt-16">
                        <Link
                            href="/san-pham"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 border-2 border-red-600 text-base font-bold rounded-full hover:bg-red-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider"
                        >
                            <span>Xem tất cả sản phẩm</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
