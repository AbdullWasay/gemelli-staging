// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { sendOrderNotifications } from "@/lib/order-notification-service";
import { LowStockNotificationService } from "@/lib/notifications/lowStockNotificationService";

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

    if (!userId) {
      return null;
    }

    return {
      userId,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// GET - Fetch orders
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const sellerId = searchParams.get("sellerId");

    // Get single order by ID
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  productImages: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      // Check if seller owns any items in this order
      const sellerOwnsOrder = order.orderItems.some(
        (item) => item.sellerId === decoded.userId
      );

      // Allow access if user is either the buyer OR a seller of items in the order
      const hasAccess = order.userId === decoded.userId || sellerOwnsOrder;

      if (!hasAccess) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { order },
      });
    }

    // Get orders for a seller
    if (sellerId) {
      // Verify the seller is requesting their own orders
      if (sellerId !== decoded.userId) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      const orderItems = await prisma.orderItem.findMany({
        where: { sellerId },
        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          product: {
            include: {
              productImages: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Group order items by order
      const ordersMap = new Map();

      for (const item of orderItems) {
        const orderId = item.orderId;

        if (!ordersMap.has(orderId)) {
          ordersMap.set(orderId, {
            ...item.order,
            orderItems: [],
          });
        }

        ordersMap.get(orderId).orderItems.push(item);
      }

      const orders = Array.from(ordersMap.values());

      return NextResponse.json({
        success: true,
        data: { orders },
      });
    }

    // Get all orders for the user (buyer)
    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                productImages: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create order from cart
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
    const {
      paymentMethod,
      customerInfo,
      shippingAddress,
      billingAddress,
      stripeSessionId,
    } = body;

    // Validate required fields
    if (!customerInfo?.email || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                productImages: true,
                seller: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Effective price: use discount when product is on sale
    const getEffectivePrice = (product: { price: number; onSale?: boolean; discountPrice?: number | null }) =>
      (product?.onSale && product?.discountPrice != null) ? product.discountPrice : (product?.price ?? 0);

    // Calculate totals (use discounted price when on sale)
    const subTotal = cart.items.reduce((sum, item) => {
      const price = getEffectivePrice(item.product);
      return sum + price * item.quantity;
    }, 0);

    const shippingCost = 20;
    const totalAmount = subTotal + shippingCost;

    // Check inventory for all items
    for (const item of cart.items) {
      if (item.product.inventory < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient inventory for ${item.product.name}`,
          },
          { status: 400 }
        );
      }
    }

    // Create order with order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: decoded.userId,
          totalAmount,
          subTotal,
          shippingCost,
          status: "PENDING",
          paymentStatus: stripeSessionId ? "PAID" : "PENDING",
          paymentMethod: paymentMethod || "card",
          stripeSessionId: stripeSessionId || null,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone || shippingAddress.phone,
          shippingAddress,
          billingAddress,
        },
      });

      // Create order items and update inventory
      const orderItems = await Promise.all(
        cart.items.map(async (cartItem) => {
          // Reduce product inventory
          await tx.product.update({
            where: { id: cartItem.productId },
            data: {
              inventory: {
                decrement: cartItem.quantity,
              },
            },
          });

          // CHECK FOR LOW STOCK AFTER INVENTORY UPDATE
          // This runs asynchronously and won't block the order
          LowStockNotificationService.checkAndNotifyLowStock(
            cartItem.productId
          ).catch((error) => {
            console.error(
              `Error checking low stock for product ${cartItem.productId}:`,
              error
            );
            // Don't fail the order if notification fails
          });

          // Get primary image
          const primaryImage = cartItem.product.productImages.find(
            (img) => img.isPrimary
          );

          // Use discounted price when product is on sale
          const itemPrice = getEffectivePrice(cartItem.product);

          // Create order item
          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: cartItem.productId,
              sellerId: cartItem.product.sellerId,
              sellerName: cartItem.product.seller.name,
              sellerEmail: cartItem.product.seller.email,
              productName: cartItem.product.name,
              productSku: cartItem.product.sku,
              size: cartItem.size,
              quantity: cartItem.quantity,
              price: itemPrice,
              imageUrl:
                primaryImage?.url || cartItem.product.productImages[0]?.url,
              fulfillmentStatus: "PENDING",
            },
          });
        })
      );

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return { ...newOrder, orderItems };
    });

    // Fetch complete order with user info for notifications
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Send notifications (async, don't wait)
    if (completeOrder) {
      console.log("\n🔔 Triggering order notifications...");
      sendOrderNotifications(completeOrder).catch((error) => {
        console.error("❌ Error sending order notifications:", error);
        // Don't fail the order creation if notifications fail
      });
    }

    return NextResponse.json({
      success: true,
      data: { order },
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
// DELETE - Remove order item
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
    const orderItemId = searchParams.get("orderItemId");

    if (!orderItemId) {
      return NextResponse.json(
        { success: false, error: "Order item ID is required" },
        { status: 400 }
      );
    }

    // Find the order item
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true },
    });

    if (!orderItem) {
      return NextResponse.json(
        { success: false, error: "Order item not found" },
        { status: 404 }
      );
    }

    // Only allow deleting items from PENDING orders
    if (orderItem.order.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Cannot delete items from confirmed orders" },
        { status: 400 }
      );
    }

    // Check if user is authorized (admin or order owner)
    if (orderItem.sellerId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Restore inventory for the product
    await prisma.product.update({
      where: { id: orderItem.productId },
      data: {
        inventory: {
          increment: orderItem.quantity,
        },
      },
    });

    // Delete the order item
    await prisma.orderItem.delete({
      where: { id: orderItemId },
    });

    // Recalculate order totals
    const remainingItems = await prisma.orderItem.findMany({
      where: { orderId: orderItem.orderId },
    });

    // Calculate new totals
    const subTotal = remainingItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const shippingCost = orderItem.order.shippingCost; // Keep same shipping cost
    const totalAmount = subTotal + shippingCost;

    // Update order with new totals
    const updatedOrder = await prisma.order.update({
      where: { id: orderItem.orderId },
      data: {
        subTotal,
        totalAmount,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                productImages: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        order: updatedOrder,
        message: "Order item deleted successfully",
      },
    });
  } catch (error) {
    console.error("Error deleting order item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, orderItemId, status, trackingNumber, confirm } = body;

    // Handle order confirmation
    if (orderId && confirm === true) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      // Check if user is authorized (admin or order owner)
      if (!order.orderItems.some((item) => item.sellerId === decoded.userId)) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Update order status to PROCESSING (which we'll use as CONFIRMED)
      // Also update all order items' fulfillment status
      const updatedOrder = await prisma.$transaction(async (tx) => {
        // First update all order items
        await tx.orderItem.updateMany({
          where: { orderId: orderId },
          data: {
            fulfillmentStatus: "PROCESSING", // Update all items to PROCESSING status
          },
        });

        // Then update the order itself
        return await tx.order.update({
          where: { id: orderId },
          data: { status: "PROCESSING" }, // Using PROCESSING as our CONFIRMED status
          include: {
            orderItems: {
              include: {
                product: {
                  include: {
                    productImages: true,
                  },
                },
              },
            },
          },
        });
      });

      return NextResponse.json({
        success: true,
        data: {
          order: updatedOrder,
          message: "Order confirmed successfully",
        },
      });
    }

    // Regular status update
    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    // Update order item (for sellers)
    if (orderItemId) {
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: orderItemId },
      });

      if (!orderItem) {
        return NextResponse.json(
          { success: false, error: "Order item not found" },
          { status: 404 }
        );
      }

      // Check if user is the seller
      if (orderItem.sellerId !== decoded.userId) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      const updatedOrderItem = await prisma.orderItem.update({
        where: { id: orderItemId },
        data: {
          fulfillmentStatus: status,
          trackingNumber: trackingNumber || orderItem.trackingNumber,
        },
      });

      return NextResponse.json({
        success: true,
        data: { orderItem: updatedOrderItem },
      });
    }

    // Update entire order (for admins or order owner)
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      // Check if user owns the order
      if (order.userId !== decoded.userId) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  productImages: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: { order: updatedOrder },
      });
    }

    return NextResponse.json(
      { success: false, error: "Order ID or Order Item ID required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
