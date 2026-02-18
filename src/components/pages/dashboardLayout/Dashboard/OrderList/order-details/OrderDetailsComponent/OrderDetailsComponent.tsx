// "use client";

// import Link from "next/link";
// import { orders } from "@/data/orders";
// import { notFound, useParams } from "next/navigation";
// import OrderItemCollapsible from "../OrderItemCollapsible";
// import OrderSummaryCollapsible from "../OrderSummaryCollapsible";
// import CustomerInfoCollapsible from "../CustomerInfoCollapsible";
// import ContactInfoCollapsible from "../ContactInfoCollapsible";
// import ShippingAddressCollapsible from "../ShippingAddressCollapsible";
// import ConversionSummaryCollapsible from "../ConversionSummaryCollapsible";
// import PrintInvoiceButton from "../PrintInvoiceButton";
// import { JSX } from "react";
// import BillingAddressCollapsible from "../BillingAddressCollapsible";

// export default function OrderDetailsComponent(): JSX.Element {
//   const { orderId } = useParams();
//   const order = orders.find((o) => o.id === orderId);

//   if (!order) {
//     notFound();
//   }

//   return (
//     <div className=" mx-auto py-8 ">
//       <div className="mb-6">
//         <Link
//           href="/dashboard/orders"
//           className="text-blue-500 hover:underline flex items-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           Back to Orders
//         </Link>
//       </div>

//       <div className="bg-white  ">
//         <div className="p-6 ">
//           <div className="flex  items-start flex-wrap gap-2">
//             <div>
//               <h1 className="text-[24px] font-semibold font-poppins text-[#0F0F0F] -mt-1">
//                 Order ID: {order.id}
//               </h1>
//               <p className=" text-[14px] font-poppins font-medium text-text-secondary mt-1">
//                 Placed on {order.date}
//               </p>
//             </div>
//             <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
//               <span className="px-3 py-1 text-[13px] font-medium font-poppins text-[#00AC61] bg-[#00AC6114] rounded-full text-sm whitespace-nowrap">
//                 Payment Pending
//               </span>
//               <span className="px-3 py-1 text-[13px] font-medium font-poppins bg-[#FF3A4414] text-[#FF3A44] rounded-full text-sm whitespace-nowrap">
//                 Unfulfilled
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-5 lg:gap-y-0 gap-y-5">
//           <div className="col-span-2">
//             <OrderItemCollapsible className="" item={order.item} />
//           </div>
//           <div className="col-span-1 ">
//             <div className="bg-[#F9F9F9] px-5 py-5 rounded-[12px]">
//               <h2 className="text-[15px] font-medium text-text-black font-poppins">
//                 Notes
//               </h2>
//               <p className="mt-3 font-poppins text-[14px] text-text-secondary font-medium">First customer and order!</p>
//             </div>

//             <CustomerInfoCollapsible customer={order.customer} />
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-5 lg:gap-y-0 gap-y-5">
//           <div className="col-span-2">
//             <OrderSummaryCollapsible summary={order.summary} />
//             <ConversionSummaryCollapsible />
//           </div>
//           <div className="col-span-1">
//             <ContactInfoCollapsible contact={order.contact} />
//             <ShippingAddressCollapsible address={order.shippingAddress} />
//             <BillingAddressCollapsible />
//           </div>
//         </div>

//         {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

//         </div> */}

//         <div className="pt-8 flex md:flex-row flex-col  md:gap-2 gap-y-2">
//           <button className="bg-text-secondary/30 text-[#4C4C4C] bg-opacity-35 rounded-xl text-[14px] transition-colors md:w-[294px] w-full h-[56px] font-poppins font-semibold">
//             CANCEL ORDER
//           </button>
//           <button className="bg-white hover:bg-gray-100  h-[56px]  rounded-xl text-sm transition-colors flex-grow  border-[#005BFF] text-[#005BFF] border-[2px] font-poppins font-semibold">
//             SEND ORDER DETAILS TO EMAIL
//           </button>
//           <PrintInvoiceButton order={order} />
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import OrderItemCollapsible from "../OrderItemCollapsible";
import OrderSummaryCollapsible from "../OrderSummaryCollapsible";
import CustomerInfoCollapsible from "../CustomerInfoCollapsible";
import ContactInfoCollapsible from "../ContactInfoCollapsible";
import ShippingAddressCollapsible from "../ShippingAddressCollapsible";
import ConversionSummaryCollapsible from "../ConversionSummaryCollapsible";
import PrintInvoiceButton from "../PrintInvoiceButton";
import { JSX } from "react";
import BillingAddressCollapsible from "../BillingAddressCollapsible";
import {
  transformOrderForFrontend,
  getOrderStatusInfo,
  formatOrderId,
} from "@/utils/order-utils";
import { OrderItem } from "@/types/Orders";
import {
  useGetOrderByIdQuery,
  useConfirmOrderMutation,
} from "@/redux/features/orders/ordersApi";
import Swal from "sweetalert2";

interface OrderItemData {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  imageUrl: string;
  size: string;
  fulfillmentStatus: string;
  product?: {
    id: string;
    name: string;
    productImages: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
}

interface OrderData {
  id: string;
  createdAt: string;
  totalAmount: number;
  subTotal: number;
  shippingCost: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  billingAddress: any;
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItemData[];
}

export default function OrderDetailsComponent(): JSX.Element {
  const { orderId } = useParams() as { orderId: string };

  // Use React Query to fetch order data
  const { data, isLoading, error: queryError } = useGetOrderByIdQuery(orderId);
  const [confirmOrder, { isLoading: isConfirming }] = useConfirmOrderMutation();

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    try {
      const result = await Swal.fire({
        title: "Confirm Order",
        text: "Once confirmed, you won't be able to delete products from this order.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#7244FF",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, confirm it!",
      });

      if (result.isConfirmed) {
        const response = await confirmOrder(orderId).unwrap();

        if (response.success) {
          Swal.fire({
            title: "Confirmed!",
            text: "Order has been confirmed successfully.",
            icon: "success",
            confirmButtonColor: "#7244FF",
          });
        }
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to confirm the order. Please try again.",
        icon: "error",
        confirmButtonColor: "#7244FF",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7244FF] mx-auto"></div>
            <p className="mt-4 text-text-secondary font-poppins">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (queryError || !data?.success) {
    return (
      <div className="mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 font-poppins text-lg">
              {queryError
                ? "Failed to load order details"
                : data?.error || "Order not found"}
            </p>
            <Link
              href="/dashboard/orders"
              className="mt-4 inline-block px-4 py-2 bg-[#7244FF] text-white rounded-lg font-poppins hover:bg-[#6134E6] transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data?.order) {
    notFound();
  }

  // Use type assertion to handle nullable fields
  const order = data.data.order as unknown as OrderData;

  // Check if order is in PENDING status
  const isPending = order.status === "PENDING";

  // Check if order is confirmed (using PROCESSING status as our CONFIRMED status)
  const isConfirmed = order.status === "PROCESSING";

  // Transform order data using utility
  const transformedOrder = transformOrderForFrontend(order);

  // Get status info
  const statusInfo = getOrderStatusInfo(order);

  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/orders"
          className="text-blue-500 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="bg-white">
        <div className="p-6">
          <div className="flex items-start flex-wrap gap-2">
            <div>
              <h1 className="text-[24px] font-semibold font-poppins text-[#0F0F0F] -mt-1">
                Order ID: {formatOrderId(order.id)}
              </h1>
              <p className="text-[14px] font-poppins font-medium text-text-secondary mt-1">
                Placed on {orderDate}
              </p>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <span
                className={`px-3 py-1 text-[13px] font-medium font-poppins rounded-full text-sm whitespace-nowrap ${statusInfo.payment.className}`}
              >
                {statusInfo.payment.label}
              </span>
              <span
                className={`px-3 py-1 text-[13px] font-medium font-poppins rounded-full text-sm whitespace-nowrap ${statusInfo.fulfillment.className}`}
              >
                {statusInfo.fulfillment.label}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-5 lg:gap-y-0 gap-y-5">
          <div className="col-span-2">
            {order.orderItems.map((item) => (
              <OrderItemCollapsible
                key={item.id}
                className=""
                item={item as unknown as OrderItem}
                canDelete={isPending}
              />
            ))}
          </div>
          <div className="col-span-1">
            <div className="bg-[#F9F9F9] px-5 py-5 rounded-[12px]">
              <h2 className="text-[15px] font-medium text-text-black font-poppins">
                Notes
              </h2>
              <p className="mt-3 font-poppins text-[14px] text-text-secondary font-medium">
                Order from {order.user.name}
              </p>
            </div>

            <CustomerInfoCollapsible customer={transformedOrder.customer} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-5 lg:gap-y-0 gap-y-5">
          <div className="col-span-2">
            <OrderSummaryCollapsible summary={transformedOrder.summary} />
            <ConversionSummaryCollapsible />
          </div>
          <div className="col-span-1">
            <ContactInfoCollapsible contact={transformedOrder.contact} />
            <ShippingAddressCollapsible
              address={transformedOrder.shippingAddress}
            />
            <BillingAddressCollapsible />
          </div>
        </div>

        <div className="pt-8 flex md:flex-row flex-col md:gap-2 gap-y-2">
          {/* Conditional button rendering based on order status */}
          {isPending && (
            <button
              onClick={handleConfirmOrder}
              disabled={isConfirming}
              className="bg-primary text-white rounded-xl text-[14px] transition-colors md:w-[294px] w-full h-[56px] font-poppins font-semibold hover:bg-[#6134E6] disabled:opacity-70"
            >
              {isConfirming ? "CONFIRMING..." : "CONFIRM ORDER"}
            </button>
          )}

          <button className="bg-text-secondary/30 text-[#4C4C4C] bg-opacity-35 rounded-xl text-[14px] transition-colors md:w-[294px] w-full h-[56px] font-poppins font-semibold hover:bg-text-secondary/40">
            CANCEL ORDER
          </button>

          <button className="bg-white hover:bg-gray-100 h-[56px] rounded-xl text-sm transition-colors flex-grow border-[#005BFF] text-[#005BFF] border-[2px] font-poppins font-semibold">
            SEND ORDER DETAILS TO EMAIL
          </button>

          {/* Only show Print Invoice button if order is confirmed */}
          {isConfirmed && <PrintInvoiceButton order={transformedOrder} />}
        </div>
      </div>
    </div>
  );
}
