import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number;
    rootMargin?: string;
}

/**
 * Custom hook for infinite scroll functionality
 * @param callback - Function to call when target is intersecting
 * @param options - IntersectionObserver options
 * @returns Ref to attach to the target element
 */
export function useInfiniteScroll(
    callback: () => void,
    options: UseInfiniteScrollOptions = {}
) {
    const { threshold = 0.5, rootMargin = '0px' } = options;
    const observerTarget = useRef<HTMLDivElement>(null);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting) {
                callback();
            }
        },
        [callback]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersect, {
            threshold,
            rootMargin,
        });

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [handleIntersect, threshold, rootMargin]);

    return observerTarget;
}
