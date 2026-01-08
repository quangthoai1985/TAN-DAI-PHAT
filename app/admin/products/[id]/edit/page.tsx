"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types/product";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const productId = params?.id as string;
        if (!productId) return;

        async function fetchProduct() {
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("id", productId)
                    .single();

                if (error) {
                    console.error("Error fetching product:", error);
                    if (error.code === 'PGRST116') { // Not found
                        return;
                    }
                    alert("Không thể tải thông tin sản phẩm");
                    return;
                }

                setProduct(data as Product);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [params?.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy sản phẩm</h2>
                <button
                    onClick={() => router.push('/admin/products')}
                    className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Cập nhật thông tin và hình ảnh sản phẩm
                </p>
            </div>

            <ProductForm initialData={product} isEditing={true} />
        </div>
    );
}
