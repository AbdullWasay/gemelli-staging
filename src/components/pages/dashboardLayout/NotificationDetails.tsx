"use client";

import { Bell, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useGetUnreadNotificationsCountQuery,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/user";
import { format } from "date-fns";

export default function NotificationDetails() {
  const [isOpen, setIsOpen] = useState(false);

  // Get unread notifications count
  const { data: unreadNotifications, refetch: refetchCount } =
    useGetUnreadNotificationsCountQuery();
  const hasUnreadNotifications =
    unreadNotifications && unreadNotifications.count > 0;

  // Get recent notifications
  const { data: notificationsData, refetch } = useGetNotificationsQuery({
    page: 1,
    pageSize: 5,
    sortOrder: "newest",
  });

  // Mark notification as read
  const [updateNotification] = useUpdateNotificationMutation();

  // Format notification time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notificationId: string) => {
    try {
      await updateNotification({ notificationId, isRead: true });
      refetch();
      refetchCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative md:!z-[100000]">
      {/* Badge wrapper with notification count */}
      <div className="relative inline-block">
        {/* Notification badge */}
        {hasUnreadNotifications && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FF008A] rounded-full flex items-center justify-center text-white text-xs">
            {unreadNotifications.count > 99 ? "99+" : unreadNotifications.count}
          </span>
        )}

        {/* Button with background */}
        <div className="bg-[#4046DE1C] hover:bg-[#4046DE1C] rounded-full p-1 flex items-center justify-center overflow-hidden">
          <button
            type="button"
            className="p-1.5 sm:p-2 rounded-full transition-colors"
            onClick={toggleDrawer}
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#4046DE]" />
          </button>
        </div>
      </div>

      {/* Drawer/Sidebar */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-[100000]`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 ">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button onClick={toggleDrawer} className="text-gray-600 ">
            <X />
          </button>
        </div>
        <div className="p-4">
          {/* Notifications Content */}
          <ul>
            {notificationsData && notificationsData.notifications.length > 0 ? (
              notificationsData.notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-2 mb-2 rounded ${
                    notification.isRead ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <Link
                    href={notification.actionUrl || "#"}
                    className="text-gray-700 block"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    {notification.actionText && (
                      <span
                        className="text-xs mt-1 py-0.5 px-2 rounded inline-block"
                        style={{
                          backgroundColor:
                            notification.actionBgColor || "#E5EFFF",
                          color: "#005BFF",
                        }}
                      >
                        {notification.actionText}
                      </span>
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                No notifications
              </li>
            )}
          </ul>
          {notificationsData && notificationsData.notifications.length > 0 && (
            <Link
              href="/dashboard/notifications"
              className="mt-3 text-center block w-full text-sm text-primary font-medium p-2 hover:bg-blue-50 rounded"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        } z-[99999]`}
        onClick={toggleDrawer}
      ></div>
    </div>
  );
}
