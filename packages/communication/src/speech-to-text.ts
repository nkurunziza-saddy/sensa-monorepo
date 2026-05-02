import type { SpeechToTextProvider, TranslationResult } from "./index";

export interface SpeechRecognizerOptions {
  apiUrl?: string;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

export function createSpeechRecognizer(options: SpeechRecognizerOptions = {}): SpeechToTextProvider {
  let recognition: any = null;
  let isStarted = false;

  let resultCallback: (result: TranslationResult) => void = () => {};
  let errorCallback: (error: Error) => void = () => {};
  let endCallback: () => void = () => {};

  const initNative = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = options.interimResults ?? false;
      recognition.lang = options.language ?? "en-US";

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        const confidence = event.results[last][0].confidence;

        resultCallback({
          text,
          confidence,
          timestamp: Date.now(),
        });
      };

      recognition.onerror = (event: any) => {
        errorCallback(new Error(event.error));
      };

      recognition.onend = () => {
        isStarted = false;
        endCallback();
      };
    }
  };

  const start = async () => {
    if (isStarted) return;
    
    if (!recognition) {
      initNative();
    }

    if (recognition) {
      recognition.start();
      isStarted = true;
    } else if (options.apiUrl) {
      // Fallback to custom API implementation if native is unavailable
      console.warn("Native SpeechRecognition not supported, custom API fallback not fully implemented in this version.");
    } else {
      errorCallback(new Error("Speech recognition not supported in this browser."));
    }
  };

  const stop = () => {
    if (recognition && isStarted) {
      recognition.stop();
      isStarted = false;
    }
  };

  return {
    start,
    stop,
    onResult: (cb) => {
      resultCallback = cb;
    },
    onError: (cb) => {
      errorCallback = cb;
    },
    onEnd: (cb) => {
      endCallback = cb;
    },
  };
}

