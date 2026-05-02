import { useState, useCallback } from "react";
import { createSpeechSynthesizer } from "@sensa-monorepo/communication";
import { useAccessibilitySettings } from "./use-accessibility-settings";
import { env } from "@sensa-monorepo/env/web";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { hapticFeedback, voiceId } = useAccessibilitySettings();

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (hapticFeedback && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    },
    [hapticFeedback],
  );

  const speak = useCallback(
    async (text: string) => {
      setError(null);
      vibrate(50);

      const synthesizer = createSpeechSynthesizer({
        apiUrl: `${env.NEXT_PUBLIC_SERVER_URL}/api/text-to-speech`,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: (err) => {
          setError(err.message);
          setIsSpeaking(false);
          vibrate([200, 100, 200]);
        },
      });

      await synthesizer.speak(text, voiceId);
    },
    [vibrate, voiceId],
  );

  return { speak, isSpeaking, error };
}
