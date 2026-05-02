export interface TranslationResult {
  text?: string;
  audioUrl?: string;
  confidence?: number;
  timestamp: number;
}

export interface GestureMapping {
  gesture: string;
  phrase: string;
  icon: string;
}

export type InputModality = "speech" | "text" | "gesture";
export type OutputModality = "text" | "audio" | "haptic";

export { GESTURE_MAPPINGS } from "./gestures";
export { createSpeechRecognizer, type SpeechRecognizerOptions } from "./speech-to-text";
export { createSpeechSynthesizer, type SpeechSynthesizerOptions } from "./text-to-speech";
export { createGestureDetector, type GestureDetectorOptions } from "./gesture-to-text";
