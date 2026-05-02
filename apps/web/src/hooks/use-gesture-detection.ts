import { useState, useCallback, useRef, useEffect } from "react";
import { createGestureDetector, GESTURE_MAPPINGS } from "@sensa-monorepo/communication";
import { useAccessibilitySettings } from "./use-accessibility-settings";

export function useGestureDetection(videoElement?: HTMLVideoElement) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<{
    gesture: string;
    phrase: string;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectorRef = useRef<ReturnType<typeof createGestureDetector> | null>(null);
  const { hapticFeedback } = useAccessibilitySettings();

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (hapticFeedback && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    },
    [hapticFeedback],
  );

  const start = useCallback(async () => {
    setError(null);
    vibrate(50);

    const detector = createGestureDetector({
      videoElement,
      onGestureDetected: (gesture, phrase, confidence) => {
        setDetectedGesture({ gesture, phrase, confidence });
        vibrate([50, 50]);
      },
      onError: (err) => {
        setError(err.message);
        setIsDetecting(false);
      },
    });

    detectorRef.current = detector;
    try {
      await detector.start();
      setIsDetecting(true);
    } catch (err) {
      setError((err as Error).message);
      setIsDetecting(false);
    }
  }, [videoElement, vibrate]);

  const stop = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = null;
    }
    setIsDetecting(false);
  }, []);

  const simulateGesture = useCallback((gestureId: string) => {
    if (detectorRef.current) {
      detectorRef.current.simulateGesture(gestureId);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isDetecting,
    detectedGesture,
    error,
    start,
    stop,
    simulateGesture,
    availableGestures: GESTURE_MAPPINGS,
  };
}
