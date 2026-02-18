/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { SubscriptionNotificationService } from "@/lib/notifications/subscriptionNotificationService";

const prisma = new PrismaClient();

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

// GET - Fetch user subscriptions
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: decoded.userId },
      include: {
        subscriptionPlan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// POST - Create subscription
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscriptionPlanId, paymentMethod } = body;

    if (!subscriptionPlanId) {
      return NextResponse.json(
        { success: false, error: "Subscription plan ID is required" },
        { status: 400 }
      );
    }

    // Get the subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Subscription plan not found" },
        { status: 404 }
      );
    }

    // Check for existing active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: decoded.userId,
        status: "ACTIVE",
      },
      include: {
        subscriptionPlan: true,
      },
    });

    // Calculate end date based on interval
    const startDate = new Date();
    const endDate = new Date();
    
    switch (plan.interval.toLowerCase()) {
      case "month":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "year":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }

    // Create subscription in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Cancel existing subscription if present
      if (existingSubscription) {
        await tx.subscription.update({
          where: { id: existingSubscription.id },
          data: { 
            status: "CANCELED",
            isAutoRenew: false,
          },
        });
      }

      // Create new subscription
      const subscription = await tx.subscription.create({
        data: {
          userId: decoded.userId,
          subscriptionPlanId,
          status: "ACTIVE",
          startDate,
          endDate,
          isAutoRenew: true,
          paymentMethod: paymentMethod || "credit_card",
          lastPaymentDate: startDate,
          nextBillingDate: endDate,
        },
        include: {
          subscriptionPlan: true,
        },
      });

      return { subscription, oldPlan: existingSubscription?.subscriptionPlan };
    });

    // Parse features for notification
    const features = typeof result.subscription.subscriptionPlan.features === "string"
      ? JSON.parse(result.subscription.subscriptionPlan.features)
      : result.subscription.subscriptionPlan.features;

    const featuresList: string[] = [];
    Object.values(features).forEach((category: any) => {
      if (Array.isArray(category)) {
        featuresList.push(...category);
      }
    });

    // Send notification (async, don't wait)
    if (result.oldPlan) {
      // This was an upgrade/switch
      SubscriptionNotificationService.notifySubscriptionUpgraded(
        decoded.userId,
        {
          oldPlanTitle: result.oldPlan.title,
          newPlanTitle: result.subscription.subscriptionPlan.title,
          newPlanPrice: result.subscription.subscriptionPlan.price,
          newPlanInterval: result.subscription.subscriptionPlan.interval,
        }
      ).catch((error) => {
        console.error("Error sending upgrade notification:", error);
      });
    } else {
      // This was a new subscription
      SubscriptionNotificationService.notifySubscriptionCreated(
        decoded.userId,
        {
          planTitle: result.subscription.subscriptionPlan.title,
          planPrice: result.subscription.subscriptionPlan.price,
          planInterval: result.subscription.subscriptionPlan.interval,
          startDate: result.subscription.startDate,
          endDate: result.subscription.endDate,
          features: featuresList.slice(0, 5), // Top 5 features
        }
      ).catch((error) => {
        console.error("Error sending subscription notification:", error);
      });
    }

    return NextResponse.json({
      success: true,
      data: result.subscription,
      message: result.oldPlan
        ? "Subscription upgraded successfully"
        : "Subscription created successfully",
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

// PATCH - Update subscription (auto-renew)
export async function PATCH(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, isAutoRenew } = body;

    if (!id || typeof isAutoRenew !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Verify subscription belongs to user
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription || subscription.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: { isAutoRenew },
      include: {
        subscriptionPlan: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSubscription,
      message: `Auto-renewal ${isAutoRenew ? "enabled" : "disabled"} successfully`,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Verify subscription belongs to user
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!subscription || subscription.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    const cancelledSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: "CANCELED",
        isAutoRenew: false,
      },
      include: {
        subscriptionPlan: true,
      },
    });

    // Send cancellation notification (async, don't wait)
    SubscriptionNotificationService.notifySubscriptionCancelled(
      decoded.userId,
      {
        planTitle: cancelledSubscription.subscriptionPlan.title,
        endDate: cancelledSubscription.endDate,
        wasAutoRenew: subscription.isAutoRenew,
      }
    ).catch((error) => {
      console.error("Error sending cancellation notification:", error);
    });

    return NextResponse.json({
      success: true,
      data: cancelledSubscription,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}