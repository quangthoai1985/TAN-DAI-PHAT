import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ToastProvider } from "@/components/ui/toast-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// Helper to fetch settings safely (server-side)
async function getSettings() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return {};

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase.from('site_settings').select('key, value');

    const settings: Record<string, string> = {};
    data?.forEach((item: { key: string; value: string }) => {
      settings[item.key] = item.value;
    });
    return settings;
  } catch (error) {
    console.error('Error fetching settings for layout:', error);
    return {};
  }
}

export const metadata: Metadata = {
  title: "Vật Liệu Xây Dựng TÂN ĐẠI PHÁT",
  description: "Cửa hàng vật liệu xây dựng uy tín chất lượng - Sơn nước, gạch ốp lát và nhiều sản phẩm khác",
};

// This is an async server component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const favicon = settings['favicon'] || "/favicon.ico";

  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {settings['favicon'] && <link rel="icon" href={settings['favicon']} />}
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <ToastProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
