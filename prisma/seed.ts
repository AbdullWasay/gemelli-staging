import { PrismaClient, Role } from "@prisma/client";

// Define the NotificationCategory enum since it might not be exported by Prisma
enum NotificationCategory {
  PRODUCT_UPDATES = "PRODUCT_UPDATES",
  CAMPAIGN_ALERTS = "CAMPAIGN_ALERTS",
  SALES_INSIGHTS = "SALES_INSIGHTS",
  STOCK_ALERTS = "STOCK_ALERTS",
}
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Check if the seller account already exists
  let seller = await prisma.user.findUnique({
    where: {
      email: "seller@gemelli.com",
    },
  });

  // If seller doesn't exist, create the account
  if (!seller) {
    console.log("Creating seller account...");
    // Hash the password
    const hashedPassword = await bcrypt.hash("password", 10);

    seller = await prisma.user.create({
      data: {
        email: "seller@gemelli.com",
        password: hashedPassword,
        name: "Gemelli Seller",
        role: Role.SELLER,
        store: {
          create: {
            storeName: "Gemelli Store",
            storeCategory: "Fashion",
            storeWebsite: "https://gemellistore.com",
          },
        },
      },
    });
    console.log(`Created seller account with ID: ${seller.id}`);
  } else {
    console.log(`Seller account already exists with ID: ${seller.id}`);
  }

  // Add dummy products if none exist for this seller
  const productCount = await prisma.product.count({
    where: {
      sellerId: seller.id,
    },
  });

  if (productCount === 0) {
    console.log("Creating dummy products...");

    // Create products with their expanded attributes
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Modern Wrist Watch",
          description: "Elegant wrist watch with modern design",
          price: 149.99,
          inventory: 25,
          category: "Electronics, Wearables",
          taxRate: "10%",
          discountPrice: 129.99,
          onSale: true,
          sku: "WATCH-001",
          trackInventory: "Yes",
          lowStockAlert: 5,
          size: "Medium",
          color: "Black",
          material: "Metal",
          length: 2.5,
          width: 2.5,
          height: 0.8,
          weight: 0.15,
          seoTitle: "Modern Elegant Wrist Watch | Premium Design",
          metaDescription:
            "Discover our elegant modern wrist watch with premium design, perfect for any occasion. Long battery life and water resistance.",
          productTags: "watch, wearable, premium, elegant",
          visibility: "Public",
          status: "Published",
          sellerId: seller.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Wireless Earbuds",
          description: "Premium sound quality wireless earbuds",
          price: 89.99,
          inventory: 5,
          category: "Electronics, Wearables",
          taxRate: "10%",
          discountPrice: 79.99,
          onSale: true,
          sku: "EARBUDS-001",
          trackInventory: "Yes",
          lowStockAlert: 3,
          size: "Small",
          color: "White",
          material: "Plastic",
          length: 5.0,
          width: 3.0,
          height: 2.0,
          weight: 0.05,
          seoTitle: "Premium Wireless Earbuds | Superior Sound Quality",
          metaDescription:
            "Experience crystal clear sound with our premium wireless earbuds. Long battery life and comfortable fit for extended use.",
          productTags: "earbuds, wireless, audio, premium",
          visibility: "Public",
          status: "Published",
          sellerId: seller.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Smart Speaker",
          description: "Voice-controlled smart speaker with premium sound",
          price: 129.99,
          inventory: 15,
          category: "Electronics",
          taxRate: "10%",
          discountPrice: null,
          onSale: false,
          sku: "SPEAKER-001",
          trackInventory: "Yes",
          lowStockAlert: 5,
          size: "Medium",
          color: "Black",
          material: "Plastic",
          length: 10.0,
          width: 10.0,
          height: 15.0,
          weight: 0.8,
          seoTitle: "Smart Voice-Controlled Speaker | Premium Sound Quality",
          metaDescription:
            "Control your music with voice commands using our premium smart speaker. Enjoy rich, room-filling sound and smart home integration.",
          productTags: "speaker, smart home, voice control, premium audio",
          visibility: "Public",
          status: "Published",
          sellerId: seller.id,
        },
      }),
    ]);

    console.log("Creating product images...");

    // Add multiple images for each product
    await Promise.all([
      // Images for Modern Wrist Watch
      prisma.productImage.create({
        data: {
          url: "/assets/ProductImage/prod1.png",
          isPrimary: true,
          order: 0,
          productId: products[0].id,
        },
      }),
      prisma.productImage.create({
        data: {
          url: "/assets/ProductImage/watch2.png",
          isPrimary: false,
          order: 1,
          productId: products[0].id,
        },
      }),

      // Images for Wireless Earbuds
      prisma.productImage.create({
        data: {
          url: "/assets/ProductImage/prod2.png",
          isPrimary: true,
          order: 0,
          productId: products[1].id,
        },
      }),

      // Images for Smart Speaker
      prisma.productImage.create({
        data: {
          url: "/assets/ProductImage/image5.png",
          isPrimary: true,
          order: 0,
          productId: products[2].id,
        },
      }),
      prisma.productImage.create({
        data: {
          url: "/assets/ProductImage/micro.png",
          isPrimary: false,
          order: 1,
          productId: products[2].id,
        },
      }),
    ]);
  }

  // Delete existing notifications for clean slate
  await prisma.notification.deleteMany({
    where: {
      userId: seller.id,
    },
  });

  console.log("Creating notifications...");

  // Create a range of dates for the notifications
  const now = new Date();
  const getDateMinusDays = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date;
  };

  // Create notifications
  await prisma.notification.createMany({
    data: [
      // SALES_INSIGHTS notifications
      {
        message:
          "Modern Wrist Watch was viewed 100 times today! Increase its visibility by running a campaign.",
        category: NotificationCategory.SALES_INSIGHTS,
        userId: seller.id,
        actionText: "PROMOTE NOW",
        actionBgColor: "bg-gradient-to-r from-amber-500 to-green-500",
        createdAt: getDateMinusDays(0), // Today
        isRead: false,
      },
      {
        message: "Your store traffic increased by 25% this week. Great job!",
        category: NotificationCategory.SALES_INSIGHTS,
        userId: seller.id,
        actionText: "VIEW ANALYTICS",
        actionBgColor: "bg-gradient-to-r from-amber-500 to-green-500",
        createdAt: getDateMinusDays(2),
        isRead: true,
      },

      // CAMPAIGN_ALERTS notifications
      {
        message:
          'Your ad campaign for "Summer Sale" expires in 2 days. Extend now to keep the momentum!',
        category: NotificationCategory.CAMPAIGN_ALERTS,
        userId: seller.id,
        actionText: "EXTEND CAMPAIGN",
        actionBgColor: "bg-[linear-gradient(90deg,_#A514FA_0%,_#49C8F2_100%)]",
        createdAt: getDateMinusDays(1),
        isRead: false,
      },
      {
        message:
          'New promotional opportunity available: "Back to School" campaign is now open for registration.',
        category: NotificationCategory.CAMPAIGN_ALERTS,
        userId: seller.id,
        actionText: "JOIN NOW",
        actionBgColor: "bg-[linear-gradient(90deg,_#A514FA_0%,_#49C8F2_100%)]",
        createdAt: getDateMinusDays(5),
        isRead: true,
      },

      // STOCK_ALERTS notifications
      {
        message:
          'Stock running low: "Wireless Earbuds" only 5 units left. Restock to meet demand.',
        category: NotificationCategory.STOCK_ALERTS,
        userId: seller.id,
        actionText: "ORDER STOCK",
        actionBgColor:
          "bg-[linear-gradient(104deg,_#FF8A00_-20.06%,_#FF3A44_109.05%)]",
        createdAt: getDateMinusDays(0), // Today
        isRead: false,
      },
      {
        message:
          'Inventory alert: "Smart Speaker" is selling quickly. Consider restocking soon.',
        category: NotificationCategory.STOCK_ALERTS,
        userId: seller.id,
        actionText: "REVIEW INVENTORY",
        actionBgColor:
          "bg-[linear-gradient(104deg,_#FF8A00_-20.06%,_#FF3A44_109.05%)]",
        createdAt: getDateMinusDays(3),
        isRead: true,
      },

      // PRODUCT_UPDATES notifications
      {
        message:
          'New review added for "Modern Wrist Watch": 4.5★ "Amazing quality and design!"',
        category: NotificationCategory.PRODUCT_UPDATES,
        userId: seller.id,
        actionText: "VIEW REVIEW",
        actionBgColor: "bg-[linear-gradient(90deg,_#F94A57_0%,_#5C67F8_100%)]",
        createdAt: getDateMinusDays(1),
        isRead: false,
      },
      {
        message:
          'Product category "Electronics" has been trending this week. Consider adding more products.',
        category: NotificationCategory.PRODUCT_UPDATES,
        userId: seller.id,
        actionText: "ADD PRODUCTS",
        actionBgColor: "bg-[linear-gradient(90deg,_#F94A57_0%,_#5C67F8_100%)]",
        createdAt: getDateMinusDays(4),
        isRead: true,
      },

      // More notifications for scrolling/pagination testing
      {
        message: "Your store has been featured in our weekly newsletter!",
        category: NotificationCategory.SALES_INSIGHTS,
        userId: seller.id,
        actionText: "SEE FEATURE",
        actionBgColor: "bg-gradient-to-r from-amber-500 to-green-500",
        createdAt: getDateMinusDays(6),
        isRead: true,
      },
      {
        message: "New order received! Order #12345 is awaiting processing.",
        category: NotificationCategory.SALES_INSIGHTS,
        userId: seller.id,
        actionText: "PROCESS ORDER",
        actionBgColor: "bg-gradient-to-r from-amber-500 to-green-500",
        createdAt: getDateMinusDays(0), // Today
        isRead: false,
      },
      {
        message:
          "Price alert: A competitor has lowered prices on similar products.",
        category: NotificationCategory.PRODUCT_UPDATES,
        userId: seller.id,
        actionText: "REVIEW PRICING",
        actionBgColor: "bg-[linear-gradient(90deg,_#F94A57_0%,_#5C67F8_100%)]",
        createdAt: getDateMinusDays(2),
        isRead: false,
      },
      {
        message:
          "Shipping promotion opportunity: Free shipping campaign is available.",
        category: NotificationCategory.CAMPAIGN_ALERTS,
        userId: seller.id,
        actionText: "ACTIVATE",
        actionBgColor: "bg-[linear-gradient(90deg,_#A514FA_0%,_#49C8F2_100%)]",
        createdAt: getDateMinusDays(7),
        isRead: true,
      },
    ],
  });

  console.log(`Created notifications for seller: ${seller.email}`);

  // Check if subscription plans already exist
  const plansCount = await prisma.subscriptionPlan.count();

  if (plansCount === 0) {
    console.log("Creating subscription plans...");

    // Create subscription plans based on the plans defined in SubscriptionPlan.tsx
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          title: "FREE PLAN", // From plan.name
          description: "Nibh commodo placerat mattis quam morbi lacus.", // From plan.subtitle
          price: 0, // From plan.price
          interval: "month",
          features: JSON.stringify({
            "Key Features": ["List up to 10 products."],
            "Limited access to AI tools:": [
              "Product description generation.",
              "Price optimization.",
            ],
          }),
          maxProducts: 10,
          isAIEnabled: true,
          isAdvancedAIEnabled: false,
          isCustomizable: false,
          maxCampaigns: 1,
          maxFileStorage: 100,
          prioritySupport: false,
        },
        {
          title: "STANDARD PLAN", // From plan.name
          description: "Nibh commodo placerat mattis quam morbi lacus.", // From plan.subtitle
          price: 8, // From plan.price
          interval: "month",
          features: JSON.stringify({
            "Key Features": [
              "List up to 50 products.",
              "Full access to AI tools.",
              "Advanced sales statistics for better insights.",
            ],
          }),
          maxProducts: 50,
          isAIEnabled: true,
          isAdvancedAIEnabled: false,
          isCustomizable: false,
          maxCampaigns: 3,
          maxFileStorage: 500,
          prioritySupport: false,
        },
        {
          title: "PRO PLAN", // From plan.name
          description: "Nibh commodo placerat mattis quam morbi lacus.", // From plan.subtitle
          price: 15, // From plan.price
          interval: "month",
          features: JSON.stringify({
            "Key Features": ["Unlimited products."],
            "Premium AI features:": [
              "3D image generation.",
              "Advanced marketing recommendations.",
            ],
          }),
          maxProducts: 1000, // Practically unlimited
          isAIEnabled: true,
          isAdvancedAIEnabled: true,
          isCustomizable: false,
          maxCampaigns: 10,
          maxFileStorage: 2048, // 2GB
          prioritySupport: true,
        },
        {
          title: "GO PRO", // From plan.name
          description: "Nibh commodo placerat mattis quam morbi lacus.", // From plan.subtitle
          price: 30, // From plan.price
          interval: "month",
          features: JSON.stringify({
            "Key Features": [
              "Fully customizable solution tailored to your needs.",
              "Dedicated AI consultancy fee.",
              "Personalized insights.",
              "Enterprise-level features like ERP and CRM.",
            ],
          }),
          maxProducts: 5000, // Enterprise level
          isAIEnabled: true,
          isAdvancedAIEnabled: true,
          isCustomizable: true,
          maxCampaigns: -1, // Unlimited campaigns
          maxFileStorage: 10240, // 10GB
          prioritySupport: true,
        },
      ],
    });

    console.log("Subscription plans created successfully!");

    // Get the free plan to assign to seller
    const freePlan = await prisma.subscriptionPlan.findFirst({
      where: { title: "FREE PLAN" },
    });

    if (freePlan && seller) {
      // Check if seller already has a subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: { userId: seller.id },
      });

      if (!existingSubscription) {
        // Calculate next billing date (1 month from now)
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        // Create a subscription for the seller
        await prisma.subscription.create({
          data: {
            status: "ACTIVE",
            isAutoRenew: true,
            paymentMethod: "Credit Card",
            lastPaymentDate: new Date(),
            nextBillingDate: nextBillingDate,
            userId: seller.id,
            subscriptionPlanId: freePlan.id,
          },
        });

        console.log(`Created free subscription for seller: ${seller.email}`);
      } else {
        console.log(`Seller already has a subscription, skipping creation.`);
      }
    }
  } else {
    console.log("Subscription plans already exist, skipping creation.");
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
