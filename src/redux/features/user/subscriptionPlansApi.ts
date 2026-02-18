import { baseApi } from "@/redux/api/baseApi";
import { SubscriptionPlanResponse } from "@/types/api";

export const subscriptionPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<
      {
        success: boolean;
        message: string;
        data: SubscriptionPlanResponse[];
      },
      void
    >({
      query: () => ({
        url: "/api/subscription-plans",
        method: "GET",
      }),
    }),

    getSubscriptionPlanById: builder.query<
      {
        success: boolean;
        message: string;
        data: SubscriptionPlanResponse;
      },
      string
    >({
      query: (id) => ({
        url: `/api/subscription-plans/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSubscriptionPlansQuery, useGetSubscriptionPlanByIdQuery } =
  subscriptionPlansApi;
