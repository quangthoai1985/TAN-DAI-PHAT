import Link from "next/link";

const footerLinks = {
    categories: [
        { name: "Nước sơn", href: "/nuoc-son" },
        { name: "Gạch ốp lát", href: "/gach" },
        { name: "Tất cả sản phẩm", href: "/san-pham" },
    ],
    company: [
        { name: "Giới thiệu", href: "/gioi-thieu" },
        { name: "Liên hệ", href: "/lien-he" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Company Info */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-4 group w-fit">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 transition-all duration-300 group-hover:shadow-red-500/40 group-hover:scale-105">
                                <span className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
                                    TĐP
                                </span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white tracking-tight leading-none group-hover:text-red-500 transition-colors" style={{ fontFamily: "var(--font-montserrat)" }}>
                                    TÂN ĐẠI PHÁT
                                </p>
                            </div>
                        </Link>
                        <p className="mt-6 text-sm text-blue-100 max-w-md leading-relaxed">
                            Cung cấp vật liệu xây dựng chất lượng cao: sơn nước, gạch ốp lát và nhiều sản phẩm khác với giá cả cạnh tranh.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <a
                                href="https://www.facebook.com/profile.php?id=61551812887711"
                                className="p-2.5 bg-blue-800 rounded-lg text-blue-200 hover:text-white hover:bg-red-600 transition-all duration-200 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://zalo.me/0907970889"
                                className="p-2.5 bg-blue-800 rounded-lg text-blue-200 hover:text-white hover:bg-red-600 transition-all duration-200 hover:scale-110"
                                aria-label="Zalo"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 14.063c-.14.271-.438.52-.896.734-.355.167-.805.28-1.338.28h-.49v2.391c0 .292-.238.532-.532.532h-1.243a.533.533 0 01-.532-.532v-6.936a.533.533 0 01.532-.532h2.265c.532 0 1.003.12 1.411.356.407.237.72.565.938.984.218.42.328.893.328 1.42 0 .554-.148 1.047-.443 1.303zm-8.047-3.688H7.594a.533.533 0 00-.532.532v6.561c0 .292.238.532.532.532h1.921a.533.533 0 00.532-.532v-6.561a.533.533 0 00-.532-.532z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3
                            className="text-sm font-semibold text-white uppercase tracking-wider mb-4"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            Danh mục
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.categories.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200 inline-flex items-center group"
                                    >
                                        <span className="w-0 opacity-0 group-hover:w-2 group-hover:opacity-100 transition-all duration-200 mr-0 group-hover:mr-1 text-red-500">
                                            →
                                        </span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3
                            className="text-sm font-semibold text-white uppercase tracking-wider mb-4"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            Liên hệ
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3 text-blue-100">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="leading-relaxed">817, Tôn Đức Thắng, phường Châu Đốc, tỉnh An Giang</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a
                                    href="tel:0907970889"
                                    className="text-blue-100 hover:text-white transition-colors duration-200"
                                >
                                    0907970889
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a
                                    href="mailto:nguyenthinhutamattp@gmail.com"
                                    className="text-blue-100 hover:text-white transition-colors duration-200"
                                >
                                    nguyenthinhutamattp@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-blue-200">
                    <p>© 2026 TÂN ĐẠI PHÁT. Tất cả quyền được bảo lưu.</p>
                    <Link
                        href="/login"
                        className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors duration-200 group"
                    >
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Quản lý sản phẩm
                    </Link>
                </div>
            </div>
        </footer>
    );
}
