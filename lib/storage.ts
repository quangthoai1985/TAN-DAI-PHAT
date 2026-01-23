import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';

/**
 * Upload result interface
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
 * Image variants configuration for multi-resolution storage
 */
export const IMAGE_VARIANTS = {
    thumb: { maxWidth: 400, maxHeight: 400, quality: 0.80 },
    medium: { maxWidth: 1200, maxHeight: 1200, quality: 0.85 },
    full: { maxWidth: 2400, maxHeight: 2400, quality: 0.92 },
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

/**
 * Upload product image to Supabase Storage with multi-resolution variants
 * Creates 3 versions: thumb (400px), medium (1200px), full (2400px)
 */
export async function uploadProductImage(
    productId: string,
    file: File,
    options: {
        optimize?: boolean;
        isPrimary?: boolean;
    } = {}
): Promise<UploadResult & { variants?: Record<ImageVariant, string> }> {
    const { optimize = true, isPrimary = false } = options;

    try {
        // Generate base filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const baseFileName = isPrimary ? `main_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;

        const variants: Record<string, string> = {};
        let mediumUrl = '';

        // Upload all variants if optimizing
        if (optimize && typeof window !== 'undefined') {
            for (const [variant, config] of Object.entries(IMAGE_VARIANTS)) {
                try {
                    const optimizedBlob = await optimizeImage(file, {
                        maxWidth: config.maxWidth,
                        maxHeight: config.maxHeight,
                        quality: config.quality,
                        format: 'webp',
                    });

                    const variantFileName = `${baseFileName}_${variant}.webp`;
                    const filePath = `${productId}/${variantFileName}`;

                    const { data, error } = await supabase.storage
                        .from(BUCKET_NAME)
                        .upload(filePath, optimizedBlob, {
                            cacheControl: '31536000', // 1 year cache for optimized images
                            upsert: true,
                            contentType: 'image/webp',
                        });

                    if (error) {
                        console.error(`Failed to upload ${variant} variant:`, error);
                        continue;
                    }

                    const { data: urlData } = supabase.storage
                        .from(BUCKET_NAME)
                        .getPublicUrl(data.path);

                    variants[variant] = urlData.publicUrl;

                    // Use medium as the default URL
                    if (variant === 'medium') {
                        mediumUrl = urlData.publicUrl;
                    }
                } catch (e) {
                    console.warn(`Image optimization failed for ${variant}:`, e);
                }
            }

            // If we have at least medium, return success
            if (mediumUrl) {
                return {
                    success: true,
                    path: `${productId}/${baseFileName}`,
                    url: mediumUrl,
                    variants: variants as Record<ImageVariant, string>,
                };
            }
        }

        // Fallback: upload original file if optimization failed
        const fileName = `${baseFileName}.${file.name.split('.').pop()?.toLowerCase() || 'jpg'}`;
        const filePath = `${productId}/${fileName}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type || 'image/jpeg',
            });

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

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
 * Delete all images for a product
 */
export async function deleteAllProductImages(productId: string): Promise<{
    success: boolean;
    deletedCount: number;
    error?: string;
}> {
    try {
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
 * Delete product image from Supabase Storage
 */
/**
 * Delete product image from Supabase Storage (including all variants)
 */
export async function deleteProductImage(imagePath: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        // Prepare paths for all potential variants
        // imagePath is likely .../name_medium.webp or .../name.ext

        // Try to identify the base name
        // Patterns: name_medium.webp, name_thumb.webp, name_full.webp, or just name.ext
        let basePath = imagePath;

        // Remove known suffixes if present
        if (imagePath.includes('_medium.webp')) basePath = imagePath.replace('_medium.webp', '');
        else if (imagePath.includes('_thumb.webp')) basePath = imagePath.replace('_thumb.webp', '');
        else if (imagePath.includes('_full.webp')) basePath = imagePath.replace('_full.webp', '');
        else if (imagePath.includes('.webp')) basePath = imagePath.replace('.webp', '');
        else {
            // Remove extension
            basePath = imagePath.replace(/\.[^/.]+$/, "");
        }

        const pathsToDelete = [
            imagePath, // The original request path
            `${basePath}_thumb.webp`,
            `${basePath}_medium.webp`,
            `${basePath}_full.webp`,
            `${basePath}.jpg`, // Legacy/Fallback
            `${basePath}.png`, // Legacy/Fallback
            `${basePath}.webp` // Legacy/Fallback
        ];

        // Remove duplicates
        const uniquePaths = [...new Set(pathsToDelete)];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(uniquePaths);

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
 * Get public URL for an image path
 */
export function getPublicUrl(imagePath: string): string {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(imagePath);

    return data.publicUrl;
}

/**
 * Get optimized image URL for a given variant
 */
export function getOptimizedImageUrl(url: string, variant: 'thumb' | 'medium' | 'full' = 'medium'): string {
    if (!url) return '';

    // Check if url is a placeholder or external
    if (url.startsWith('/') || !url.startsWith('http')) return url;

    // Remove existing suffix if present to get base
    let baseUrl = url;
    if (url.includes('_medium.webp')) baseUrl = url.replace('_medium.webp', '');
    else if (url.includes('_thumb.webp')) baseUrl = url.replace('_thumb.webp', '');
    else if (url.includes('_full.webp')) baseUrl = url.replace('_full.webp', '');
    else if (url.includes('.webp')) baseUrl = url.replace('.webp', '');
    else baseUrl = url.replace(/\.[^/.]+$/, "");

    return `${baseUrl}_${variant}.webp`;
}
