import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardInteractive } from "@/components/ui/card";

const categories = [
  {
    name: "Nước Sơn",
    description: "Đa dạng các loại sơn nước chất lượng cao từ các thương hiệu uy tín",
    href: "/nuoc-son",
    gradient: "from-indigo-500 to-blue-600",
    bgGradient: "from-indigo-50 to-blue-50",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    name: "Gạch Ốp Lát",
    description: "Gạch men, gạch ốp lát cao cấp với đa dạng mẫu mã kích thước",
    href: "/gach",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
];

const features = [
  {
    title: "Chất lượng đảm bảo",
    description: "Sản phẩm chính hãng từ các thương hiệu uy tín hàng đầu",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    title: "Giá cả cạnh tranh",
    description: "Cam kết mức giá tốt nhất trên thị trường",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "Giao hàng nhanh",
    description: "Giao hàng tận nơi trong khu vực nội thành",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "text-amber-600 bg-amber-100",
  },
  {
    title: "Tư vấn chuyên nghiệp",
    description: "Đội ngũ nhân viên giàu kinh nghiệm, tận tâm",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    color: "text-purple-600 bg-purple-100",
  },
];

export default function Home() {
  return (
    <div className="bg-[hsl(var(--background))]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="text-indigo-300 font-medium mb-3 tracking-wide text-sm uppercase">
              Vật liệu xây dựng chất lượng cao
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="block text-white">Vật Liệu Xây Dựng</span>
              <span className="block mt-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                TÂN ĐẠI PHÁT
              </span>
            </h1>
            <p className="mt-6 text-lg text-indigo-100/90 max-w-xl leading-relaxed">
              Cung cấp đa dạng các loại vật liệu xây dựng chất lượng cao với giá cả cạnh tranh.
              Sơn nước, gạch ốp lát và nhiều sản phẩm khác.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/san-pham"
                className="group inline-flex items-center justify-center gap-3 h-14 px-8 bg-white text-indigo-700 rounded-xl font-semibold text-base shadow-xl shadow-black/20 hover:bg-indigo-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <span>Xem sản phẩm</span>
                <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:0123456789"
                className="group inline-flex items-center justify-center gap-3 h-14 px-8 border-2 border-indigo-400/50 text-white rounded-xl font-semibold text-base backdrop-blur-sm hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Liên hệ ngay</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Danh mục sản phẩm
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Khám phá các loại vật liệu xây dựng chất lượng của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group block animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardInteractive className={`p-0 overflow-hidden bg-gradient-to-br ${category.bgGradient}`}>
                  <div className="p-6 sm:p-8 flex items-start gap-5">
                    <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {category.name}
                      </h3>
                      <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
                        {category.description}
                      </p>
                      <span className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                        Xem sản phẩm
                        <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </CardInteractive>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Tại sao chọn chúng tôi?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="text-center p-6 border-0 shadow-none hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className={`mx-auto w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3
                  className="text-lg font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="relative">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Bạn cần tư vấn?
              </h2>
              <p className="mt-4 text-indigo-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Liên hệ với chúng tôi để được tư vấn miễn phí về các sản phẩm vật liệu xây dựng phù hợp với công trình của bạn.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                  href="tel:0123456789"
                  className="group inline-flex items-center justify-center gap-3 h-14 px-8 bg-white text-indigo-700 rounded-xl font-semibold text-base shadow-xl shadow-white/20 hover:bg-indigo-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>0123 456 789</span>
                </a>
                <a
                  href="https://zalo.me/0123456789"
                  className="group inline-flex items-center justify-center gap-3 h-14 px-8 border-2 border-white/40 text-white rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/60 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  <span>Chat Zalo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
