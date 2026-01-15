"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StoreImage {
    id: string;
    url: string;
    display_order: number;
    title: string | null;
}

export default function StoreImageManager() {
    const [images, setImages] = useState<StoreImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

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
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Upload failed! (Check console for details)");
        } finally {
            setUploading(false);
            // Reset input
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
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Delete failed!");
        }
    };

    const handleUpdateOrder = async (id: string, newOrder: number) => {
        try {
            // Optimistic update
            const updatedImages = images.map(img =>
                img.id === id ? { ...img, display_order: newOrder } : img
            );
            setImages(updatedImages.sort((a, b) => a.display_order - b.display_order));

            const { error } = await supabase
                .from("store_images")
                .update({ display_order: newOrder })
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Update order failed!");
            fetchImages(); // Revert
        }
    }

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
                    <Button disabled={uploading} isLoading={uploading}>
                        {uploading ? "Đang tải lên..." : "Thêm ảnh mới"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <div key={image.id} className="relative group border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white">
                            <div className="aspect-video relative bg-gray-100">
                                <img src={image.url} alt="Store" className="object-cover w-full h-full" />
                            </div>
                            <div className="p-3 flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Thứ tự:</span>
                                <Input
                                    type="number"
                                    className="w-20 h-9"
                                    value={image.display_order}
                                    onChange={(e) => handleUpdateOrder(image.id, parseInt(e.target.value) || 0)}
                                />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="ml-auto"
                                    onClick={() => handleDelete(image.id)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </div>
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
            </CardContent>
        </Card>
    );
}
