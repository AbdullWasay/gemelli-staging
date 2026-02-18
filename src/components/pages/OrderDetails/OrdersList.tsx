"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Spin, Empty, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const OrdersList = () => {
  const router = useRouter();
  const { data: ordersData, isLoading, error } = useGetOrdersQuery();
  const { currency: globalCurrency } = useSelector(
    (state: RootState) => state.currency
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Orders per page

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-orange-100 text-orange-800 border-orange-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      SHIPPED: "bg-cyan-100 text-cyan-800 border-cyan-200",
      DELIVERED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Filter and paginate orders
  const filteredOrders =
    ordersData?.data?.orders?.filter((order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !ordersData?.data?.orders) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-8">
        <p className="text-red-600 font-medium">Failed to load orders</p>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="my-8">
        <Empty description="No orders found" />
      </div>
    );
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };

  return (
    <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
      <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-6 lg:mb-10">
        My Orders
      </h1>

      {/* Search input */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search by order ID"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
          className="w-full md:w-1/2 px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <SearchOutlined className="absolute left-3 top-3.5 text-gray-400" />
      </div>

      {/* Orders list */}
      <div className="space-y-6">
        {paginatedOrders.map((order) => (
          <div
            key={order.id}
            className="bg-[#F9F9F9] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-base font-medium">
                  <h3 className="font-semibold">Order #</h3>
                  <span>{order.id.slice(0, 8)}</span>
                </div>
                <p className="text-gray-500 text-sm">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <p className="font-semibold text-lg">
                  ${order.totalAmount.toFixed(2)} {globalCurrency}
                </p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-6">
              {/* Left: Items preview */}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-700 mb-3">Items</h3>
                <div className="flex flex-wrap gap-4">
                  {order.orderItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative">
                      <div className="h-16 w-16 bg-white border rounded-md overflow-hidden">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="object-contain h-full w-full"
                          />
                        )}
                      </div>
                      {item.quantity > 1 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}

                  {order.orderItems.length > 4 && (
                    <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 font-medium">
                      +{order.orderItems.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Order actions */}
              <div className="flex items-end">
                <button
                  onClick={() => handleViewOrder(order.id)}
                  className="bg-primary text-white rounded-lg px-6 py-2.5 font-medium hover:bg-primary/90 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredOrders.length > pageSize && (
        <div className="flex justify-center mt-10">
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={filteredOrders.length}
            pageSize={pageSize}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersList;
