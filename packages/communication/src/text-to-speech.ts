export interface SpeechSynthesizerOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  apiUrl: string;
}

export function createSpeechSynthesizer(options: SpeechSynthesizerOptions) {
  let audioContext: AudioContext | null = null;
  const apiUrl = options.apiUrl;

  const speak = async (text: string, voice?: string) => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    try {
      options.onStart?.();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      
      if (!response.ok) throw new Error('API error: ' + response.statusText);
      
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
