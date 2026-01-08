"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product, ProductType, PaintSpecs, TileSpecs } from "@/types/product";

interface ProductFormProps {
    initialData?: Product;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: initialData?.code || "",
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        type: initialData?.type || ("PAINT" as ProductType),
        price: initialData?.price || "",
        // Paint specs
        volume: (initialData?.specs as PaintSpecs)?.volume || "",
        color: (initialData?.specs as PaintSpecs)?.color || "",
        finish: (initialData?.specs as PaintSpecs)?.finish || "",
        coverage: (initialData?.specs as PaintSpecs)?.coverage || "",
        // Tile specs
        size: (initialData?.specs as TileSpecs)?.size || "",
        material: (initialData?.specs as TileSpecs)?.material || "",
        surface: (initialData?.specs as TileSpecs)?.surface || "",
        thickness: (initialData?.specs as TileSpecs)?.thickness || "",
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setImages((prev) => [...prev, ...files]);

            // Create previews
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Build specs based on product type
            const specs =
                formData.type === "PAINT"
                    ? {
                        volume: formData.volume,
                        color: formData.color,
                        finish: formData.finish,
                        coverage: formData.coverage,
                    }
                    : {
                        size: formData.size,
                        material: formData.material,
                        surface: formData.surface,
                        thickness: formData.thickness,
                    };

            const productData = {
                code: formData.code,
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                type: formData.type,
                price: formData.price ? Number(formData.price) : null,
                specs,
                images: [], // Will be updated after image upload
            };

            // TODO: Implement actual API call to save product
            console.log("Product data:", productData);
            console.log("Images to upload:", images);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            router.push("/admin/products");
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã sản phẩm *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.code}
                            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="VD: SON-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loại sản phẩm *
                        </label>
                        <select
                            required
                            value={formData.type}
                            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as ProductType }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="PAINT">Nước sơn</option>
                            <option value="TILE">Gạch ốp lát</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên sản phẩm *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleNameChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug (URL)
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="ten-san-pham"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá (VNĐ)
                        </label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Mô tả chi tiết sản phẩm..."
                        />
                    </div>
                </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông số kỹ thuật ({formData.type === "PAINT" ? "Nước sơn" : "Gạch ốp lát"})
                </h2>

                {formData.type === "PAINT" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thể tích</label>
                            <input
                                type="text"
                                value={formData.volume}
                                onChange={(e) => setFormData((prev) => ({ ...prev, volume: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: 18L"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: Trắng"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Độ bóng</label>
                            <input
                                type="text"
                                value={formData.finish}
                                onChange={(e) => setFormData((prev) => ({ ...prev, finish: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: Bóng, Mờ"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích phủ</label>
                            <input
                                type="text"
                                value={formData.coverage}
                                onChange={(e) => setFormData((prev) => ({ ...prev, coverage: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: 10-12m²/L/2 lớp"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                            <input
                                type="text"
                                value={formData.size}
                                onChange={(e) => setFormData((prev) => ({ ...prev, size: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: 60x60cm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chất liệu</label>
                            <input
                                type="text"
                                value={formData.material}
                                onChange={(e) => setFormData((prev) => ({ ...prev, material: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: Porcelain"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bề mặt</label>
                            <input
                                type="text"
                                value={formData.surface}
                                onChange={(e) => setFormData((prev) => ({ ...prev, surface: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: Bóng, Mờ, Nhám"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Độ dày</label>
                            <input
                                type="text"
                                value={formData.thickness}
                                onChange={(e) => setFormData((prev) => ({ ...prev, thickness: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="VD: 10mm"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh sản phẩm</h2>

                <div className="space-y-4">
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                    <Image
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded">
                                            Ảnh chính
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                            Click để chọn ảnh hoặc kéo thả vào đây
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, WEBP tối đa 5MB. Ảnh đầu tiên sẽ là ảnh chính.
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                    {isEditing ? "Cập nhật" : "Thêm sản phẩm"}
                </button>
            </div>
        </form>
    );
}
