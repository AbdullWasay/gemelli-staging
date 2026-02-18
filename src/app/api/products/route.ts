/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload } from "@/types/api";
import { Role } from "@prisma/client";
import { SubscriptionLimitService } from "@/lib/subscription/subscriptionLimitService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sellerId = searchParams.get("sellerId");
    const productId = searchParams.get("id");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");
    const onSale = searchParams.get("onSale");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // If product ID is provided, return a single product
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          productImages: {
            orderBy: {
              order: "asc",
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }

      // Find variants (products with same name but different size/color)
      const variants = await prisma.product.findMany({
        where: {
          AND: [
            { name: product.name },
            { sellerId: product.sellerId },
            { id: { not: product.id } }, // Exclude the current product
          ],
        },
        select: {
          id: true,
          size: true,
          color: true,
          inventory: true,
          sku: true,
          productImages: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
        },
      });

      // Add variants to the product object
      const productWithVariants = {
        ...product,
        variants,
      };

      return NextResponse.json({
        success: true,
        data: { product: productWithVariants },
      });
    }

    // Build query conditions for multiple products
    const where: {
      sellerId?: string;
      category?: {
        contains: string;
        mode: "insensitive";
      };
      status?: string;
      price?: { gte?: number; lte?: number };
      inventory?: { gt: number };
      onSale?: boolean;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
        productTags?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (sellerId) {
      where.sellerId = sellerId;
    }

    // Add category filter with case-insensitive matching
    if (category) {
      where.category = {
        contains: category,
        mode: "insensitive",
      };
    }

    //  Search across multiple fields
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          productTags: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    //Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    //In stock filter
    if (inStock === "true") {
      where.inventory = { gt: 0 };
    }

    //On sale filter
    if (onSale === "true") {
      where.onSale = true;
    }

    // Only show published products to public (non-seller requests)
    // If sellerId is provided, show all products from that seller
    if (!sellerId) {
      where.status = "Published";
    }

    //Dynamic sorting
    const orderByField = sortBy as keyof typeof orderByOptions;
    const orderByOptions = {
      createdAt: { createdAt: sortOrder },
      price: { price: sortOrder },
      name: { name: sortOrder },
      inventory: { inventory: sortOrder },
    };

    const orderBy = orderByOptions[orderByField] || { createdAt: "desc" };

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        productImages: {
          orderBy: {
            order: "asc",
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Check if user is a seller or admin
    if (decoded.role !== Role.SELLER && decoded.role !== Role.ADMIN) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only sellers can create products",
        },
        { status: 403 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("Received product creation data:", body);
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Basic validation with better error messages
    const validationErrors = [];
    if (!body.name && !body.productTitle) {
      validationErrors.push("Product name is required");
    }
    if (!body.price && body.price !== 0) {
      validationErrors.push("Product price is required");
    }
    if (body.price && isNaN(Number(body.price))) {
      validationErrors.push("Product price must be a number");
    }

    if (validationErrors.length > 0) {
      console.error("Product validation errors:", validationErrors);
      return NextResponse.json(
        { success: false, error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    // Debug the token payload
    console.log("Token payload for product creation:", {
      userId: decoded.id,
      userRole: decoded.role,
    });

    // Make sure the user exists before creating the product
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!userExists) {
      console.error("User not found when creating product:", decoded.id);
      return NextResponse.json(
        { success: false, error: "User not found, please log in again" },
        { status: 404 }
      );
    }

    console.log("Found user for product creation:", {
      userId: userExists.id,
      userEmail: userExists.email,
      userRole: userExists.role,
    });

    if (decoded.role === Role.SELLER) {
      console.log("\n🔍 Checking product limit for seller...");

      const limitCheck = await SubscriptionLimitService.checkProductLimit(
        decoded.id
      );

      console.log("📊 Limit check result:", {
        canAdd: limitCheck.canAdd,
        current: limitCheck.currentCount,
        max: limitCheck.maxProducts,
        remaining: limitCheck.remaining,
      });

      if (!limitCheck.canAdd) {
        console.log("❌ Product limit reached - blocking creation");
        return NextResponse.json(
          {
            success: false,
            error: `You have reached your plan's limit of ${limitCheck.maxProducts} products. Please upgrade your subscription to add more products.`,
            data: {
              currentCount: limitCheck.currentCount,
              maxProducts: limitCheck.maxProducts,
              upgradeUrl: "/dashboard/subscription-plans",
            },
          },
          { status: 403 }
        );
      }

      // Show warning if approaching limit
      if (limitCheck.remaining <= Math.ceil(limitCheck.maxProducts * 0.1)) {
        console.log(
          `⚠️ Warning: Only ${limitCheck.remaining} product slots remaining`
        );
      }

      console.log("✅ Limit check passed - proceeding with product creation\n");
    }

    console.log("Creating product with sellerId:", decoded.id);

    // Create the product
    const product = await prisma.product.create({
      data: {
        // Map productTitle to name
        name: body.productTitle || body.name,
        // Explicitly set the seller ID from the token
        sellerId: decoded.id,
        description: body.productDescription || body.description,
        price: parseFloat(body.price),
        inventory: parseInt(body.inventory || "0"),
        category: body.category,
        taxRate: body.taxRate,
        discountPrice: body.discountPrice
          ? parseFloat(body.discountPrice)
          : null,
        onSale: Boolean(body.onSale),
        sku: body.sku,
        trackInventory: body.trackInventory,
        lowStockAlert: body.lowStockAlert ? parseInt(body.lowStockAlert) : 5,
        size: body.size,
        color: body.color,
        material: body.material,
        length: body.length ? parseFloat(body.length) : null,
        width: body.width ? parseFloat(body.width) : null,
        height: body.height ? parseFloat(body.height) : null,
        weight: body.weight ? parseFloat(body.weight) : null,
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription,
        productTags: body.productTags,
        visibility: body.visibility || "Public",
        status: body.status || "Published",
      },
    });

    console.log("✅ Product created successfully:", product.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          product,
          message: "Product created successfully",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle unique constraint violations for SKU
    if (error instanceof Error) {
      // Check if it's a unique constraint violation on the SKU field
      if (
        error.message.includes("Unique constraint") &&
        error.message.includes("sku")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "A product with this SKU already exists. SKU values must be unique.",
            field: "sku",
            code: "UNIQUE_CONSTRAINT",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error.stack,
        },
        { status: 500 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a product
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
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch the product to check ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id: body.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user owns the product or is an admin
    if (
      existingProduct.sellerId !== decoded.id &&
      decoded.role !== Role.ADMIN
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to update this product",
        },
        { status: 403 }
      );
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        // Map productTitle to name if provided
        ...(body.productTitle && { name: body.productTitle }),
        ...(body.productDescription && {
          description: body.productDescription,
        }),
        ...(body.price && { price: parseFloat(body.price) }),
        ...(body.inventory && { inventory: parseInt(body.inventory) }),
        ...(body.category && { category: body.category }),
        ...(body.taxRate && { taxRate: body.taxRate }),
        ...(body.discountPrice && {
          discountPrice: parseFloat(body.discountPrice),
        }),
        ...(body.onSale !== undefined && { onSale: Boolean(body.onSale) }),
        ...(body.sku && { sku: body.sku }),
        ...(body.trackInventory && { trackInventory: body.trackInventory }),
        ...(body.lowStockAlert && {
          lowStockAlert: parseInt(body.lowStockAlert),
        }),
        ...(body.size && { size: body.size }),
        ...(body.color && { color: body.color }),
        ...(body.material && { material: body.material }),
        ...(body.length && { length: parseFloat(body.length) }),
        ...(body.width && { width: parseFloat(body.width) }),
        ...(body.height && { height: parseFloat(body.height) }),
        ...(body.weight && { weight: parseFloat(body.weight) }),
        ...(body.seoTitle && { seoTitle: body.seoTitle }),
        ...(body.metaDescription && { metaDescription: body.metaDescription }),
        ...(body.productTags && { productTags: body.productTags }),
        ...(body.visibility && { visibility: body.visibility }),
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        product,
        message: "Product updated successfully",
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle unique constraint violations for SKU
    if (error instanceof Error) {
      // Check if it's a unique constraint violation on the SKU field
      if (
        error.message.includes("Unique constraint") &&
        error.message.includes("sku")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "A product with this SKU already exists. SKU values must be unique.",
            field: "sku",
            code: "UNIQUE_CONSTRAINT",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a product
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
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch the product to check ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user owns the product or is an admin
    if (
      existingProduct.sellerId !== decoded.id &&
      decoded.role !== Role.ADMIN
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to delete this product",
        },
        { status: 403 }
      );
    }

    // Delete the product (product images will be cascaded due to the schema definition)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: "Product deleted successfully",
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
