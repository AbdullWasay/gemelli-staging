import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload } from "@/types/api";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
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

    // Check if user is a seller or admin
    if (decoded.role !== Role.SELLER && decoded.role !== Role.ADMIN) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only sellers can upload product images",
        },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;
    const isPrimary = formData.get("isPrimary") === "true";
    const order = parseInt((formData.get("order") as string) || "0");

    // Basic validation
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate that the product exists and belongs to the user
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user owns the product or is an admin
    if (product.sellerId !== decoded.id && decoded.role !== Role.ADMIN) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: You do not have permission to upload images for this product",
        },
        { status: 403 }
      );
    }

    // Create a folder structure for better organization in S3
    const uploadFolder = `uploads/products/${productId}`;
    
    // Generate unique filename with product folder as prefix
    const uniqueFileName = generateUniqueFileName(file.name, uploadFolder);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to S3
    const fileUrl = await uploadFileToS3(
      buffer,
      uniqueFileName,
      file.type || 'application/octet-stream'
    );

    // If this is set as the primary image and isPrimary is true,
    // update all other images to not be primary
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: {
          productId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create the product image record in the database
    const productImage = await prisma.productImage.create({
      data: {
        url: fileUrl,
        isPrimary,
        order,
        productId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          productImage,
          url: fileUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading product image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload product image",
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a product image (e.g., to change isPrimary status or order)
export async function PUT(request: NextRequest) {
  try {
    // Extract and verify token from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Fetch the image to check ownership via the product
    const existingImage = await prisma.productImage.findUnique({
      where: { id: body.id },
      include: { product: true },
    });

    if (!existingImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    // Check if user owns the associated product or is an admin
    if (
      existingImage.product.sellerId !== decoded.id &&
      decoded.role !== Role.ADMIN
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to update this image",
        },
        { status: 403 }
      );
    }

    // If setting this image as primary, update all other images to not be primary
    if (body.isPrimary) {
      await prisma.productImage.updateMany({
        where: {
          productId: existingImage.productId,
          id: { not: body.id },
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Update the image record
    const productImage = await prisma.productImage.update({
      where: { id: body.id },
      data: {
        isPrimary:
          body.isPrimary !== undefined
            ? body.isPrimary
            : existingImage.isPrimary,
        order: body.order !== undefined ? body.order : existingImage.order,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        productImage,
        message: "Product image updated successfully",
      },
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product image" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a product image
export async function DELETE(request: NextRequest) {
  try {
    // Extract and verify token from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Fetch the image to check ownership via the product
    const existingImage = await prisma.productImage.findUnique({
      where: { id: imageId },
      include: { product: true },
    });

    if (!existingImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    // Check if user owns the associated product or is an admin
    if (
      existingImage.product.sellerId !== decoded.id &&
      decoded.role !== Role.ADMIN
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to delete this image",
        },
        { status: 403 }
      );
    }

    try {
      // If the URL is an S3 URL, delete the file from S3
      if (existingImage.url.includes('amazonaws.com')) {
        // Import here to avoid circular dependencies
        const { deleteFileFromS3, getS3KeyFromUrl } = await import('@/lib/s3-utils');
        const fileKey = getS3KeyFromUrl(existingImage.url);
        await deleteFileFromS3(fileKey);
      }
    } catch (deleteError) {
      console.error('Error deleting file from S3:', deleteError);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete the image from the database
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // If this was the primary image and there are other images,
    // set the first remaining image as primary
    if (existingImage.isPrimary) {
      const remainingImages = await prisma.productImage.findMany({
        where: { productId: existingImage.productId },
        orderBy: { order: "asc" },
        take: 1,
      });

      if (remainingImages.length > 0) {
        await prisma.productImage.update({
          where: { id: remainingImages[0].id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: "Product image deleted successfully",
      },
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product image" },
      { status: 500 }
    );
  }
}
