/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Returns a valid profile image URL or the fallback.
 * Fixes profile image inconsistency (random/placeholder images).
 */
export function getProfileImageUrl(
  profilePic: string | null | undefined,
  fallback: string | { src: string }
): string | any {
  const fallbackVal = typeof fallback === "string" ? fallback : fallback;

  if (!profilePic || typeof profilePic !== "string" || profilePic.trim() === "") {
    return fallbackVal;
  }

  // Must start with http/https to be a valid external URL
  if (!profilePic.startsWith("http://") && !profilePic.startsWith("https://")) {
    return fallbackVal;
  }

  // Use data URLs (e.g. base64) as-is for local previews
  if (profilePic.startsWith("data:")) {
    return profilePic;
  }

  return profilePic;
}
