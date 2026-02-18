// app/api/cron/check-stock/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LowStockNotificationService } from "@/lib/notifications/lowStockNotificationService";

/**
 * Cron job endpoint to check stock levels
 * Run daily to notify sellers of low stock
 * 
 * Setup with Vercel Cron (add to vercel.json):
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/check-stock",
 *       "schedule": "0 9 * * *"
 *     },
 *     {
 *       "path": "/api/cron/check-stock?type=weekly",
 *       "schedule": "0 9 * * 1"
 *     }
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "daily";

    console.log(`\n🔄 Starting ${type} stock check cron job...`);

    if (type === "weekly") {
      // Weekly summary
      await LowStockNotificationService.sendWeeklyLowStockSummary();
    } else {
      // Daily check
      await LowStockNotificationService.checkAllProductsForLowStock();
    }

    console.log(`✅ ${type} stock check completed\n`);

    return NextResponse.json({
      success: true,
      message: `${type} stock check completed successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in stock check cron job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete stock check",
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for easier testing
export async function POST(request: NextRequest) {
  return GET(request);
}