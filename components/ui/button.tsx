import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  openInNewTab?: boolean;
  loading?: boolean; // Added loading prop
  disabled?: boolean; // Explicitly declare disabled prop
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      href,
      openInNewTab = false,
      loading = false,
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    let Comp: React.ElementType = asChild ? Slot : "button";

    if (href) {
      Comp = "a";
    }

    // Consolidate disabled state considering both disabled and loading props
    const isDisabled = disabled || loading;
    const loadingClass = loading ? "loading" : "";

    return (
      <Comp
        href={href}
        className={cn(buttonVariants({ variant, size }), className, loadingClass, { disabled: isDisabled })}
        ref={ref}
        {...props}
        disabled={isDisabled}
        {...(href && openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(href ? {} : { type })}
        {...(loading && { "aria-busy": true })}>
        {loading ? (
          <>
            <span className="spinner">Loading...</span>
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
