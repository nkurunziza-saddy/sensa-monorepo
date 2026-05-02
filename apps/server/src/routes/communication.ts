import { Hono } from "hono";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@sensa-monorepo/env/server";
import * as googleTTS from "google-tts-api";

export const communicationRoutes = new Hono();

// We initialize the provider lazily in case env vars are populated via Cloudflare Worker bindings
const getGoogleProvider = () => createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY!,
});

communicationRoutes.post("/speech-to-text", async (c) => {
  try {
    const formData = await c.req.formData();
    const audioBlob = formData.get("audio") as unknown as Blob;
    
    if (!audioBlob) {
      return c.json({ error: "No audio file provided" }, 400);
    }

    const google = getGoogleProvider();
    const arrayBuffer = await audioBlob.arrayBuffer();

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please transcribe the speech in this audio exactly. Do not add any extra text or commentary. Only output the transcription." },
            { type: "file", data: new Uint8Array(arrayBuffer), mediaType: audioBlob.type || "audio/webm" }
          ]
        }
      ]
    });

    return c.json({
      text: text.trim(),
      confidence: 1.0, 
    });
  } catch (error) {
    console.error("STT Error:", error);
    return c.json({ error: "Speech to text failed" }, 500);
  }
});

communicationRoutes.post("/text-to-speech", async (c) => {
  try {
    const { text, voice = "en" } = await c.req.json();

    if (!text) {
      return c.json({ error: "No text provided" }, 400);
    }

    const url = googleTTS.getAudioUrl(text, {
      lang: voice === "alloy" ? "en" : voice,
      slow: false,
      host: 'https://translate.google.com',
    });

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    
    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return c.json({ error: "Text to speech failed" }, 500);
  }
});
