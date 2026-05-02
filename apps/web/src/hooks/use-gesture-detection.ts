import { useState, useCallback, useRef, useEffect } from "react";
import { createGestureDetector, GESTURE_MAPPINGS } from "@sensa-monorepo/communication";
import type { DetectionMetadata } from "@sensa-monorepo/communication/hand-gestures";
import { useAccessibilitySettings } from "./use-accessibility-settings";

export function useGestureDetection(
  videoElement?: HTMLVideoElement,
  canvasElement?: HTMLCanvasElement,
) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [metadata, setMetadata] = useState<DetectionMetadata>({
    handFound: false,
    isCentered: false,
    distance: "ideal",
    orientation: "upright",
    confidence: 0,
  });
  const [detectedGesture, setDetectedGesture] = useState<{
    gesture: string;
    phrase: string;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectorRef = useRef<ReturnType<typeof createGestureDetector> | null>(null);
  const isStartingRef = useRef(false);
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
    if (!videoElement) return;
    if (isStartingRef.current) return;

    if (detectorRef.current) {
      detectorRef.current.stop();
    }
    
    isStartingRef.current = true;
    setError(null);
    setDetectedGesture(null);
    setMetadata({
      handFound: false,
      isCentered: false,
      distance: "ideal",
      orientation: "upright",
      confidence: 0,
    });
    vibrate(50);

    const detector = createGestureDetector({
      videoElement,
      canvasElement,
    });

    detector.onGesture((gesture, phrase, confidence) => {
      setDetectedGesture({ gesture, phrase, confidence });
      vibrate([50, 50]);
    });

    detector.onMetadata((m) => {
      setMetadata(m);
    });

    detector.onError((err) => {
      setError(err.message);
      setIsDetecting(false);
    });

    detectorRef.current = detector;
    try {
      await detector.start();
      setIsDetecting(true);
    } catch (err) {
      setError((err as Error).message);
      setIsDetecting(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [videoElement, canvasElement, vibrate]);

  const stop = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = null;
    }
    setIsDetecting(false);
    setError(null);
    setDetectedGesture(null);
    setMetadata({ handFound: false, isCentered: false, distance: "ideal", orientation: "upright", confidence: 0 });
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
    metadata,
    error,
    start,
    stop,
    simulateGesture,
    availableGestures: GESTURE_MAPPINGS,
  };
}
