"use client";

import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { cn } from "../lib/utils";

export function Card({ className, ...props }: BoxProps) {
  return <Box className={cn("clay-card shadow-none", className)} {...props} />;
}
