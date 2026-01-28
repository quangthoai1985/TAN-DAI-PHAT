"use client";

import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/settings";

export default function DynamicFavicon() {
    const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadFavicon = async () => {
            const settings = await getSiteSettings();
            if (settings.favicon) {
                setFaviconUrl(settings.favicon);
            }
        };
        loadFavicon();
    }, []);

    useEffect(() => {
        if (!faviconUrl) return;

        // Update existing favicon links or create new ones
        const updateFaviconLink = (rel: string, href: string) => {
            let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
            if (link) {
                link.href = href;
            } else {
                link = document.createElement("link");
                link.rel = rel;
                link.href = href;
                document.head.appendChild(link);
            }
        };

        updateFaviconLink("icon", faviconUrl);
        updateFaviconLink("shortcut icon", faviconUrl);
    }, [faviconUrl]);

    return null;
}
