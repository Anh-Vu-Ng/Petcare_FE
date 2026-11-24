import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          {
            "bg-accent-collar text-white hover:bg-accent-collar-hover h-10 px-4 py-2":
              variant === "default",
            "bg-shell-bg text-shell-ink-bright hover:bg-shell-surface h-10 px-4 py-2":
              variant === "secondary",
            "border border-strong bg-surface-card text-ink-primary hover:bg-surface-subtle h-10 px-4 py-2":
              variant === "outline",
            "text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary h-10 px-4 py-2":
              variant === "ghost",
            "h-10 w-10 p-2 bg-accent-collar text-white hover:bg-accent-collar-hover":
              variant === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
