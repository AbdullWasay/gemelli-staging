// lib/email-service.ts
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL!;
const APP_NAME = 'Gemelli Store';
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send email using SendGrid
 */
export async function sendEmail({ to, subject, text, html }: EmailParams) {
  try {
    const msg = {
      to,
      from: SENDER_EMAIL,
      subject,
      text,
      html: html || text,
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Welcome Email Template
 */
export function getWelcomeEmailContent(userName: string) {
  const subject = `Welcome to ${APP_NAME}! 🎉`;
  
  const text = `
Hello ${userName},

Welcome to ${APP_NAME}! We're thrilled to have you join our community.

Your account has been successfully created, and you're all set to start selling your products.

Here's what you can do next:
- Set up your store profile
- Add your first products
- Configure your notification preferences
- Explore our AI-powered tools

If you have any questions, our support team is here to help.

Best regards,
The ${APP_NAME} Team

Visit your dashboard: ${APP_URL}/dashboard
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4046DE;">Welcome to ${APP_NAME}! 🎉</h1>
      <p>Hello ${userName},</p>
      <p>Welcome to ${APP_NAME}! We're thrilled to have you join our community.</p>
      <p>Your account has been successfully created, and you're all set to start selling your products.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Here's what you can do next:</h3>
        <ul style="line-height: 1.8;">
          <li>Set up your store profile</li>
          <li>Add your first products</li>
          <li>Configure your notification preferences</li>
          <li>Explore our AI-powered tools</li>
        </ul>
      </div>
      
      <p>If you have any questions, our support team is here to help.</p>
      
      <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #4046DE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Visit Your Dashboard
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Best regards,<br>
        The ${APP_NAME} Team
      </p>
    </div>
  `;

  return { subject, text, html };
}

/**
 * Order Confirmation Email Template
 */
export function getOrderConfirmationEmailContent(
  userName: string,
  orderId: string,
  orderTotal: number,
  orderItems: Array<{ name: string; quantity: number; price: number }>
) {
  const subject = `Order Confirmation - #${orderId}`;
  
  const itemsList = orderItems
    .map(item => `- ${item.name} (Qty: ${item.quantity}) - $${item.price.toFixed(2)}`)
    .join('\n');
  
  const text = `
Hello ${userName},

Thank you for your order! We've received your order and it's being processed.

Order ID: #${orderId}
Order Total: $${orderTotal.toFixed(2)}

Items:
${itemsList}

We'll send you another email once your order has been shipped.

View your order: ${APP_URL}/dashboard/orders/${orderId}

Best regards,
The ${APP_NAME} Team
  `.trim();

  const htmlItems = orderItems
    .map(
      item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4046DE;">Order Confirmation</h1>
      <p>Hello ${userName},</p>
      <p>Thank you for your order! We've received your order and it's being processed.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Order Total:</strong> $${orderTotal.toFixed(2)}</p>
        
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #4046DE; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${htmlItems}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold;">
              <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">$${orderTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <p>We'll send you another email once your order has been shipped.</p>
      
      <a href="${APP_URL}/dashboard/orders/${orderId}" style="display: inline-block; background-color: #4046DE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        View Your Order
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Best regards,<br>
        The ${APP_NAME} Team
      </p>
    </div>
  `;

  return { subject, text, html };
}

/**
 * Product Update Notification Email
 */
export function getProductUpdateEmailContent(
  userName: string,
  productName: string,
  updateMessage: string
) {
  const subject = `Product Update: ${productName}`;
  
  const text = `
Hello ${userName},

${updateMessage}

Product: ${productName}

View product details: ${APP_URL}/dashboard/products

Best regards,
The ${APP_NAME} Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #F94A57;">Product Update</h1>
      <p>Hello ${userName},</p>
      <p>${updateMessage}</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Product:</strong> ${productName}</p>
      </div>
      
      <a href="${APP_URL}/dashboard/products" style="display: inline-block; background: linear-gradient(90deg, #F94A57 0%, #5C67F8 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        View Product Details
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Best regards,<br>
        The ${APP_NAME} Team
      </p>
    </div>
  `;

  return { subject, text, html };
}

/**
 * Campaign Alert Email
 */
export function getCampaignAlertEmailContent(
  userName: string,
  campaignName: string,
  alertMessage: string,
  actionUrl?: string
) {
  const subject = `Campaign Alert: ${campaignName}`;
  
  const text = `
Hello ${userName},

${alertMessage}

Campaign: ${campaignName}

${actionUrl ? `Take action: ${actionUrl}` : ''}

Best regards,
The ${APP_NAME} Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #A514FA;">Campaign Alert</h1>
      <p>Hello ${userName},</p>
      <p>${alertMessage}</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Campaign:</strong> ${campaignName}</p>
      </div>
      
      ${
        actionUrl
          ? `<a href="${actionUrl}" style="display: inline-block; background: linear-gradient(90deg, #A514FA 0%, #49C8F2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Take Action
      </a>`
          : ''
      }
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Best regards,<br>
        The ${APP_NAME} Team
      </p>
    </div>
  `;

  return { subject, text, html };
}

/**
 * Sales Insights Email
 */
export function getSalesInsightsEmailContent(
  userName: string,
  insightMessage: string,
  metrics?: {
    views?: number;
    sales?: number;
    revenue?: number;
  }
) {
  const subject = 'Sales Insights Update';
  
  const text = `
Hello ${userName},

${insightMessage}

${metrics ? `
Metrics:
${metrics.views ? `- Views: ${metrics.views}` : ''}
${metrics.sales ? `- Sales: ${metrics.sales}` : ''}
${metrics.revenue ? `- Revenue: $${metrics.revenue.toFixed(2)}` : ''}
` : ''}

View analytics: ${APP_URL}/dashboard/analytics

Best regards,
The ${APP_NAME} Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #FFA500;">Sales Insights</h1>
      <p>Hello ${userName},</p>
      <p>${insightMessage}</p>
      
      ${
        metrics
          ? `
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Metrics:</h3>
        <ul style="line-height: 1.8;">
          ${metrics.views ? `<li>Views: ${metrics.views}</li>` : ''}
          ${metrics.sales ? `<li>Sales: ${metrics.sales}</li>` : ''}
          ${metrics.revenue ? `<li>Revenue: $${metrics.revenue.toFixed(2)}</li>` : ''}
        </ul>
      </div>
      `
          : ''
      }
      
      <a href="${APP_URL}/dashboard/analytics" style="display: inline-block; background: linear-gradient(90deg, #FFA500 0%, #22C55E 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        View Analytics
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Best regards,<br>
        The ${APP_NAME} Team
      </p>
    </div>
  `;

  return { subject, text, html };
}

/**
 * Stock Alert Email
 */
export function getStockAlertEmailContent(
  userName: string,
  productName: string,
  currentStock: number,
  lowStockThreshold: number
) {
  const subject = `Low Stock Alert: ${productName}`;
  
  const text = `
Hello ${userName},

Your product "${productName}" is running low on stock!

Current Stock: ${currentStock} units
Low Stock Threshold: ${lowStockThreshold} units

Please restock soon to avoid running out of inventory.

Manage inventory: ${APP_URL}/dashboard/products

Best regards,
The ${APP_NAME} Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #FF3A44;">Low Stock Alert</h1>
      <p>Hello ${userName},</p>
      <p>Your product <strong>"${productName}"</strong> is running low on stock!</p>
      
      <div style="background-color: #fff3cd; border-left: 4px solid #FF3A44; padding: 20px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Current Stock:</strong> ${currentStock} units</p>
        <p style="margin: 10px 0 0 0;"><strong>Low Stock Threshold:</strong> ${lowStockThreshold} units</p>
      </div>
      
      <p>Please restock soon to avoid running out of inventory.</p>
      
      <a href="${APP_URL}/dashboard/products" style="display: inline-block; background: linear-gradient(104deg, #FF8A00 -20.06%, #FF3A44 109.05%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Manage Inventory
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Best regards,<br>
        The ${APP_NAME} Team
      </p>
    </div>
  `;

  return { subject, text, html };
}