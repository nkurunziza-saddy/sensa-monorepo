export interface GestureMapping {
  gesture: string;
  phrase: string;
  icon: string;
}

export const GESTURE_MAPPINGS: GestureMapping[] = [
  { gesture: "open_palm", phrase: "Hello", icon: "👋" },
  { gesture: "thumbs_up", phrase: "Yes", icon: "👍" },
  { gesture: "thumbs_down", phrase: "No", icon: "👎" },
  { gesture: "fist", phrase: "Stop", icon: "✊" },
  { gesture: "peace_sign", phrase: "Thank you", icon: "✌️" },
  { gesture: "pointing_up", phrase: "Help", icon: "☝️" },
  { gesture: "wave", phrase: "Goodbye", icon: "👋" },
  { gesture: "flat_hand", phrase: "Please", icon: "✋" },
  { gesture: "love_you", phrase: "I love you", icon: "🤟" },
  { gesture: "ok", phrase: "Okay", icon: "👌" },
  { gesture: "call_me", phrase: "Call me", icon: "🤙" },
  { gesture: "clap", phrase: "Great job", icon: "👏" },
  { gesture: "prayer", phrase: "Thank you", icon: "🙏" },
  { gesture: "heart", phrase: "Love", icon: "❤️" },
  { gesture: "point_right", phrase: "Look there", icon: "👉" },
  { gesture: "point_left", phrase: "Look here", icon: "👈" },
];

/**
 * Maps common words to emojis for visual feedback
 */
export function getEmojiForText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("hello")) return "👋";
  if (lower.includes("thank")) return "🙏";
  if (lower.includes("yes")) return "👍";
  if (lower.includes("no")) return "👎";
  if (lower.includes("love")) return "❤️";
  if (lower.includes("help")) return "🆘";
  if (lower.includes("stop")) return "🛑";
  return "💬";
}

/**
 * Translates a text string into a sequence of mapped phrases.
 * This is the core "Text to Sign" logic.
 */
export function getSignSequence(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const sequence: string[] = [];

  let i = 0;
  while (i < words.length) {
    let foundMatch = false;
    // Look for multi-word phrases (up to 3 words)
    for (let len = 3; len >= 1; len--) {
      if (i + len <= words.length) {
        const candidate = words.slice(i, i + len).join(" ");
        const match = GESTURE_MAPPINGS.find(
          (m) => m.phrase.toLowerCase() === candidate || m.phrase.toLowerCase().includes(candidate),
        );

        if (match) {
          sequence.push(match.phrase);
          i += len;
          foundMatch = true;
          break;
        }
      }
    }
    if (!foundMatch) i++;
  }
  return sequence;
}
