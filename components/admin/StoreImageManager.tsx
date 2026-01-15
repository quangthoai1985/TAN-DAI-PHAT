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

interface StoreImage {
    id: string;
    url: string;
    display_order: number;
    title: string | null;
}

// Sortable Item Component
function SortableItem({ image, onDelete }: { image: StoreImage; onDelete: (id: string) => void }) {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white flex flex-col`}
        >
            <div
                {...attributes}
                {...listeners}
                className="aspect-video relative bg-gray-100 cursor-grab active:cursor-grabbing"
            >
                <img src={image.url} alt="Store" className="object-cover w-full h-full pointer-events-none select-none" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium drop-shadow-md">Kéo để sắp xếp</span>
                </div>
            </div>

            <div className="p-3 flex items-center justify-between mt-auto">
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
        </div>
    );
}

export default function StoreImageManager() {
    const [images, setImages] = useState<StoreImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts to prevent accidental clicks
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

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("store-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("store-images")
                .getPublicUrl(filePath);

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

                // Update display_order property for all items
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    display_order: index + 1
                }));

                // Update to DB
                updateOrderInDb(updatedItems);

                return updatedItems;
            });
        }
    };

    const updateOrderInDb = async (updatedItems: StoreImage[]) => {
        try {
            // Prepare updates
            const updates = updatedItems.map(item => ({
                id: item.id,
                display_order: item.display_order,
                url: item.url // Include other required fields if RLS requires them or partial update is tricky
            }));

            const { error } = await supabase
                .from("store_images")
                .upsert(updates, { onConflict: 'id' });

            if (error) throw error;
            // toast.success("Đã cập nhật thứ tự!"); // Optional: Can be too spammy
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Lỗi khi lưu thứ tự!");
            fetchImages(); // Revert on failure
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
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
                        {uploading ? "Đang tải lên..." : "Thêm ảnh mới"}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {images.map((image) => (
                                <SortableItem key={image.id} image={image} onDelete={handleDelete} />
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
    );
}
