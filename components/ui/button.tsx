import { forwardRef, ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "sm" | "default" | "lg" | "xl" | "icon";
    isLoading?: boolean;
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", size = "default", isLoading, disabled, children, asChild, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl
      font-semibold
      transition-all duration-300 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
      active:scale-[0.97]
      shadow-sm hover:shadow-lg
    `.replace(/\s+/g, " ").trim();

        const variants: Record<string, string> = {
            default: `
        bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
        hover:from-indigo-700 hover:to-indigo-800 
        hover:shadow-indigo-500/30
        focus-visible:ring-indigo-500
      `.replace(/\s+/g, " ").trim(),
            secondary: `
        bg-gray-100 text-gray-900 
        hover:bg-gray-200 
        hover:shadow-gray-300/30
      `.replace(/\s+/g, " ").trim(),
            outline: `
        border-2 border-current bg-transparent 
        hover:bg-white/10
        shadow-none hover:shadow-none
      `.replace(/\s+/g, " ").trim(),
            ghost: `
        bg-transparent hover:bg-gray-100 
        shadow-none hover:shadow-none
      `.replace(/\s+/g, " ").trim(),
            destructive: `
        bg-gradient-to-r from-red-500 to-red-600 text-white 
        hover:from-red-600 hover:to-red-700
        hover:shadow-red-500/30
        focus-visible:ring-red-500
      `.replace(/\s+/g, " ").trim(),
        };

        const sizes: Record<string, string> = {
            sm: "h-10 px-4 text-sm min-w-[100px]",
            default: "h-12 px-6 text-base min-w-[120px]",
            lg: "h-14 px-8 text-base min-w-[140px]",
            xl: "h-16 px-10 text-lg min-w-[160px]",
            icon: "h-12 w-12 p-0 min-w-0",
        };

        const Comp = asChild ? "span" : "button";

        return (
            <Comp
                ref={ref as any}
                disabled={disabled || isLoading}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...(asChild ? {} : props)}
            >
                {isLoading && (
                    <svg className="animate-spin h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button };
