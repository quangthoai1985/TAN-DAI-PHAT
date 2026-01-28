"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DynamicFavicon from "@/components/layout/DynamicFavicon";
import { getSiteSettings, SiteSettings } from "@/lib/settings";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");
    const [settings, setSettings] = useState<SiteSettings>({});

    useEffect(() => {
        if (!isAdminPage) {
            getSiteSettings().then(setSettings);
        }
    }, [isAdminPage]);

    // Don't show Header/Footer on admin pages
    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <>
            <DynamicFavicon />
            <Header logoUrl={settings.header_logo} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer logoUrl={settings.footer_logo} />
        </>
    );
}
