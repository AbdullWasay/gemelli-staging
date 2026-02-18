// src/lib/templates/notificationTemplates.ts

export const emailTemplates = {
  // Seller: New Order Notification
  newOrderSeller: (data: {
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    itemCount: number;
    orderUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 New Order Received!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #333333;">
                      Great news! You have received a new order.
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" style="width: 100%;">
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; color: #666;">Order Number:</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #333; text-align: right;">#${data.orderNumber}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; color: #666;">Customer:</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #333; text-align: right;">${data.customerName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; color: #666;">Items:</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #333; text-align: right;">${data.itemCount}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-top: 1px solid #ddd; font-size: 16px; font-weight: bold; color: #333;">Total:</td>
                              <td style="padding: 8px 0; border-top: 1px solid #ddd; font-size: 18px; font-weight: bold; color: #667eea; text-align: right;">$${data.totalAmount.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${data.orderUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">View Order Details</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0 0; font-size: 14px; line-height: 20px; color: #666;">
                      Process this order as soon as possible to ensure customer satisfaction.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
                      You received this email because you have new order notifications enabled.
                      <br>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/notifications" style="color: #667eea;">Manage notification preferences</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,

  // Seller: Low Stock Alert
  lowStockAlert: (data: {
    productName: string;
    currentStock: number;
    threshold: number;
    productUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Low Stock Alert</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; background: linear-gradient(104deg, #FF8A00 -20%, #FF3A44 100%);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">⚠️ Low Stock Alert</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #333333;">
                      Your product inventory is running low and needs attention.
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff5f5; border-left: 4px solid #FF3A44; border-radius: 4px; margin: 20px 0;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px; font-size: 18px; font-weight: bold; color: #333;">${data.productName}</p>
                          <p style="margin: 0; font-size: 14px; color: #666;">
                            Current Stock: <strong style="color: #FF3A44; font-size: 16px;">${data.currentStock} units</strong>
                            <br>
                            Threshold: ${data.threshold} units
                          </p>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${data.productUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(104deg, #FF8A00 -20%, #FF3A44 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Restock Now</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0 0; font-size: 14px; line-height: 20px; color: #666;">
                      Keep your inventory stocked to avoid missed sales opportunities.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
                      You received this email because you have stock alert notifications enabled.
                      <br>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/notifications" style="color: #FF8A00;">Manage notification preferences</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,

  // Seller: Sales Insight
  salesInsight: (data: {
    title: string;
    metric: string;
    value: string;
    change?: string;
    actionUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sales Insight</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; background: linear-gradient(90deg, #F59E0B 0%, #10B981 100%);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">📊 ${data.title}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 24px; color: #333333;">
                      Here's an important insight about your store's performance:
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #FEF3C7 0%, #D1FAE5 100%); border-radius: 8px; margin: 20px 0;">
                      <tr>
                        <td style="padding: 30px; text-align: center;">
                          <p style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">${data.metric}</p>
                          <p style="margin: 0; font-size: 36px; font-weight: bold; color: #059669;">${data.value}</p>
                          ${data.change ? `<p style="margin: 10px 0 0; font-size: 16px; color: #10B981; font-weight: 600;">${data.change}</p>` : ''}
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${data.actionUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(90deg, #F59E0B 0%, #10B981 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">View Full Analytics</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0 0; font-size: 14px; line-height: 20px; color: #666;">
                      Stay on top of your sales performance with regular insights.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
                      You received this email because you have sales insight notifications enabled.
                      <br>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/notifications" style="color: #F59E0B;">Manage notification preferences</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,

  // Seller: Product Update
  productUpdate: (data: {
    title: string;
    description: string;
    actionUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; background: linear-gradient(90deg, #F94A57 0%, #5C67F8 100%);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 ${data.title}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #333333;">
                      ${data.description}
                    </p>
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${data.actionUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(90deg, #F94A57 0%, #5C67F8 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Learn More</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/notifications" style="color: #F94A57;">Manage notification preferences</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,

  // Buyer: Order Confirmation
  orderConfirmationBuyer: (data: {
    orderNumber: string;
    totalAmount: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    shippingAddress: string;
    orderUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✓ Order Confirmed!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #333333;">
                      Thank you for your order! We've received it and will start processing it soon.
                    </p>
                    <p style="margin: 0 0 30px; font-size: 14px; color: #666;">
                      Order Number: <strong style="color: #667eea;">#${data.orderNumber}</strong>
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                      <tr>
                        <td colspan="3" style="padding: 10px 0; border-bottom: 2px solid #667eea; font-weight: bold; color: #333;">Order Items</td>
                      </tr>
                      ${data.items.map(item => `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #333;">${item.name}</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #666; text-align: center;">x${item.quantity}</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #333; text-align: right;">$${item.price.toFixed(2)}</td>
                        </tr>
                      `).join('')}
                      <tr>
                        <td colspan="2" style="padding: 15px 0; font-weight: bold; color: #333; font-size: 16px;">Total</td>
                        <td style="padding: 15px 0; font-weight: bold; color: #667eea; text-align: right; font-size: 18px;">$${data.totalAmount.toFixed(2)}</td>
                      </tr>
                    </table>
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
                      <p style="margin: 0 0 5px; font-weight: bold; color: #333;">Shipping Address:</p>
                      <p style="margin: 0; color: #666; font-size: 14px; line-height: 20px;">${data.shippingAddress}</p>
                    </div>
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${data.orderUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Track Your Order</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
                      If you have any questions, please contact our support team.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,

  // Buyer: Order Status Update
  orderStatusUpdate: (data: {
    orderNumber: string;
    status: string;
    statusMessage: string;
    trackingNumber?: string;
    orderUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">📦 Order Update</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Order #${data.orderNumber}</p>
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #333;">${data.statusMessage}</h2>
                    ${data.trackingNumber ? `
                      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
                        <p style="margin: 0 0 5px; font-weight: bold; color: #333;">Tracking Number:</p>
                        <p style="margin: 0; color: #667eea; font-size: 16px; font-family: monospace;">${data.trackingNumber}</p>
                      </div>
                    ` : ''}
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${data.orderUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">View Order Details</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
                      If you have any questions, please contact our support team.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
};