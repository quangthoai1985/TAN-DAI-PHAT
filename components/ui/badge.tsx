import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "secondary" | "outline" | "destructive" | "success";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = "", variant = "default", ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center rounded-full px-2.5 py-0.5
      text-xs font-semibold
      transition-colors duration-200
    `.replace(/\s+/g, " ").trim();

        const variants: Record<string, string> = {
            default: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/80",
            secondary: "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary))]/80",
            outline: "border border-[hsl(var(--border))] text-[hsl(var(--foreground))]",
            destructive: "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive))]/80",
            success: "bg-emerald-500 text-white hover:bg-emerald-600",
        };

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${className}`}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
