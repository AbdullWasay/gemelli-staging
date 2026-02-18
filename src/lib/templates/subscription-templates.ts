// src/lib/email/templates/subscription-templates.ts

/**
 * Email template for subscription created
 */
export const subscriptionCreatedTemplate = (data: {
  planTitle: string;
  planPrice: number;
  planInterval: string;
  startDate: string;
  endDate: string;
  features: string[];
  dashboardUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${data.planTitle}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🎉 Welcome to ${data.planTitle}!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Congratulations! Your subscription to <strong>${data.planTitle}</strong> is now active.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #667eea; margin-top: 0;">Subscription Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Plan:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${data.planTitle}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Price:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${data.planPrice} USDT / ${data.planInterval}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Start Date:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${data.startDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>Next Billing:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${data.endDate}</td>
        </tr>
      </table>
    </div>
    
    ${
      data.features.length > 0
        ? `
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #667eea; margin-top: 0;">Your Features</h3>
      <ul style="padding-left: 20px;">
        ${data.features.map((feature) => `<li style="margin: 8px 0;">${feature}</li>`).join("")}
      </ul>
    </div>
    `
        : ""
    }
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Go to Dashboard
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
      Questions? Contact our support team anytime.
    </p>
  </div>
</body>
</html>
`;

/**
 * Email template for subscription upgraded
 */
export const subscriptionUpgradedTemplate = (data: {
  oldPlanTitle: string;
  newPlanTitle: string;
  newPlanPrice: number;
  newPlanInterval: string;
  dashboardUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Upgraded</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🚀 Subscription Upgraded!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Great news! You've successfully upgraded from <strong>${data.oldPlanTitle}</strong> to <strong>${data.newPlanTitle}</strong>.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #4facfe; margin-top: 0;">New Plan Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>New Plan:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${data.newPlanTitle}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>New Price:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${data.newPlanPrice} USDT / ${data.newPlanInterval}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #2e7d32;">
        ✓ Your new features are now active and ready to use!
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Explore New Features
      </a>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email template for subscription expiring soon
 */
export const subscriptionExpiringSoonTemplate = (data: {
  planTitle: string;
  daysRemaining: number;
  expiryDate: string;
  isAutoRenew: boolean;
  dashboardUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0;">
  <title>Subscription ${data.isAutoRenew ? "Renewal" : "Expiring"} Soon</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">⏰ Subscription ${data.isAutoRenew ? "Renewal" : "Expiry"} Notice</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    ${
      data.isAutoRenew
        ? `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your <strong>${data.planTitle}</strong> subscription will automatically renew in <strong>${data.daysRemaining} days</strong> on <strong>${data.expiryDate}</strong>.
    </p>
    
    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1565c0;">
        ℹ️ Auto-renewal is enabled. Your subscription will continue uninterrupted.
      </p>
    </div>
    `
        : `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your <strong>${data.planTitle}</strong> subscription expires in <strong>${data.daysRemaining} days</strong> on <strong>${data.expiryDate}</strong>.
    </p>
    
    <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #e65100;">
        ⚠️ Auto-renewal is disabled. Renew now to keep your premium features!
      </p>
    </div>
    `
    }
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        ${data.isAutoRenew ? "Manage Subscription" : "Renew Now"}
      </a>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email template for subscription expired
 */
export const subscriptionExpiredTemplate = (data: {
  planTitle: string;
  expiryDate: string;
  upgradeUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Expired</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f2709c 0%, #ff9472 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">⌛ Subscription Expired</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your <strong>${data.planTitle}</strong> subscription expired on <strong>${data.expiryDate}</strong>.
    </p>
    
    <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #c62828;">
        Your account has been downgraded to the free plan with limited features.
      </p>
    </div>
    
    <p style="font-size: 16px;">
      Renew your subscription now to restore all your premium features and continue growing your business.
    </p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.upgradeUrl}" style="display: inline-block; background: linear-gradient(135deg, #f2709c 0%, #ff9472 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Renew Subscription
      </a>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email template for subscription limit reached
 */
export const subscriptionLimitReachedTemplate = (data: {
  limitType: string;
  currentCount: number;
  maxLimit: number;
  planTitle: string;
  upgradeUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Limit Reached</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #333; margin: 0;">🚧 ${data.limitType.charAt(0).toUpperCase() + data.limitType.slice(1)} Limit Reached</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      You've reached your ${data.limitType} limit on the <strong>${data.planTitle}</strong> plan.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <div style="font-size: 48px; font-weight: bold; color: #ff6b6b; margin-bottom: 10px;">
        ${data.currentCount} / ${data.maxLimit}
      </div>
      <p style="margin: 0; color: #666;">
        ${data.limitType}s used
      </p>
    </div>
    
    <p style="font-size: 16px;">
      Upgrade your plan to add more ${data.limitType}s and unlock additional features!
    </p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.upgradeUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Upgrade Now
      </a>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email template for subscription limit warning
 */
export const subscriptionLimitWarningTemplate = (data: {
  limitType: string;
  currentCount: number;
  maxLimit: number;
  remaining: number;
  planTitle: string;
  upgradeUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Limit Warning</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #333; margin: 0;">⚠️ Approaching ${data.limitType.charAt(0).toUpperCase() + data.limitType.slice(1)} Limit</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      You're approaching your ${data.limitType} limit on the <strong>${data.planTitle}</strong> plan.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <div style="font-size: 36px; font-weight: bold; color: #fdcb6e; margin-bottom: 10px; text-align: center;">
        ${data.remaining} remaining
      </div>
      <p style="margin: 0; color: #666; text-align: center;">
        ${data.currentCount} of ${data.maxLimit} ${data.limitType}s used
      </p>
      
      <div style="background: #eee; height: 20px; border-radius: 10px; margin-top: 15px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #ffeaa7 0%, #fdcb6e 100%); height: 100%; width: ${(data.currentCount / data.maxLimit) * 100}%; transition: width 0.3s;"></div>
      </div>
    </div>
    
    <p style="font-size: 16px;">
      Consider upgrading your plan to avoid hitting your limit!
    </p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.upgradeUrl}" style="display: inline-block; background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); color: #333; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View Plans
      </a>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email template for subscription cancelled
 */
export const subscriptionCancelledTemplate = (data: {
  planTitle: string;
  endDate?: string;
  wasAutoRenew: boolean;
  upgradeUrl: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Cancelled</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #a8a8a8 0%, #757575 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">❌ Subscription Cancelled</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your <strong>${data.planTitle}</strong> subscription has been cancelled.
    </p>
    
    ${
      data.endDate
        ? `
    <div style="background: #fff9c4; border-left: 4px solid #fbc02d; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #f57f17;">
        You'll continue to have access to your premium features until <strong>${data.endDate}</strong>.
      </p>
    </div>
    `
        : `
    <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #c62828;">
        Your premium features have been disabled immediately.
      </p>
    </div>
    `
    }
    
    <p style="font-size: 16px;">
      We're sorry to see you go! If you change your mind, you can reactivate your subscription anytime.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #667eea; margin-top: 0;">Why did you cancel?</h3>
      <p style="font-size: 14px; color: #666;">
        We'd love to hear your feedback. Your input helps us improve our service for everyone.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.upgradeUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reactivate Subscription
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
      If you need any assistance, our support team is always here to help.
    </p>
  </div>
</body>
</html>
`;

// Export all templates as a map for easy access
export const subscriptionEmailTemplates = {
  subscriptionCreated: subscriptionCreatedTemplate,
  subscriptionUpgraded: subscriptionUpgradedTemplate,
  subscriptionExpiringSoon: subscriptionExpiringSoonTemplate,
  subscriptionExpired: subscriptionExpiredTemplate,
  subscriptionLimitReached: subscriptionLimitReachedTemplate,
  subscriptionLimitWarning: subscriptionLimitWarningTemplate,
  subscriptionCancelled: subscriptionCancelledTemplate,
};