// // src/app/api/webhooks/stripe/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import Stripe from "stripe";
// import { headers } from "next/headers";

// const prisma = new PrismaClient();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
//   apiVersion: "2025-09-30.clover",
// });

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// /**
//  * POST /api/webhooks/stripe - Handle Stripe webhook events
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.text();
//     const headersList = await headers();
//     const signature = headersList.get("stripe-signature");

//     if (!signature) {
//       return NextResponse.json(
//         { error: "No signature" },
//         { status: 400 }
//       );
//     }

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err) {
//       console.error("Webhook signature verification failed:", err);
//       return NextResponse.json(
//         { error: "Webhook signature verification failed" },
//         { status: 400 }
//       );
//     }

//     // Handle the event
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;
//         await handleCheckoutSessionCompleted(session);
//         break;
//       }
//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
//         await handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       }
//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
//         await handlePaymentIntentFailed(paymentIntent);
//         break;
//       }
//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return NextResponse.json(
//       { error: "Webhook handler failed" },
//       { status: 500 }
//     );
//   }
// }

// async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
//   try {
//     const metadata = session.metadata;
//     if (!metadata) {
//       console.error("No metadata in session");
//       return;
//     }

//     const userId = metadata.userId;
//     const customerEmail = metadata.customerEmail;
//     const customerPhone = metadata.customerPhone;
//     const shippingAddress = JSON.parse(metadata.shippingAddress);
//     const billingAddress = JSON.parse(metadata.billingAddress);
//     const paymentMethod = metadata.paymentMethod;

//     // Get user's cart
//     const cart = await prisma.cart.findUnique({
//       where: { userId },
//       include: {
//         items: {
//           include: {
//             product: {
//               include: {
//                 productImages: {
//                   where: { isPrimary: true },
//                 },
//                 seller: {
//                   select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!cart || cart.items.length === 0) {
//       console.error("Cart not found or empty");
//       return;
//     }

//     // Calculate totals
//     const subTotal = cart.items.reduce((sum, item) => {
//       return sum + item.product.price * item.quantity;
//     }, 0);
//     const shippingCost = 20;
//     const totalAmount = subTotal + shippingCost;

//     // Create order
//     const order = await prisma.$transaction(async (tx) => {
//       const newOrder = await tx.order.create({
//         data: {
//           userId,
//           totalAmount,
//           subTotal,
//           shippingCost,
//           status: "PROCESSING",
//           paymentStatus: "PAID",
//           paymentMethod,
//           customerEmail,
//           customerPhone: customerPhone || null,
//           shippingAddress,
//           billingAddress,
//           stripeSessionId: session.id,
//           stripePaymentId: session.payment_intent as string,
//         },
//       });

//       // Create order items and track sellers
//       const sellerOrders = new Map<string, { email: string; items: number; total: number }>();

//       for (const cartItem of cart.items) {
//         const primaryImage = cartItem.product.productImages[0];

//         await tx.orderItem.create({
//           data: {
//             orderId: newOrder.id,
//             productId: cartItem.productId,
//             sellerId: cartItem.product.sellerId,
//             sellerName: cartItem.product.seller.name,
//             sellerEmail: cartItem.product.seller.email,
//             productName: cartItem.product.name,
//             productSku: cartItem.product.sku,
//             size: cartItem.size,
//             quantity: cartItem.quantity,
//             price: cartItem.product.price,
//             imageUrl: primaryImage?.url || null,
//             fulfillmentStatus: "PROCESSING",
//           },
//         });

//         // Decrease inventory
//         await tx.product.update({
//           where: { id: cartItem.productId },
//           data: {
//             inventory: {
//               decrement: cartItem.quantity,
//             },
//           },
//         });

//         // Track seller orders
//         const sellerId = cartItem.product.sellerId;
//         if (!sellerOrders.has(sellerId)) {
//           sellerOrders.set(sellerId, {
//             email: cartItem.product.seller.email,
//             items: 0,
//             total: 0,
//           });
//         }
//         const sellerData = sellerOrders.get(sellerId)!;
//         sellerData.items += 1;
//         sellerData.total += cartItem.product.price * cartItem.quantity;
//       }

//       // Create notifications
//       for (const [sellerId, data] of sellerOrders) {
//         await tx.orderNotification.create({
//           data: {
//             orderId: newOrder.id,
//             sellerId,
//             sellerEmail: data.email,
//             orderItemsCount: data.items,
//             totalAmount: data.total,
//           },
//         });
//       }

//       // Clear cart
//       await tx.cartItem.deleteMany({
//         where: { cartId: cart.id },
//       });

//       return newOrder;
//     });

//     console.log("Order created successfully:", order.id);

//     // TODO: Send email notifications to sellers
//     // This will be handled by the email service we'll create next

//   } catch (error) {
//     console.error("Error handling checkout session completed:", error);
//   }
// }

// async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     // Update order payment status
//     await prisma.order.updateMany({
//       where: {
//         stripePaymentId: paymentIntent.id,
//       },
//       data: {
//         paymentStatus: "PAID",
//       },
//     });

//     console.log("Payment succeeded for:", paymentIntent.id);
//   } catch (error) {
//     console.error("Error handling payment intent succeeded:", error);
//   }
// }

// async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     // Update order payment status
//     await prisma.order.updateMany({
//       where: {
//         stripePaymentId: paymentIntent.id,
//       },
//       data: {
//         paymentStatus: "FAILED",
//         status: "CANCELLED",
//       },
//     });

//     console.log("Payment failed for:", paymentIntent.id);
//   } catch (error) {
//     console.error("Error handling payment intent failed:", error);
//   }
// }
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { sendOrderNotifications } from "@/lib/order-notification-service";
import { LowStockNotificationService } from "@/lib/notifications/lowStockNotificationService";

const prisma = new PrismaClient();

// Effective price: use discount when product is on sale
function getEffectivePrice(product: { price: number; onSale?: boolean; discountPrice?: number | null }): number {
  return (product?.onSale && product?.discountPrice != null) ? product.discountPrice : (product?.price ?? 0);
}

export async function POST(request: NextRequest) {
  console.log('🎣 Webhook received');
  
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  console.log('📝 Webhook details:', {
    hasBody: !!body,
    hasSignature: !!signature,
    bodyLength: body.length,
    webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
  });

  if (!signature) {
    console.error('❌ No signature found');
    return NextResponse.json(
      { error: "No signature found" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('✅ Webhook signature verified, event type:', event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("✅ Payment successful for session:", session.id);

        // Extract metadata
        const metadata = session.metadata;
        if (!metadata) {
          console.error("❌ No metadata found in session");
          throw new Error("No metadata found in session");
        }

        console.log("📦 Session metadata:", metadata);

        const userId = metadata.userId;
        const cartId = metadata.cartId;
        
        if (!userId || !cartId) {
          console.error("❌ Missing userId or cartId in metadata");
          throw new Error("Missing required metadata: userId or cartId");
        }
        
        // Safely parse JSON metadata with fallbacks
        let shippingAddress;
        let billingAddress;
        
        try {
          shippingAddress = metadata.shippingAddress && metadata.shippingAddress !== 'undefined' 
            ? JSON.parse(metadata.shippingAddress) 
            : {};
          console.log("✅ Parsed shipping address:", shippingAddress);
        } catch (error) {
          console.error('❌ Error parsing shippingAddress:', error);
          shippingAddress = {};
        }
        
        try {
          billingAddress = metadata.billingAddress && metadata.billingAddress !== 'undefined'
            ? JSON.parse(metadata.billingAddress)
            : { same: true };
          console.log("✅ Parsed billing address:", billingAddress);
        } catch (error) {
          console.error('❌ Error parsing billingAddress:', error);
          billingAddress = { same: true };
        }
        
        const customerEmail = metadata.customerEmail;
        const customerPhone = metadata.customerPhone;

        console.log("📧 Customer info:", { customerEmail, customerPhone });

        // Get the cart
        const cart = await prisma.cart.findUnique({
          where: { id: cartId },
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
          throw new Error("Cart not found or empty");
        }

        // Calculate totals (use discounted price when on sale)
        const subTotal = cart.items.reduce((sum, item) => {
          const price = getEffectivePrice(item.product);
          return sum + price * item.quantity;
        }, 0);

        const shippingCost = 20;
        const totalAmount = subTotal + shippingCost;

        // Create order with transaction
        const order = await prisma.$transaction(async (tx) => {
          // Create the order
          const newOrder = await tx.order.create({
            data: {
              userId,
              totalAmount,
              subTotal,
              shippingCost,
              status: "PENDING",
              paymentStatus: "PAID",
              paymentMethod: "card",
              stripeSessionId: session.id,
              stripePaymentId: session.payment_intent as string,
              customerEmail,
              customerPhone,
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

              // Check for low stock
              LowStockNotificationService.checkAndNotifyLowStock(cartItem.productId)
                .catch(error => {
                  console.error(`Error checking low stock for product ${cartItem.productId}:`, error);
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
                  imageUrl: primaryImage?.url || cartItem.product.productImages[0]?.url,
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

        // Fetch complete order for notifications
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

        // Send notifications
        if (completeOrder) {
          console.log("🔔 Triggering order notifications...");
          sendOrderNotifications(completeOrder).catch(error => {
            console.error("❌ Error sending order notifications:", error);
          });
        }

        console.log("✅ Order created successfully:", order.id);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        console.log("⚠️ Checkout session expired:", session.id);
        // Optionally handle expired sessions
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("❌ Payment failed:", paymentIntent.id);
        // Optionally notify user of payment failure
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Webhook processing failed", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}