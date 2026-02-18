// lib/notification-service.ts
import prisma from "./prisma";
import { NotificationCategory } from "@prisma/client";
import {
  sendEmail,
  getWelcomeEmailContent,
  getOrderConfirmationEmailContent,
  getProductUpdateEmailContent,
  getCampaignAlertEmailContent,
  getSalesInsightsEmailContent,
  getStockAlertEmailContent,
} from "./email-service";

/**
 * Check if user has enabled notifications for a specific category and channel
 */
async function shouldSendNotification(
  userId: string,
  category: NotificationCategory,
  channel: "email" | "app"
): Promise<boolean> {
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    // Default behavior if no settings exist
    return channel === "app"; // Only send in-app notifications by default
  }

  // Check if the channel is enabled
  if (channel === "email" && !settings.emailChannel) return false;
  if (channel === "app" && !settings.appNotifications) return false;

  // Check category-specific settings
  switch (category) {
    case "PRODUCT_UPDATES":
      return true; // Product updates don't have a specific toggle, always send if channel is enabled
    case "CAMPAIGN_ALERTS":
      return true; // Campaign alerts don't have a specific toggle
    case "SALES_INSIGHTS":
      return true; // Sales insights don't have a specific toggle
    case "STOCK_ALERTS":
      return true; // Stock alerts don't have a specific toggle
    default:
      return false;
  }
}

/**
 * Create in-app notification
 */
async function createInAppNotification(
  userId: string,
  message: string,
  category: NotificationCategory,
  actionText?: string,
  actionUrl?: string,
  actionBgColor?: string
) {
  return await prisma.notification.create({
    data: {
      userId,
      message,
      category,
      actionText,
      actionUrl,
      actionBgColor,
      isRead: false,
    },
  });
}

/**
 * Send welcome email and notification to new user
 */
export async function sendWelcomeNotification(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      console.error("User not found or email missing");
      return { success: false };
    }

    const userName = user.name || "there";

    // Send email (always send welcome email regardless of settings)
    const emailContent = getWelcomeEmailContent(userName);
    await sendEmail({
      to: user.email,
      ...emailContent,
    });

    // Create in-app notification (optional)
    await createInAppNotification(
      userId,
      `Welcome to Gemelli Store! Your account has been created successfully.`,
      "SALES_INSIGHTS", // Using SALES_INSIGHTS as a general category
      "GET STARTED",
      "/dashboard",
      "bg-gradient-to-r from-amber-500 to-green-500"
    );

    console.log(`Welcome notification sent to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending welcome notification:", error);
    return { success: false, error };
  }
}

/**
 * Send order confirmation notification
 */
export async function sendOrderConfirmationNotification(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order || !order.user.email) {
      console.error("Order or user email not found");
      return { success: false };
    }

    const userName = order.user.name || "there";
    const orderItems = order.orderItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Send email (always send order confirmation)
    const emailContent = getOrderConfirmationEmailContent(
      userName,
      orderId,
      order.totalAmount,
      orderItems
    );
    await sendEmail({
      to: order.user.email,
      ...emailContent,
    });

    // Create in-app notification if enabled
    const shouldSendApp = await shouldSendNotification(
      order.userId,
      "SALES_INSIGHTS",
      "app"
    );

    if (shouldSendApp) {
      await createInAppNotification(
        order.userId,
        `Order #${orderId.slice(0, 8)} confirmed! Total: $${order.totalAmount.toFixed(2)}`,
        "SALES_INSIGHTS",
        "VIEW ORDER",
        `/dashboard/orders/${orderId}`,
        "bg-gradient-to-r from-amber-500 to-green-500"
      );
    }

    console.log(`Order confirmation sent for order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending order confirmation:", error);
    return { success: false, error };
  }
}

/**
 * Send product update notification (e.g., new review)
 */
export async function sendProductUpdateNotification(
  productId: string,
  updateMessage: string
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: true,
      },
    });

    if (!product || !product.seller.email) {
      console.error("Product or seller email not found");
      return { success: false };
    }

    const userName = product.seller.name || "there";

    // Check if notifications should be sent
    const shouldSendEmailNotif = await shouldSendNotification(
      product.sellerId,
      "PRODUCT_UPDATES",
      "email"
    );
    const shouldSendApp = await shouldSendNotification(
      product.sellerId,
      "PRODUCT_UPDATES",
      "app"
    );

    // Send email if enabled
    if (shouldSendEmailNotif) {
      const emailContent = getProductUpdateEmailContent(
        userName,
        product.name,
        updateMessage
      );
      await sendEmail({
        to: product.seller.email,
        ...emailContent,
      });
    }

    // Create in-app notification if enabled
    if (shouldSendApp) {
      await createInAppNotification(
        product.sellerId,
        `${product.name}: ${updateMessage}`,
        "PRODUCT_UPDATES",
        "VIEW DETAILS",
        `/dashboard/products/${productId}`,
        "bg-[linear-gradient(90deg,_#F94A57_0%,_#5C67F8_100%)]"
      );
    }

    console.log(`Product update notification sent for product ${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending product update notification:", error);
    return { success: false, error };
  }
}

/**
 * Send campaign alert notification
 */
export async function sendCampaignAlertNotification(
  userId: string,
  campaignName: string,
  alertMessage: string,
  actionUrl?: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      console.error("User or email not found");
      return { success: false };
    }

    const userName = user.name || "there";

    // Check if notifications should be sent
    const shouldSendEmailNotif = await shouldSendNotification(
      userId,
      "CAMPAIGN_ALERTS",
      "email"
    );
    const shouldSendApp = await shouldSendNotification(
      userId,
      "CAMPAIGN_ALERTS",
      "app"
    );

    // Send email if enabled
    if (shouldSendEmailNotif) {
      const emailContent = getCampaignAlertEmailContent(
        userName,
        campaignName,
        alertMessage,
        actionUrl
      );
      await sendEmail({
        to: user.email,
        ...emailContent,
      });
    }

    // Create in-app notification if enabled
    if (shouldSendApp) {
      await createInAppNotification(
        userId,
        `${campaignName}: ${alertMessage}`,
        "CAMPAIGN_ALERTS",
        "VIEW CAMPAIGN",
        actionUrl || "/dashboard/campaigns",
        "bg-[linear-gradient(90deg,_#A514FA_0%,_#49C8F2_100%)]"
      );
    }

    console.log(`Campaign alert sent to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending campaign alert:", error);
    return { success: false, error };
  }
}

/**
 * Send sales insights notification
 */
export async function sendSalesInsightsNotification(
  userId: string,
  insightMessage: string,
  metrics?: {
    views?: number;
    sales?: number;
    revenue?: number;
  }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      console.error("User or email not found");
      return { success: false };
    }

    const userName = user.name || "there";

    // Check if notifications should be sent
    const shouldSendEmailNotif = await shouldSendNotification(
      userId,
      "SALES_INSIGHTS",
      "email"
    );
    const shouldSendApp = await shouldSendNotification(
      userId,
      "SALES_INSIGHTS",
      "app"
    );

    // Send email if enabled
    if (shouldSendEmailNotif) {
      const emailContent = getSalesInsightsEmailContent(
        userName,
        insightMessage,
        metrics
      );
      await sendEmail({
        to: user.email,
        ...emailContent,
      });
    }

    // Create in-app notification if enabled
    if (shouldSendApp) {
      await createInAppNotification(
        userId,
        insightMessage,
        "SALES_INSIGHTS",
        "VIEW ANALYTICS",
        "/dashboard/analytics",
        "bg-gradient-to-r from-amber-500 to-green-500"
      );
    }

    console.log(`Sales insights sent to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending sales insights:", error);
    return { success: false, error };
  }
}

/**
 * Send stock alert notification
 */
export async function sendStockAlertNotification(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: true,
      },
    });

    if (!product || !product.seller.email) {
      console.error("Product or seller email not found");
      return { success: false };
    }

    // Check if stock is below threshold
    if (product.inventory > (product.lowStockAlert || 5)) {
      return { success: false, message: "Stock is not low" };
    }

    const userName = product.seller.name || "there";

    // Check if notifications should be sent
    const shouldSendEmailNotif = await shouldSendNotification(
      product.sellerId,
      "STOCK_ALERTS",
      "email"
    );
    const shouldSendApp = await shouldSendNotification(
      product.sellerId,
      "STOCK_ALERTS",
      "app"
    );

    // Send email if enabled
    if (shouldSendEmailNotif) {
      const emailContent = getStockAlertEmailContent(
        userName,
        product.name,
        product.inventory,
        product.lowStockAlert || 5
      );
      await sendEmail({
        to: product.seller.email,
        ...emailContent,
      });
    }

    // Create in-app notification if enabled
    if (shouldSendApp) {
      await createInAppNotification(
        product.sellerId,
        `Stock running low: "${product.name}" only ${product.inventory} units left. Restock to meet demand.`,
        "STOCK_ALERTS",
        "ORDER STOCK",
        `/dashboard/products/${productId}`,
        "bg-[linear-gradient(104deg,_#FF8A00_-20.06%,_#FF3A44_109.05%)]"
      );
    }

    console.log(`Stock alert sent for product ${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending stock alert:", error);
    return { success: false, error };
  }
}

/**
 * Check all products for low stock and send alerts
 */
export async function checkAllProductsForLowStock() {
  try {
    const products = await prisma.product.findMany({
      where: {
        trackInventory: "Yes",
      },
      include: {
        seller: true,
      },
    });

    let alertsSent = 0;

    for (const product of products) {
      const lowStockThreshold = product.lowStockAlert || 5;
      
      if (product.inventory <= lowStockThreshold) {
        const result = await sendStockAlertNotification(product.id);
        if (result.success) {
          alertsSent++;
        }
      }
    }

    console.log(`Low stock check complete. Sent ${alertsSent} alerts.`);
    return { success: true, alertsSent };
  } catch (error) {
    console.error("Error checking products for low stock:", error);
    return { success: false, error };
  }
}