/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/order-notification-service.ts

import { NotificationService } from "./notifications/notificationService";
import prisma from "@/lib/prisma";

interface Order {
  id: string;
  totalAmount: number;
  subTotal: number;
  shippingCost: number;
  customerEmail: string;
  shippingAddress: any;
  orderItems: Array<{
    id: string;
    sellerId: string;
    sellerEmail: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  user: {
    name: string | null;
    email: string;
  };
}

/**
 * Send order notifications to all sellers and the buyer
 */
export async function sendOrderNotifications(order: Order): Promise<void> {
  try {
    console.log(`\n📧 Processing notifications for order: ${order.id}`);
    
    // Generate order number (you might want to adjust this based on your needs)
    const orderNumber = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
    
    // Group items by seller
    const sellerGroups = new Map<string, typeof order.orderItems>();
    
    for (const item of order.orderItems) {
      if (!sellerGroups.has(item.sellerId)) {
        sellerGroups.set(item.sellerId, []);
      }
      sellerGroups.get(item.sellerId)!.push(item);
    }

    console.log(`📦 Found ${sellerGroups.size} unique seller(s) in this order`);

    // Send notification to each seller
    const sellerNotificationPromises = Array.from(sellerGroups.entries()).map(
      async ([sellerId, items]) => {
        try {
          const sellerTotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          console.log(`  └─ Notifying seller ${sellerId}: ${items.length} item(s), $${sellerTotal.toFixed(2)}`);

          await NotificationService.notifyNewOrder(sellerId, {
            orderId: order.id,
            orderNumber: orderNumber,
            customerName: order.user.name || "Customer",
            totalAmount: sellerTotal,
            itemCount: items.length,
          });

          // Track notification in OrderNotification table
          await prisma.orderNotification.create({
            data: {
              orderId: order.id,
              sellerId: sellerId,
              sellerEmail: items[0].sellerEmail,
              emailSent: true,
              sentAt: new Date(),
              orderItemsCount: items.length,
              totalAmount: sellerTotal,
            },
          });

          console.log(`  ✅ Seller notification sent successfully`);
        } catch (error) {
          console.error(`  ❌ Failed to notify seller ${sellerId}:`, error);
          
          // Still track the failed notification
          try {
            await prisma.orderNotification.create({
              data: {
                orderId: order.id,
                sellerId: sellerId,
                sellerEmail: items[0].sellerEmail,
                emailSent: false,
                orderItemsCount: items.length,
                totalAmount: items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ),
              },
            });
          } catch (dbError) {
            console.error(`  ❌ Failed to log notification failure:`, dbError);
          }
        }
      }
    );

    // Send confirmation email to buyer
    const buyerNotificationPromise = (async () => {
      try {
        console.log(`📨 Sending order confirmation to buyer: ${order.customerEmail}`);

        const orderItems = order.orderItems.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
        }));

        await NotificationService.notifyBuyerOrderConfirmation(
          order.customerEmail,
          {
            orderId: order.id,
            orderNumber: orderNumber,
            totalAmount: order.totalAmount,
            items: orderItems,
            shippingAddress: order.shippingAddress,
          }
        );

        console.log(`✅ Buyer confirmation email sent successfully`);
      } catch (error) {
        console.error(`❌ Failed to send buyer confirmation:`, error);
      }
    })();

    // Wait for all notifications to complete
    await Promise.allSettled([
      ...sellerNotificationPromises,
      buyerNotificationPromise,
    ]);

    console.log(`\n✅ All order notifications processed\n`);
  } catch (error) {
    console.error("❌ Error in sendOrderNotifications:", error);
    // Don't throw - we don't want to fail the order creation
  }
}

/**
 * Send order status update notification to buyer
 */
export async function sendOrderStatusUpdate(
  orderId: string,
  newStatus: string,
  trackingNumber?: string
): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        customerEmail: true,
      },
    });

    if (!order) {
      console.error("Order not found:", orderId);
      return;
    }

    const orderNumber = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
    
    const statusMessages: Record<string, string> = {
      PROCESSING: "Your order is being processed and will ship soon!",
      SHIPPED: "Your order has been shipped and is on its way!",
      DELIVERED: "Your order has been delivered. Enjoy your purchase!",
      CANCELLED: "Your order has been cancelled.",
    };

    await NotificationService.notifyBuyerOrderStatus(order.customerEmail, {
      orderId: order.id,
      orderNumber: orderNumber,
      status: newStatus,
      statusMessage: statusMessages[newStatus] || `Your order status has been updated to ${newStatus}`,
      trackingNumber: trackingNumber,
    });

    console.log(`✅ Order status update sent to ${order.customerEmail}`);
  } catch (error) {
    console.error("Error sending order status update:", error);
  }
}