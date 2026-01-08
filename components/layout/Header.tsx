"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/san-pham" },
    { name: "Nước sơn", href: "/nuoc-son" },
    { name: "Gạch ốp lát", href: "/gach" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Track scroll for header background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header
            className={`
                sticky top-0 z-40 w-full
                transition-all duration-300 ease-out
                ${scrolled
                    ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-[hsl(var(--border))]"
                    : "bg-white border-b border-transparent"
                }
            `}
        >
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
                    >
                        <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-shadow duration-300 group-hover:shadow-indigo-500/40">
                            <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-montserrat)" }}>
                                TĐP
                            </span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-lg font-bold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                                TÂN ĐẠI PHÁT
                            </p>
                            <p className="text-xs text-gray-500 -mt-0.5">
                                Vật liệu xây dựng
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    relative px-4 py-2 rounded-lg text-sm font-medium
                                    transition-all duration-200 ease-out
                                    ${pathname === item.href
                                        ? "text-indigo-700 bg-indigo-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }
                                `}
                            >
                                {item.name}
                                {pathname === item.href && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Contact Button */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="tel:0123456789"
                            className="inline-flex items-center justify-center gap-2.5 h-11 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>Liên hệ</span>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors touch-target"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                    >
                        <div className="w-5 h-5 relative flex flex-col justify-center items-center">
                            <span
                                className={`block absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-out ${mobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
                                    }`}
                            />
                            <span
                                className={`block absolute h-0.5 w-5 bg-current transition-all duration-300 ease-out ${mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                                    }`}
                            />
                            <span
                                className={`block absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-out ${mobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
                                    }`}
                            />
                        </div>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`
                        md:hidden overflow-hidden
                        transition-all duration-300 ease-out
                        ${mobileMenuOpen ? "max-h-80 opacity-100 pb-4" : "max-h-0 opacity-0"}
                    `}
                >
                    <div className="pt-2 border-t border-gray-100 space-y-1">
                        {navigation.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    block px-4 py-3 rounded-lg text-base font-medium
                                    transition-all duration-200
                                    animate-fade-in-up
                                    ${pathname === item.href
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                                    }
                                `}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <a
                            href="tel:0123456789"
                            className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg text-base font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors animate-fade-in-up touch-target"
                            style={{ animationDelay: "200ms" }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Liên hệ ngay
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
}
