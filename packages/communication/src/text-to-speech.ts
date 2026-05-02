import type { TextToSpeechProvider } from "./index";

export interface SpeechSynthesizerOptions {
  apiUrl?: string;
}

let sharedAudioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return sharedAudioContext;
}

export function createSpeechSynthesizer(options: SpeechSynthesizerOptions = {}): TextToSpeechProvider & { onError: (cb: (err: Error) => void) => void, onStart: (cb: () => void) => void, onEnd: (cb: () => void) => void } {
  const apiUrl = options.apiUrl || "http://localhost:3000/api/text-to-speech";

  let startCallback: () => void = () => {};
  let endCallback: () => void = () => {};
  let errorCallback: (err: Error) => void = () => {};

  const speak = async (text: string, voice?: string) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    try {
      startCallback();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const response = await fetch(apiUrl, {
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
      source.onended = () => endCallback();
      source.start();
    } catch (error) {
      errorCallback(error as Error);
      endCallback();
    }
  };

  return { 
    speak,
    onStart: (cb) => { startCallback = cb; },
    onEnd: (cb) => { endCallback = cb; },
    onError: (cb) => { errorCallback = cb; }
  };
}
