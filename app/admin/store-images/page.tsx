"use client";

import StoreImageManager from "@/components/admin/StoreImageManager";

export default function StoreImagesPage() {
    return (
        <div className="space-y-8">
            <div className="animate-fade-in-up">
                <h1
                    className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                >
                    Ảnh cửa hàng
                </h1>
                <p className="mt-1 text-gray-500 text-sm">
                    Quản lý hình ảnh hiển thị trên slide trang chủ
                </p>
            </div>

            <StoreImageManager />
        </div>
    );
}
