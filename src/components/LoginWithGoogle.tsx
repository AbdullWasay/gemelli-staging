"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { useLoginWithGoogleMutation } from "@/redux/features/auth/authApi";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface LoginWithGoogleProps {
  variant?: "login" | "signup";
  onSuccess?: () => void;
  redirectTo?: string;
  /** When signing up as seller, pass "SELLER" so user is created with store step next */
  role?: "USER" | "SELLER";
}

export default function LoginWithGoogle({ variant = "login", onSuccess, redirectTo = "/", role }: LoginWithGoogleProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginWithGoogle] = useLoginWithGoogleMutation();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;
    if (!credential) {
      toast.error("Failed to get Google credential");
      return;
    }

    const toastId = toast.loading(variant === "login" ? "Signing in..." : "Creating account...");

    try {
      const response = await loginWithGoogle({ credential, role }).unwrap();

      if (response?.success && response?.data?.accessToken) {
        const decodedToken = jwtDecode(response.data.accessToken) as {
          id: string;
          email: string;
          profilePic?: string;
          role: string;
          name?: string;
        };

        dispatch(
          setUser({
            access_token: response.data.accessToken,
            user: {
              id: decodedToken.id,
              email: decodedToken.email,
              profilePic: decodedToken.profilePic,
              role: decodedToken.role,
              name: decodedToken.name,
            },
            refresh_token: null,
          })
        );

        Cookie.set("accessToken", response.data.accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", decodedToken.role?.toLowerCase() === "seller" ? "seller" : "buyer");

        toast.success(variant === "login" ? "Signed in successfully" : "Account created successfully", {
          id: toastId,
          duration: 2000,
        });

        onSuccess?.();
        router.refresh();
        router.push(redirectTo);
      } else {
        toast.error(response?.error || "Authentication failed", {
          id: toastId,
          duration: 1500,
        });
      }
    } catch (error: unknown) {
      const err = error as { data?: { error?: string } };
      toast.error(err?.data?.error || "Google sign-in failed", {
        id: toastId,
        duration: 1500,
      });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed");
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_Google_ID;

  if (!clientId) {
    return null;
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text={variant === "login" ? "signin_with" : "signup_with"}
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}
