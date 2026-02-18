// src/redux/features/user/subscriptionLimitsApi.ts
import { baseApi } from "@/redux/api/baseApi";

export interface SubscriptionLimits {
  products: {
    current: number;
    max: number;
    remaining: number;
    canAdd: boolean;
    percentUsed: number;
  };
  campaigns: {
    current: number;
    max: number;
    remaining: number;
    canAdd: boolean;
    percentUsed: number;
  };
  storage: {
    current: number;
    max: number;
    remaining: number;
    canAdd: boolean;
    percentUsed: number;
    unit: string;
  };
  features: {
    ai: boolean;
    advancedAI: boolean;
    customization: boolean;
    prioritySupport: boolean;
  };
}

export const subscriptionLimitsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionLimits: builder.query<SubscriptionLimits, void>({
      query: () => ({
        url: "/api/user/subscription-limits",
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: SubscriptionLimits;
      }) => response.data,
      providesTags: ["Subscriptions"],
    }),
  }),
});

export const { useGetSubscriptionLimitsQuery } = subscriptionLimitsApi;