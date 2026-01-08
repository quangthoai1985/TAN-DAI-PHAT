"use client";

import { useState } from "react";
import Image from "next/image";
import ImageZoom from "./ImageZoom";
import { ProductImage } from "@/types/product";

interface ProductGalleryProps {
    images: ProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">No Image</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                <ImageZoom src={activeImage.url} alt={activeImage.alt || "Product image"} />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {images.map((img) => (
                    <button
                        key={img.id}
                        onClick={() => setActiveImage(img)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all snap-start ${activeImage.id === img.id ? "border-blue-500 ring-2 ring-blue-100" : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={img.url}
                            alt={img.alt || "Thumbnail"}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
