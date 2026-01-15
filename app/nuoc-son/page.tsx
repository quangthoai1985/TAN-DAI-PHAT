import { supabase } from "@/lib/supabase";
import CategoryProductList from "@/components/product/CategoryProductList";
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
                <CategoryProductList initialProducts={products} />
            </div>
        </div>
    );
}
