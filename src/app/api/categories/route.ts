/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/categories/route.ts
// Optional API route to get unique categories with product counts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get all products with their categories
    const products = await prisma.product.findMany({
      select: {
        category: true,
      },
      where: {
        category: {
          not: null,
        },
        status: "Published", // Only count published products
      },
    });

    // Count products per category
    const categoryCount: { [key: string]: number } = {};
    
    products.forEach((product) => {
      if (product.category) {
        const normalizedCategory = product.category.toUpperCase().trim();
        categoryCount[normalizedCategory] = (categoryCount[normalizedCategory] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const categories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        total: categories.length,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}