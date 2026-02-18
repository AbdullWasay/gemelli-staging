// src/lib/subscription/subscriptionLimitService.ts
// ⚠️ REPLACE YOUR EXISTING FILE WITH THIS FIXED VERSION

import prisma from "@/lib/prisma";
import { SubscriptionNotificationService } from "@/lib/notifications/subscriptionNotificationService";

export class SubscriptionLimitService {
  /**
   * Check if user can add more products
   * Returns true if within limit, false otherwise
   * Sends notification if at or near limit
   */
  static async checkProductLimit(userId: string): Promise<{
    canAdd: boolean;
    currentCount: number;
    maxProducts: number;
    remaining: number;
  }> {
    try {
      console.log(`\n🔍 Checking product limit for user: ${userId}`);

      // Get user's active subscription
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          subscriptionPlan: true,
        },
      });

      // If no subscription, use free plan default (assumed 10 products)
      const maxProducts = subscription?.subscriptionPlan.maxProducts || 10;
      const planTitle = subscription?.subscriptionPlan.title || "Free Plan";

      console.log(`📊 Subscription Plan: ${planTitle}`);
      console.log(`🎯 Max Products: ${maxProducts}`);

      // Count user's current products
      const currentCount = await prisma.product.count({
        where: { sellerId: userId },
      });

      console.log(`📦 Current Products: ${currentCount}`);

      const remaining = maxProducts - currentCount;
      const canAdd = currentCount < maxProducts;
      const percentUsed = (currentCount / maxProducts) * 100;

      console.log(`✅ Can Add: ${canAdd}`);
      console.log(`📈 Percent Used: ${percentUsed.toFixed(1)}%`);
      console.log(`⏳ Remaining: ${remaining}`);

      // Send notifications based on usage
      if (!canAdd) {
        // At limit - send limit reached notification
        console.log(`🚫 LIMIT REACHED! Sending notification...`);
        
        try {
          await SubscriptionNotificationService.notifyProductLimitReached(
            userId,
            {
              currentCount,
              maxProducts,
              planTitle,
            }
          );
          console.log(`✅ Limit reached notification sent successfully`);
        } catch (notificationError) {
          console.error(`❌ Failed to send limit reached notification:`, notificationError);
        }
      } else if (remaining <= Math.ceil(maxProducts * 0.1)) {
        // At 90% or above - send warning notification
        console.log(`⚠️ WARNING THRESHOLD! Sending warning notification...`);
        
        try {
          await SubscriptionNotificationService.notifyProductLimitWarning(
            userId,
            {
              currentCount,
              maxProducts,
              planTitle,
              remaining,
            }
          );
          console.log(`✅ Warning notification sent successfully`);
        } catch (notificationError) {
          console.error(`❌ Failed to send warning notification:`, notificationError);
        }
      } else {
        console.log(`✅ Below warning threshold (${percentUsed.toFixed(1)}% < 90%)`);
      }

      console.log(`🔍 Limit check complete\n`);

      return {
        canAdd,
        currentCount,
        maxProducts,
        remaining,
      };
    } catch (error) {
      console.error("❌ Error checking product limit:", error);
      // In case of error, allow the action
      return {
        canAdd: true,
        currentCount: 0,
        maxProducts: 10,
        remaining: 10,
      };
    }
  }

  /**
   * Check if user can create more campaigns
   */
  static async checkCampaignLimit(userId: string): Promise<{
    canAdd: boolean;
    currentCount: number;
    maxCampaigns: number;
    remaining: number;
  }> {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          subscriptionPlan: true,
        },
      });

      const maxCampaigns = subscription?.subscriptionPlan.maxCampaigns || 1;

      // TODO: Count user's campaigns from your campaigns table
      // For now, returning a placeholder
      const currentCount = 0; // Replace with actual campaign count

      const remaining = maxCampaigns - currentCount;
      const canAdd = currentCount < maxCampaigns;

      if (!canAdd) {
        await SubscriptionNotificationService.notifyCampaignLimitReached(
          userId,
          {
            currentCount,
            maxCampaigns,
            planTitle: subscription?.subscriptionPlan.title || "Free Plan",
          }
        );
      }

      return {
        canAdd,
        currentCount,
        maxCampaigns,
        remaining,
      };
    } catch (error) {
      console.error("Error checking campaign limit:", error);
      return {
        canAdd: true,
        currentCount: 0,
        maxCampaigns: 1,
        remaining: 1,
      };
    }
  }

  /**
   * Check if user has enough storage space
   * @param additionalSizeMB - Size in MB to be added
   */
  static async checkStorageLimit(
    userId: string,
    additionalSizeMB: number = 0
  ): Promise<{
    canAdd: boolean;
    currentUsage: number;
    maxStorage: number;
    remaining: number;
  }> {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          subscriptionPlan: true,
        },
      });

      const maxStorage = subscription?.subscriptionPlan.maxFileStorage || 100;

      // TODO: Calculate actual storage usage from your file storage
      // For now, returning a placeholder
      const currentUsage = 0; // Replace with actual storage calculation

      const remaining = maxStorage - currentUsage;
      const canAdd = currentUsage + additionalSizeMB <= maxStorage;

      if (!canAdd) {
        await SubscriptionNotificationService.notifyStorageLimitReached(
          userId,
          {
            currentUsage,
            maxStorage,
            planTitle: subscription?.subscriptionPlan.title || "Free Plan",
          }
        );
      }

      return {
        canAdd,
        currentUsage,
        maxStorage,
        remaining,
      };
    } catch (error) {
      console.error("Error checking storage limit:", error);
      return {
        canAdd: true,
        currentUsage: 0,
        maxStorage: 100,
        remaining: 100,
      };
    }
  }

  /**
   * Get user's subscription plan features
   */
  static async getUserPlanFeatures(userId: string): Promise<{
    maxProducts: number;
    maxCampaigns: number;
    maxFileStorage: number;
    isAIEnabled: boolean;
    isAdvancedAIEnabled: boolean;
    isCustomizable: boolean;
    prioritySupport: boolean;
  }> {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          subscriptionPlan: true,
        },
      });

      if (!subscription) {
        // Return free plan defaults
        return {
          maxProducts: 10,
          maxCampaigns: 1,
          maxFileStorage: 100,
          isAIEnabled: false,
          isAdvancedAIEnabled: false,
          isCustomizable: false,
          prioritySupport: false,
        };
      }

      return {
        maxProducts: subscription.subscriptionPlan.maxProducts,
        maxCampaigns: subscription.subscriptionPlan.maxCampaigns,
        maxFileStorage: subscription.subscriptionPlan.maxFileStorage,
        isAIEnabled: subscription.subscriptionPlan.isAIEnabled,
        isAdvancedAIEnabled: subscription.subscriptionPlan.isAdvancedAIEnabled,
        isCustomizable: subscription.subscriptionPlan.isCustomizable,
        prioritySupport: subscription.subscriptionPlan.prioritySupport,
      };
    } catch (error) {
      console.error("Error getting user plan features:", error);
      // Return free plan defaults on error
      return {
        maxProducts: 10,
        maxCampaigns: 1,
        maxFileStorage: 100,
        isAIEnabled: false,
        isAdvancedAIEnabled: false,
        isCustomizable: false,
        prioritySupport: false,
      };
    }
  }

  /**
   * Check if user has access to a specific feature
   */
  static async hasFeatureAccess(
    userId: string,
    feature: "ai" | "advancedAI" | "customization" | "prioritySupport"
  ): Promise<boolean> {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          subscriptionPlan: true,
        },
      });

      if (!subscription) return false;

      const plan = subscription.subscriptionPlan;

      switch (feature) {
        case "ai":
          return plan.isAIEnabled;
        case "advancedAI":
          return plan.isAdvancedAIEnabled;
        case "customization":
          return plan.isCustomizable;
        case "prioritySupport":
          return plan.prioritySupport;
        default:
          return false;
      }
    } catch (error) {
      console.error("Error checking feature access:", error);
      return false;
    }
  }
}