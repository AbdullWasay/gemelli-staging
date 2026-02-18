// src/redux/features/orders/ordersApi.ts
import { baseApi } from "../../api/baseApi";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  sellerName: string | null;
  sellerEmail: string;
  productName: string;
  productSku: string | null;
  size: string | null;
  quantity: number;
  price: number;
  imageUrl: string | null;
  fulfillmentStatus: string;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    productImages: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  subTotal: number;
  shippingCost: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  customerEmail: string;
  customerPhone: string | null;
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
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface OrdersResponse {
  success: boolean;
  data?: {
    orders: Order[];
  };
  error?: string;
}

interface SingleOrderResponse {
  success: boolean;
  data?: {
    order: Order;
    message?: string;
  };
  error?: string;
}

interface CreateOrderData {
  paymentMethod: string;
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
  stripeSessionId?: string;
}

interface UpdateOrderData {
  orderId?: string;
  orderItemId?: string;
  status: string;
  trackingNumber?: string;
  confirm?: boolean;
}

interface DeleteOrderItemResponse {
  success: boolean;
  data?: {
    order: Order;
    message: string;
  };
  error?: string;
}

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's orders
    getOrders: builder.query<OrdersResponse, void>({
      query: () => ({
        url: "api/orders",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // Get single order by ID
    getOrderById: builder.query<SingleOrderResponse, string>({
      query: (orderId) => ({
        url: `api/orders?orderId=${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, orderId) => [
        { type: "orders", id: orderId },
      ],
    }),

    // Get orders for a seller
    getSellerOrders: builder.query<OrdersResponse, string>({
      query: (sellerId) => ({
        url: `api/orders?sellerId=${sellerId}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // Create order from cart
    createOrder: builder.mutation<SingleOrderResponse, CreateOrderData>({
      query: (data) => ({
        url: "api/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["orders", "cart"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<SingleOrderResponse, UpdateOrderData>({
      query: (data) => ({
        url: "api/orders",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { orderId, orderItemId }) => [
        "orders",
        ...(orderId ? [{ type: "orders" as const, id: orderId }] : []),
        ...(orderItemId ? [{ type: "orders" as const, id: orderItemId }] : []),
      ],
    }),

    // Confirm order
    confirmOrder: builder.mutation<SingleOrderResponse, string>({
      query: (orderId) => ({
        url: "api/orders",
        method: "PUT",
        body: {
          orderId,
          confirm: true,
        },
      }),
      invalidatesTags: (result, error, orderId) => [
        "orders",
        { type: "orders", id: orderId },
      ],
    }),

    // Delete order item
    deleteOrderItem: builder.mutation<DeleteOrderItemResponse, string>({
      query: (orderItemId) => ({
        url: `api/orders?orderItemId=${orderItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => {
        const orderId = result?.data?.order?.id;
        return [
          "orders",
          ...(orderId ? [{ type: "orders" as const, id: orderId }] : []),
        ];
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetSellerOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useConfirmOrderMutation,
  useDeleteOrderItemMutation,
} = ordersApi;

export default ordersApi;
