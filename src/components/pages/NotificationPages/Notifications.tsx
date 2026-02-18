//src\components\pages\NotificationPages\Notifications.tsx
"use client";

import Heading from "@/components/ui/Heading/Heading";
import { useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useUpdateNotificationMutation,
} from "@/redux/features/user/notificationsApi";
import { format } from "date-fns";
import { NotificationCategory } from "@/redux/features/user/notificationsApi";

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useGetNotificationsQuery({
    category: activeFilter || undefined,
    page: currentPage,
    pageSize,
    sortOrder,
  });

  const [updateNotification] = useUpdateNotificationMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  // Filter categories for the buttons
  const filterCategories = [
    { label: "ALL", value: null },
    { label: "PRODUCT UPDATES", value: NotificationCategory.PRODUCT_UPDATES },
    { label: "CAMPAIGN ALERTS", value: NotificationCategory.CAMPAIGN_ALERTS },
    { label: "SALES INSIGHTS", value: NotificationCategory.SALES_INSIGHTS },
    { label: "STOCK ALERTS", value: NotificationCategory.STOCK_ALERTS },
  ];

  // Helper to format the timestamp to readable time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  // Handler for marking a notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateNotification({
        notificationId,
        isRead: true,
      });
      refetch();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Handler for marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      refetch();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Get notifications from the API (already sorted by backend)
  const notifications = data?.notifications || [];

  return (
    <div className="font-poppins px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3 sm:gap-0">
        <Heading className="!text-[20px] sm:!text-[24px]">
          Notifications
        </Heading>
        <div className="flex gap-3">
          <button
            onClick={handleMarkAllAsRead}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-xs rounded-lg font-medium"
          >
            Mark All Read
          </button>
          <div className="relative min-w-[150px]">
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="appearance-none w-full text-text-secondary bg-[#F9F9F9] py-[10px] pl-4 pr-8 rounded-lg font-medium cursor-pointer border border-transparent hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-1 text-sm sm:text-base text-text-secondary/70 font-medium mb-5 sm:mb-7">
        Stay updated with the latest activity and important updates for your
        eCommerce store.
      </p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterCategories.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveFilter(item.value)}
            className={`px-3 sm:px-5 py-1 sm:py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap ${
              (activeFilter === item.value && item.value !== null) ||
              (activeFilter === null && item.value === null)
                ? "border-2 border-primary text-primary"
                : "text-text-secondary border-2"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          Error loading notifications. Please try again.
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {notifications.map((notification) => {
            // Determine background color for action button based on category
            let bgColor = "bg-gray-500";
            switch (notification.category) {
              case "SALES_INSIGHTS":
                bgColor = "bg-gradient-to-r from-amber-500 to-green-500";
                break;
              case "CAMPAIGN_ALERTS":
                bgColor =
                  "bg-[linear-gradient(90deg,_#A514FA_0%,_#49C8F2_100%)]";
                break;
              case "STOCK_ALERTS":
                bgColor =
                  "bg-[linear-gradient(104deg,_#FF8A00_-20.06%,_#FF3A44_109.05%)]";
                break;
              case "PRODUCT_UPDATES":
                bgColor =
                  "bg-[linear-gradient(90deg,_#F94A57_0%,_#5C67F8_100%)]";
                break;
            }

            return (
              <div
                key={notification.id}
                className={`bg-[#F9F9F9] p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 ${
                  notification.isRead ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-start gap-3 w-full sm:w-auto">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border flex-shrink-0 flex items-center justify-center ${
                      notification.isRead
                        ? "border-gray-300"
                        : "border-blue-400"
                    }`}
                  >
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-text-black font-medium text-sm sm:text-base">
                      {notification.message}
                    </p>
                    <p className="text-text-secondary font-medium text-xs sm:text-sm mt-1 flex items-center gap-2">
                      {formatTime(notification.createdAt)}
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                        >
                          Mark as read
                        </button>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  className={`w-full sm:w-40 px-5 text-nowrap py-2 sm:py-3 rounded-lg text-white text-sm font-medium ${
                    notification.actionBgColor || bgColor
                  }`}
                >
                  {notification.actionText || "VIEW DETAILS"}
                </button>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No notifications found.
            </div>
          )}

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500"
                    : "bg-primary text-white"
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-gray-100 rounded">
                {currentPage} / {data.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, data.pagination.totalPages)
                  )
                }
                disabled={currentPage === data.pagination.totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === data.pagination.totalPages
                    ? "bg-gray-200 text-gray-500"
                    : "bg-primary text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
