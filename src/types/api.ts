import {
  User,
  Store,
  SubscriptionPlan,
  Subscription,
  SubscriptionStatus,
} from "@prisma/client";

// Define Address type manually since it's new and may not be in the client yet
export interface Address {
  id: string;
  country: string;
  cityState: string;
  postalCode: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
  storeId?: string | null;
}

// User types
export type UserWithRelations = User & {
  addresses?: Address[];
  store?: Store | null;
  subscriptions?: Subscription[];
};

// Store types
export type StoreWithAddresses = Store & {
  addresses?: Address[];
};

// Response types
export type UserResponse = Omit<UserWithRelations, "password"> & {
  store?: StoreWithAddresses | null;
  activeSubscription?: SubscriptionWithPlan | null;
};

// Token payload type
export interface TokenPayload {
  id: string;
  role?: string;
  email?: string;
}

// Notification Settings types
export interface NotificationSettings {
  id: string;
  newOrders: boolean;
  aiRecommendations: boolean;
  promotionsDiscounts: boolean;
  emailChannel: boolean;
  smsChannel: boolean;
  appNotifications: boolean;
  marketingEmails: boolean;
  generalUpdates: boolean;
  orderReminders: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Prisma operation parameter types for notification settings
export interface FindUniqueNotificationParams {
  where: {
    userId: string;
  };
}

export interface CreateNotificationParams {
  data: {
    userId: string;
    newOrders?: boolean;
    aiRecommendations?: boolean;
    promotionsDiscounts?: boolean;
    emailChannel?: boolean;
    smsChannel?: boolean;
    appNotifications?: boolean;
    marketingEmails?: boolean;
    generalUpdates?: boolean;
    orderReminders?: boolean;
  };
}

export interface UpsertNotificationParams {
  where: {
    userId: string;
  };
  update: {
    newOrders?: boolean;
    aiRecommendations?: boolean;
    promotionsDiscounts?: boolean;
    emailChannel?: boolean;
    smsChannel?: boolean;
    appNotifications?: boolean;
    marketingEmails?: boolean;
    generalUpdates?: boolean;
    orderReminders?: boolean;
  };
  create: {
    userId: string;
    newOrders?: boolean;
    aiRecommendations?: boolean;
    promotionsDiscounts?: boolean;
    emailChannel?: boolean;
    smsChannel?: boolean;
    appNotifications?: boolean;
    marketingEmails?: boolean;
    generalUpdates?: boolean;
    orderReminders?: boolean;
  };
}

// Subscription Plan types
export interface SubscriptionPlanFeatures {
  [category: string]: string[];
}

export type SubscriptionPlanResponse = SubscriptionPlan & {
  features: SubscriptionPlanFeatures;
};

// Subscription types
export type SubscriptionWithPlan = Subscription & {
  subscriptionPlan: SubscriptionPlan;
};

export interface SubscriptionResponse {
  id: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
  isAutoRenew: boolean;
  paymentMethod?: string | null;
  lastPaymentDate?: Date | null;
  nextBillingDate?: Date | null;
  subscriptionPlan: SubscriptionPlanResponse;
  createdAt: Date;
  updatedAt: Date;
}
