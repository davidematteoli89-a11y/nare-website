/** Restituisce solo URL assoluti HTTP(S), altrimenti null. Sicura anche nei Client Components. */
export function resolvePublicImageUrl(path: string | null): string | null {
  if (!path) return null;
  try {
    const parsed = new URL(path);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}
