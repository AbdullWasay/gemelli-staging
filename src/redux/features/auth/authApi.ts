import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/api/auth/login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    loginWithGoogle: builder.mutation({
      query: (payload: { credential: string; role?: "USER" | "SELLER" }) => ({
        url: "/api/auth/google",
        method: "POST",
        body: { credential: payload.credential, role: payload.role },
      }),
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "/forgot-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "/reset-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    // User-related endpoints moved to userApi.ts
    register: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/api/auth/signup",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    otp: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/users/verify-otp",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    // getMe endpoint moved to userApi.ts
  }),
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useOtpMutation,
  // User-related hooks moved to userApi.ts
} = authApi;
