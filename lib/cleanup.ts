import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';

export interface ScanResult {
    orphanedFolders: string[];
    orphanedFiles: {
        path: string;
        reason: string;
        size?: number;
    }[];
    totalOrphanedSize?: number;
    scannedProducts: number;
    scannedFolders: number;
}

/**
 * Scan storage for orphaned files and folders
 * This runs client-side to avoid timeout limits on server functions for large buckets
 */
export async function scanForOrphans(onProgress?: (msg: string) => void): Promise<ScanResult> {
    const result: ScanResult = {
        orphanedFolders: [],
        orphanedFiles: [],
        scannedProducts: 0,
        scannedFolders: 0,
        totalOrphanedSize: 0
    };

    try {
        // 1. Get all valid product IDs and their images from DB
        onProgress?.("Fetching product data from database...");
        let allProducts: { id: string, images: any[] }[] = [];
        let page = 0;
        const pageSize = 1000;

        while (true) {
            const { data, error } = await supabase
                .from('products')
                .select('id, images')
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (error) throw error;
            if (!data || data.length === 0) break;

            allProducts = [...allProducts, ...data];
            if (data.length < pageSize) break;
            page++;
        }

        const validProductIds = new Set(allProducts.map(p => p.id));
        result.scannedProducts = validProductIds.size;

        // Map product ID to set of valid image base names
        const validImageMap = new Map<string, Set<string>>();

        allProducts.forEach(p => {
            const validNames = new Set<string>();
            if (Array.isArray(p.images)) {
                p.images.forEach((img: any) => {
                    if (img.image_url) {
                        // Extract filename from URL
                        // URL: .../product-images/productId/filename.ext
                        const parts = img.image_url.split('/');
                        const filename = parts[parts.length - 1];

                        // Clean filename to get base name (remove known suffixes and extension)
                        let baseName = filename;
                        if (filename.includes('_medium.webp')) baseName = filename.replace('_medium.webp', '');
                        else if (filename.includes('_thumb.webp')) baseName = filename.replace('_thumb.webp', '');
                        else if (filename.includes('_full.webp')) baseName = filename.replace('_full.webp', '');
                        else if (filename.includes('.webp')) baseName = filename.replace('.webp', '');
                        else baseName = filename.replace(/\.[^/.]+$/, "");

                        validNames.add(baseName);
                    }
                });
            }
            validImageMap.set(p.id, validNames);
        });

        // 2. Scan Storage Folders
        onProgress?.("Scanning storage folders...");
        const { data: rootFolders, error: listError } = await supabase.storage
            .from(BUCKET_NAME)
            .list();

        if (listError) throw listError;

        for (const folder of rootFolders) {
            // Only process UUID-like folders (product IDs)
            // Skip .emptyFolderPlaceholder or other system files
            if (folder.name === '.emptyFolderPlaceholder') continue;

            result.scannedFolders++;

            // Check if folder is orphaned (Product ID not in DB)
            if (!validProductIds.has(folder.name)) {
                result.orphanedFolders.push(folder.name);
                onProgress?.(`Found orphaned folder: ${folder.name}`);
                continue;
                // If folder is orphaned, we can delete the whole folder later. 
                // We don't need to scan inside (or we can if we want to count files).
                // Let's assume we delete the folder recursively.
            }

            // Folder is valid, check contents for orphaned files
            const validNamesForProduct = validImageMap.get(folder.name) || new Set();

            const { data: files, error: filesError } = await supabase.storage
                .from(BUCKET_NAME)
                .list(folder.name, {
                    limit: 1000, // Adjust if product has huge number of images
                });

            if (filesError) {
                console.error(`Error listing files for ${folder.name}`, filesError);
                continue;
            }

            for (const file of files) {
                // Determine if file is valid
                // File name: timestamp_random_variant.webp or timestamp_random.ext
                let fileBaseName = file.name;

                if (file.name === '.emptyFolderPlaceholder') continue;

                if (file.name.includes('_medium.webp')) fileBaseName = file.name.replace('_medium.webp', '');
                else if (file.name.includes('_thumb.webp')) fileBaseName = file.name.replace('_thumb.webp', '');
                else if (file.name.includes('_full.webp')) fileBaseName = file.name.replace('_full.webp', '');
                else if (file.name.includes('.webp')) fileBaseName = file.name.replace('.webp', '');
                else fileBaseName = file.name.replace(/\.[^/.]+$/, "");

                if (!validNamesForProduct.has(fileBaseName)) {
                    // This file has no corresponding entry in the product's image list
                    const size = file.metadata?.size || 0;
                    result.orphanedFiles.push({
                        path: `${folder.name}/${file.name}`,
                        reason: 'Not referenced in product images',
                        size: size
                    });
                    result.totalOrphanedSize = (result.totalOrphanedSize || 0) + size;
                }
            }
        }

    } catch (error) {
        console.error("Scan failed", error);
        throw error;
    }

    return result;
}

export async function deleteOrphanedItems(
    items: string[],
    onProgress?: (msg: string) => void
): Promise<{ success: number, failed: number }> {
    let success = 0;
    let failed = 0;
    const batchSize = 10; // Delete in batches

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        onProgress?.(`Deleting items ${i + 1} to ${Math.min(i + batchSize, items.length)} of ${items.length}...`);

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(batch);

        if (error) {
            console.error("Delete batch failed", error);
            failed += batch.length;
        } else {
            success += batch.length;
        }
    }

    return { success, failed };
}
