"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { getOptimizedImageUrl } from "@/lib/storage";

interface ProductCarouselItemProps {
    product: Product;
}

export default function ProductCarouselItem({ product }: ProductCarouselItemProps) {
    // Get primary image or first image
    // Note: strict check for images array existence to avoid crashes
    const rawImageUrl = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url || "/placeholder-image.jpg";
    const optimizedUrl = getOptimizedImageUrl(rawImageUrl, 'medium');

    const [imgSrc, setImgSrc] = useState(optimizedUrl);

    useEffect(() => {
        setImgSrc(getOptimizedImageUrl(rawImageUrl, 'medium'));
    }, [rawImageUrl]);

    const categoryName = product.type === "PAINT" ? "NƯỚC SƠN" : "GẠCH ỐP LÁT";

    return (
        <div
            className="flex-none w-[280px] sm:w-[320px] snap-center bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group/card"
        >
            <Link href={`/san-pham/${product.slug}`} className="block">
                {/* Image */}
                <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden bg-gray-100">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                        sizes="(max-width: 768px) 280px, 320px"
                        onError={() => {
                            if (imgSrc !== rawImageUrl) {
                                setImgSrc(rawImageUrl);
                            }
                        }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider shadow-sm">
                        {categoryName}
                    </div>
                </div>

                {/* Content - Title only */}
                <div className="p-6 pb-0">
                    <h3
                        className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] mb-4 group-hover/card:text-red-600 transition-colors"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        {product.name}
                    </h3>
                </div>
            </Link>

            {/* Action Button */}
            <div className="px-6 pb-6">
                <Link
                    href="tel:0907970889"
                    className="block w-full py-3 text-center bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors uppercase text-sm tracking-wide shadow-red-200 shadow-lg transform active:scale-95 duration-200"
                >
                    Liên hệ
                </Link>
            </div>
        </div>
    );
}
