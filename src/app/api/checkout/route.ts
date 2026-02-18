/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { stripe, formatAmountForStripe } from "@/lib/stripe";

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

// Effective price: use discount when product is on sale
function getEffectivePrice(product: { price: number; onSale?: boolean; discountPrice?: number | null }): number {
  return (product?.onSale && product?.discountPrice != null) ? product.discountPrice : (product?.price ?? 0);
}

// Helper function to convert relative URLs to absolute URLs
function getAbsoluteUrl(imageUrl: string | null | undefined): string | undefined {
  if (!imageUrl) return undefined;
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Convert relative path to absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

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
    const { customerInfo, shippingAddress, billingAddress } = body;

    console.log('📦 Checkout request received:', {
      hasCustomerInfo: !!customerInfo,
      hasShippingAddress: !!shippingAddress,
      hasBillingAddress: !!billingAddress,
      customerEmail: customerInfo?.email,
    });

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

    // Calculate totals (use discounted price when product is on sale)
    const subTotal = cart.items.reduce((sum, item) => {
      const price = getEffectivePrice(item.product);
      return sum + price * item.quantity;
    }, 0);

    const shippingCost = 20;
    const totalAmount = subTotal + shippingCost;

    // Create Stripe line items (use discounted price when on sale)
    const lineItems = cart.items.map((item) => {
      const primaryImage = item.product.productImages.find((img) => img.isPrimary);
      const imageUrl = primaryImage?.url || item.product.productImages[0]?.url;
      const unitPrice = getEffectivePrice(item.product);

      // Convert relative URL to absolute URL for Stripe
      const absoluteImageUrl = getAbsoluteUrl(imageUrl);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            // Only include images array if we have a valid absolute URL
            ...(absoluteImageUrl && { images: [absoluteImageUrl] }),
            metadata: {
              productId: item.product.id,
              size: item.size || 'N/A',
            },
          },
          unit_amount: formatAmountForStripe(unitPrice),
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Express Delivery Shipping',
          metadata: {
            productId: 'shipping',
            size: 'N/A',
          },
        },
        unit_amount: formatAmountForStripe(shippingCost),
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?canceled=true`,
      customer_email: customerInfo.email,
      metadata: {
        userId: decoded.userId,
        cartId: cart.id,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || shippingAddress.phone || '',
        // Ensure we're stringifying valid objects
        shippingAddress: JSON.stringify(shippingAddress || {}),
        billingAddress: JSON.stringify(billingAddress || {}),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create checkout session" 
      },
      { status: 500 }
    );
  }
}