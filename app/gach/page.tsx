'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/product/ProductSkeleton';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { Product } from '@/types/product';

const ITEMS_PER_PAGE = 20;

export default function TileProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/products?page=${page}&limit=${ITEMS_PER_PAGE}&type=TILE`);
            const data = await res.json();

            setProducts((prev) => [...prev, ...data.products]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);

            if (page === 1) {
                setTotalCount(data.total);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
            setInitializing(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        loadMore();
    }, []);

    const observerTarget = useInfiniteScroll(loadMore, { threshold: 0.1 });

    const tabs = [
        { name: 'Tất cả', href: '/san-pham', active: false },
        { name: 'Nước sơn', href: '/nuoc-son', active: false },
        { name: `Gạch ốp lát (${totalCount || products.length})`, href: '/gach', active: true },
    ];

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <div className="bg-white border-b border-[hsl(var(--border))]">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
                    <h1
                        className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight animate-fade-in-up"
                        style={{ fontFamily: 'var(--font-montserrat)' }}
                    >
                        Gạch Ốp Lát
                    </h1>
                    <p className="mt-2 text-gray-600 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                        Khám phá bộ sưu tập gạch cao cấp
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`
                                flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium
                                transition-all duration-200 ease-out touch-target
                                ${tab.active
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </div>

                {initializing && products.length === 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                                >
                                    <ProductCard
                                        slug={product.slug}
                                        code={product.code}
                                        name={product.name}
                                        images={product.images}
                                        price={product.price}
                                        type={product.type}
                                    />
                                </div>
                            ))}
                        </div>

                        <div ref={observerTarget} className="mt-8 flex items-center justify-center min-h-[100px]">
                            {loading && (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm text-gray-500">Đang tải thêm sản phẩm...</p>
                                </div>
                            )}
                            {!hasMore && !loading && products.length > 0 && (
                                <p className="text-sm text-gray-500">Đã hiển thị tất cả sản phẩm</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'var(--font-montserrat)' }}>
                            Chưa có sản phẩm gạch
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">Các sản phẩm sẽ được cập nhật sớm.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
