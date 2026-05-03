import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type Condition = "visual" | "vocal" | "auditory" | "none";

export function getConditionColors(condition: Condition): [string, string] {
  switch (condition) {
    case "visual":
      return ["#ff4d8b", "#ffb084"];
    case "vocal":
      return ["#1a3a3a", "#a4d4c5"];
    case "auditory":
      return ["#b8a4ed", "#e8b94a"];
    default:
      return ["#0a0a0a", "#6a6a6a"];
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
