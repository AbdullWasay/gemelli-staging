import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get("section");
    const limit = parseInt(searchParams.get("limit") || "8");

    // Default query options - only show published products
    const baseQuery = {
      where: {
        status: "Published",
        inventory: { gt: 0 },
      },
      include: {
        productImages: {
          orderBy: {
            order: "asc" as const,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: true,
      },
      take: limit,
    };

    // Section-specific queries
    switch (section) {
      case "most-loved": {
        // Most Loved Products: Products with highest average rating
        // For now, simulate with random products (since we don't have a rating system implemented)
        // In a real implementation, you would join with a ratings table
        return NextResponse.json({
          success: true,
          data: await prisma.product.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: baseQuery.include,
          }),
        });
      }

      case "best-sellers": {
        // Best Sellers: Products with the most sales
        // Get products with order count
        const productsWithSales = await prisma.product.findMany({
          take: limit,
          orderBy: { createdAt: "desc" },
          include: baseQuery.include,
        });
        return NextResponse.json({
          success: true,
          data: productsWithSales,
        });
      }

      case "top-picks": {
        // Top Picks: New products with highest price discount
        // Could be personalized in a real implementation
        return NextResponse.json({
          success: true,
          data: await prisma.product.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            where: { onSale: true },
            include: baseQuery.include,
          }),
        });
      }

      case "featured": {
        // Featured Products: Products marked for special promotion on homepage
        return NextResponse.json({
          success: true,
          data: await prisma.product.findMany({
            take: limit,
            where: {
              ...baseQuery.where,
              // Featured products are those with onSale=true and have images
              onSale: true,
              productImages: {
                some: {},
              },
            },
            orderBy: { createdAt: "desc" },
            include: baseQuery.include,
          }),
        });
      }

      default: {
        // Return an error for unknown section
        return NextResponse.json(
          {
            success: false,
            error: "Invalid section parameter",
          },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    console.error("Error fetching home page products:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
