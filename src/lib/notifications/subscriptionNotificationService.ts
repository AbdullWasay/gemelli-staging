// src/lib/notifications/subscriptionNotificationService.ts

import { NotificationService } from "./notificationService";
import prisma from "@/lib/prisma";

/**
 * Service for handling subscription-related notifications
 */
export class SubscriptionNotificationService {
  /**
   * Send notification when user subscribes to a plan
   */
  static async notifySubscriptionCreated(
    userId: string,
    subscriptionData: {
      planTitle: string;
      planPrice: number;
      planInterval: string;
      startDate: Date;
      endDate?: Date | null;
      features: string[];
    }
  ): Promise<void> {
    const endDateStr = subscriptionData.endDate 
      ? new Date(subscriptionData.endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Never (lifetime)";

    await NotificationService.sendNotification({
      userId,
      message: `You've successfully subscribed to ${subscriptionData.planTitle} plan! Your subscription is now active.`,
      category: "CAMPAIGN_ALERTS",
      actionText: "View Subscription",
      actionUrl: "/dashboard/settings/subscriptions-and-plans",
      actionBgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      emailSubject: `Welcome to ${subscriptionData.planTitle}!`,
      emailTemplate: "subscriptionCreated",
      emailData: {
        planTitle: subscriptionData.planTitle,
        planPrice: subscriptionData.planPrice,
        planInterval: subscriptionData.planInterval,
        startDate: subscriptionData.startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        endDate: endDateStr,
        features: subscriptionData.features,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/subscriptions-and-plans`,
      },
    });
  }

  /**
   * Send notification when subscription is upgraded
   */
  static async notifySubscriptionUpgraded(
    userId: string,
    upgradeData: {
      oldPlanTitle: string;
      newPlanTitle: string;
      newPlanPrice: number;
      newPlanInterval: string;
    }
  ): Promise<void> {
    await NotificationService.sendNotification({
      userId,
      message: `Your subscription has been upgraded from ${upgradeData.oldPlanTitle} to ${upgradeData.newPlanTitle}!`,
      category: "CAMPAIGN_ALERTS",
      actionText: "View Details",
      actionUrl: "/dashboard/settings/subscriptions-and-plans",
      actionBgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
      emailSubject: `Subscription Upgraded - Welcome to ${upgradeData.newPlanTitle}`,
      emailTemplate: "subscriptionUpgraded",
      emailData: {
        oldPlanTitle: upgradeData.oldPlanTitle,
        newPlanTitle: upgradeData.newPlanTitle,
        newPlanPrice: upgradeData.newPlanPrice,
        newPlanInterval: upgradeData.newPlanInterval,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/subscriptions-and-plans`,
      },
    });
  }

  /**
   * Send notification 7 days before subscription expires
   */
  static async notifySubscriptionExpiringSoon(
    userId: string,
    expiryData: {
      planTitle: string;
      daysRemaining: number;
      expiryDate: Date;
      isAutoRenew: boolean;
    }
  ): Promise<void> {
    const message = expiryData.isAutoRenew
      ? `Your ${expiryData.planTitle} subscription will auto-renew in ${expiryData.daysRemaining} days.`
      : `Your ${expiryData.planTitle} subscription expires in ${expiryData.daysRemaining} days. Renew now to keep your premium features!`;

    await NotificationService.sendNotification({
      userId,
      message,
      category: "CAMPAIGN_ALERTS",
      actionText: expiryData.isAutoRenew ? "Manage Subscription" : "Renew Now",
      actionUrl: "/dashboard/settings/subscriptions-and-plans",
      actionBgColor: "bg-gradient-to-r from-orange-500 to-amber-600",
      emailSubject: `Subscription ${expiryData.isAutoRenew ? "Auto-Renewal" : "Expiring"} Soon`,
      emailTemplate: "subscriptionExpiringSoon",
      emailData: {
        planTitle: expiryData.planTitle,
        daysRemaining: expiryData.daysRemaining,
        expiryDate: expiryData.expiryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        isAutoRenew: expiryData.isAutoRenew,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/subscriptions-and-plans`,
      },
    });
  }

  /**
   * Send notification when subscription expires
   */
  static async notifySubscriptionExpired(
    userId: string,
    expiredData: {
      planTitle: string;
      expiryDate: Date;
    }
  ): Promise<void> {
    await NotificationService.sendNotification({
      userId,
      message: `Your ${expiredData.planTitle} subscription has expired. Upgrade to continue using premium features.`,
      category: "CAMPAIGN_ALERTS",
      actionText: "Upgrade Now",
      actionUrl: "/dashboard/subscription-plans",
      actionBgColor: "bg-gradient-to-r from-red-500 to-pink-600",
      emailSubject: `Subscription Expired - ${expiredData.planTitle}`,
      emailTemplate: "subscriptionExpired",
      emailData: {
        planTitle: expiredData.planTitle,
        expiryDate: expiredData.expiryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription-plans`,
      },
    });
  }

  /**
   * Send notification when user hits product limit
   */
  static async notifyProductLimitReached(
    userId: string,
    limitData: {
      currentCount: number;
      maxProducts: number;
      planTitle: string;
    }
  ): Promise<void> {
    await NotificationService.sendNotification({
      userId,
      message: `You've reached your product limit (${limitData.maxProducts} products) on the ${limitData.planTitle} plan. Upgrade to add more products!`,
      category: "PRODUCT_UPDATES",
      actionText: "Upgrade Plan",
      actionUrl: "/dashboard/subscription-plans",
      actionBgColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
      emailSubject: `Product Limit Reached - ${limitData.planTitle}`,
      emailTemplate: "subscriptionLimitReached",
      emailData: {
        limitType: "product",
        currentCount: limitData.currentCount,
        maxLimit: limitData.maxProducts,
        planTitle: limitData.planTitle,
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription-plans`,
      },
    });
  }

  /**
   * Send notification when user approaches product limit (90%)
   */
  static async notifyProductLimitWarning(
    userId: string,
    warningData: {
      currentCount: number;
      maxProducts: number;
      planTitle: string;
      remaining: number;
    }
  ): Promise<void> {
    await NotificationService.sendNotification({
      userId,
      message: `You're approaching your product limit! ${warningData.currentCount}/${warningData.maxProducts} products used. Only ${warningData.remaining} remaining.`,
      category: "PRODUCT_UPDATES",
      actionText: "View Plans",
      actionUrl: "/dashboard/subscription-plans",
      actionBgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      emailSubject: `Product Limit Warning - ${warningData.planTitle}`,
      emailTemplate: "subscriptionLimitWarning",
      emailData: {
        limitType: "product",
        currentCount: warningData.currentCount,
        maxLimit: warningData.maxProducts,
        remaining: warningData.remaining,
        planTitle: warningData.planTitle,
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription-plans`,
      },
    });
  }

  /**
   * Send notification when user hits campaign limit
   */
  static async notifyCampaignLimitReached(
    userId: string,
    limitData: {
      currentCount: number;
      maxCampaigns: number;
      planTitle: string;
    }
  ): Promise<void> {
    await NotificationService.sendNotification({
      userId,
      message: `You've reached your campaign limit (${limitData.maxCampaigns} campaigns) on the ${limitData.planTitle} plan. Upgrade for more campaigns!`,
      category: "CAMPAIGN_ALERTS",
      actionText: "Upgrade Plan",
      actionUrl: "/dashboard/subscription-plans",
      actionBgColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
      emailSubject: `Campaign Limit Reached - ${limitData.planTitle}`,
      emailTemplate: "subscriptionLimitReached",
      emailData: {
        limitType: "campaign",
        currentCount: limitData.currentCount,
        maxLimit: limitData.maxCampaigns,
        planTitle: limitData.planTitle,
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription-plans`,
      },
    });
  }

  /**
   * Send notification when user hits file storage limit
   */
  static async notifyStorageLimitReached(
    userId: string,
    limitData: {
      currentUsage: number;
      maxStorage: number;
      planTitle: string;
    }
  ): Promise<void> {
    await NotificationService.sendNotification({
      userId,
      message: `You've reached your storage limit (${limitData.maxStorage}MB) on the ${limitData.planTitle} plan. Upgrade for more storage!`,
      category: "PRODUCT_UPDATES",
      actionText: "Upgrade Plan",
      actionUrl: "/dashboard/subscription-plans",
      actionBgColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
      emailSubject: `Storage Limit Reached - ${limitData.planTitle}`,
      emailTemplate: "subscriptionLimitReached",
      emailData: {
        limitType: "storage",
        currentCount: limitData.currentUsage,
        maxLimit: limitData.maxStorage,
        planTitle: limitData.planTitle,
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription-plans`,
      },
    });
  }

  /**
   * Send notification when subscription is cancelled
   */
  static async notifySubscriptionCancelled(
    userId: string,
    cancelData: {
      planTitle: string;
      endDate: Date | null;
      wasAutoRenew: boolean;
    }
  ): Promise<void> {
    const message = cancelData.endDate
      ? `Your ${cancelData.planTitle} subscription has been cancelled. You'll have access until ${cancelData.endDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`
      : `Your ${cancelData.planTitle} subscription has been cancelled.`;

    await NotificationService.sendNotification({
      userId,
      message,
      category: "CAMPAIGN_ALERTS",
      actionText: "Reactivate",
      actionUrl: "/dashboard/subscription-plans",
      actionBgColor: "bg-gradient-to-r from-gray-500 to-slate-600",
      emailSubject: `Subscription Cancelled - ${cancelData.planTitle}`,
      emailTemplate: "subscriptionCancelled",
      emailData: {
        planTitle: cancelData.planTitle,
        endDate: cancelData.endDate?.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        wasAutoRenew: cancelData.wasAutoRenew,
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription-plans`,
      },
    });
  }

  /**
   * Check and send expiry warnings for all subscriptions
   * This should be run daily via a cron job
   */
  static async checkAndNotifyExpiringSubscriptions(): Promise<void> {
    try {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const expiringSubscriptions = await prisma.subscription.findMany({
        where: {
          status: "ACTIVE",
          endDate: {
            lte: sevenDaysFromNow,
            gte: new Date(),
          },
        },
        include: {
          subscriptionPlan: true,
          user: true,
        },
      });

      for (const sub of expiringSubscriptions) {
        if (!sub.endDate) continue;

        const daysRemaining = Math.ceil(
          (sub.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        // Only notify on days 7, 3, and 1
        if ([7, 3, 1].includes(daysRemaining)) {
          await this.notifySubscriptionExpiringSoon(sub.userId, {
            planTitle: sub.subscriptionPlan.title,
            daysRemaining,
            expiryDate: sub.endDate,
            isAutoRenew: sub.isAutoRenew,
          });
        }
      }

      console.log(
        `✅ Checked ${expiringSubscriptions.length} expiring subscriptions`
      );
    } catch (error) {
      console.error("Error checking expiring subscriptions:", error);
    }
  }

  /**
   * Check and expire subscriptions that have passed their end date
   * This should be run daily via a cron job
   */
  static async checkAndExpireSubscriptions(): Promise<void> {
    try {
      const expiredSubscriptions = await prisma.subscription.findMany({
        where: {
          status: "ACTIVE",
          endDate: {
            lt: new Date(),
          },
          isAutoRenew: false,
        },
        include: {
          subscriptionPlan: true,
        },
      });

      for (const sub of expiredSubscriptions) {
        // Update subscription status
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "EXPIRED" },
        });

        // Send expiry notification
        if (sub.endDate) {
          await this.notifySubscriptionExpired(sub.userId, {
            planTitle: sub.subscriptionPlan.title,
            expiryDate: sub.endDate,
          });
        }
      }

      console.log(`✅ Expired ${expiredSubscriptions.length} subscriptions`);
    } catch (error) {
      console.error("Error expiring subscriptions:", error);
    }
  }
}