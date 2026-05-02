export interface SpeechRecognizerOptions {
  onResult: (text: string, confidence?: number) => void;
  onError: (error: Error) => void;
  onEnd: () => void;
  apiUrl: string;
}

export function createSpeechRecognizer(options: SpeechRecognizerOptions) {
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  const apiUrl = options.apiUrl;

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'audio.webm');
          const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) throw new Error('API error: ' + response.statusText);
          const data = await response.json() as { text: string; confidence?: number };
          options.onResult(data.text, data.confidence);
        } catch (error) {
          options.onError(error as Error);
        } finally {
          options.onEnd();
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
    } catch (error) {
      options.onError(error as Error);
    }
  };

  const stop = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  return { start, stop };
}
