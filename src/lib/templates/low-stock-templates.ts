// src/lib/email/templates/low-stock-templates.ts

/**
 * Email template for low stock alert
 */
export const lowStockAlertTemplate = (data: {
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">⚠️ Low Stock Alert</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; color: #856404; font-weight: bold;">
        ⚠️ Your product is running low on stock!
      </p>
    </div>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Your product <strong>"${data.productName}"</strong> has reached low stock levels.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #ff6a00; margin-top: 0;">Stock Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Product:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${data.productName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Current Stock:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; color: #ff6a00; font-weight: bold;">${data.currentStock} units</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>Alert Threshold:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${data.threshold} units</td>
        </tr>
      </table>
    </div>

    <div style="background: #e8f4fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1565c0; font-size: 14px;">
        💡 <strong>Tip:</strong> Restock soon to avoid losing sales and maintain customer satisfaction.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.productUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Restock Now
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
      Act quickly to prevent stockouts and maintain your sales momentum.
    </p>
  </div>
</body>
</html>
`;

/**
 * Email template for out of stock alert
 */
export const outOfStockAlertTemplate = (data: {
  productName: string;
  sku?: string;
  productUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Out of Stock Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f44336 0%, #c62828 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🚨 URGENT: Out of Stock</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; color: #c62828; font-weight: bold; font-size: 16px;">
        🚨 CRITICAL: Product completely out of stock!
      </p>
    </div>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Your product <strong>"${data.productName}"</strong> is now completely out of stock.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <div style="font-size: 72px; color: #f44336; font-weight: bold; margin-bottom: 10px;">
        0
      </div>
      <p style="margin: 0; color: #666; font-size: 18px;">units remaining</p>
      ${data.sku ? `<p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">SKU: ${data.sku}</p>` : ''}
    </div>

    <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #e65100; font-size: 14px;">
        ⚠️ <strong>Impact:</strong> You're losing sales right now. Customers cannot purchase this product.
      </p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #f44336; margin-top: 0;">Action Required</h3>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li style="margin: 8px 0;">Restock immediately to resume sales</li>
        <li style="margin: 8px 0;">Update product status if discontinuing</li>
        <li style="margin: 8px 0;">Set up auto-reorder to prevent future stockouts</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.productUrl}" style="display: inline-block; background: linear-gradient(135deg, #f44336 0%, #c62828 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Restock Immediately
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
      Every minute counts. Restock now to avoid losing more customers.
    </p>
  </div>
</body>
</html>
`;

/**
 * Email template for weekly stock summary
 */
export const weeklyStockSummaryTemplate = (data: {
  outOfStockCount: number;
  lowStockCount: number;
  outOfStockProducts: Array<{ name: string; sku?: string | null }>;
  lowStockProducts: Array<{ name: string; currentStock: number; threshold: number }>;
  dashboardUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Stock Summary</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">📊 Weekly Stock Summary</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Here's your weekly inventory status update for products that need attention.
    </p>

    <!-- Summary Cards -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
      <div style="background: #ffebee; padding: 20px; border-radius: 8px; text-align: center;">
        <div style="font-size: 36px; font-weight: bold; color: #f44336; margin-bottom: 5px;">
          ${data.outOfStockCount}
        </div>
        <div style="color: #c62828; font-size: 14px;">Out of Stock</div>
      </div>
      
      <div style="background: #fff3e0; padding: 20px; border-radius: 8px; text-align: center;">
        <div style="font-size: 36px; font-weight: bold; color: #ff9800; margin-bottom: 5px;">
          ${data.lowStockCount}
        </div>
        <div style="color: #e65100; font-size: 14px;">Low Stock</div>
      </div>
    </div>

    ${data.outOfStockCount > 0 ? `
    <!-- Out of Stock Products -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #f44336; margin-top: 0; display: flex; align-items: center;">
        🚨 Out of Stock Items
      </h3>
      <ul style="padding-left: 0; list-style: none;">
        ${data.outOfStockProducts.slice(0, 5).map(product => `
          <li style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${product.name}</strong>
            ${product.sku ? `<span style="color: #999; font-size: 12px; margin-left: 10px;">SKU: ${product.sku}</span>` : ''}
          </li>
        `).join('')}
        ${data.outOfStockProducts.length > 5 ? `
          <li style="padding: 10px; color: #666; font-style: italic;">
            ... and ${data.outOfStockProducts.length - 5} more
          </li>
        ` : ''}
      </ul>
    </div>
    ` : ''}

    ${data.lowStockCount > 0 ? `
    <!-- Low Stock Products -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #ff9800; margin-top: 0;">
        ⚠️ Low Stock Items
      </h3>
      <ul style="padding-left: 0; list-style: none;">
        ${data.lowStockProducts.slice(0, 5).map(product => `
          <li style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
            <strong>${product.name}</strong>
            <span style="color: #ff9800; font-weight: bold;">${product.currentStock} / ${product.threshold}</span>
          </li>
        `).join('')}
        ${data.lowStockProducts.length > 5 ? `
          <li style="padding: 10px; color: #666; font-style: italic;">
            ... and ${data.lowStockProducts.length - 5} more
          </li>
        ` : ''}
      </ul>
    </div>
    ` : ''}

    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1565c0; font-size: 14px;">
        💡 <strong>Pro Tip:</strong> Set up automatic reorder points to prevent future stockouts and maintain steady inventory levels.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Manage Inventory
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
      You're receiving this weekly summary to help you stay on top of your inventory.
    </p>
  </div>
</body>
</html>
`;

// Export all templates
export const lowStockEmailTemplates = {
  lowStockAlert: lowStockAlertTemplate,
  outOfStockAlert: outOfStockAlertTemplate,
  weeklyStockSummary: weeklyStockSummaryTemplate,
};