"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@chakra-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-medium transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
        outline: "border-2 border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50",
        ghost: "bg-transparent hover:bg-indigo-100",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        accent: "bg-amber-500 text-amber-950 hover:bg-amber-600",
      },
      size: {
        default: "h-14 px-6 text-lg",
        sm: "h-10 px-4 text-md",
        lg: "h-20 px-8 text-xl",
        xl: "h-32 px-12 text-4xl",
      },
      active: {
        true: "ring-4 ring-indigo-500 scale-95",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
    },
  },
);

export interface LargeButtonProps
  extends Omit<ButtonProps, "variant" | "size">, VariantProps<typeof buttonVariants> {}

export const LargeButton = React.forwardRef<HTMLButtonElement, LargeButtonProps>(
  ({ className, variant, size, active, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(buttonVariants({ variant, size, active, className }))}
        unstyled // Use unstyled to let CVA/Tailwind handle it, or keep it to mix.
        {...props}
      />
    );
  },
);

LargeButton.displayName = "LargeButton";
