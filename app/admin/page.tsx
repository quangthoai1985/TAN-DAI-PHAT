import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
    {
        title: "Tổng sản phẩm",
        value: "0",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        color: "text-indigo-600",
        bgColor: "bg-gradient-to-br from-indigo-100 to-indigo-50",
        borderColor: "border-indigo-200",
    },
    {
        title: "Nước sơn",
        value: "0",
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
        value: "0",
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

export default function AdminDashboard() {
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
                {stats.map((stat, index) => (
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
                                        {stat.value}
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
                            className="group inline-flex items-center justify-center gap-3 h-12 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
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

            {/* Recent Activity Placeholder */}
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
                </CardContent>
            </Card>
        </div>
    );
}
