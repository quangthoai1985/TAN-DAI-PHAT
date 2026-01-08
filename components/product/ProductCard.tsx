"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/types/product";
import { CardInteractive } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
    slug: string;
    code: string;
    name: string;
    images: ProductImage[];
    price?: number;
    type?: string;
}

export default function ProductCard({ slug, code, name, images, price, type }: ProductCardProps) {
    // Get primary image or first image
    const primaryImage = images?.find((img) => img.is_primary) || images?.[0];
    const imageUrl = primaryImage?.image_url || "/placeholder-product.png";

    return (
        <Link href={`/san-pham/${slug}`} className="group block h-full">
            <CardInteractive className="h-full overflow-hidden flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick view button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Xem chi tiết
                        </span>
                    </div>

                    {/* Product type badge */}
                    {type && (
                        <div className="absolute top-3 left-3">
                            <Badge variant={type === 'PAINT' ? 'default' : 'secondary'} className="text-xs">
                                {type === 'PAINT' ? 'Sơn' : 'Gạch'}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col">
                    {/* Product Code */}
                    <p className="text-xs text-gray-500 font-medium mb-1 tracking-wide">
                        {code}
                    </p>

                    {/* Product Name */}
                    <h3
                        className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 flex-1"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        {name}
                    </h3>

                    {/* Price */}
                    {price && (
                        <p className="mt-2 text-base sm:text-lg font-bold text-indigo-600">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(price)}
                        </p>
                    )}
                </div>
            </CardInteractive>
        </Link>
    );
}
