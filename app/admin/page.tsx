"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductStats {
    total: number;
    paint: number;
    tile: number;
}

interface Activity {
    id: string;
    type: "create" | "update" | "delete";
    productName: string;
    productType: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<ProductStats>({ total: 0, paint: 0, tile: 0 });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchRecentProducts();
    }, []);

    const fetchStats = async () => {
        try {
            // Get total count
            const { count: totalCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true });

            // Get paint count
            const { count: paintCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true })
                .eq("type", "PAINT");

            // Get tile count
            const { count: tileCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true })
                .eq("type", "TILE");

            setStats({
                total: totalCount || 0,
                paint: paintCount || 0,
                tile: tileCount || 0,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentProducts = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, type, created_at, updated_at")
                .order("updated_at", { ascending: false })
                .limit(5);

            if (error) throw error;

            if (data) {
                const recentActivities: Activity[] = data.map((product) => ({
                    id: product.id,
                    type: "create" as const, // For now we only track creation
                    productName: product.name || "Sản phẩm",
                    productType: product.type === "PAINT" ? "Nước sơn" : "Gạch ốp lát",
                    createdAt: product.updated_at || product.created_at,
                }));
                setActivities(recentActivities);
            }
        } catch (error) {
            console.error("Error fetching recent products:", error);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Vừa xong";
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString("vi-VN");
    };

    const statsConfig = [
        {
            title: "Tổng sản phẩm",
            value: stats.total,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: "text-red-600",
            bgColor: "bg-gradient-to-br from-red-100 to-red-50",
            borderColor: "border-red-200",
        },
        {
            title: "Nước sơn",
            value: stats.paint,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ),
            color: "text-blue-600",
            bgColor: "bg-gradient-to-br from-blue-100 to-blue-50",
            borderColor: "border-blue-200",
        },
        {
            title: "Gạch ốp lát",
            value: stats.tile,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
            color: "text-amber-600",
            bgColor: "bg-gradient-to-br from-amber-100 to-amber-50",
            borderColor: "border-amber-200",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="animate-fade-in-up">
                <h1
                    className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                >
                    Dashboard
                </h1>
                <p className="mt-1 text-gray-500 text-sm">
                    Tổng quan về sản phẩm và hoạt động
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {statsConfig.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className={`hover:shadow-lg transition-all duration-300 animate-fade-in-up group border ${stat.borderColor}`}
                        style={{ animationDelay: `${index * 75}ms` }}
                    >
                        <div className="h-28 px-6 flex items-center">
                            <div className="flex items-center justify-between gap-4 w-full">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                        {stat.title}
                                    </p>
                                    <p
                                        className="text-4xl font-bold text-gray-900 tracking-tight"
                                        style={{ fontFamily: "var(--font-montserrat)" }}
                                    >
                                        {loading ? (
                                            <span className="inline-block w-12 h-10 bg-gray-200 rounded animate-pulse" />
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg flex-shrink-0`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card className="animate-fade-in-up border border-gray-200" style={{ animationDelay: "300ms" }}>
                <CardHeader className="pb-4">
                    <CardTitle
                        className="text-lg"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        Thao tác nhanh
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/admin/products/new"
                            className="group inline-flex items-center justify-center gap-3 h-12 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-sm shadow-md hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Thêm sản phẩm mới</span>
                        </Link>
                        <Link
                            href="/admin/products"
                            className="group inline-flex items-center justify-center gap-3 h-12 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span>Quản lý sản phẩm</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="animate-fade-in-up border border-gray-200" style={{ animationDelay: "400ms" }}>
                <CardHeader className="pb-4">
                    <CardTitle
                        className="text-lg"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        Hoạt động gần đây
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
                                        <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-base text-gray-500 font-medium">
                                Chưa có hoạt động nào
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Các hoạt động gần đây sẽ hiển thị ở đây
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.productType === "Nước sơn"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-amber-100 text-amber-600"
                                        }`}>
                                        {activity.productType === "Nước sơn" ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {activity.productName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {activity.productType} • {formatTimeAgo(activity.createdAt)}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/admin/products/${activity.id}/edit`}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Xem
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
