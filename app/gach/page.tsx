import { supabase } from "@/lib/supabase";
import CategoryProductList from "@/components/product/CategoryProductList";
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
                <CategoryProductList initialProducts={products} />
            </div>
        </div>
    );
}
