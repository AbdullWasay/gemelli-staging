"use client";

import Heading from "@/components/ui/Heading/Heading";
import { useEffect, useState } from "react";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/redux/features/user/notificationSettingsApi";
import { toast } from "sonner";

export default function NotificationSettingsComponent() {
  const [preferences, setPreferences] = useState({
    newOrders: false,
    aiRecommendations: false,
    promotionsDiscounts: false,
    emailChannel: false,
    smsChannel: false,
    appNotifications: false,
    marketingEmails: false,
    generalUpdates: false,
    orderReminders: false,
  });

  const {
    data: notificationSettings,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
  } = useGetNotificationSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateNotificationSettingsMutation();

  // Load settings from API
  useEffect(() => {
    if (notificationSettings) {
      setPreferences({
        newOrders: notificationSettings.newOrders,
        aiRecommendations: notificationSettings.aiRecommendations,
        promotionsDiscounts: notificationSettings.promotionsDiscounts,
        emailChannel: notificationSettings.emailChannel,
        smsChannel: notificationSettings.smsChannel,
        appNotifications: notificationSettings.appNotifications,
        marketingEmails: notificationSettings.marketingEmails,
        generalUpdates: notificationSettings.generalUpdates,
        orderReminders: notificationSettings.orderReminders,
      });
    }
  }, [notificationSettings]);

  // Handle toggle changes
  const handleToggleChange = async (category: keyof typeof preferences) => {
    const newValue = !preferences[category];

    // Update local state
    setPreferences((prev) => ({
      ...prev,
      [category]: newValue,
    }));

    // Update in database
    const toastId = toast.loading(`Updating ${category} setting...`);
    try {
      await updateSettings({ [category]: newValue }).unwrap();
      toast.success(`${category} setting updated`, { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Revert local state on error
      setPreferences((prev) => ({
        ...prev,
        [category]: !newValue,
      }));
      toast.error(`Failed to update setting`, { id: toastId });
    }
  };

  return (
    <div className="mx-auto sm:p-6">
      <Heading className="!text-[16px] !mt-0 font-poppins !text-black !font-semibold mb-5">
        Notifications
      </Heading>

      {/* New Orders */}
      <div className="flex sm:items-center justify-between py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div>
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            New Orders
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Get notified when a customer places an order.
          </p>
        </div>
        <button
          className={`relative inline-flex flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${
            preferences.newOrders ? "bg-purple-500" : "bg-gray-200"
          }`}
          onClick={() => handleToggleChange("newOrders")}
          disabled={isUpdating}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
              preferences.newOrders ? "translate-x-6" : "translate-x-1"
            } shadow-sm`}
          />

          {!preferences.newOrders && (
            <span className="absolute h-2 w-2 rounded-full bg-white top-1/2 right-2 -translate-y-1/2 border border-gray-200"></span>
          )}
        </button>
      </div>

      {/* AI Recommendations */}
      <div className="flex sm:items-center justify-between py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div>
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            AI Recommendations
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Receive AI-driven suggestions.
          </p>
        </div>
        <button
          className={`relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${
            preferences.aiRecommendations ? "bg-purple-500" : "bg-gray-200"
          }`}
          onClick={() => handleToggleChange("aiRecommendations")}
          disabled={isUpdating}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
              preferences.aiRecommendations ? "translate-x-6" : "translate-x-1"
            } shadow-sm`}
          />

          {!preferences.aiRecommendations && (
            <span className="absolute h-2 w-2 rounded-full bg-white top-1/2 right-2 -translate-y-1/2 border border-gray-200"></span>
          )}
        </button>
      </div>

      {/* Promotions & Discounts */}
      <div className="flex sm:items-center justify-between py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div>
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            Promotions & Discounts
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Get informed about premium promotions or offers.
          </p>
        </div>
        <button
          className={`relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${
            preferences.promotionsDiscounts ? "bg-purple-500" : "bg-gray-200"
          }`}
          onClick={() => handleToggleChange("promotionsDiscounts")}
          disabled={isUpdating}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
              preferences.promotionsDiscounts
                ? "translate-x-6"
                : "translate-x-1"
            } shadow-sm`}
          />

          {!preferences.promotionsDiscounts && (
            <span className="absolute h-2 w-2 rounded-full bg-white top-1/2 right-2 -translate-y-1/2 border border-gray-200"></span>
          )}
        </button>
      </div>

      {/* Notification Channels */}
      <div className="mt-6 mb-4">
        <h2 className="font-semibold text-black font-poppins text-[16px]">
          Notifications Channels
        </h2>
        <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
          Decide where you want to receive your notifications.
        </p>
      </div>

      {/* Email */}
      <div className="flex py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div className="mt-1">
          <button
            className={`relative inline-flex h-5 w-5 items-center justify-center rounded border ${
              preferences.emailChannel
                ? "bg-purple-600 border-purple-600"
                : "bg-white border-gray-300"
            } transition-colors duration-200 ease-in-out`}
            onClick={() => handleToggleChange("emailChannel")}
            disabled={isUpdating}
          >
            {preferences.emailChannel && (
              <svg
                className="h-3 w-3 text-white transform transition-transform duration-200 ease-in-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            Email
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Updates sent to your registered email address.
          </p>
        </div>
      </div>

      {/* SMS */}
      <div className="flex py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div className="mt-1">
          <button
            className={`relative inline-flex h-5 w-5 items-center justify-center rounded border ${
              preferences.smsChannel
                ? "bg-purple-600 border-purple-600"
                : "bg-white border-gray-300"
            } transition-colors duration-200 ease-in-out`}
            onClick={() => handleToggleChange("smsChannel")}
            disabled={isUpdating}
          >
            {preferences.smsChannel && (
              <svg
                className="h-3 w-3 text-white transform transition-transform duration-200 ease-in-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            SMS
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Alerts directly on your mobile device.
          </p>
        </div>
      </div>

      {/* App Notifications */}
      <div className="flex py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div className="mt-1">
          <button
            className={`relative inline-flex h-5 w-5 items-center justify-center rounded border ${
              preferences.appNotifications
                ? "bg-purple-600 border-purple-600"
                : "bg-white border-gray-300"
            } transition-colors duration-200 ease-in-out`}
            onClick={() => handleToggleChange("appNotifications")}
            disabled={isUpdating}
          >
            {preferences.appNotifications && (
              <svg
                className="h-3 w-3 text-white transform transition-transform duration-200 ease-in-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            App Notifications
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Real-time updates through the platform&lsquo;s mobile or web app.
          </p>
        </div>
      </div>

      {/* Deactivate Notifications */}
      <div className="mt-6 mb-4">
        <h2 className="font-semibold text-black font-poppins text-[16px]">
          Deactivate Notifications
        </h2>
        <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
          Manage unwanted alerts and declutter your inbox.
        </p>
      </div>

      {/* Marketing Emails */}
      <div className="flex sm:items-center justify-between py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div>
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            Marketing Emails
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Newsletters and promotional emails.
          </p>
        </div>
        <button
          className={`px-4 h-max py-1 text-xs font-medium rounded-full transition-colors duration-200 ease-in-out active:scale-95 transform ${
            preferences.marketingEmails
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "text-purple-600 border border-purple-600 hover:bg-purple-50"
          }`}
          onClick={() => handleToggleChange("marketingEmails")}
          disabled={isUpdating}
        >
          {preferences.marketingEmails ? "Disable" : "Enable"}
        </button>
      </div>

      {/* General Updates */}
      <div className="flex sm:items-center justify-between py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div>
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            General Updates
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Receive notifications about minor app updates.
          </p>
        </div>
        <button
          className={`px-4 h-max py-1 text-xs font-medium rounded-full transition-colors duration-200 ease-in-out active:scale-95 transform ${
            preferences.generalUpdates
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "text-purple-600 border border-purple-600 hover:bg-purple-50"
          }`}
          onClick={() => handleToggleChange("generalUpdates")}
          disabled={isUpdating}
        >
          {preferences.generalUpdates ? "Disable" : "Enable"}
        </button>
      </div>

      {/* Order Reminders */}
      <div className="flex sm:items-center justify-between py-5 px-8 rounded-xl mb-2.5 bg-white">
        <div>
          <h3 className="font-semibold text-text-black font-poppins text-[14px]">
            Order Reminders
          </h3>
          <p className="font-medium text-[#646464] font-poppins text-[14px] opacity-80">
            Notifications for order confirmations.
          </p>
        </div>
        <button
          className={`px-4 h-max py-1 text-xs font-medium rounded-full transition-colors duration-200 ease-in-out active:scale-95 transform ${
            preferences.orderReminders
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "text-purple-600 border border-purple-600 hover:bg-purple-50"
          }`}
          onClick={() => handleToggleChange("orderReminders")}
          disabled={isUpdating}
        >
          {preferences.orderReminders ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
}
