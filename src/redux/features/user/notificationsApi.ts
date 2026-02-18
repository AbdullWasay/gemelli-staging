//src\redux\features\user\notificationsApi.ts 
 import { baseApi } from "../../api/baseApi";

// Define NotificationCategory enum as it's not available from Prisma client
export enum NotificationCategory {
  PRODUCT_UPDATES = "PRODUCT_UPDATES",
  CAMPAIGN_ALERTS = "CAMPAIGN_ALERTS",
  SALES_INSIGHTS = "SALES_INSIGHTS",
  STOCK_ALERTS = "STOCK_ALERTS",
}

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  category: NotificationCategory;
  isRead: boolean;
  actionText?: string | null;
  actionUrl?: string | null;
  actionBgColor?: string | null;
  userId: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface CreateNotificationRequest {
  message: string;
  category: NotificationCategory;
  actionText?: string;
  actionUrl?: string;
  actionBgColor?: string;
}

export interface UpdateNotificationRequest {
  notificationId: string;
  isRead: boolean;
}

export interface MarkAllReadRequest {
  markAllRead: boolean;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUnreadNotificationsCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/api/user/me/notifications?isRead=false&countOnly=true",
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: { count: number };
      }) => response.data,
    }),
    getNotifications: builder.query<
      NotificationsResponse,
      {
        category?: string;
        page?: number;
        pageSize?: number;
        isRead?: boolean;
        sortOrder?: "newest" | "oldest";
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append("category", params.category);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.pageSize)
          queryParams.append("pageSize", params.pageSize.toString());
        if (params.isRead !== undefined)
          queryParams.append("isRead", params.isRead.toString());
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        return {
          url: `/api/user/me/notifications?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: boolean;
        data: NotificationsResponse;
      }) => response.data,
    }),

    createNotification: builder.mutation<
      Notification,
      CreateNotificationRequest
    >({
      query: (notificationData) => ({
        url: "/api/user/me/notifications",
        method: "POST",
        body: notificationData,
      }),
      transformResponse: (response: { success: boolean; data: Notification }) =>
        response.data,
    }),

    updateNotification: builder.mutation<
      Notification,
      UpdateNotificationRequest
    >({
      query: (updateData) => ({
        url: "/api/user/me/notifications",
        method: "PUT",
        body: updateData,
      }),
      transformResponse: (response: { success: boolean; data: Notification }) =>
        response.data,
    }),

    markAllNotificationsAsRead: builder.mutation<{ count: number }, void>({
      query: () => ({
        url: "/api/user/me/notifications",
        method: "PUT",
        body: { markAllRead: true },
      }),
      transformResponse: (response: {
        success: boolean;
        data: { count: number };
      }) => response.data,
    }),

    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/api/user/me/notifications?id=${notificationId}`,
        method: "DELETE",
      }),
    }),

    clearAllReadNotifications: builder.mutation<{ count: number }, void>({
      query: () => ({
        url: "/api/user/me/notifications?clearAll=true",
        method: "DELETE",
      }),
      transformResponse: (response: {
        success: boolean;
        data: { count: number };
      }) => response.data,
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllReadNotificationsMutation,
} = notificationsApi;
