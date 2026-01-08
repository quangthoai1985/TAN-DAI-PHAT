"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";

interface ImageZoomProps {
    src: string;
    alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
    const [showZoom, setShowZoom] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
    };

    return (
        <div
            ref={ref}
            className="relative w-full h-full overflow-hidden cursor-zoom-in group rounded-lg bg-gray-100"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
            />
            {showZoom && (
                <div
                    className="absolute inset-0 pointer-events-none hidden md:block"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundSize: "200%",
                        backgroundRepeat: "no-repeat",
                    }}
                />
            )}
        </div>
    );
}
