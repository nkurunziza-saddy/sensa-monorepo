import type { GestureMapping } from "./index";

export const GESTURE_MAPPINGS: GestureMapping[] = [
  { gesture: "open_palm", phrase: "Hello", icon: "👋" },
  { gesture: "thumbs_up", phrase: "Yes", icon: "👍" },
  { gesture: "thumbs_down", phrase: "No", icon: "👎" },
  { gesture: "fist", phrase: "Stop", icon: "✊" },
  { gesture: "peace_sign", phrase: "Thank you", icon: "✌️" },
  { gesture: "pointing_up", phrase: "Help", icon: "☝️" },
  { gesture: "wave", phrase: "Goodbye", icon: "👋" },
  { gesture: "flat_hand", phrase: "Please", icon: "🤚" },
  { gesture: "love_you", phrase: "I love you", icon: "🤟" },
  { gesture: "ok", phrase: "Okay", icon: "👌" },
  { gesture: "call_me", phrase: "Call me", icon: "🤙" },
  { gesture: "clap", phrase: "Great job", icon: "👏" },
  { gesture: "prayer", phrase: "Please/Thank you", icon: "🙏" },
  { gesture: "heart", phrase: "Love", icon: "❤️" },
  { gesture: "point_right", phrase: "Look there", icon: "👉" },
  { gesture: "point_left", phrase: "Look here", icon: "👈" },
];

export function getEmojiForText(text: string): string {
  const normalized = text.toLowerCase().trim();
  
  // Try exact phrase match
  const match = GESTURE_MAPPINGS.find(m => 
    normalized.includes(m.phrase.toLowerCase()) || 
    m.phrase.toLowerCase().includes(normalized)
  );
  
  if (match) return match.icon;

  // Fallback keyword matching
  if (normalized.includes("hello") || normalized.includes("hi")) return "👋";
  if (normalized.includes("thank")) return "🙏";
  if (normalized.includes("yes") || normalized.includes("agree")) return "👍";
  if (normalized.includes("no") || normalized.includes("disagree")) return "👎";
  if (normalized.includes("help")) return "🆘";
  if (normalized.includes("stop") || normalized.includes("wait")) return "✋";
  if (normalized.includes("love")) return "❤️";
  if (normalized.includes("okay") || normalized.includes("ok")) return "👌";
  
  return "💬"; // Default speech bubble
}

export function getSignSequence(text: string): { phrase: string, icon: string }[] {
  const words = text.toLowerCase().split(/\s+/);
  const sequence: { phrase: string, icon: string }[] = [];
  
  let i = 0;
  while (i < words.length) {
    // Try matching phrases (up to 3 words)
    let foundMatch = false;
    for (let len = 3; len >= 1; len--) {
      if (i + len <= words.length) {
        const candidate = words.slice(i, i + len).join(" ");
        const match = GESTURE_MAPPINGS.find(m => 
          m.phrase.toLowerCase() === candidate || 
          m.phrase.toLowerCase().includes(candidate)
        );
        
        if (match) {
          sequence.push({ phrase: match.phrase, icon: match.icon });
          i += len;
          foundMatch = true;
          break;
        }
      }
    }
    
    if (!foundMatch) {
      // No match for this word, skip or add generic icon
      i++;
    }
  }
  
  return sequence;
}
