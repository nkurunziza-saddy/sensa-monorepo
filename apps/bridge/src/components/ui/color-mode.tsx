"use client";

import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import * as React from "react";
import { Sun } from "lucide-react";

export interface ColorModeProviderProps {
  children: React.ReactNode;
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return <>{props.children}</>;
}

export function useColorMode() {
  return {
    colorMode: "light",
    setColorMode: () => {},
    toggleColorMode: () => {},
  };
}

export function useColorModeValue<T>(light: T, _dark: T) {
  return light;
}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function ColorModeButton(props, ref) {
    return (
      <IconButton
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        disabled
        {...props}
      >
        <Sun size={20} />
      </IconButton>
    );
  },
);

export function ColorModeIcon() {
  return <Sun size={20} />;
}
