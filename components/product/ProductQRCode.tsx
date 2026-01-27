"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { getOptimizedImageUrl } from "@/lib/storage";

interface ProductImage {
    id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
}

interface ProductQRCodeProps {
    productUrl: string;
    productName: string;
    productCode: string;
    images: ProductImage[];
}

type QRSize = "small" | "medium" | "large";
type QRPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const QR_SIZES: Record<QRSize, { size: number; label: string }> = {
    small: { size: 60, label: "Nhỏ" },
    medium: { size: 100, label: "Vừa" },
    large: { size: 140, label: "Lớn" },
};

const QR_POSITIONS: Record<QRPosition, { label: string; icon: string }> = {
    "top-left": { label: "Trên trái", icon: "↖" },
    "top-right": { label: "Trên phải", icon: "↗" },
    "bottom-left": { label: "Dưới trái", icon: "↙" },
    "bottom-right": { label: "Dưới phải", icon: "↘" },
};

export default function ProductQRCode({
    productUrl,
    productName,
    productCode,
    images,
}: ProductQRCodeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [qrSize, setQrSize] = useState<QRSize>("medium");
    const [qrPosition, setQrPosition] = useState<QRPosition>("bottom-right");
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Sort images by display_order, primary first
    const sortedImages = [...images].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.display_order - b.display_order;
    });

    const selectedImage = sortedImages[selectedImageIndex];

    // Calculate QR position coordinates
    const calculateQRPosition = (
        canvasWidth: number,
        canvasHeight: number,
        qrDisplaySize: number,
        padding: number
    ): { x: number; y: number } => {
        switch (qrPosition) {
            case "top-left":
                return { x: padding, y: padding };
            case "top-right":
                return { x: canvasWidth - qrDisplaySize - padding, y: padding };
            case "bottom-left":
                return { x: padding, y: canvasHeight - qrDisplaySize - padding };
            case "bottom-right":
            default:
                return {
                    x: canvasWidth - qrDisplaySize - padding,
                    y: canvasHeight - qrDisplaySize - padding,
                };
        }
    };

    // Generate preview with QR code
    const generatePreview = useCallback(async () => {
        if (!selectedImage || !canvasRef.current) return;

        setIsGenerating(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        try {
            // Load the product image
            const img = new window.Image();
            img.crossOrigin = "anonymous";

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
                // Use optimized full version for export
                img.src = getOptimizedImageUrl(selectedImage.image_url, "full");
            });

            // Set canvas size to image size
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the product image
            ctx.drawImage(img, 0, 0);

            // Generate QR code
            const qrDataUrl = await QRCode.toDataURL(productUrl, {
                width: QR_SIZES[qrSize].size * 2, // 2x for retina
                margin: 1,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
                errorCorrectionLevel: "M",
            });

            // Load QR code image
            const qrImg = new window.Image();
            await new Promise<void>((resolve, reject) => {
                qrImg.onload = () => resolve();
                qrImg.onerror = reject;
                qrImg.src = qrDataUrl;
            });

            // Calculate QR position based on selected position
            const qrDisplaySize = QR_SIZES[qrSize].size * (img.width / 400); // Scale QR based on image size
            const padding = qrDisplaySize * 0.2;
            const { x: qrX, y: qrY } = calculateQRPosition(
                canvas.width,
                canvas.height,
                qrDisplaySize,
                padding
            );

            // Draw white background with subtle shadow effect
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(qrX - 8, qrY - 8, qrDisplaySize + 16, qrDisplaySize + 16);
            ctx.restore();

            // Draw the QR code
            ctx.drawImage(qrImg, qrX, qrY, qrDisplaySize, qrDisplaySize);

            // Generate preview URL
            const previewDataUrl = canvas.toDataURL("image/jpeg", 0.9);
            setPreviewUrl(previewDataUrl);
        } catch (error) {
            console.error("Error generating QR preview:", error);
        } finally {
            setIsGenerating(false);
        }
    }, [selectedImage, productUrl, qrSize, qrPosition]);

    // Regenerate preview when dependencies change
    useEffect(() => {
        if (isOpen && selectedImage) {
            generatePreview();
        }
    }, [isOpen, selectedImage, qrSize, qrPosition, generatePreview]);

    // Handle download
    const handleDownload = () => {
        if (!previewUrl) return;

        const link = document.createElement("a");
        link.download = `${productCode}-qrcode.jpg`;
        link.href = previewUrl;
        link.click();
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!images || images.length === 0) return null;

    return (
        <>
            {/* Trigger Button - Styled to match "Liên hệ đặt hàng" button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex max-w-xs flex-1 items-center justify-center gap-2 rounded-md border-2 border-indigo-600 bg-white px-8 py-3 text-base font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
            >
                {/* QR Icon */}
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="18" y="14" width="3" height="3" />
                    <rect x="14" y="18" width="3" height="3" />
                    <rect x="18" y="18" width="3" height="3" />
                </svg>
                <span>Tải ảnh có QRCode</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: "modalSlideIn 0.3s ease-out forwards",
                        }}
                    >
                        {/* Header */}
                        <div className="relative border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white">
                                Tải ảnh có QRCode
                            </h2>
                            <p className="mt-1 text-sm text-indigo-100">
                                {productName}
                            </p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 180px)" }}>
                            {/* Preview */}
                            <div className="relative mb-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
                                {isGenerating ? (
                                    <div className="flex aspect-[4/3] items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                                            <span className="text-sm text-gray-500">
                                                Đang tạo ảnh...
                                            </span>
                                        </div>
                                    </div>
                                ) : previewUrl ? (
                                    <div className="relative aspect-[4/3]">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview with QR code"
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="flex aspect-[4/3] items-center justify-center">
                                        <span className="text-sm text-gray-400">
                                            Chọn ảnh để xem trước
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* QR Position Selection */}
                            <div className="mb-6">
                                <label className="mb-3 block text-sm font-medium text-gray-700">
                                    Vị trí QRCode
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {(Object.keys(QR_POSITIONS) as QRPosition[]).map((position) => (
                                        <button
                                            key={position}
                                            onClick={() => setQrPosition(position)}
                                            className={`relative rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all duration-200 ${qrPosition === position
                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                {/* Position indicator grid */}
                                                <div className="relative h-8 w-8 rounded border border-current opacity-60">
                                                    <div
                                                        className={`absolute h-2.5 w-2.5 rounded-sm bg-current ${position === "top-left"
                                                                ? "left-0.5 top-0.5"
                                                                : position === "top-right"
                                                                    ? "right-0.5 top-0.5"
                                                                    : position === "bottom-left"
                                                                        ? "bottom-0.5 left-0.5"
                                                                        : "bottom-0.5 right-0.5"
                                                            }`}
                                                    />
                                                </div>
                                                <span className="text-xs">{QR_POSITIONS[position].label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* QR Size Selection */}
                            <div className="mb-6">
                                <label className="mb-3 block text-sm font-medium text-gray-700">
                                    Kích thước QRCode
                                </label>
                                <div className="flex gap-3">
                                    {(Object.keys(QR_SIZES) as QRSize[]).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setQrSize(size)}
                                            className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${qrSize === size
                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <div
                                                    className={`grid grid-cols-2 gap-0.5 ${qrSize === size ? "text-indigo-500" : "text-gray-400"
                                                        }`}
                                                    style={{
                                                        width: size === "small" ? 16 : size === "medium" ? 20 : 24,
                                                        height: size === "small" ? 16 : size === "medium" ? 20 : 24,
                                                    }}
                                                >
                                                    <div className="rounded-sm bg-current" />
                                                    <div className="rounded-sm bg-current" />
                                                    <div className="rounded-sm bg-current" />
                                                    <div className="rounded-sm bg-current opacity-50" />
                                                </div>
                                                <span>{QR_SIZES[size].label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Selection */}
                            {sortedImages.length > 1 && (
                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-gray-700">
                                        Chọn ảnh
                                    </label>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {sortedImages.map((img, index) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-lg transition-all duration-200 ${selectedImageIndex === index
                                                        ? "ring-2 ring-indigo-500 ring-offset-2 scale-105"
                                                        : "opacity-60 hover:opacity-100 border border-gray-200"
                                                    }`}
                                            >
                                                <Image
                                                    src={getOptimizedImageUrl(img.image_url, "thumb")}
                                                    alt={`Ảnh ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                                {selectedImageIndex === index && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/20">
                                                        <svg
                                                            className="h-5 w-5 text-white drop-shadow-lg"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                            <button
                                onClick={handleDownload}
                                disabled={!previewUrl || isGenerating}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                <span>Tải xuống ảnh</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} className="hidden" />

            {/* CSS Animation */}
            <style jsx global>{`
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
