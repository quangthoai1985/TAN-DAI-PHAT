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
 * Upload product image to Supabase Storage
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
export async function deleteProductImage(imagePath: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
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
 * Get public URL for an image path
 */
export function getPublicUrl(imagePath: string): string {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(imagePath);

    return data.publicUrl;
}
