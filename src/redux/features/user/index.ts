// Re-export everything from the userSlice and userApi
import userReducer from "./userSlice";
import {
  useGetMeQuery,
  useGetUserByIdQuery,
  useGetStoreAddressesQuery,
  useUpdateUserMutation,
  useGetUserAddressesQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} from "./userApi";

import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "./notificationSettingsApi";

import {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllReadNotificationsMutation,
} from "./notificationsApi";

import {
  setCurrentUser,
  setSelectedUser,
  updateUserProfile,
  setLoading,
  setError,
  clearUserState,
} from "./userSlice";

export {
  // API Hooks
  useGetMeQuery,
  useGetUserByIdQuery,
  useGetStoreAddressesQuery,
  useUpdateUserMutation,
  useGetUserAddressesQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,

  // Notification Settings Hooks
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,

  // Notifications Hooks
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllReadNotificationsMutation,

  // Slice Actions
  setCurrentUser,
  setSelectedUser,
  updateUserProfile,
  setLoading,
  setError,
  clearUserState,
};

export default userReducer;
