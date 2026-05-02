# 🚀 Accessible Communication Platform — Hackathon Plan

## 🎯 Goal
Build a **realtime accessibility translation layer** that enables communication between:
- Blind users
- Non-verbal users

Core idea:
> Convert between **speech, text, and simple gestures** in real time.

---

## 🏗️ Monorepo Structure

```
apps/
  web/        # Next.js frontend
  api/        # Hono backend

packages/
  core/       # shared translation logic
```

---

## 🧠 Core Features (MVP Only)

### 1. Speech → Text
- Capture microphone input
- Convert to text

### 2. Text → Speech
- Convert typed or selected text into audio

### 3. Gesture → Text (Basic)
- Detect a few predefined hand signs
- Map to simple phrases ("hello", "help")

---

## 🔌 API Design

### Endpoints

```
POST /speech-to-text
POST /text-to-speech
POST /gesture-to-text
```

### Example Response

```json
{
  "text": "hello"
}
```

---

## 🛠️ Tooling

### Frontend (apps/web)
- Next.js
- TypeScript
- Tailwind CSS
- Web Speech API (SpeechRecognition + SpeechSynthesis)
- MediaPipe Hands (gesture detection)

### Backend (apps/api)
- Hono
- Node.js

### AI / Processing
- Whisper (speech-to-text)
- Google Text-to-Speech (or browser fallback)
- TensorFlow.js (gesture classification)

### Monorepo
- pnpm workspaces (or Turborepo if needed)

---

## 🧩 packages/core Responsibilities

- Unified translation interface
- Input normalization (audio, text, gesture)
- Output formatting

### Example Interface

```ts
export interface TranslationResult {
  text?: string;
  audioUrl?: string;
}

export async function speechToText(audio: Blob): Promise<string> {}
export async function textToSpeech(text: string): Promise<string> {}
export async function gestureToText(data: any): Promise<string> {}
```

---

## 🖥️ Frontend Pages

### 1. Talk Page
- Button: "Start Speaking"
- Output: live text

### 2. Reply Page
- Large buttons with phrases
- Tap → plays audio

### 3. Gesture Page
- Camera feed
- Displays detected gesture text

---

## 🔄 Demo Flow

1. Non-verbal user taps phrase
   → Audio is played

2. Blind user speaks
   → Text appears + optional audio feedback

3. Gesture demo
   → Show recognition of a simple sign

---

## 🌍 Integration Story

External apps can use the API:

- E-commerce platforms
- Government services
- Healthcare systems

Example:
```
POST /text-to-speech
{
  "text": "Your order is confirmed"
}
```

---

## 📅 Timeline

### Day 1
- Setup monorepo
- Implement text-to-speech
- Basic UI

### Day 2
- Add speech-to-text
- Connect frontend to backend

### Day 3
- Add gesture detection (or mock)
- Polish UI

### Final Hours
- Prepare demo
- Build slides

---

## ⚡ Key Implementation Tips

- Keep latency under 2 seconds
- Use large, simple UI elements
- Provide audio + visual feedback
- Avoid complex gesture models (limit to 5–10 gestures)
- Add fallback buttons if AI fails

---

## 🎯 Success Criteria

- Working end-to-end demo
- Clear real-world use case
- Simple and accessible UI
- API that can be reused externally

---

## 💡 Optional Enhancements (if time allows)

- Vibration feedback
- Offline phrase support
- AI-powered sentence suggestions

---

## 🏁 Final Note

Focus on:
- Working demo > perfect system
- Clear communication flow
- Real user impact

