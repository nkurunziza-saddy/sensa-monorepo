import { GESTURE_MAPPINGS } from "./gestures";
import { detectGesture, drawHand, type DetectionMetadata } from "./hand-gestures";
import type { Results } from "@mediapipe/hands";
import type { GestureProvider } from "./index";

export interface GestureDetectorOptions {
  videoElement?: HTMLVideoElement;
  canvasElement?: HTMLCanvasElement;
}

export interface EnhancedGestureProvider extends GestureProvider {
  simulateGesture: (gestureId: string) => void;
}

export function createGestureDetector(options: GestureDetectorOptions): EnhancedGestureProvider {
  let active = false;
  let stream: MediaStream | null = null;
  let hands: any = null;
  let animationFrameId: number | null = null;

  let gestureCallback: (gesture: string, phrase: string, confidence: number) => void = () => {};
  let metadataCallback: (metadata: DetectionMetadata) => void = () => {};
  let errorCallback: (err: Error) => void = () => {};

  // Debouncing & Smoothing logic
  let lastGesture: string | null = null;
  let gestureCount = 0;
  const CONFIRMATION_THRESHOLD = 6;

  const runDetection = async () => {
    if (!active || !hands || !options.videoElement) return;

    if (options.videoElement.readyState >= 2) {
      await hands.send({ image: options.videoElement });
    }

    animationFrameId = requestAnimationFrame(runDetection);
  };

  const start = async () => {
    if (typeof window === "undefined") return;
    active = true;

    try {
      // 1. Initialize MediaPipe
      const { Hands } = await import("@mediapipe/hands");
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults((results: Results) => {
        if (!active) return;

        // --- DRAWING ---
        const canvasCtx = options.canvasElement?.getContext("2d");
        if (canvasCtx && options.canvasElement) {
          canvasCtx.clearRect(0, 0, options.canvasElement.width, options.canvasElement.height);
          canvasCtx.save();
          canvasCtx.scale(-1, 1);
          canvasCtx.translate(-options.canvasElement.width, 0);
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            drawHand(canvasCtx, results.multiHandLandmarks[0]);
          }
          canvasCtx.restore();
        }

        // --- DETECTION ---
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          const { gesture: gestureId, metadata } = detectGesture(landmarks);
          metadataCallback(metadata);

          if (gestureId) {
            if (gestureId === lastGesture) {
              gestureCount++;
              if (gestureCount === CONFIRMATION_THRESHOLD) {
                const mapping = GESTURE_MAPPINGS.find((m) => m.gesture === gestureId);
                if (mapping) gestureCallback(mapping.gesture, mapping.phrase, 0.95);
                gestureCount = 0;
              }
            } else {
              lastGesture = gestureId;
              gestureCount = 0;
            }
          } else {
            lastGesture = null;
            gestureCount = 0;
          }
        } else {
          metadataCallback({ handFound: false, isCentered: false, distance: "ideal", score: 0 });
          lastGesture = null;
          gestureCount = 0;
        }
      });

      // 2. Manual Camera Access (More reliable)
      if (options.videoElement) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        });
        options.videoElement.srcObject = stream;
        await options.videoElement.play();

        // Start detection loop
        runDetection();
      }
    } catch (err) {
      console.error("Gesture Detector Start Error:", err);
      errorCallback(err as Error);
      active = false;
    }
  };

  const stop = () => {
    active = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    if (hands) {
      hands.close();
      hands = null;
    }
    if (options.videoElement) {
      options.videoElement.srcObject = null;
    }
  };

  const simulateGesture = (gestureId: string) => {
    const mapping = GESTURE_MAPPINGS.find((m) => m.gesture === gestureId);
    if (mapping) {
      gestureCallback(mapping.gesture, mapping.phrase, 1.0);
    }
  };

  return {
    start,
    stop,
    onGesture: (cb) => {
      gestureCallback = cb;
    },
    onMetadata: (cb) => {
      metadataCallback = cb;
    },
    onError: (cb) => {
      errorCallback = cb;
    },
    simulateGesture,
  };
}
