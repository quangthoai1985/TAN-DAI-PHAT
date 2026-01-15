import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardInteractive } from "@/components/ui/card";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import ProductCarousel from "@/components/home/ProductCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";

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



export default function Home() {
  return (
    <div className="bg-[hsl(var(--background))]">
      {/* Hero Section */}
      {/* Hero Section */}
      <HeroSlideshow />

      {/* New Products Carousel */}
      <ProductCarousel />

      {/* Categories Grid */}
      <CategoryGrid />





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
                  <span>0907 970 889</span>
                </a>
                <a
                  href="https://zalo.me/0907970889"
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
