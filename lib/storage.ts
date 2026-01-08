import { getSupabase } from './supabase';

const BUCKET_NAME = 'product-images';

/**
 * ===========================================
 * SUPABASE STORAGE SETUP GUIDE
 * ===========================================
 * 
 * 1. Tạo bucket "product-images" trong Supabase Dashboard:
 *    - Vào Storage > Create new bucket
 *    - Name: product-images
 *    - Public bucket: ON (cho phép public read)
 * 
 * 2. Thiết lập Storage Policies:
 *    
 *    -- Policy cho phép PUBLIC READ (SELECT):
 *    CREATE POLICY "Public Access" ON storage.objects
 *    FOR SELECT USING (bucket_id = 'product-images');
 *    
 *    -- Policy cho phép authenticated users INSERT:
 *    CREATE POLICY "Authenticated Upload" ON storage.objects
 *    FOR INSERT WITH CHECK (
 *      bucket_id = 'product-images' 
 *      AND auth.role() = 'authenticated'
 *    );
 *    
 *    -- Policy cho phép authenticated users DELETE:
 *    CREATE POLICY "Authenticated Delete" ON storage.objects
 *    FOR DELETE USING (
 *      bucket_id = 'product-images' 
 *      AND auth.role() = 'authenticated'
 *    );
 * 
 * 3. Cấu trúc folder:
 *    product-images/
 *    ├── {product_id}/
 *    │   ├── main.webp
 *    │   ├── thumb_1.webp
 *    │   └── thumb_2.webp
 * 
 * ===========================================
 */

export interface UploadResult {
    success: boolean;
    path?: string;
    url?: string;
    error?: string;
}

/**
 * Generate unique filename with timestamp
 */
function generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
    return `${timestamp}_${Math.random().toString(36).substring(7)}.${sanitizedExt}`;
}

/**
 * Compress/resize image using Canvas API (client-side)
 * Returns a Blob of the optimized image
 */
export async function optimizeImage(
    file: File,
    options: {
        maxWidth?: number;
        maxHeight?: number;
        quality?: number;
        format?: 'webp' | 'jpeg';
    } = {}
): Promise<Blob> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.85,
        format = 'webp',
    } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            // Draw to canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                },
                `image/${format}`,
                quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Upload product image to Supabase Storage
 * 
 * @param productId - Product ID for folder organization
 * @param file - File to upload
 * @param options - Upload options
 * @returns Upload result with path and public URL
 */
export async function uploadProductImage(
    productId: string,
    file: File,
    options: {
        optimize?: boolean;
        isPrimary?: boolean;
    } = {}
): Promise<UploadResult> {
    const { optimize = true, isPrimary = false } = options;

    try {
        const supabase = getSupabase();

        // Prepare file
        let uploadData: Blob | File = file;
        let fileName = generateFileName(file.name);

        // Optimize if requested (client-side only)
        if (optimize && typeof window !== 'undefined') {
            try {
                uploadData = await optimizeImage(file, {
                    maxWidth: 1200,
                    maxHeight: 1200,
                    quality: 0.85,
                    format: 'webp',
                });
                fileName = fileName.replace(/\.[^.]+$/, '.webp');
            } catch (e) {
                console.warn('Image optimization failed, uploading original:', e);
            }
        }

        // If primary, name it 'main'
        if (isPrimary) {
            fileName = `main.${fileName.split('.').pop()}`;
        }

        const filePath = `${productId}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, uploadData, {
                cacheControl: '3600',
                upsert: true,
                contentType: uploadData.type || 'image/webp',
            });

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return {
            success: true,
            path: data.path,
            url: urlData.publicUrl,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Upload multiple images for a product
 */
export async function uploadProductImages(
    productId: string,
    files: File[],
    primaryIndex: number = 0
): Promise<UploadResult[]> {
    const results = await Promise.all(
        files.map((file, index) =>
            uploadProductImage(productId, file, {
                optimize: true,
                isPrimary: index === primaryIndex,
            })
        )
    );
    return results;
}

/**
 * Delete product image from Supabase Storage
 * 
 * @param imagePath - Full path in storage (e.g., "product-id/filename.webp")
 */
export async function deleteProductImage(imagePath: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const supabase = getSupabase();

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([imagePath]);

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Delete all images for a product
 */
export async function deleteAllProductImages(productId: string): Promise<{
    success: boolean;
    deletedCount: number;
    error?: string;
}> {
    try {
        const supabase = getSupabase();

        // List all files in product folder
        const { data: files, error: listError } = await supabase.storage
            .from(BUCKET_NAME)
            .list(productId);

        if (listError) {
            return {
                success: false,
                deletedCount: 0,
                error: listError.message,
            };
        }

        if (!files || files.length === 0) {
            return { success: true, deletedCount: 0 };
        }

        // Delete all files
        const filePaths = files.map((f) => `${productId}/${f.name}`);
        const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(filePaths);

        if (deleteError) {
            return {
                success: false,
                deletedCount: 0,
                error: deleteError.message,
            };
        }

        return {
            success: true,
            deletedCount: files.length,
        };
    } catch (error) {
        return {
            success: false,
            deletedCount: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Get public URL for an image path
 * 
 * @param imagePath - Path in storage (e.g., "product-id/filename.webp")
 * @returns Public URL
 */
export function getPublicUrl(imagePath: string): string {
    const supabase = getSupabase();

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(imagePath);

    return data.publicUrl;
}

/**
 * Get transformed image URL with Supabase Image Transformations
 * (Requires Supabase Pro plan)
 * Note: Basic implementation - transform options require Pro plan
 */
export function getTransformedUrl(
    imagePath: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
    } = {}
): string {
    // For basic plan, just return the public URL
    // Transform options require Supabase Pro plan
    return getPublicUrl(imagePath);
}

/**
 * List all images for a product
 */
export async function listProductImages(productId: string): Promise<{
    success: boolean;
    images: { name: string; path: string; url: string }[];
    error?: string;
}> {
    try {
        const supabase = getSupabase();

        const { data: files, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(productId);

        if (error) {
            return {
                success: false,
                images: [],
                error: error.message,
            };
        }

        const images = (files || []).map((file) => ({
            name: file.name,
            path: `${productId}/${file.name}`,
            url: getPublicUrl(`${productId}/${file.name}`),
        }));

        return {
            success: true,
            images,
        };
    } catch (error) {
        return {
            success: false,
            images: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
