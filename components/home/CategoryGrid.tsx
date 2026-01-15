"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface CategoryData {
    id: string;
    name: string;
    count: number;
    image: string;
    href: string;
}

export default function CategoryGrid() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryData();
    }, []);

    const fetchCategoryData = async () => {
        try {
            // 1. Fetch Paint Data
            const { count: paintCount, data: paintData, error: paintError } = await supabase
                .from("products")
                .select("images", { count: "exact", head: false })
                .eq("type", "PAINT")
                .limit(1)
                .order("created_at", { ascending: false });

            if (paintError) throw paintError;

            // 2. Fetch Tile Data
            const { count: tileCount, data: tileData, error: tileError } = await supabase
                .from("products")
                .select("images", { count: "exact", head: false })
                .eq("type", "TILE")
                .limit(1)
                .order("created_at", { ascending: false });

            if (tileError) throw tileError;

            // Process results
            const paintImage = paintData?.[0]?.images?.find((img: any) => img.is_primary)?.image_url
                || paintData?.[0]?.images?.[0]?.image_url
                || "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=2031&auto=format&fit=crop"; // Fallback paint image

            const tileImage = tileData?.[0]?.images?.find((img: any) => img.is_primary)?.image_url
                || tileData?.[0]?.images?.[0]?.image_url
                || "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop"; // Fallback tile image

            const cats: CategoryData[] = [
                {
                    id: "paint",
                    name: "NƯỚC SƠN",
                    count: paintCount || 0,
                    image: paintImage,
                    href: "/san-pham?type=PAINT"
                },
                {
                    id: "tile",
                    name: "GẠCH ỐP LÁT",
                    count: tileCount || 0,
                    image: tileImage,
                    href: "/san-pham?type=TILE"
                }
            ];

            setCategories(cats);

        } catch (error) {
            console.error("Error fetching category data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-red-600 uppercase tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        Danh mục VLXD
                    </h2>
                    <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className="group relative flex flex-col items-center animate-fade-in-up lg:col-span-2 lg:odd:justify-self-end lg:even:justify-self-start" // Centering logic for 2 items in 4-col grid
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Circular Image Container */}
                            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-xl ring-4 ring-gray-100 group-hover:ring-red-500/30 transition-all duration-500 transform group-hover:scale-105">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-8 sm:pb-12 text-center p-4">
                                    <h3
                                        className="text-white font-bold text-lg sm:text-xl uppercase tracking-wider drop-shadow-md"
                                        style={{ fontFamily: "var(--font-montserrat)" }}
                                    >
                                        {category.name}
                                    </h3>
                                    <p className="text-white/90 text-xs sm:text-sm font-medium mt-1 drop-shadow-md">
                                        {category.count} sản phẩm
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
