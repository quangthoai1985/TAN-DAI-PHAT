import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";

export const revalidate = 3600; // Revalidate every hour

const categoryInfo = {
    title: "Gạch Ốp Lát",
    description: "Đa dạng các loại gạch men, gạch ốp lát cao cấp: gạch lát nền, gạch ốp tường, gạch trang trí...",
    slug: "gach",
};

async function getProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("type", "TILE")
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

export default async function TileCategoryPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {categoryInfo.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-amber-100">
                        {categoryInfo.description}
                    </p>
                    <p className="mt-2 text-sm text-amber-200">
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

                            {/* Size Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Kích thước</h4>
                                <div className="space-y-2">
                                    {["30x30cm", "40x40cm", "60x60cm", "80x80cm", "60x120cm"].map((size) => (
                                        <label key={size} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-600">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Material Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Chất liệu</h4>
                                <div className="space-y-2">
                                    {["Ceramic", "Porcelain", "Granite"].map((material) => (
                                        <label key={material} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-600">{material}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Surface Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Bề mặt</h4>
                                <div className="space-y-2">
                                    {["Bóng", "Mờ", "Nhám", "Vân gỗ", "Vân đá"].map((surface) => (
                                        <label key={surface} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-600">{surface}</span>
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
