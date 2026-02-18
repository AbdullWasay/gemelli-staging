// app/api/user/subscription-limits/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SubscriptionLimitService } from "@/lib/subscription/subscriptionLimitService";

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id?: string;
      userId?: string;
      email: string;
    };

    const userId = decoded.id || decoded.userId;
    if (!userId) return null;

    return { userId, email: decoded.email };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * GET /api/user/subscription-limits
 * Get current user's subscription limits and usage
 */
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all limits and features
    const [productLimit, campaignLimit, storageLimit, features] =
      await Promise.all([
        SubscriptionLimitService.checkProductLimit(decoded.userId),
        SubscriptionLimitService.checkCampaignLimit(decoded.userId),
        SubscriptionLimitService.checkStorageLimit(decoded.userId),
        SubscriptionLimitService.getUserPlanFeatures(decoded.userId),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        products: {
          current: productLimit.currentCount,
          max: productLimit.maxProducts,
          remaining: productLimit.remaining,
          canAdd: productLimit.canAdd,
          percentUsed: Math.round(
            (productLimit.currentCount / productLimit.maxProducts) * 100
          ),
        },
        campaigns: {
          current: campaignLimit.currentCount,
          max: campaignLimit.maxCampaigns,
          remaining: campaignLimit.remaining,
          canAdd: campaignLimit.canAdd,
          percentUsed: Math.round(
            (campaignLimit.currentCount / campaignLimit.maxCampaigns) * 100
          ),
        },
        storage: {
          current: storageLimit.currentUsage,
          max: storageLimit.maxStorage,
          remaining: storageLimit.remaining,
          canAdd: storageLimit.canAdd,
          percentUsed: Math.round(
            (storageLimit.currentUsage / storageLimit.maxStorage) * 100
          ),
          unit: "MB",
        },
        features: {
          ai: features.isAIEnabled,
          advancedAI: features.isAdvancedAIEnabled,
          customization: features.isCustomizable,
          prioritySupport: features.prioritySupport,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching subscription limits:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription limits" },
      { status: 500 }
    );
  }
}