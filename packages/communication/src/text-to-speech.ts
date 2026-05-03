import type { TextToSpeechProvider } from "./index";

export interface SpeechSynthesizerOptions {
  apiUrl?: string;
  useNative?: boolean;
}

export function createSpeechSynthesizer(
  options: SpeechSynthesizerOptions = {},
): TextToSpeechProvider {
  let startCallback: () => void = () => {};
  let endCallback: () => void = () => {};
  let errorCallback: (err: Error) => void = () => {};

  const speakNative = (text: string, voice?: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      errorCallback(new Error("Speech synthesis not supported"));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        (v: SpeechSynthesisVoice) => v.name === voice || v.lang === voice,
      );
      if (selectedVoice) utterance.voice = selectedVoice;
    }

    utterance.onstart = () => startCallback();
    utterance.onend = () => endCallback();
    utterance.onerror = (e: SpeechSynthesisErrorEvent) => errorCallback(new Error(e.error));

    window.speechSynthesis.speak(utterance);
  };

  const speakApi = async (text: string, voice?: string) => {
    if (typeof window === "undefined") return;
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();

    try {
      startCallback();
      const response = await fetch(options.apiUrl!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) throw new Error("API error: " + response.statusText);

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        endCallback();
        audioContext.close();
      };
      source.start();
    } catch (error) {
      errorCallback(error as Error);
      endCallback();
      audioContext.close();
    }
  };

  const speak = async (text: string, voice?: string) => {
    if (options.apiUrl && options.useNative !== true) {
      await speakApi(text, voice);
    } else {
      speakNative(text, voice);
    }
  };

  return {
    speak,
    onStart: (cb) => {
      startCallback = cb;
    },
    onEnd: (cb) => {
      endCallback = cb;
    },
    onError: (cb) => {
      errorCallback = cb;
    },
  };
}
