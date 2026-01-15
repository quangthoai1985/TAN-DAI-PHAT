"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";

interface CategoryProductListProps {
    initialProducts: Product[];
}

export default function CategoryProductList({ initialProducts }: CategoryProductListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return initialProducts;

        const lowerQuery = searchQuery.toLowerCase().trim();
        return initialProducts.filter((product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.code.toLowerCase().includes(lowerQuery)
        );
    }, [initialProducts, searchQuery]);

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-8 max-w-md mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all shadow-sm text-gray-700"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            slug={product.slug}
                            code={product.code}
                            name={product.name}
                            images={product.images}
                            price={product.price}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        Không tìm thấy sản phẩm
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Vui lòng thử từ khóa khác.
                    </p>
                </div>
            )}
        </div>
    );
}
