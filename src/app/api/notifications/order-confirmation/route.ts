
// src/app/api/notifications/order-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationNotification } from '@/lib/notification-service';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Send the notification
    const result = await sendOrderConfirmationNotification(orderId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order confirmation sent successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}