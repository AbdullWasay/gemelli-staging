import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken, hashPassword } from "@/lib/auth-utils";
import { z } from "zod";
import { Role } from "@prisma/client";
import { sendWelcomeNotification } from "@/lib/notification-service";
import { validatePassword } from "@/utils/passwordValidator";

// Validation schema for store details
const storeSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeCategory: z.string().min(1, "Store category is required"),
  storeWebsite: z.string().optional(),
});

// Validation schema for signup request
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "SELLER"]).default("USER"),
  store: storeSchema.optional(),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validatedData = signupSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validatedData.error.issues,
        },
        { status: 400 }
      );
    }
    const passwordValidation = validatePassword(validatedData.data.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password does not meet security requirements: " +
            passwordValidation.errors.join(", "), // join the errors with a comma
        },
        { status: 400 }
      );
    }

    const { name, email, password, role, store } = validatedData.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
        // Create the store if role is SELLER and store data is provided
        ...(role === "SELLER" && store
          ? {
              store: {
                create: {
                  storeName: store.storeName,
                  storeCategory: store.storeCategory,
                  storeWebsite: store.storeWebsite || "",
                },
              },
            }
          : {}),
      },
      include: {
        store: role === "SELLER",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    // Send welcome notification (async, don't wait for it)
    sendWelcomeNotification(user.id).catch((error) => {
      console.error("Failed to send welcome notification:", error);
      // Don't fail the registration if notification fails
    });

    // Remove password from the response
    const userResponse = {
      ...user,
      password: undefined,
      accessToken: generateToken(user),
    };

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
