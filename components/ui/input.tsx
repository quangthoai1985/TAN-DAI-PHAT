import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", type = "text", error, ...props }, ref) => {
        return (
            <input
                type={type}
                ref={ref}
                className={`
          flex h-11 w-full rounded-lg
          border bg-[hsl(var(--background))]
          px-3 py-2 text-base
          file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-[hsl(var(--muted-foreground))]
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${error
                        ? "border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]"
                        : "border-[hsl(var(--input))] focus-visible:ring-[hsl(var(--ring))]"
                    }
          ${className}
        `.replace(/\s+/g, " ").trim()}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = "", error, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`
          flex min-h-[100px] w-full rounded-lg
          border bg-[hsl(var(--background))]
          px-3 py-2 text-base
          placeholder:text-[hsl(var(--muted-foreground))]
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          resize-none
          ${error
                        ? "border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]"
                        : "border-[hsl(var(--input))] focus-visible:ring-[hsl(var(--ring))]"
                    }
          ${className}
        `.replace(/\s+/g, " ").trim()}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";

// Label component
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = "", ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={`
          text-sm font-medium leading-none
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
          ${className}
        `.replace(/\s+/g, " ").trim()}
                {...props}
            />
        );
    }
);

Label.displayName = "Label";

export { Input, Textarea, Label };
