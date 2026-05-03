"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        canvas: { value: "#fffaf0" },
        primary: { value: "#0a0a0a" },
        ink: { value: "#0a0a0a" },
        body: { value: "#3a3a3a" },
        muted: { value: "#6a6a6a" },
        hairline: { value: "#e5e5e5" },
        "hairline-soft": { value: "#f0f0f0" },
        "surface-soft": { value: "#faf5e8" },
        "surface-card": { value: "#ffffff" },
        "surface-strong": { value: "#f5f0e0" },
        "brand-pink": { value: "#ff4d8b" },
        "brand-teal": { value: "#1a3a3a" },
      },
      radii: {
        "clay-sm": { value: "6px" },
        "clay-md": { value: "10px" },
        "clay-lg": { value: "14px" },
      },
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
