import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/auth-utils";
import { Role } from "@prisma/client";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_Google_ID;

interface GoogleTokenPayload {
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  aud: string;
  sub: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential, role: requestedRole } = body;
    const role = requestedRole === "SELLER" ? Role.SELLER : Role.USER;

    if (!credential) {
      return NextResponse.json(
        { success: false, error: "Google credential is required" },
        { status: 400 }
      );
    }

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: "Google OAuth is not configured" },
        { status: 500 }
      );
    }

    // Verify the Google ID token
    const tokenResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Invalid Google token" },
        { status: 401 }
      );
    }

    const payload: GoogleTokenPayload = await tokenResponse.json();

    // Verify the token is for our app
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: "Invalid token audience" },
        { status: 401 }
      );
    }

    if (!payload.email_verified || !payload.email) {
      return NextResponse.json(
        { success: false, error: "Email not verified by Google" },
        { status: 401 }
      );
    }

    const { email, name, picture, given_name, family_name } = payload;
    const displayName = name || [given_name, family_name].filter(Boolean).join(" ") || email.split("@")[0];

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: displayName,
          profilePic: picture || null,
          password: null, // No password for Google users
          role,
        },
      });
    } else if (!user.profilePic && picture) {
      // Update profile pic if we have it and user doesn't
      user = await prisma.user.update({
        where: { id: user.id },
        data: { profilePic: picture },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    const accessToken = generateToken(userWithoutPassword);

    return NextResponse.json(
      {
        success: true,
        message: "Authentication successful",
        data: {
          user: userWithoutPassword,
          accessToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
