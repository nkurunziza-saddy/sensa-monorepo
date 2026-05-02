import { GESTURE_MAPPINGS } from "./gestures";

export interface GestureDetectorOptions {
  videoElement?: HTMLVideoElement;
  onGestureDetected: (gesture: string, phrase: string, confidence: number) => void;
  onError?: (error: Error) => void;
}

export function createGestureDetector(options: GestureDetectorOptions) {
  let active = false;
  
  const start = async () => {
    active = true;
    // TODO: Phase 3 MediaPipe implementation
    // For now, it's just a mock structure that allows manual triggers via simulateGesture
  };

  const stop = () => {
    active = false;
  };

  const simulateGesture = (gestureId: string) => {
    if (!active) return;
    const mapping = GESTURE_MAPPINGS.find(m => m.gesture === gestureId);
    if (mapping) {
      options.onGestureDetected(mapping.gesture, mapping.phrase, 1.0);
    }
  };

  return { start, stop, simulateGesture };
}
