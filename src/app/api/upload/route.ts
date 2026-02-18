import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload } from "@/types/api";
import { uploadFileToS3, generateUniqueFileName } from "@/lib/s3-utils";

export async function POST(request: NextRequest) {
  try {
    // Extract the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: No token provided",
        },
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 }
      );
    }

    // Create a folder structure for better organization
    const uploadFolder = 'uploads';
    
    // Generate unique filename with user ID as prefix
    const uniqueFileName = generateUniqueFileName(file.name, `${uploadFolder}/${decoded.id}`);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to S3
    const fileUrl = await uploadFileToS3(
      buffer,
      uniqueFileName,
      file.type || 'application/octet-stream'
    );

    return NextResponse.json(
      {
        success: true,
        data: { url: fileUrl },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
