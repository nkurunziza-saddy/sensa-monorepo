import { useState, useCallback, useRef } from "react";
import { createSpeechRecognizer } from "@sensa-monorepo/communication";
import { useAccessibilitySettings } from "./use-accessibility-settings";
import { env } from "@sensa-monorepo/env/web";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Track recognizer instance to stop it
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);
  
  const { hapticFeedback } = useAccessibilitySettings();

  const vibrate = useCallback((pattern: number | number[]) => {
    if (hapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, [hapticFeedback]);

  const start = useCallback(() => {
    setError(null);
    vibrate(50); // Small feedback on start

    const recognizer = createSpeechRecognizer({
      apiUrl: `${env.NEXT_PUBLIC_SERVER_URL}/api/speech-to-text`,
      onResult: (text) => {
        setTranscript(text);
        vibrate([50, 50, 50]); // Success vibration
      },
      onError: (err) => {
        setError(err.message);
        vibrate([200, 100, 200]); // Error vibration
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
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

  return { isListening, transcript, error, start, stop };
}
