"use client";

import dynamic from "next/dynamic";
import React from "react";

// Using dynamic import to avoid the SSR issue with the component
const OrderDetailsPage = dynamic(
  () => import("@/components/pages/OrderDetails/OrderDetailsPage"),
  { ssr: false }
);

const OrderDetailPage = () => {
  return (
    <div>
      <OrderDetailsPage />
    </div>
  );
};

export default OrderDetailPage;
