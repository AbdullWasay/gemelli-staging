import { baseApi } from "@/redux/api/baseApi";
import { SubscriptionResponse } from "@/types/api";

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<
      {
        success: boolean;
        message: string;
        data: SubscriptionResponse;
      },
      {
        subscriptionPlanId: string;
        paymentMethod?: string;
      }
    >({
      query: (body) => ({
        url: "/api/subscriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscriptions", "user"],
    }),

    getUserSubscriptions: builder.query<
      {
        success: boolean;
        message: string;
        data: SubscriptionResponse[];
      },
      void
    >({
      query: () => ({
        url: "/api/subscriptions",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),

    getSubscriptionById: builder.query<
      {
        success: boolean;
        message: string;
        data: SubscriptionResponse;
      },
      string
    >({
      query: (id) => ({
        url: `/api/subscriptions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Subscriptions", id }],
    }),

    updateSubscriptionAutoRenew: builder.mutation<
      {
        success: boolean;
        message: string;
        data: SubscriptionResponse;
      },
      {
        id: string;
        isAutoRenew: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/subscriptions/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subscriptions", id },
        "Subscriptions",
      ],
    }),

    cancelSubscription: builder.mutation<
      {
        success: boolean;
        message: string;
        data: SubscriptionResponse;
      },
      string
    >({
      query: (id) => ({
        url: `/api/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Subscriptions", id },
        "Subscriptions",
        "user",
      ],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetUserSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionAutoRenewMutation,
  useCancelSubscriptionMutation,
} = subscriptionsApi;
