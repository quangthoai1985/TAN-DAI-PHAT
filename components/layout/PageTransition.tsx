'use client';

import { useEffect, useState } from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger fade-in after mount
        setIsVisible(true);
    }, []);

    return (
        <div
            className={`transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {children}
        </div>
    );
}
