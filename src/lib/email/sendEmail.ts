/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/email/sendEmail.ts
import sgMail from "@sendgrid/mail";
import { emailTemplates } from "@/lib/templates/notificationTemplates";
import {
  subscriptionCreatedTemplate,
  subscriptionUpgradedTemplate,
  subscriptionExpiringSoonTemplate,
  subscriptionExpiredTemplate,
  subscriptionLimitReachedTemplate,
  subscriptionLimitWarningTemplate,
  subscriptionCancelledTemplate,
} from "@/lib/templates/subscription-templates";
import {
  lowStockAlertTemplate,
  outOfStockAlertTemplate,
  weeklyStockSummaryTemplate,
} from "@/lib/templates/low-stock-templates";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailParams {
  to: string;
  subject: string;
  template: string; // Changed from keyof typeof emailTemplates to string for flexibility
  data: any;
}

export async function sendEmail({
  to,
  subject,
  template,
  data,
}: SendEmailParams): Promise<void> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error("❌ SendGrid API key is not configured");
      return;
    }
    if (!process.env.SENDGRID_FROM_EMAIL) {
      console.error("❌ SendGrid from email is not configured");
      return;
    }

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Template: ${template}`);
    console.log(`📧 Subject: ${subject}`);

    let html: string;

    // Check subscription templates first, then fall back to regular templates
    switch (template) {
      // Subscription templates
      case "subscriptionCreated":
        html = subscriptionCreatedTemplate(data);
        break;
      case "subscriptionUpgraded":
        html = subscriptionUpgradedTemplate(data);
        break;
      case "subscriptionExpiringSoon":
        html = subscriptionExpiringSoonTemplate(data);
        break;
      case "subscriptionExpired":
        html = subscriptionExpiredTemplate(data);
        break;
      case "subscriptionLimitReached":
        html = subscriptionLimitReachedTemplate(data);
        break;
      case "subscriptionLimitWarning":
        html = subscriptionLimitWarningTemplate(data);
        break;
      case "subscriptionCancelled":
        html = subscriptionCancelledTemplate(data);
        break;
      
      // Low Stock templates
      case "lowStockAlert":
        html = lowStockAlertTemplate(data);
        break;

      case "outOfStockAlert":
        html = outOfStockAlertTemplate(data);
        break;

      case "weeklyStockSummary":
        html = weeklyStockSummaryTemplate(data);
        break;

      default:
        const templateFn = emailTemplates[template as keyof typeof emailTemplates];
        if (!templateFn) {
          throw new Error(`Template "${template}" not found`);
        }
        html = templateFn(data);
    }

    // Send email
    const result = await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`📊 SendGrid Response:`, result[0].statusCode);
  } catch (error: any) {
    console.error("❌ Error sending email:", error);

    // Log more details about the error
    if (error.response) {
      console.error("SendGrid error response:", {
        statusCode: error.response.statusCode,
        body: error.response.body,
      });
    }

    // Don't throw - we don't want email failures to break the main flow
    // But log it so we can debug
  }
}