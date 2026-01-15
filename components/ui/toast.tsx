"use client";

import { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

export default function Toast({ id, message, type = "info", duration = 3000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    // Auto close logic
    useEffect(() => {
        const startTime = Date.now();
        const endTime = startTime + duration;

        const timer = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            const percentage = (remaining / duration) * 100;

            setProgress(percentage);

            if (remaining === 0) {
                clearInterval(timer);
                handleClose();
            }
        }, 10);

        return () => clearInterval(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
    };

    const variants = {
        success: "bg-white border-l-4 border-emerald-500 text-gray-800",
        error: "bg-white border-l-4 border-red-500 text-gray-800",
        info: "bg-white border-l-4 border-blue-500 text-gray-800",
    };

    const icons = {
        success: (
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    const progressColors = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    return (
        <div
            className={`
                relative flex items-center w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5
                transition-all duration-300 ease-in-out
                ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0 animate-slide-in-right"}
                ${variants[type]}
            `}
            role="alert"
        >
            <div className="p-4 flex items-start gap-3 w-full">
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1 pt-0.5">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                <div
                    className={`h-full transition-all duration-75 ease-linear ${progressColors[type]}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
