/* eslint-disable @typescript-eslint/no-explicit-any */

const FAVORITES_PREFIX = "favorites_";
const LEGACY_KEY = "favorites";

/**
 * Get the localStorage key for favorites based on user.
 * Logged-in users get favorites_${userId}, guests get favorites_guest.
 */
export function getFavoritesStorageKey(userId: string | null | undefined): string {
  if (userId) return `${FAVORITES_PREFIX}${userId}`;
  return `${FAVORITES_PREFIX}guest`;
}

/**
 * Get favorites from localStorage for the current user.
 * Migrates legacy "favorites" to user-scoped key on first use.
 */
export function getFavorites(userId: string | null | undefined): any[] {
  if (typeof window === "undefined") return [];
  const key = getFavoritesStorageKey(userId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  // One-time migration from legacy key
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    try {
      const data = JSON.parse(legacy);
      localStorage.setItem(key, legacy);
      localStorage.removeItem(LEGACY_KEY);
      return data;
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Save favorites to localStorage for the current user.
 */
export function setFavorites(userId: string | null | undefined, items: any[]): void {
  if (typeof window === "undefined") return;
  const key = getFavoritesStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(items));
}

/**
 * Clear guest favorites (called on logout so wishlist appears empty).
 */
export function clearGuestFavorites(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${FAVORITES_PREFIX}guest`);
}
