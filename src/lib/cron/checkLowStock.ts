// src/lib/cron/checkLowStock.ts

import prisma from "@/lib/prisma";
import { NotificationService } from "@/lib/notifications/notificationService";

/**
 * Check all products for low stock and send notifications
 * This should be run as a cron job (e.g., daily at 9 AM)
 */
export async function checkLowStockProducts() {
  try {
    console.log("🔍 Starting low stock check...");

    // Find all products where inventory is at or below the lowStockAlert threshold
    // Only check active/published products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            inventory: {
              lte: prisma.product.fields.lowStockAlert,
            },
          },
          {
            status: "Published", // Only check published products
          },
          {
            visibility: "Public", // Only check public products
          },
          {
            inventory: {
              gt: 0, // Don't alert on out-of-stock items
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        inventory: true,
        lowStockAlert: true,
        sellerId: true,
        seller: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(`📦 Found ${lowStockProducts.length} low stock products`);

    if (lowStockProducts.length === 0) {
      console.log("✅ No low stock products found");
      return;
    }

    // Send notification for each low stock product
    for (const product of lowStockProducts) {
      try {
        // Check if we've already sent a notification recently
        // to avoid spamming the seller
        const recentNotification = await prisma.notification.findFirst({
          where: {
            userId: product.sellerId,
            category: "STOCK_ALERTS",
            message: {
              contains: product.name,
            },
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        });

        if (recentNotification) {
          console.log(`  ⏭️ Skipping duplicate notification for: ${product.name}`);
          continue;
        }

        console.log(`  📧 Sending notification for: ${product.name} (${product.inventory} units)`);

        await NotificationService.notifyLowStock(product.sellerId, {
          productId: product.id,
          productName: product.name,
          currentStock: product.inventory,
          threshold: product.lowStockAlert || 5,
        });

        console.log(`  ✅ Notification sent successfully`);
      } catch (error) {
        console.error(`  ❌ Error notifying for ${product.name}:`, error);
        // Continue with other products even if one fails
      }
    }

    console.log("✅ Low stock check completed\n");
  } catch (error) {
    console.error("❌ Error in low stock check:", error);
    throw error;
  }
}

/**
 * Check low stock for a specific seller
 */
export async function checkLowStockForSeller(sellerId: string) {
  try {
    console.log(`🔍 Checking low stock for seller: ${sellerId}`);

    const lowStockProducts = await prisma.product.findMany({
      where: {
        sellerId: sellerId,
        inventory: {
          lte: prisma.product.fields.lowStockAlert,
          gt: 0,
        },
        status: "Published",
      },
      select: {
        id: true,
        name: true,
        inventory: true,
        lowStockAlert: true,
      },
    });

    console.log(`📦 Found ${lowStockProducts.length} low stock products for this seller`);

    for (const product of lowStockProducts) {
      await NotificationService.notifyLowStock(sellerId, {
        productId: product.id,
        productName: product.name,
        currentStock: product.inventory,
        threshold: product.lowStockAlert || 5,
      });
    }

    return lowStockProducts;
  } catch (error) {
    console.error("Error checking low stock for seller:", error);
    throw error;
  }
}