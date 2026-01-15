import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductGallery from "@/components/product/ProductGallery";
import { Product, PaintSpecs, TileSpecs } from "@/types/product";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

async function getProduct(slug: string): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error || !data) {
            return null;
        }
        return data as Product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export default async function ProductDetailPage(props: Props) {
    const params = await props.params;
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    // Helper to render specs based on type
    const renderSpecs = () => {
        if (product.type === "PAINT") {
            const specs = product.specs as PaintSpecs;
            return (
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    {specs.volume && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Thể tích</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.volume}</dd>
                        </div>
                    )}
                    {specs.color && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Màu sắc</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.color}</dd>
                        </div>
                    )}
                    {specs.finish && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Độ bóng</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.finish}</dd>
                        </div>
                    )}
                    {specs.coverage && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Diện tích phủ</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.coverage}</dd>
                        </div>
                    )}
                </dl>
            );
        } else if (product.type === "TILE") {
            const specs = product.specs as TileSpecs;
            return (
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    {specs.size && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Kích thước</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.size}</dd>
                        </div>
                    )}
                    {specs.material && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Chất liệu</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.material}</dd>
                        </div>
                    )}
                    {specs.surface && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Bề mặt</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.surface}</dd>
                        </div>
                    )}
                    {specs.thickness && (
                        <div className="border-t border-gray-100 pt-4">
                            <dt className="font-medium text-gray-900">Độ dày</dt>
                            <dd className="mt-2 text-sm text-gray-500">{specs.thickness}</dd>
                        </div>
                    )}
                </dl>
            );
        }
        return null;
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                    {/* Gallery Section - 60-70% width on desktop -> col-span-7 or 8 */}
                    <div className="lg:col-span-8">
                        <ProductGallery images={product.images} />
                    </div>

                    {/* Info Section */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:col-span-4 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">
                                {product.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) : 'Liên hệ'}
                            </p>
                        </div>

                        <div className="mt-2">
                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                Mã SP: {product.code}
                            </span>
                            <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {product.type === 'PAINT' ? 'Nước Sơn' : 'Gạch Ốp Lát'}
                            </span>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-gray-700">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-medium text-gray-900">Thông số kỹ thuật</h3>
                            <div className="mt-4">
                                {renderSpecs()}
                            </div>
                        </div>

                        <div className="mt-10 flex">
                            <a
                                href="https://zalo.me/0907970889"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                            >
                                Liên hệ đặt hàng
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
