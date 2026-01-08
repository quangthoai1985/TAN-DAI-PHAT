"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            router.push("/admin");
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
                {/* Logo */}
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
                        <span
                            className="text-white font-bold text-xl"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            TĐP
                        </span>
                    </div>
                    <h2
                        className="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        Đăng nhập hệ thống
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Dành cho quản trị viên
                    </p>
                </div>

                {/* Login Card */}
                <Card className="mt-8 shadow-xl border-0 bg-white/80 backdrop-blur-xl">
                    <CardContent className="pt-6">
                        <form className="space-y-5" onSubmit={handleLogin}>
                            {/* Error Alert */}
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 animate-fade-in flex items-start gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@tandaiphat.vn"
                                    className="h-12"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">
                                    Mật khẩu
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                isLoading={isLoading}
                                className="w-full h-12 text-base"
                            >
                                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Back to home */}
                <p className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại trang chủ
                    </a>
                </p>
            </div>
        </div>
    );
}
