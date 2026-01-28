import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Convert to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Use sharp to resize and convert to PNG (required for png-to-ico)
        // Create multiple sizes for better quality favicon
        const sizes = [16, 32, 48];
        const pngBuffers: Buffer[] = [];

        for (const size of sizes) {
            const resizedPng = await sharp(buffer)
                .resize(size, size, {
                    fit: "contain",
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toBuffer();
            pngBuffers.push(resizedPng);
        }

        // Convert PNG to ICO (use the 32x32 as primary)
        const icoBuffer = await pngToIco(pngBuffers);

        // Save to public folder
        const faviconPath = join(process.cwd(), "public", "favicon.ico");
        await writeFile(faviconPath, icoBuffer);

        // Also update apple-icon.png (180x180) for iOS
        const appleIcon = await sharp(buffer)
            .resize(180, 180, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .png()
            .toBuffer();

        const appleIconPath = join(process.cwd(), "public", "apple-icon.png");
        await writeFile(appleIconPath, appleIcon);

        // Update icon.png (32x32) for general use
        const iconPng = await sharp(buffer)
            .resize(32, 32, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .png()
            .toBuffer();

        const iconPath = join(process.cwd(), "public", "icon.png");
        await writeFile(iconPath, iconPng);

        return NextResponse.json({
            success: true,
            message: "Favicon updated successfully",
            timestamp: Date.now()
        });
    } catch (error) {
        console.error("Error processing favicon:", error);
        return NextResponse.json(
            { error: "Failed to process favicon" },
            { status: 500 }
        );
    }
}
