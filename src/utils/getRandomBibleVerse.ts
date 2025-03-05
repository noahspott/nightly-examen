import type { BibleVerse } from "@/types/types";
import bibleVerses from "@/data/bibleVerses.json";

export default function getRandomBibleVerse(): BibleVerse {
  // Get today's date and create a stable seed
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  // Create a simple hash of the date string
  const hash = dateString.split("").reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);

  // Use the hash to get a consistent index for today
  const index = Math.abs(hash) % bibleVerses.length;

  return bibleVerses[index];
}
