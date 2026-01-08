import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import Link from "next/link";

export const revalidate = 3600;

async function getProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
            return [];
        }
        return (data as Product[]) || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();

    // Group products by type
    const paintProducts = products.filter(p => p.type === 'PAINT');
    const tileProducts = products.filter(p => p.type === 'TILE');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Tất cả sản phẩm</h1>
                    <p className="mt-2 text-gray-600">
                        Khám phá đầy đủ các sản phẩm vật liệu xây dựng của chúng tôi
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{products.length} sản phẩm</p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Category Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    <Link
                        href="/san-pham"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
                    >
                        Tất cả ({products.length})
                    </Link>
                    <Link
                        href="/nuoc-son"
                        className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200"
                    >
                        Nước sơn ({paintProducts.length})
                    </Link>
                    <Link
                        href="/gach"
                        className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200"
                    >
                        Gạch ốp lát ({tileProducts.length})
                    </Link>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product) => (
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
                            Chưa có sản phẩm
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Các sản phẩm sẽ được cập nhật sớm.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
