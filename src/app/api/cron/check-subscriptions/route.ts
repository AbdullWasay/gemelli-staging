// app/api/cron/check-subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionNotificationService } from "@/lib/notifications/subscriptionNotificationService";

/**
 * Cron job endpoint to check and notify about expiring/expired subscriptions
 * Should be called daily (recommended: once per day at midnight)
 * 
 * Setup with Vercel Cron:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-subscriptions",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 * 
 * Or use external cron services like:
 * - cron-job.org
 * - EasyCron
 * - GitHub Actions
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("\n🔄 Starting subscription cron job...");

    // Check for expiring subscriptions (7, 3, 1 days before)
    await SubscriptionNotificationService.checkAndNotifyExpiringSubscriptions();

    // Check and expire subscriptions that have passed end date
    await SubscriptionNotificationService.checkAndExpireSubscriptions();

    console.log("✅ Subscription cron job completed\n");

    return NextResponse.json({
      success: true,
      message: "Subscription checks completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in subscription cron job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete subscription checks",
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for easier testing
export async function POST(request: NextRequest) {
  return GET(request);
}