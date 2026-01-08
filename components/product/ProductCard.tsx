"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/types/product";

interface ProductCardProps {
    slug: string;
    code: string;
    name: string;
    images: ProductImage[];
    price?: number;
}

export default function ProductCard({ slug, code, name, images, price }: ProductCardProps) {
    // Get primary image or first image
    const primaryImage = images?.find((img) => img.is_primary) || images?.[0];
    const imageUrl = primaryImage?.image_url || "/placeholder-product.png";

    return (
        <Link
            href={`/san-pham/${slug}`}
            className="group block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Product Code */}
                <p className="text-xs text-gray-500 font-medium mb-1">
                    {code}
                </p>

                {/* Product Name */}
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {name}
                </h3>

                {/* Price */}
                {price && (
                    <p className="mt-2 text-base font-bold text-indigo-600">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(price)}
                    </p>
                )}
            </div>
        </Link>
    );
}
