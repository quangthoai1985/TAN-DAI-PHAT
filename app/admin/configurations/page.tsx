"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getSiteSettings, updateSiteSetting, SiteSettings } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-context";

export default function ConfigurationsPage() {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const data = await getSiteSettings();
        setSettings(data);
        setLoading(false);
    };

    const handleUpload = async (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        try {
            setUploading(key);
            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${key}_${Date.now()}.${fileExt}`;
            const filePath = `settings/${fileName}`;

            // Upload image
            const { error: uploadError } = await supabase.storage
                .from("store-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("store-images")
                .getPublicUrl(filePath);

            // Update setting in database
            const success = await updateSiteSetting(key, publicUrl);

            if (success) {
                setSettings(prev => ({ ...prev, [key]: publicUrl }));
                toast.success("Cập nhật thành công!");
            } else {
                throw new Error("Failed to update setting in database");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Có lỗi xảy ra khi tải ảnh lên!");
        } finally {
            setUploading(null);
            // Reset input
            event.target.value = "";
        }
    };

    const ImageUploader = ({
        title,
        settingKey,
        currentValue,
        description
    }: {
        title: string,
        settingKey: string,
        currentValue?: string,
        description: string
    }) => (
        <Card className="h-full">
            <CardHeader>
                <CardTitle style={{ fontFamily: "var(--font-montserrat)" }} className="text-lg">
                    {title}
                </CardTitle>
                <p className="text-sm text-gray-500">{description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                    {currentValue ? (
                        <img
                            src={currentValue}
                            alt={title}
                            className="w-full h-full object-contain p-2"
                        />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">Chưa có ảnh</span>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleUpload(settingKey, e)}
                        disabled={!!uploading}
                    />
                    <Button
                        variant="outline"
                        className="w-full"
                        disabled={!!uploading}
                        isLoading={uploading === settingKey}
                    >
                        {uploading === settingKey ? "Đang tải lên..." : "Thay đổi ảnh"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-montserrat)" }}>
                        Cấu hình trang web
                    </h1>
                    <p className="text-gray-500 mt-1">Quản lý logo và nhận diện thương hiệu</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ImageUploader
                    title="Logo Header"
                    settingKey="header_logo"
                    currentValue={settings.header_logo}
                    description="Logo hiển thị trên thanh menu chính (Header)"
                />

                <ImageUploader
                    title="Logo Footer"
                    settingKey="footer_logo"
                    currentValue={settings.footer_logo}
                    description="Logo hiển thị ở chân trang (Footer)"
                />

                <ImageUploader
                    title="Favicon"
                    settingKey="favicon"
                    currentValue={settings.favicon}
                    description="Icon hiển thị trên tab trình duyệt (upload ảnh PNG hoặc ICO)"
                />
            </div>
        </div>
    );
}
