import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";

export const revalidate = 3600; // Revalidate every hour

const categoryInfo = {
    title: "Nước Sơn",
    description: "Đa dạng các loại sơn nước chất lượng cao: sơn nội thất, sơn ngoại thất, sơn chống thấm, sơn trang trí...",
    slug: "nuoc-son",
};

async function getProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("type", "PAINT")
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

export default async function PaintCategoryPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {categoryInfo.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-indigo-100">
                        {categoryInfo.description}
                    </p>
                    <p className="mt-2 text-sm text-indigo-200">
                        {products.length} sản phẩm
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Filter Sidebar - Optional */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>

                            {/* Color Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Màu sắc</h4>
                                <div className="space-y-2">
                                    {["Trắng", "Kem", "Xám", "Xanh", "Vàng"].map((color) => (
                                        <label key={color} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-600">{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Finish Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Độ bóng</h4>
                                <div className="space-y-2">
                                    {["Bóng", "Mờ", "Bán bóng"].map((finish) => (
                                        <label key={finish} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-600">{finish}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Volume Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Thể tích</h4>
                                <div className="space-y-2">
                                    {["1L", "5L", "18L"].map((volume) => (
                                        <label key={volume} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-600">{volume}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
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
            </div>
        </div>
    );
}
