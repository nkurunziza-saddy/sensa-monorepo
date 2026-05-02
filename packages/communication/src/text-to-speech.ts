export interface SpeechSynthesizerOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
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

export function createSpeechSynthesizer(options: SpeechSynthesizerOptions) {
  const apiUrl = options.apiUrl || "http://localhost:3000/api/text-to-speech";

  const speak = async (text: string, voice?: string) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    try {
      options.onStart?.();

      // Ensure context is running (required by some browsers after user interaction)
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
      source.onended = () => options.onEnd?.();
      source.start();
    } catch (error) {
      options.onError?.(error as Error);
      options.onEnd?.();
    }
  };

  return { speak };
}
