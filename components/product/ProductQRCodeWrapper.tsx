"use client";

import ProductQRCode from "./ProductQRCode";
import { ProductImage } from "@/types/product";

interface ProductQRCodeWrapperProps {
    slug: string;
    productName: string;
    productCode: string;
    images: ProductImage[];
}

export default function ProductQRCodeWrapper({
    slug,
    productName,
    productCode,
    images,
}: ProductQRCodeWrapperProps) {
    // Build the full product URL
    const baseUrl = typeof window !== "undefined"
        ? window.location.origin
        : "https://tandaiphat.vn";
    const productUrl = `${baseUrl}/san-pham/${slug}`;

    return (
        <ProductQRCode
            productUrl={productUrl}
            productName={productName}
            productCode={productCode}
            images={images}
        />
    );
}
