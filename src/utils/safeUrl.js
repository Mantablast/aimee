export function toSafeHttpUrl(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function openSafeExternalUrl(url, { target = "_blank" } = {}) {
  const safe = toSafeHttpUrl(url);
  if (!safe) return false;
  window.open(safe, target, "noopener,noreferrer");
  return true;
}

