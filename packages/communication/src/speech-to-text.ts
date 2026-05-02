import type { SpeechToTextProvider, TranslationResult } from "./index";

export interface SpeechRecognizerOptions {
  apiUrl: string;
}

export function createSpeechRecognizer(options: SpeechRecognizerOptions): SpeechToTextProvider {
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];

  let resultCallback: (result: TranslationResult) => void = () => {};
  let errorCallback: (error: Error) => void = () => {};
  let endCallback: () => void = () => {};

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "audio.webm");

          const response = await fetch(options.apiUrl, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("API error: " + response.statusText);

          const data = (await response.json()) as { text: string; confidence?: number };

          resultCallback({
            text: data.text,
            confidence: data.confidence ?? 1.0,
            timestamp: Date.now(),
          });
        } catch (error) {
          errorCallback(error as Error);
        } finally {
          endCallback();
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
    } catch (error) {
      errorCallback(error as Error);
    }
  };

  const stop = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
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
