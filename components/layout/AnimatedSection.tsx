'use client';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

interface AnimatedSectionProps {
    children: React.ReactNode;
    animation?: 'fade-in-up' | 'fade-in-down' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
    delay?: number;
    className?: string;
}

export default function AnimatedSection({
    children,
    animation = 'fade-in-up',
    delay = 0,
    className = ''
}: AnimatedSectionProps) {
    const { ref, isVisible } = useScrollAnimation();

    const animationClass = {
        'fade-in-up': 'translate-y-8 opacity-0',
        'fade-in-down': '-translate-y-8 opacity-0',
        'slide-in-left': '-translate-x-8 opacity-0',
        'slide-in-right': 'translate-x-8 opacity-0',
        'scale-in': 'scale-95 opacity-0'
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : animationClass[animation]
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
