// src/lib/notifications/lowStockNotificationService.ts

import prisma from "@/lib/prisma";
import { NotificationService } from "./notificationService";

export class LowStockNotificationService {
  /**
   * Check a single product for low stock and send notification if needed
   */
  static async checkAndNotifyLowStock(productId: string): Promise<void> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          inventory: true,
          lowStockAlert: true,
          sellerId: true,
          sku: true,
        },
      });

      if (!product) {
        console.log(`⚠️ Product ${productId} not found`);
        return;
      }

      // Check if inventory tracking is enabled for this product
      // (You might need to add this field to your schema if you want it)
      const lowStockThreshold = product.lowStockAlert || 5;

      console.log(`📦 Checking stock for "${product.name}":`, {
        current: product.inventory,
        threshold: lowStockThreshold,
      });

      // Only notify if stock is at or below threshold
      if (product.inventory <= lowStockThreshold && product.inventory > 0) {
        console.log(`⚠️ Low stock detected for ${product.name}`);

        await NotificationService.notifyLowStock(product.sellerId, {
          productId: product.id,
          productName: product.name,
          currentStock: product.inventory,
          threshold: lowStockThreshold,
        });
      } else if (product.inventory === 0) {
        console.log(`❌ Out of stock: ${product.name}`);

        // Send out of stock notification
        await this.notifyOutOfStock(product.sellerId, {
          productId: product.id,
          productName: product.name,
          sku: product.sku || undefined,
        });
      } else {
        console.log(`✅ Stock levels OK for ${product.name}`);
      }
    } catch (error) {
      console.error(`Error checking low stock for product ${productId}:`, error);
    }
  }

  /**
   * Send out of stock notification
   */
  static async notifyOutOfStock(
    sellerId: string,
    productData: {
      productId: string;
      productName: string;
      sku?: string;
    }
  ): Promise<void> {
    await NotificationService.sendNotification({
      userId: sellerId,
      message: `OUT OF STOCK: "${productData.productName}" has 0 units remaining. Restock immediately to avoid lost sales.`,
      category: "STOCK_ALERTS",
      actionText: "Restock Now",
      actionUrl: `/dashboard/products/${productData.productId}/edit`,
      actionBgColor: "bg-gradient-to-r from-red-500 to-pink-500",
      emailSubject: `URGENT: Out of Stock Alert - ${productData.productName}`,
      emailTemplate: "outOfStockAlert",
      emailData: {
        productName: productData.productName,
        sku: productData.sku,
        productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/products/${productData.productId}/edit`,
      },
    });
  }

  /**
   * Check all products for low stock (run via cron job daily)
   */
  static async checkAllProductsForLowStock(): Promise<void> {
    try {
      console.log("\n🔍 Starting daily low stock check...");

      // Find all products with low stock
      const lowStockProducts = await prisma.product.findMany({
        where: {
          OR: [
            {
              // Products at or below their alert threshold
              inventory: {
                lte: prisma.product.fields.lowStockAlert,
              },
            },
            {
              // Products with inventory <= 5 if no custom threshold set
              AND: [
                { lowStockAlert: null },
                { inventory: { lte: 5 } },
              ],
            },
          ],
          // Only check products that are supposed to be tracked
          trackInventory: "Yes",
        },
        select: {
          id: true,
          name: true,
          inventory: true,
          lowStockAlert: true,
          sellerId: true,
          sku: true,
        },
      });

      console.log(`📊 Found ${lowStockProducts.length} products with low stock`);

      // Group products by seller to send consolidated notifications
      const productsBySeller = new Map<string, typeof lowStockProducts>();

      for (const product of lowStockProducts) {
        if (!productsBySeller.has(product.sellerId)) {
          productsBySeller.set(product.sellerId, []);
        }
        productsBySeller.get(product.sellerId)!.push(product);
      }

      console.log(`👥 Notifying ${productsBySeller.size} sellers`);

      // Send notifications to each seller
      for (const [sellerId, products] of productsBySeller.entries()) {
        try {
          // Separate out of stock from low stock
          const outOfStock = products.filter((p) => p.inventory === 0);
          const lowStock = products.filter((p) => p.inventory > 0);

          console.log(`  📤 Seller ${sellerId}: ${outOfStock.length} out of stock, ${lowStock.length} low stock`);

          // Send individual notifications for out of stock items
          for (const product of outOfStock) {
            await this.notifyOutOfStock(sellerId, {
              productId: product.id,
              productName: product.name,
              sku: product.sku || undefined,
            });
          }

          // Send individual notifications for low stock items
          for (const product of lowStock) {
            await NotificationService.notifyLowStock(sellerId, {
              productId: product.id,
              productName: product.name,
              currentStock: product.inventory,
              threshold: product.lowStockAlert || 5,
            });
          }
        } catch (error) {
          console.error(`  ❌ Failed to notify seller ${sellerId}:`, error);
        }
      }

      console.log("✅ Daily low stock check completed\n");
    } catch (error) {
      console.error("Error in daily low stock check:", error);
    }
  }

  /**
   * Send consolidated weekly low stock summary
   */
  static async sendWeeklyLowStockSummary(): Promise<void> {
    try {
      console.log("\n📊 Generating weekly low stock summaries...");

      // Get all sellers with low stock products
      const sellers = await prisma.user.findMany({
        where: {
          role: "SELLER",
          products: {
            some: {
              OR: [
                { inventory: { lte: 5 } },
                {
                  inventory: {
                    lte: prisma.product.fields.lowStockAlert,
                  },
                },
              ],
              trackInventory: "Yes",
            },
          },
        },
        include: {
          products: {
            where: {
              OR: [
                { inventory: { lte: 5 } },
                {
                  inventory: {
                    lte: prisma.product.fields.lowStockAlert,
                  },
                },
              ],
              trackInventory: "Yes",
            },
            select: {
              id: true,
              name: true,
              inventory: true,
              lowStockAlert: true,
              sku: true,
            },
          },
        },
      });

      console.log(`📤 Sending summaries to ${sellers.length} sellers`);

      for (const seller of sellers) {
        const outOfStock = seller.products.filter((p) => p.inventory === 0);
        const lowStock = seller.products.filter((p) => p.inventory > 0);

        await NotificationService.sendNotification({
          userId: seller.id,
          message: `Weekly Stock Summary: ${outOfStock.length} items out of stock, ${lowStock.length} items running low.`,
          category: "STOCK_ALERTS",
          actionText: "Review Inventory",
          actionUrl: "/dashboard/product-management",
          actionBgColor: "bg-gradient-to-r from-orange-500 to-amber-500",
          emailSubject: "Weekly Stock Summary",
          emailTemplate: "weeklyStockSummary",
          emailData: {
            outOfStockCount: outOfStock.length,
            lowStockCount: lowStock.length,
            outOfStockProducts: outOfStock.map((p) => ({
              name: p.name,
              sku: p.sku,
            })),
            lowStockProducts: lowStock.map((p) => ({
              name: p.name,
              currentStock: p.inventory,
              threshold: p.lowStockAlert || 5,
            })),
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/product-management`,
          },
        });
      }

      console.log("✅ Weekly summaries sent\n");
    } catch (error) {
      console.error("Error sending weekly summaries:", error);
    }
  }
}