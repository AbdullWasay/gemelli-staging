//src\redux\features\user\notificationSettingsApi.ts
import { baseApi } from "../../api/baseApi";
import { NotificationSettings } from "@/types/api";

const notificationSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => ({
        url: "/api/user/me/notification-settings",
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: NotificationSettings;
      }) => response.data,
      providesTags: ["NotificationSettings"],
    }),

    updateNotificationSettings: builder.mutation<
      NotificationSettings,
      Partial<NotificationSettings>
    >({
      query: (settings) => ({
        url: "/api/user/me/notification-settings",
        method: "PUT",
        body: settings,
      }),
      transformResponse: (response: {
        success: boolean;
        data: NotificationSettings;
      }) => response.data,
      invalidatesTags: ["NotificationSettings"],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationSettingsApi;
