import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseImages(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [input];
  } catch {
    // If it's a single URL string or comma-separated
    if (typeof input === "string" && input.includes(",")) {
      return input.split(",").map(s => s.trim());
    }
    return [input];
  }
}
