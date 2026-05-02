import { GESTURE_MAPPINGS } from "./gestures";
import { detectGesture, drawHand, type DetectionMetadata, type HandLandmark } from "./hand-gestures";
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

  // --- PERFECT STABILITY ENGINE ---
  const WINDOW_SIZE = 6; 
  const CONSENSUS_THRESHOLD = 4; 
  let gestureWindow: string[] = [];
  let lastEmittedGesture: string | null = null;
  let lastProcessTime = 0;
  const FRAME_THROTTLE = 16; 

  // Landmark Smoothing (Exponential Moving Average)
  let smoothedLandmarks: HandLandmark[] | null = null;
  const SMOOTHING_FACTOR = 0.35; 

  const runDetection = async (time: number) => {
    if (!active || !options.videoElement) return;
    
    // Process MediaPipe only if hands are ready and element is loaded
    if (hands && time - lastProcessTime > FRAME_THROTTLE && options.videoElement.readyState >= 2) {
      try {
        await hands.send({ image: options.videoElement });
        lastProcessTime = time;
      } catch (err) {
        console.error("MediaPipe inference error:", err);
      }
    }
    
    // Always reschedule for smooth camera preview and drawing
    animationFrameId = requestAnimationFrame(runDetection);
  };

  const start = async () => {
    if (typeof window === "undefined") return;
    active = true;

    try {
      // 1. Manual Camera Access (Immediate feedback)
      if (options.videoElement) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        });

        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        options.videoElement.srcObject = stream;
        await options.videoElement.play();
      }

      // Start loop early for smooth camera preview even before MediaPipe loads
      runDetection(0);

      // 2. Initialize MediaPipe (Background load)
      const { Hands } = await import("@mediapipe/hands");
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1, 
        modelComplexity: 1, 
        minDetectionConfidence: 0.75, 
        minTrackingConfidence: 0.75
      });

      hands.onResults((results: Results) => {
        if (!active) return;
        
        const rawLandmarks = results.multiHandLandmarks?.[0];

        // Landmark Smoothing Engine
        if (rawLandmarks) {
          if (!smoothedLandmarks) {
            smoothedLandmarks = [...rawLandmarks];
          } else {
            smoothedLandmarks = smoothedLandmarks.map((prev, i) => ({
              x: prev.x + (rawLandmarks[i].x - prev.x) * SMOOTHING_FACTOR,
              y: prev.y + (rawLandmarks[i].y - prev.y) * SMOOTHING_FACTOR,
              z: prev.z + (rawLandmarks[i].z - prev.z) * SMOOTHING_FACTOR,
            }));
          }
        } else {
          smoothedLandmarks = null;
        }

        // High-Fidelity Feedback Drawing
        const canvasCtx = options.canvasElement?.getContext("2d");
        if (canvasCtx && options.canvasElement) {
           canvasCtx.clearRect(0, 0, options.canvasElement.width, options.canvasElement.height);
           if (smoothedLandmarks) {
             canvasCtx.save();
             canvasCtx.scale(-1, 1);
             canvasCtx.translate(-options.canvasElement.width, 0);
             drawHand(canvasCtx, smoothedLandmarks);
             canvasCtx.restore();
           }
        }

        // Surgical Intent Matching
        if (smoothedLandmarks) {
          const { gesture, metadata } = detectGesture(smoothedLandmarks);
          metadataCallback(metadata);
          
          if (gesture) {
            gestureWindow.push(gesture);
            if (gestureWindow.length > WINDOW_SIZE) gestureWindow.shift();

            const counts = gestureWindow.reduce((acc, g) => {
              acc[g] = (acc[g] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            const [bestGesture, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

            if (count >= CONSENSUS_THRESHOLD && bestGesture !== lastEmittedGesture) {
              const mapping = GESTURE_MAPPINGS.find(m => m.gesture === bestGesture);
              if (mapping) {
                gestureCallback(mapping.gesture, mapping.phrase, count / WINDOW_SIZE);
                lastEmittedGesture = bestGesture;
                gestureWindow = []; 
                setTimeout(() => { lastEmittedGesture = null; }, 1200);
              }
            }
          }
        } else {
          metadataCallback({ handFound: false, isCentered: false, distance: "ideal", orientation: "upright", confidence: 0 });
          gestureWindow = [];
        }
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Gesture detector start aborted (likely stopped during init).");
        return;
      }
      console.error("Gesture Detector Start Error:", err);
      errorCallback(err as Error);
      active = false;
    }
  };

  const stop = () => {
    active = false;
    smoothedLandmarks = null;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (hands) hands.close();
    if (options.videoElement) options.videoElement.srcObject = null;
  };

  const simulateGesture = (gestureId: string) => {
    const mapping = GESTURE_MAPPINGS.find((m) => m.gesture === gestureId);
    if (mapping) gestureCallback(mapping.gesture, mapping.phrase, 1.0);
  };

  return { 
    start, stop, simulateGesture,
    onGesture: (cb) => { gestureCallback = cb; },
    onMetadata: (cb) => { metadataCallback = cb; },
    onError: (cb) => { errorCallback = cb; }
  };
}
