export type Modality = "speech" | "text" | "gesture";

export interface TranslationResult {
  text: string;
  confidence: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface GestureMapping {
  gesture: string;
  phrase: string;
  icon: string;
}

// --- Provider Interfaces ---

export interface SpeechToTextProvider {
  start: () => Promise<void>;
  stop: () => void;
  onResult: (callback: (result: TranslationResult) => void) => void;
  onError: (callback: (error: Error) => void) => void;
}

export interface TextToSpeechProvider {
  speak: (text: string, voice?: string) => Promise<void>;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface GestureProvider {
  start: () => Promise<void>;
  stop: () => void;
  onGesture: (callback: (gesture: string, phrase: string, confidence: number) => void) => void;
  onMetadata?: (callback: (metadata: any) => void) => void;
}

// --- Exports ---
export { GESTURE_MAPPINGS, getEmojiForText, getSignSequence } from "./gestures";
export { createSpeechRecognizer } from "./speech-to-text";
export { createSpeechSynthesizer } from "./text-to-speech";
export { createGestureDetector } from "./gesture-to-text";
