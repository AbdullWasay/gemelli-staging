// src/redux/features/checkout/checkoutApi.ts
import { baseApi } from "../../api/baseApi";

interface CheckoutSessionData {
  customerInfo: {
    email: string;
    phone?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    areaCode: string;
    phone: string;
  };
  billingAddress: {
    same: boolean;
    [key: string]: unknown;
  };
}

interface CheckoutSessionResponse {
  success: boolean;
  data?: {
    sessionId: string;
    url: string;
  };
  error?: string;
}

const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Stripe checkout session
    createCheckoutSession: builder.mutation<CheckoutSessionResponse, CheckoutSessionData>({
      query: (data) => ({
        url: "api/checkout",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
} = checkoutApi;

export default checkoutApi;