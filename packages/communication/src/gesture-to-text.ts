import { GESTURE_MAPPINGS } from "./gestures";
import { detectGesture, type DetectionMetadata } from "./hand-gestures";
import type { Results } from "@mediapipe/hands";
import type { GestureProvider } from "./index";

export interface GestureDetectorOptions {
  videoElement?: HTMLVideoElement;
}

export function createGestureDetector(options: GestureDetectorOptions): GestureProvider & { onError: (cb: (err: Error) => void) => void, simulateGesture: (id: string) => void } {
  let active = false;
  let stream: MediaStream | null = null;
  let hands: any = null;
  let camera: any = null;
  
  let gestureCallback: (gesture: string, phrase: string, confidence: number) => void = () => {};
  let metadataCallback: (metadata: DetectionMetadata) => void = () => {};
  let errorCallback: (err: Error) => void = () => {};

  // Debouncing logic
  let lastGesture: string | null = null;
  let gestureCount = 0;
  const CONFIRMATION_THRESHOLD = 5; 

  const start = async () => {
    if (typeof window === "undefined") return;
    active = true;

    try {
      const { Hands } = await import("@mediapipe/hands");
      const { Camera } = await import("@mediapipe/camera_utils");

      hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults((results: Results) => {
        if (!active) return;
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          const { gesture: gestureId, metadata } = detectGesture(landmarks);
          
          metadataCallback(metadata);
          
          if (gestureId) {
            if (gestureId === lastGesture) {
              gestureCount++;
              if (gestureCount === CONFIRMATION_THRESHOLD) {
                const mapping = GESTURE_MAPPINGS.find(m => m.gesture === gestureId);
                if (mapping) {
                  gestureCallback(mapping.gesture, mapping.phrase, 0.9);
                }
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
          metadataCallback({ handFound: false, isCentered: false, distance: "ideal" });
          lastGesture = null;
          gestureCount = 0;
        }
      });

      if (options.videoElement) {
        camera = new Camera(options.videoElement, {
          onFrame: async () => {
            if (active && hands && options.videoElement) {
              await hands.send({ image: options.videoElement });
            }
          },
          width: 1280,
          height: 720
        });
        await camera.start();
      }
    } catch (err) {
      errorCallback(err as Error);
      active = false;
    }
  };

  const stop = async () => {
    active = false;
    if (camera) {
      await camera.stop();
      camera = null;
    }
    if (hands) {
      await hands.close();
      hands = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
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
    onGesture: (cb) => { gestureCallback = cb; },
    onMetadata: (cb) => { metadataCallback = cb; },
    onError: (cb) => { errorCallback = cb; },
    simulateGesture 
  };
}
