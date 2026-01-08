export type ProductType = 'PAINT' | 'TILE';

export interface ProductImage {
    id: string;
    url: string;
    alt?: string;
}

export interface PaintSpecs {
    volume?: string;       // Thể tích
    color?: string;        // Màu sắc
    finish?: string;       // Độ bóng
    coverage?: string;     // Diện tích phủ
}

export interface TileSpecs {
    size?: string;         // Kích thước
    material?: string;     // Chất liệu
    surface?: string;      // Bề mặt
    thickness?: string;    // Độ dày
}

export interface Product {
    id: string;
    code: string;
    name: string;
    slug: string;
    description?: string;
    category_id?: string;
    type: ProductType;
    price?: number;
    images: ProductImage[];
    specs: PaintSpecs | TileSpecs;
    created_at: string;
}
