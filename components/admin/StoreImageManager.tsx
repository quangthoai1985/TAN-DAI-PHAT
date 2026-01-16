"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-context";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * =====================================================
 * HƯỚNG DẪN KÍCH THƯỚC ẢNH BANNER
 * =====================================================
 * 
 * ẢNH DESKTOP (url):
 * - Tỷ lệ: 21:9 (ultrawide)
 * - Kích thước khuyến nghị: 2520 x 1080 pixels
 * - Dùng cho: Laptop, PC, màn hình lớn (≥768px)
 * 
 * ẢNH MOBILE (mobile_url):
 * - Tỷ lệ: 4:3
 * - Kích thước khuyến nghị: 1200 x 900 pixels
 * - Dùng cho: Điện thoại, màn hình nhỏ (<768px)
 * 
 * =====================================================
 */

interface StoreImage {
    id: string;
    url: string;
    mobile_url: string | null;
    display_order: number;
    title: string | null;
}

// Sortable Item Component
function SortableItem({
    image,
    onDelete,
    onReplaceDesktop,
    onReplaceMobile,
    isReplacingDesktop,
    isReplacingMobile
}: {
    image: StoreImage;
    onDelete: (id: string) => void;
    onReplaceDesktop: (id: string, file: File) => void;
    onReplaceMobile: (id: string, file: File) => void;
    isReplacingDesktop: boolean;
    isReplacingMobile: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    const handleDesktopReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onReplaceDesktop(image.id, e.target.files[0]);
        }
        e.target.value = "";
    };

    const handleMobileReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onReplaceMobile(image.id, e.target.files[0]);
        }
        e.target.value = "";
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white flex flex-col`}
        >
            {/* Desktop Image */}
            <div
                {...attributes}
                {...listeners}
                className="aspect-[21/9] relative bg-gray-100 cursor-grab active:cursor-grabbing"
            >
                <img src={image.url} alt="Desktop Banner" className="object-contain w-full h-full pointer-events-none select-none bg-gradient-to-b from-red-600 to-red-700" />
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                    Desktop (21:9)
                </div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium drop-shadow-md">Kéo để sắp xếp</span>
                </div>
            </div>

            {/* Mobile Image Preview */}
            <div className="aspect-[4/3] relative bg-gray-50 border-t border-gray-200">
                {image.mobile_url ? (
                    <img src={image.mobile_url} alt="Mobile Banner" className="object-contain w-full h-full bg-gradient-to-b from-red-600 to-red-700" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Chưa có ảnh Mobile</span>
                    </div>
                )}
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
                    Mobile (4:3)
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 space-y-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Thứ tự: {image.display_order}</span>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={() => onDelete(image.id)}
                    >
                        Xóa
                    </Button>
                </div>

                {/* Replace Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleDesktopReplace}
                            disabled={isReplacingDesktop}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs"
                            disabled={isReplacingDesktop}
                        >
                            {isReplacingDesktop ? "Đang thay..." : "Thay Desktop"}
                        </Button>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleMobileReplace}
                            disabled={isReplacingMobile}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs border-green-300 text-green-700 hover:bg-green-50"
                            disabled={isReplacingMobile}
                        >
                            {isReplacingMobile ? "Đang thay..." : image.mobile_url ? "Thay Mobile" : "Thêm Mobile"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StoreImageManager() {
    const [images, setImages] = useState<StoreImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [replacingDesktop, setReplacingDesktop] = useState<string | null>(null);
    const [replacingMobile, setReplacingMobile] = useState<string | null>(null);
    const toast = useToast();

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from("store_images")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const uploadImageToStorage = async (file: File, prefix: string = "") => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${prefix}${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("store-images")
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from("store-images")
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = event.target.files[0];
            const publicUrl = await uploadImageToStorage(file, "desktop_");

            const { error: dbError } = await supabase
                .from("store_images")
                .insert([{ url: publicUrl, display_order: images.length + 1 }]);

            if (dbError) throw dbError;

            fetchImages();
            toast.success("Thêm ảnh thành công!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Tải ảnh thất bại! Vui lòng thử lại.");
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const handleReplaceDesktop = async (id: string, file: File) => {
        try {
            setReplacingDesktop(id);
            const publicUrl = await uploadImageToStorage(file, "desktop_");

            const { error } = await supabase
                .from("store_images")
                .update({ url: publicUrl })
                .eq("id", id);

            if (error) throw error;

            setImages(images.map(img =>
                img.id === id ? { ...img, url: publicUrl } : img
            ));
            toast.success("Đã thay thế ảnh Desktop!");
        } catch (error) {
            console.error("Error replacing desktop image:", error);
            toast.error("Thay ảnh thất bại!");
        } finally {
            setReplacingDesktop(null);
        }
    };

    const handleReplaceMobile = async (id: string, file: File) => {
        try {
            setReplacingMobile(id);
            const publicUrl = await uploadImageToStorage(file, "mobile_");

            const { error } = await supabase
                .from("store_images")
                .update({ mobile_url: publicUrl })
                .eq("id", id);

            if (error) throw error;

            setImages(images.map(img =>
                img.id === id ? { ...img, mobile_url: publicUrl } : img
            ));
            toast.success("Đã thay thế ảnh Mobile!");
        } catch (error) {
            console.error("Error replacing mobile image:", error);
            toast.error("Thay ảnh thất bại!");
        } finally {
            setReplacingMobile(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa ảnh này?")) return;

        try {
            const { error } = await supabase
                .from("store_images")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setImages(images.filter(img => img.id !== id));
            toast.success("Xóa ảnh thành công!");
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Xóa ảnh thất bại!");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    display_order: index + 1
                }));

                updateOrderInDb(updatedItems);
                return updatedItems;
            });
        }
    };

    const updateOrderInDb = async (updatedItems: StoreImage[]) => {
        try {
            const updates = updatedItems.map(item => ({
                id: item.id,
                display_order: item.display_order,
                url: item.url
            }));

            const { error } = await supabase
                .from("store_images")
                .upsert(updates, { onConflict: 'id' });

            if (error) throw error;
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Lỗi khi lưu thứ tự!");
            fetchImages();
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="space-y-6">
            {/* Size Guidelines */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                                📐 Hướng dẫn kích thước ảnh Banner
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Desktop</span>
                                        <span className="text-gray-500">Laptop, PC</span>
                                    </div>
                                    <p className="font-medium text-gray-900">2520 × 1080 pixels</p>
                                    <p className="text-gray-500">Tỷ lệ 21:9 (ultrawide)</p>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">Mobile</span>
                                        <span className="text-gray-500">Điện thoại</span>
                                    </div>
                                    <p className="font-medium text-gray-900">1200 × 900 pixels</p>
                                    <p className="text-gray-500">Tỷ lệ 4:3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Image Manager */}
            <Card className="animate-fade-in-up">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{ fontFamily: "var(--font-montserrat)" }}>Quản lý ảnh cửa hàng</CardTitle>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        <Button disabled={uploading} isLoading={uploading} className="bg-red-600 hover:bg-red-700 text-white">
                            {uploading ? "Đang tải lên..." : "Thêm banner mới"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={images.map(img => img.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {images.map((image) => (
                                    <SortableItem
                                        key={image.id}
                                        image={image}
                                        onDelete={handleDelete}
                                        onReplaceDesktop={handleReplaceDesktop}
                                        onReplaceMobile={handleReplaceMobile}
                                        isReplacingDesktop={replacingDesktop === image.id}
                                        isReplacingMobile={replacingMobile === image.id}
                                    />
                                ))}

                                {images.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium">Chưa có ảnh nào</p>
                                        <p className="text-sm text-gray-400 mt-1">Hãy tải lên ảnh để hiển thị trên trang chủ</p>
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </CardContent>
            </Card>
        </div>
    );
}
