"use client";

import { Box, Spinner } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { cn } from "../../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const smoothButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-clay-md font-semibold text-sm transition-all duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:opacity-90",
        destructive: "bg-brand-pink text-white hover:opacity-90",
        outline: "border border-hairline bg-transparent hover:bg-surface-soft text-primary",
        secondary: "bg-surface-card text-primary border border-hairline hover:bg-surface-strong",
        ghost: "hover:bg-surface-soft text-muted hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        candy: "bg-brand-teal text-white border border-hairline-soft hover:opacity-90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-clay-md px-4 py-2",
        lg: "h-12 rounded-clay-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface SmoothButtonProps extends BoxProps, VariantProps<typeof smoothButtonVariants> {
  disabled?: boolean;
  loading?: boolean;
}

export const SmoothButton = React.forwardRef<HTMLButtonElement, SmoothButtonProps>(
  ({ className, variant, size, disabled, loading, children, ...props }, ref) => {
    return (
      <Box
        as="button"
        ref={ref}
        {...({ disabled: disabled || loading } as any)}
        _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        className={cn(smoothButtonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? <Spinner size="xs" color="currentColor" /> : children}
      </Box>
    );
  },
);

SmoothButton.displayName = "SmoothButton";

export { smoothButtonVariants };
