import { useState, useCallback, useRef } from "react";
import { createSpeechRecognizer } from "@sensa-monorepo/communication";
import { useAccessibilitySettings } from "./use-accessibility-settings";
import { env } from "@sensa-monorepo/env/web";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);
  const { hapticFeedback } = useAccessibilitySettings();

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (hapticFeedback && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    },
    [hapticFeedback],
  );

  const start = useCallback(() => {
    setError(null);
    vibrate(50);

    const recognizer = createSpeechRecognizer({
      apiUrl: `${env.NEXT_PUBLIC_SERVER_URL}/api/speech-to-text`,
    });

    recognizer.onResult((res) => {
      setTranscript(res.text);
      vibrate([50, 50, 50]);
    });

    recognizer.onError((err) => {
      setError(err.message);
      vibrate([200, 100, 200]);
      setIsListening(false);
    });

    recognizer.onEnd(() => {
      setIsListening(false);
    });

    recognizerRef.current = recognizer;
    recognizer.start();
    setIsListening(true);
  }, [vibrate]);

  const stop = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }
    setIsListening(false);
    vibrate(50);
  }, [vibrate]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return { isListening, transcript, error, start, stop, resetTranscript };
}
