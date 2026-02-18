/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/notifications/notificationService.ts

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { NotificationCategory } from "@prisma/client";

export interface NotificationPayload {
  userId: string;
  message: string;
  category: NotificationCategory;
  actionText?: string;
  actionUrl?: string;
  actionBgColor?: string;
  emailSubject?: string;
  emailTemplate?: string;
  emailData?: Record<string, any>;
}

/**
 * Main notification service that handles both in-app and email notifications
 * based on user preferences
 */
export class NotificationService {
  /**
   * Send notification to user (in-app and/or email based on preferences)
   */
  static async sendNotification(payload: NotificationPayload): Promise<void> {
    try {
      console.log(`\n🔔 Processing notification for user: ${payload.userId}`);
      
      // Get user's notification settings
      const settings = await prisma.notificationSettings.findUnique({
        where: { userId: payload.userId },
      });

      console.log(`⚙️ Notification settings:`, {
        found: !!settings,
        emailChannel: settings?.emailChannel,
        appNotifications: settings?.appNotifications,
        newOrders: settings?.newOrders,
      });

      // Get user details for email
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { email: true, name: true, role: true },
      });

      if (!user) {
        console.error("❌ User not found:", payload.userId);
        return;
      }

      console.log(`👤 User details:`, {
        email: user.email,
        role: user.role,
      });

      // Only sellers get in-app notifications
      const shouldSendInApp = 
        user.role === "SELLER" && 
        settings?.appNotifications !== false;

      // Check if email should be sent based on settings
      const shouldSendEmail = settings?.emailChannel === true;

      console.log(`📊 Notification decisions:`, {
        shouldSendInApp,
        shouldSendEmail,
        hasEmailTemplate: !!payload.emailTemplate,
      });

      // Create in-app notification if enabled
      if (shouldSendInApp) {
        await this.createInAppNotification(payload);
        console.log(`✅ In-app notification created for user: ${payload.userId}`);
      } else {
        console.log(`⏭️ Skipping in-app notification (shouldSendInApp: ${shouldSendInApp})`);
      }

      // Send email if enabled
      if (shouldSendEmail && payload.emailTemplate) {
        await this.sendEmailNotification(user.email, payload);
        console.log(`✅ Email sent to: ${user.email}`);
      } else {
        console.log(`⏭️ Skipping email (shouldSendEmail: ${shouldSendEmail}, hasTemplate: ${!!payload.emailTemplate})`);
      }
    } catch (error) {
      console.error("❌ Error sending notification:", error);
      // Don't throw error to prevent blocking the main flow
    }
  }

  /**
   * Create in-app notification in database
   */
  private static async createInAppNotification(
    payload: NotificationPayload
  ): Promise<void> {
    await prisma.notification.create({
      data: {
        message: payload.message,
        category: payload.category,
        actionText: payload.actionText,
        actionUrl: payload.actionUrl,
        actionBgColor: payload.actionBgColor,
        userId: payload.userId,
        isRead: false,
      },
    });
  }

  /**
   * Send email notification using SendGrid
   */
  private static async sendEmailNotification(
    email: string,
    payload: NotificationPayload
  ): Promise<void> {
    if (!payload.emailSubject || !payload.emailTemplate) {
      return;
    }

    await sendEmail({
      to: email,
      subject: payload.emailSubject,
      template: payload.emailTemplate,
      data: payload.emailData || {},
    });
  }

  /**
   * Send new order notification to seller
   */
  static async notifyNewOrder(
    sellerId: string,
    orderData: {
      orderId: string;
      orderNumber: string;
      customerName: string;
      totalAmount: number;
      itemCount: number;
    }
  ): Promise<void> {
    // Check if seller wants new order notifications
    const settings = await prisma.notificationSettings.findUnique({
      where: { userId: sellerId },
    });

    if (settings?.newOrders === false) {
      console.log(`⏭️ Seller ${sellerId} has disabled new order notifications`);
      return;
    }

    await this.sendNotification({
      userId: sellerId,
      message: `New order #${orderData.orderNumber} from ${orderData.customerName} - $${orderData.totalAmount.toFixed(2)}`,
      category: "CAMPAIGN_ALERTS",
      actionText: "View Order",
      actionUrl: `/dashboard/orders/${orderData.orderId}`,
      actionBgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
      emailSubject: `New Order Received - #${orderData.orderNumber}`,
      emailTemplate: "newOrderSeller",
      emailData: {
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        totalAmount: orderData.totalAmount,
        itemCount: orderData.itemCount,
        orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderData.orderId}`,
      },
    });
  }

  /**
   * Send low stock alert to seller
   */
  static async notifyLowStock(
    sellerId: string,
    productData: {
      productId: string;
      productName: string;
      currentStock: number;
      threshold: number;
    }
  ): Promise<void> {
    await this.sendNotification({
      userId: sellerId,
      message: `Low stock alert: "${productData.productName}" has only ${productData.currentStock} units left`,
      category: "STOCK_ALERTS",
      actionText: "Restock Now",
      actionUrl: `/dashboard/products/${productData.productId}/edit`,
      actionBgColor: "bg-gradient-to-r from-orange-500 to-red-500",
      emailSubject: `Low Stock Alert - ${productData.productName}`,
      emailTemplate: "lowStockAlert",
      emailData: {
        productName: productData.productName,
        currentStock: productData.currentStock,
        threshold: productData.threshold,
        productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/products/${productData.productId}/edit`,
      },
    });
  }

  /**
   * Send product update notification
   */
  static async notifyProductUpdate(
    sellerId: string,
    updateData: {
      title: string;
      description: string;
      actionUrl?: string;
    }
  ): Promise<void> {
    await this.sendNotification({
      userId: sellerId,
      message: updateData.description,
      category: "PRODUCT_UPDATES",
      actionText: "Learn More",
      actionUrl: updateData.actionUrl || "/dashboard",
      actionBgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      emailSubject: updateData.title,
      emailTemplate: "productUpdate",
      emailData: {
        title: updateData.title,
        description: updateData.description,
        actionUrl: updateData.actionUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  }

  /**
   * Send sales insight notification
   */
  static async notifySalesInsight(
    sellerId: string,
    insightData: {
      title: string;
      metric: string;
      value: string;
      change?: string;
      actionUrl?: string;
    }
  ): Promise<void> {
    await this.sendNotification({
      userId: sellerId,
      message: `${insightData.title}: ${insightData.metric} is ${insightData.value}${insightData.change ? ` (${insightData.change})` : ""}`,
      category: "SALES_INSIGHTS",
      actionText: "View Analytics",
      actionUrl: insightData.actionUrl || "/dashboard/analytics",
      actionBgColor: "bg-gradient-to-r from-amber-500 to-green-500",
      emailSubject: `Sales Insight - ${insightData.title}`,
      emailTemplate: "salesInsight",
      emailData: {
        title: insightData.title,
        metric: insightData.metric,
        value: insightData.value,
        change: insightData.change,
        actionUrl: insightData.actionUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics`,
      },
    });
  }

  /**
   * Send order confirmation email to buyer (email only, no in-app)
   */
  static async notifyBuyerOrderConfirmation(
    buyerEmail: string,
    orderData: {
      orderId: string;
      orderNumber: string;
      totalAmount: number;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      shippingAddress: any;
    }
  ): Promise<void> {
    // Format shipping address
    const formattedAddress = typeof orderData.shippingAddress === 'string' 
      ? orderData.shippingAddress 
      : `${orderData.shippingAddress.address || ''}, ${orderData.shippingAddress.city || ''}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.postalCode || ''}`.trim();

    await sendEmail({
      to: buyerEmail,
      subject: `Order Confirmation - #${orderData.orderNumber}`,
      template: "orderConfirmationBuyer",
      data: {
        orderNumber: orderData.orderNumber,
        totalAmount: orderData.totalAmount,
        items: orderData.items,
        shippingAddress: formattedAddress,
        orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData.orderId}`,
      },
    });
  }

  /**
   * Send order status update to buyer (email only)
   */
  static async notifyBuyerOrderStatus(
    buyerEmail: string,
    statusData: {
      orderId: string;
      orderNumber: string;
      status: string;
      statusMessage: string;
      trackingNumber?: string;
    }
  ): Promise<void> {
    await sendEmail({
      to: buyerEmail,
      subject: `Order ${statusData.status} - #${statusData.orderNumber}`,
      template: "orderStatusUpdate",
      data: {
        orderNumber: statusData.orderNumber,
        status: statusData.status,
        statusMessage: statusData.statusMessage,
        trackingNumber: statusData.trackingNumber,
        orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${statusData.orderId}`,
      },
    });
  }
}