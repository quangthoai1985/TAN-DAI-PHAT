"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/admin/AuthGuard";

const navItems = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: "Sản phẩm",
        href: "/admin/products",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg min-h-screen border-r border-gray-200 hidden md:flex md:flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:shadow-indigo-500/40 group-hover:scale-105">
                                <span className="text-white font-bold text-base" style={{ fontFamily: "var(--font-montserrat)" }}>TĐP</span>
                            </div>
                            <div>
                                <span
                                    className="font-bold text-gray-900 text-lg tracking-tight block"
                                    style={{ fontFamily: "var(--font-montserrat)" }}
                                >
                                    Admin Panel
                                </span>
                                <span className="text-xs text-gray-500">Quản lý sản phẩm</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                    transition-all duration-200
                                    ${pathname === item.href
                                        ? "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                `}
                            >
                                <span className={pathname === item.href ? "text-indigo-600" : "text-gray-400"}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-gray-100 space-y-2">
                        {/* View Website Link */}
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Xem trang chủ</span>
                            <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </Link>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Header - Only shown on mobile */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TĐP</span>
                            </div>
                            <span className="font-bold text-gray-900" style={{ fontFamily: "var(--font-montserrat)" }}>Admin</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8 md:pt-8 pt-20">{children}</main>
            </div>
        </AuthGuard>
    );
}
