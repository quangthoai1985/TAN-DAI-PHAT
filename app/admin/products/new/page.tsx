"use client";

import { useSearchParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { ProductType } from "@/types/product";

export default function NewProductPage() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get("type");
    const defaultType: ProductType = typeParam === "TILE" ? "TILE" : "PAINT";

    const typeLabel = defaultType === "PAINT" ? "Nước sơn" : "Gạch";

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Thêm {typeLabel} mới</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Điền thông tin và upload hình ảnh sản phẩm
                </p>
            </div>

            <ProductForm defaultType={defaultType} />
        </div>
    );
}
