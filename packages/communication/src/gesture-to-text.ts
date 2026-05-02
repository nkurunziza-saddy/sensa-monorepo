import { GESTURE_MAPPINGS } from "./gestures";

export interface GestureDetectorOptions {
  videoElement?: HTMLVideoElement;
  onGestureDetected: (gesture: string, phrase: string, confidence: number) => void;
  onError?: (error: Error) => void;
}

export function createGestureDetector(options: GestureDetectorOptions) {
  let active = false;
  let stream: MediaStream | null = null;

  const start = async () => {
    active = true;

    if (options.videoElement) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });
        options.videoElement.srcObject = stream;
        await options.videoElement.play();
      } catch (err) {
        console.error("Camera access error:", err);
        options.onError?.(err as Error);
        active = false;
        throw err;
      }
    }

    // TODO: Phase 3 MediaPipe implementation
    // For now, it's just a mock structure that allows manual triggers via simulateGesture
  };

  const stop = () => {
    active = false;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    if (options.videoElement) {
      options.videoElement.srcObject = null;
    }
  };
  const simulateGesture = (gestureId: string) => {
    if (!active) return;
    const mapping = GESTURE_MAPPINGS.find((m) => m.gesture === gestureId);
    if (mapping) {
      options.onGestureDetected(mapping.gesture, mapping.phrase, 1.0);
    }
  };

  return { start, stop, simulateGesture };
}
