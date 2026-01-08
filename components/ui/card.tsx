import { forwardRef, HTMLAttributes } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div
            ref={ref}
            className={`
        rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]
        shadow-sm transition-all duration-200 ease-out
        ${className}
      `.replace(/\s+/g, " ").trim()}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div
            ref={ref}
            className={`flex flex-col space-y-1.5 p-6 ${className}`}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className = "", ...props }, ref) => (
        <h3
            ref={ref}
            className={`text-lg font-semibold leading-none tracking-tight ${className}`}
            style={{ fontFamily: "var(--font-montserrat), var(--font-inter), system-ui" }}
            {...props}
        />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className = "", ...props }, ref) => (
        <p
            ref={ref}
            className={`text-sm text-[hsl(var(--muted-foreground))] ${className}`}
            {...props}
        />
    )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div
            ref={ref}
            className={`p-6 pt-0 ${className}`}
            {...props}
        />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div
            ref={ref}
            className={`flex items-center p-6 pt-0 ${className}`}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

// Interactive card with hover effects
const CardInteractive = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div
            ref={ref}
            className={`
        rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]
        shadow-sm cursor-pointer
        transition-all duration-200 ease-out
        hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(var(--primary))]/20
        active:scale-[0.99]
        ${className}
      `.replace(/\s+/g, " ").trim()}
            {...props}
        />
    )
);
CardInteractive.displayName = "CardInteractive";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardInteractive };
