import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || "";

/**
 * Upload file to S3
 * @param fileBuffer - File buffer to upload
 * @param fileName - Desired file name in S3
 * @param contentType - MIME type of the file
 * @returns Promise with S3 URL
 */
export async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  // Ensure bucket name is provided
  if (!bucketName) {
    throw new Error("AWS S3 bucket name is not configured");
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

/**
 * Delete file from S3
 * @param fileKey - The key (path/name) of the file to delete
 */
export async function deleteFileFromS3(fileKey: string): Promise<void> {
  // Ensure bucket name is provided
  if (!bucketName) {
    throw new Error("AWS S3 bucket name is not configured");
  }

  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
}

/**
 * Get presigned URL for a file in S3
 * @param fileKey - The key (path/name) of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600s = 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUrl(
  fileKey: string,
  expiresIn = 3600
): Promise<string> {
  // Ensure bucket name is provided
  if (!bucketName) {
    throw new Error("AWS S3 bucket name is not configured");
  }

  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

/**
 * Extract S3 file key from S3 URL
 * @param s3Url - Full S3 URL
 * @returns File key
 */
export function getS3KeyFromUrl(s3Url: string): string {
  try {
    const url = new URL(s3Url);
    // Remove leading slash if exists
    return url.pathname.startsWith("/")
      ? url.pathname.substring(1)
      : url.pathname;
  } catch {
    // If not a valid URL, assume it might be just the key
    return s3Url;
  }
}

/**
 * Helper to generate unique file name for S3
 * @param originalName - Original file name
 * @param prefix - Optional prefix (e.g., folder name)
 * @returns Unique file name
 */
export function generateUniqueFileName(
  originalName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const fileExtension = originalName.split(".").pop() || "";

  const fileName = `${timestamp}-${randomStr}.${fileExtension}`;
  return prefix ? `${prefix}/${fileName}` : fileName;
}
