// src/app/api/cron/check-low-stock/route.ts

import { NextRequest, NextResponse } from "next/server";
import { checkLowStockProducts } from "@/lib/cron/checkLowStock";

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from your cron service
    const authHeader = req.headers.get("authorization");
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log("❌ Unauthorized cron request");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🚀 Cron job triggered: Low stock check");
    
    await checkLowStockProducts();

    return NextResponse.json({
      success: true,
      message: "Low stock check completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in cron job:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to check low stock",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}