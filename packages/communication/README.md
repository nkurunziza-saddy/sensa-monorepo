# @sensa-monorepo/communication

A high-performance communication bridge package providing Gesture-to-Text, Speech-to-Text, and Text-to-Speech capabilities.

## Features

- **Gesture Detection**: Real-time hand gesture recognition using MediaPipe.
- **Speech-to-Text**: Voice recognition for hands-free communication.
- **Text-to-Speech**: High-quality synthesis for vocal feedback.
- **Unified Interface**: Consistent provider patterns for all communication modalities.

## Installation

```bash
npm install @sensa-monorepo/communication
```

_Note: This package requires `@mediapipe/hands` and `@mediapipe/camera_utils` as peer dependencies for gesture detection._

## Usage

### Gesture Detection

```typescript
import { createGestureDetector } from "@sensa-monorepo/communication";

const detector = createGestureDetector({
  videoElement: document.getElementById("my-video"),
  canvasElement: document.getElementById("my-canvas"),
});

detector.onGesture((gestureId, phrase, confidence) => {
  console.log(`Detected: ${phrase} (${confidence})`);
});

await detector.start();
```

### Speech Recognition

```typescript
import { createSpeechRecognizer } from "@sensa-monorepo/communication";

const recognizer = createSpeechRecognizer();

recognizer.onResult((result) => {
  console.log(`Speech: ${result.text}`);
});

await recognizer.start();
```

## Making it External

To use this package outside of the Sensa Monorepo:

1. Ensure `zod` and `@mediapipe` dependencies are satisfied.
2. The package is exported as ESM.
3. MediaPipe WASM binaries are loaded from CDN by default but can be configured.

## Design Philosophy

This package follows the "Single Modality focus" principle from the Sensa Design System, ensuring that each communication channel is robust and isolated before being bridged.
