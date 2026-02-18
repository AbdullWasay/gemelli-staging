/**
 * Auth helper functions for troubleshooting product creation authentication
 */

import { useAppSelector } from "@/redux/hooks";
import { getTokenFromLocalStorage } from "@/utils/tokenHandler";

/**
 * Hook to get the current authentication token - uses the existing auth pattern
 *
 * This simplifies token access by checking both Redux store and localStorage
 * to help troubleshoot product creation issues
 */
export function useAuthToken(): string | null {
  // Get token from Redux state (primary source)
  const reduxToken = useAppSelector((state) => state.auth.access_token);

  // If we have a token in Redux, use it (this is the standard pattern in the app)
  if (reduxToken) {
    return reduxToken;
  }

  // Fallback: check localStorage using the app's existing token handler
  // This is just for debugging the current issue
  const localStorageToken = getTokenFromLocalStorage();
  if (localStorageToken) {
    console.log("Using fallback token from localStorage for troubleshooting");
    return localStorageToken;
  }

  // No token found
  return null;
}
