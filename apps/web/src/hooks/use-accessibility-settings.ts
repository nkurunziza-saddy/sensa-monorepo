import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AccessibilitySettings {
  userMode: "blind" | "nonverbal" | "sighted";
  fontSize: number; // 1-3 scale
  highContrast: boolean;
  autoReadMessages: boolean;
  hapticFeedback: boolean;
  voiceId: string;
  speechRate: number; // 0.5 to 2.0
}

interface AccessibilityStore extends AccessibilitySettings {
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

export const useAccessibilitySettings = create<AccessibilityStore>()(
  persist(
    (set) => ({
      userMode: "sighted",
      fontSize: 1,
      highContrast: false,
      autoReadMessages: false,
      hapticFeedback: true,
      voiceId: "alloy",
      speechRate: 1.0,
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: "accessibility-settings",
    },
  ),
);
