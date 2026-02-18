/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all subscription plans from the database
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        price: "asc", // Order by price, lowest to highest
      },
    });

    // Return the subscription plans in a structured response
    return NextResponse.json({
      success: true,
      message: "Subscription plans fetched successfully",
      data: subscriptionPlans,
    });
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subscription plans",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
