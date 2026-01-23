import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardInteractive } from "@/components/ui/card";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import ProductCarousel from "@/components/home/ProductCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import PageTransition from "@/components/layout/PageTransition";
import AnimatedSection from "@/components/layout/AnimatedSection";

export default function Home() {
  return (
    <PageTransition>
      <div className="bg-[hsl(var(--background))]">
        {/* Hero Section */}
        <HeroSlideshow />

        {/* New Products Carousel */}
        <AnimatedSection>
          <ProductCarousel />
        </AnimatedSection>

        {/* Categories Grid */}
        <AnimatedSection delay={200}>
          <CategoryGrid />
        </AnimatedSection>

        {/* Features Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-12 sm:mb-16">
                <h2
                  className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Tại sao chọn chúng tôi?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Cam kết mang đến những sản phẩm chất lượng và dịch vụ tốt nhất
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: "M5 13l4 4L19 7",
                  title: "Chất lượng đảm bảo",
                  description: "Sản phẩm chính hãng từ các thương hiệu uy tín hàng đầu",
                },
                {
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: "Giá cả cạnh tranh",
                  description: "Giá tốt nhất thị trường với nhiều ưu đãi hấp dẫn",
                },
                {
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  title: "Giao hàng nhanh chóng",
                  description: "Hỗ trợ vận chuyển miễn phí cho đơn hàng lớn",
                },
              ].map((feature, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 100}
                  className="p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="scale-in">
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
            </AnimatedSection>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

