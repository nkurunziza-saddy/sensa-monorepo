export type Modality = "speech" | "text" | "gesture";

export interface TranslationResult {
  text: string;
  confidence: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

// --- Provider Interfaces ---

export interface SpeechToTextProvider {
  start: () => Promise<void>;
  stop: () => void;
  onResult: (callback: (result: TranslationResult) => void) => void;
  onError: (callback: (error: Error) => void) => void;
  onEnd: (callback: () => void) => void;
}

export interface TextToSpeechProvider {
  speak: (text: string, voice?: string) => Promise<void>;
  onStart: (callback: () => void) => void;
  onEnd: (callback: () => void) => void;
  onError: (callback: (error: Error) => void) => void;
}

export interface GestureProvider {
  start: () => Promise<void>;
  stop: () => void;
  onGesture: (callback: (gestureId: string, phrase: string, confidence: number) => void) => void;
  onMetadata: (callback: (metadata: any) => void) => void;
  onError: (callback: (error: Error) => void) => void;
}

// --- Core Logic ---
export {
  GESTURE_MAPPINGS,
  getSignSequence,
  type GestureMapping,
  type DetectionMetadata,
  type HandLandmark,
} from "@sensa-monorepo/communication-core";
export { createSpeechRecognizer } from "./speech-to-text";
export { createSpeechSynthesizer } from "./text-to-speech";
export { createGestureDetector } from "./gesture-to-text";
