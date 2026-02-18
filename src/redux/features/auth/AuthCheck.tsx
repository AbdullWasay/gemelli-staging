"use client";

import {
  selectCurrentUser,
  useCurrentToken,
} from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loading from "@/components/shared/Loading/Loading";
import { useSelector } from "react-redux";

interface AuthCheckProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional: specific roles that are allowed to access
  redirectTo?: string; // Where to redirect if not authenticated
}

/**
 * Component to protect routes based on authentication status
 *
 * Usage:
 * <AuthCheck>
 *   <YourProtectedComponent />
 * </AuthCheck>
 *
 * With role-based protection:
 * <AuthCheck allowedRoles={["ADMIN", "SELLER"]}>
 *   <AdminOnlyComponent />
 * </AuthCheck>
 */
const AuthCheck = ({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}: AuthCheckProps) => {
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(useCurrentToken);
  const isAuthenticated = !!user && !!accessToken;
  const isLoading = false; // We can add a loading state if needed
  const router = useRouter();

  useEffect(() => {
    // Wait for authentication check to complete
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If roles are specified, check if user has required role
      if (allowedRoles.length > 0 && user?.role) {
        if (!allowedRoles.includes(user.role)) {
          // Redirect if user doesn't have required role
          router.push("/"); // Redirect to homepage or access denied page
        }
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    redirectTo,
    allowedRoles,
    user?.role,
  ]);

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If authenticated and no role restrictions or has correct role, render children
  if (
    isAuthenticated &&
    (allowedRoles.length === 0 ||
      (user?.role && allowedRoles.includes(user.role)))
  ) {
    return <>{children}</>;
  }

  // Don't render anything while redirecting
  return null;
};

export default AuthCheck;
