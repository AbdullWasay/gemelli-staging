// lib/email-templates/orderEmails.ts

const APP_NAME = 'Gemelli Store';
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Buyer Order Confirmation Email
 */
export function getBuyerOrderConfirmationEmail(
  buyerName: string,
  orderId: string,
  orderTotal: number,
  shippingCost: number,
  subTotal: number,
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    size?: string | null;
    imageUrl?: string | null;
  }>,
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    areaCode: string;
  }
) {
  const subject = `Order Confirmation - Order #${orderId.slice(0, 8)}`;
  
  const itemsText = orderItems
    .map(item => `- ${item.productName}${item.size ? ` (Size: ${item.size})` : ''} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');
  
  const text = `
Hello ${buyerName},

Thank you for your order! We've received your payment and your order is being processed.

ORDER DETAILS
Order ID: #${orderId.slice(0, 8)}
Order Date: ${new Date().toLocaleDateString()}

ITEMS ORDERED
${itemsText}

PRICING
Subtotal: $${subTotal.toFixed(2)}
Shipping: $${shippingCost.toFixed(2)}
Total: $${orderTotal.toFixed(2)}

SHIPPING ADDRESS
${shippingAddress.firstName} ${shippingAddress.lastName}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.areaCode}
${shippingAddress.country}

We'll send you another email with tracking information once your order ships.

View Order Details: ${APP_URL}/dashboard/orders/${orderId}

Need help? Contact our support team.

Best regards,
The ${APP_NAME} Team
  `.trim();

  const htmlItems = orderItems
    .map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.imageUrl ? `
              <img src="${item.imageUrl}" alt="${item.productName}" 
                   style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: #f5f5f5;" />
            ` : ''}
            <div>
              <div style="font-weight: 600; color: #333;">${item.productName}</div>
              ${item.size ? `<div style="font-size: 13px; color: #666;">Size: ${item.size}</div>` : ''}
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #333;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4046DE 0%, #5C67F8 100%); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Order Confirmed! 🎉</h1>
          <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Thank you for your purchase</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
            Hello <strong>${buyerName}</strong>,
          </p>
          <p style="margin: 0 0 30px 0; color: #666; font-size: 15px; line-height: 1.6;">
            Great news! We've received your order and payment. Your items are being prepared for shipment.
          </p>

          <!-- Order Info Box -->
          <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666; font-size: 14px;">Order Number:</span>
              <strong style="color: #333; font-size: 14px;">#${orderId.slice(0, 8)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-size: 14px;">Order Date:</span>
              <strong style="color: #333; font-size: 14px;">${new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          <!-- Order Items -->
          <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; font-weight: 700;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase;">Item</th>
                <th style="padding: 12px; text-align: center; font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase;">Qty</th>
                <th style="padding: 12px; text-align: right; font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${htmlItems}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 700;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #666; font-size: 15px;">Subtotal</span>
              <span style="color: #333; font-size: 15px; font-weight: 600;">$${subTotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
              <span style="color: #666; font-size: 15px;">Shipping</span>
              <span style="color: #333; font-size: 15px; font-weight: 600;">$${shippingCost.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #333; font-size: 18px; font-weight: 700;">Total</span>
              <span style="color: #4046DE; font-size: 20px; font-weight: 700;">$${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 700;">Shipping Address</h3>
            <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.6;">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br/>
              ${shippingAddress.address}<br/>
              ${shippingAddress.city}, ${shippingAddress.areaCode}<br/>
              ${shippingAddress.country}
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard/orders/${orderId}" 
               style="display: inline-block; background: linear-gradient(135deg, #4046DE 0%, #5C67F8 100%); color: #ffffff; 
                      padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View Order Details
            </a>
          </div>

          <p style="margin: 30px 0 0 0; color: #666; font-size: 14px; line-height: 1.6; text-align: center;">
            We'll send you tracking information once your order ships.<br/>
            Questions? Contact our support team anytime.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0; color: #999; font-size: 13px;">
            This email was sent to you because you placed an order on ${APP_NAME}
          </p>
          <p style="margin: 0; color: #666; font-size: 14px; font-weight: 600;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, text, html };
}

/**
 * Seller New Order Notification Email
 */
export function getSellerNewOrderEmail(
  sellerName: string,
  orderId: string,
  buyerName: string,
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    size?: string | null;
  }>,
  totalAmount: number,
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    areaCode: string;
  }
) {
  const subject = `🎉 New Order Received - #${orderId.slice(0, 8)}`;
  
  const itemsText = orderItems
    .map(item => `- ${item.productName}${item.size ? ` (Size: ${item.size})` : ''} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');
  
  const text = `
Hello ${sellerName},

Great news! You have a new order!

ORDER DETAILS
Order ID: #${orderId.slice(0, 8)}
Customer: ${buyerName}
Order Date: ${new Date().toLocaleDateString()}

ITEMS SOLD
${itemsText}

TOTAL REVENUE: $${totalAmount.toFixed(2)}

SHIPPING TO
${shippingAddress.firstName} ${shippingAddress.lastName}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.areaCode}
${shippingAddress.country}

NEXT STEPS
1. Review the order details
2. Prepare items for shipment
3. Update order status when shipped

Manage Order: ${APP_URL}/dashboard/orders

Best regards,
The ${APP_NAME} Team
  `.trim();

  const htmlItems = orderItems
    .map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="font-weight: 600; color: #333;">${item.productName}</div>
          ${item.size ? `<div style="font-size: 13px; color: #666; margin-top: 4px;">Size: ${item.size}</div>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #333;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 40px 30px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">New Order Received!</h1>
          <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">You've made a sale</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
            Hello <strong>${sellerName}</strong>,
          </p>
          <p style="margin: 0 0 30px 0; color: #666; font-size: 15px; line-height: 1.6;">
            Congratulations! You have a new order from <strong>${buyerName}</strong>. Please prepare the items for shipment.
          </p>

          <!-- Order Info Box -->
          <div style="background-color: #f0fdf4; border-left: 4px solid #22C55E; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666; font-size: 14px;">Order Number:</span>
              <strong style="color: #333; font-size: 14px;">#${orderId.slice(0, 8)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666; font-size: 14px;">Customer:</span>
              <strong style="color: #333; font-size: 14px;">${buyerName}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-size: 14px;">Order Date:</span>
              <strong style="color: #333; font-size: 14px;">${new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          <!-- Order Items -->
          <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; font-weight: 700;">Items Sold</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase;">Item</th>
                <th style="padding: 12px; text-align: center; font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase;">Qty</th>
                <th style="padding: 12px; text-align: right; font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${htmlItems}
            </tbody>
          </table>

          <!-- Total Revenue -->
          <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <div style="color: #666; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Total Revenue</div>
            <div style="color: #22C55E; font-size: 32px; font-weight: 700;">$${totalAmount.toFixed(2)}</div>
          </div>

          <!-- Shipping Address -->
          <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 700;">Ship To</h3>
            <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.6;">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br/>
              ${shippingAddress.address}<br/>
              ${shippingAddress.city}, ${shippingAddress.areaCode}<br/>
              ${shippingAddress.country}
            </p>
          </div>

          <!-- Next Steps -->
          <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 700;">📋 Next Steps</h3>
            <ol style="margin: 0; padding-left: 20px; color: #78350f; font-size: 15px; line-height: 1.8;">
              <li>Review the order details carefully</li>
              <li>Prepare the items for shipment</li>
              <li>Update the order status when shipped</li>
              <li>Add tracking information for the customer</li>
            </ol>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard/orders" 
               style="display: inline-block; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: #ffffff; 
                      padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Manage Order
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0; color: #999; font-size: 13px;">
            This email was sent because you received a new order on ${APP_NAME}
          </p>
          <p style="margin: 0; color: #666; font-size: 14px; font-weight: 600;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, text, html };
}