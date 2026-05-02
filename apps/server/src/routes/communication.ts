import { Hono } from "hono";
import { env } from "@sensa-monorepo/env/server";
import * as googleTTS from "google-tts-api";

export const communicationRoutes = new Hono();

communicationRoutes.post("/speech-to-text", async (c) => {
  try {
    const formData = await c.req.formData();
    const audioBlob = formData.get("audio") as unknown as Blob;

    if (!audioBlob) {
      return c.json({ error: "No audio file provided" }, 400);
    }

    const mimeType = audioBlob.type || "audio/webm";
    console.log(`Processing STT with Groq Whisper API and mimeType: ${mimeType}`);

    // Groq transcription API expects a real file in FormData
    const groqFormData = new FormData();
    groqFormData.append("file", audioBlob, `audio.${mimeType.split("/")[1] || "webm"}`);
    groqFormData.append("model", "whisper-large-v3-turbo");
    groqFormData.append("response_format", "json");
    groqFormData.append("language", "en");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", errorData);
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { text: string };

    return c.json({
      text: data.text.trim(),
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

    const lang = voice === "alloy" ? "en" : voice;
    const urls = googleTTS.getAllAudioUrls(text, {
      lang,
      slow: false,
      host: "https://translate.google.com",
    });

    const buffers = await Promise.all(
      urls.map(async (urlObj) => {
        const response = await fetch(urlObj.url);
        return response.arrayBuffer();
      }),
    );

    // Concatenate buffers
    const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of buffers) {
      result.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    return new Response(result, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return c.json({ error: "Text to speech failed" }, 500);
  }
});

communicationRoutes.post("/assistant", async (c) => {
  try {
    const { message } = await c.req.json();

    if (!message) {
      return c.json({ error: "No message provided" }, 400);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an accessibility assistant for Sensa. Provide concise, helpful responses to help users communicate. User says: ${message}`,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Gemini API error");
    }

    const data = (await response.json()) as any;
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

    return c.json({ reply: reply.trim() });
  } catch (error) {
    console.error("Assistant Error:", error);
    return c.json({ error: "Assistant failed" }, 500);
  }
});
