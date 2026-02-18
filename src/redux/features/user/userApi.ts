import { baseApi } from "../../api/baseApi";
import { UserWithRelations, Address } from "@/types/api";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user's profile
    getMe: builder.query({
      query: () => ({
        url: "api/user/me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `api/user/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // Get store addresses
    getStoreAddresses: builder.query({
      query: (storeId) => ({
        url: `api/store/${storeId}/addresses`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // Update current user
    updateUser: builder.mutation<
      { success: boolean; data?: UserWithRelations; error?: string },
      Partial<UserWithRelations>
    >({
      query: (userInfo) => {
        return {
          url: "api/user/me",
          method: "PUT",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),

    // Get user's addresses
    getUserAddresses: builder.query<
      { success: boolean; data?: Address[]; error?: string },
      void
    >({
      query: () => ({
        url: "api/user/me/addresses",
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // Create a new address for user
    createUserAddress: builder.mutation<
      { success: boolean; data?: Address; error?: string },
      { country: string; cityState: string; postalCode: string }
    >({
      query: (addressData) => {
        return {
          url: "api/user/me/addresses",
          method: "POST",
          body: addressData,
        };
      },
      invalidatesTags: ["user"],
    }),

    // Update user's address
    updateUserAddress: builder.mutation<
      { success: boolean; data?: Address; error?: string },
      { id: string; country?: string; cityState?: string; postalCode?: string }
    >({
      query: (data) => {
        const { id, ...addressData } = data;
        return {
          url: `api/user/me/addresses/${id}`,
          method: "PUT",
          body: addressData,
        };
      },
      invalidatesTags: ["user"],
    }),

    // Delete user's address
    deleteUserAddress: builder.mutation<
      { success: boolean; message?: string; error?: string },
      string
    >({
      query: (id) => {
        return {
          url: `api/user/me/addresses/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["user"],
    }),

    // Create store for current user (seller who signed up with Google)
    createStore: builder.mutation<
      { success: boolean; data?: { id: string }; error?: string },
      { storeName: string; storeCategory: string; storeWebsite?: string }
    >({
      query: (storeData) => ({
        url: "api/user/me/store",
        method: "POST",
        body: storeData,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUserByIdQuery,
  useGetStoreAddressesQuery,
  useUpdateUserMutation,
  useGetUserAddressesQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
  useCreateStoreMutation,
} = userApi;
