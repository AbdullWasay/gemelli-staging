// src/redux/features/cart/cartApi.ts
import { baseApi } from "../../api/baseApi";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  size?: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    inventory: number;
    productImages: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
    seller: {
      id: string;
      name: string | null;
      email: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

interface CartResponse {
  success: boolean;
  data?: {
    cart: Cart;
  };
  error?: string;
}

interface CartItemResponse {
  success: boolean;
  data?: {
    cartItem: CartItem;
    message?: string;
  };
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  data?: {
    message: string;
  };
  error?: string;
}

const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's cart
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "api/cart",
        method: "GET",
      }),
      providesTags: ["cart"],
    }),

    // Add item to cart
    addToCart: builder.mutation<
      CartItemResponse,
      { productId: string; quantity: number; size?: string }
    >({
      query: (data) => ({
        url: "api/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<
      CartItemResponse,
      { cartItemId: string; quantity: number }
    >({
      query: (data) => ({
        url: "api/cart",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<DeleteResponse, string>({
      query: (cartItemId) => ({
        url: `api/cart?cartItemId=${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    // Sync localStorage cart to database (for when user logs in)
    syncCartToDatabase: builder.mutation<
      CartResponse,
      Array<{ productId: string; quantity: number; size?: string }>
    >({
      queryFn: async (localCartItems, _api, _extraOptions, baseQuery) => {
        try {
          // Add each item from localStorage to database
          for (const item of localCartItems) {
            await baseQuery({
              url: "api/cart",
              method: "POST",
              body: item,
            });
          }

          // Get updated cart
          const result = await baseQuery({
            url: "api/cart",
            method: "GET",
          });

          return result.data
            ? { data: result.data as CartResponse }
            : { error: result.error as { status: number; data: unknown } };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useSyncCartToDatabaseMutation,
} = cartApi;

export default cartApi;
