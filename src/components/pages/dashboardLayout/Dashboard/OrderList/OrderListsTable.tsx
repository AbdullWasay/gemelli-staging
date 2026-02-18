// "use client";
// import { GoEye } from "react-icons/go";
// import { JSX } from "react";
// import { orders } from "@/data/orders";
// import Link from "next/link";

// export function OrderListsTable(): JSX.Element {
//   return (
//     <div className="rounded-lg mt-6 overflow-hidden">
//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[700px] grid grid-cols-4 gap-y-4">
//           {/* Table Header */}
//           <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 rounded-tl-md rounded-bl-md">
//             Order ID
//           </div>
//           <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4">Date</div>
//           <div className="text-[16px] font-poppins text-[#151D48] font-mediumd bg-[#EDF4FF] p-4">Customer</div>
//           <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 rounded-tr-md rounded-br-md">
//             Actions
//           </div>
          
//           {/* Table Rows */}
//           {orders.map((order, index) => (
//             <>
//               <div
//                 className="py-4 bg-[#F9F9F9] px-4 rounded-tl-md rounded-bl-md font-medium text-[15px] text-text-secondary font-poppins"
//                 key={`name-${index}`}
//               >
//                 {order.id}
//               </div>
//               <div className="py-4 bg-[#F9F9F9] px-4 font-medium text-[15px] text-text-secondary font-poppins" key={`price-${index}`}>
//                 {order.date}
//               </div>
//               <div className="py-4 bg-[#F9F9F9] px-4 font-medium text-[15px] text-text-secondary font-poppins" key={`stock-${index}`}>
//                 {order.customer.name}
//               </div>
//               <Link
//                 href={`/dashboard/orders/${order.id}`}
//                 className="py-4 bg-[#F9F9F9] px-4 rounded-tr-md rounded-br-md flex space-x-4"
//                 key={`actions-${index}`}
//               >
//                 <div className="flex items-center gap-1 font-medium text-[15px] text-text-secondary font-poppins">
//                   <GoEye className="text-[#7244FF]" />
//                   <button className="text-[#7244FF]">View details</button>
//                 </div>
//               </Link>
//             </>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { GoEye } from "react-icons/go";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { formatOrderId } from "@/utils/order-utils";
import { useSelector } from "react-redux";
import { selectCurrentUser, useCurrentToken } from "@/redux/features/auth/authSlice";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
  size: string;
  fulfillmentStatus: string;
}

interface OrderData {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
}

export function OrderListsTable(): JSX.Element {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CORRECT: These are selector functions, not hooks
  const user = useSelector(selectCurrentUser);
  const token = useSelector(useCurrentToken);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        
        
        
        if (!token) {
          setError('Please log in to view orders');
          setLoading(false);
          return;
        }

        if (!user?.id) {
          setError('User data not found');
          setLoading(false);
          return;
        }

        const sellerId = user.id;
        

        // Fetch orders for this seller
        const response = await fetch(`/api/orders?sellerId=${sellerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to fetch orders');
        }
        
        const result = await response.json();
        
        
        if (result.success && result.data?.orders) {
          setOrders(result.data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('❌ Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token, user]);

  if (loading) {
    return (
      <div className="rounded-lg mt-6">
        <div className="w-full flex justify-center items-center py-12 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7244FF] mx-auto"></div>
            <p className="mt-4 text-text-secondary font-poppins">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg mt-6">
        <div className="w-full flex justify-center items-center py-12 px-4">
          <div className="text-center">
            <p className="text-red-500 font-poppins break-words">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#7244FF] text-white rounded-lg font-poppins hover:bg-[#6134E6] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg flex-1 flex items-center justify-center py-8">
        <div className="w-full flex justify-center items-center px-4">
          <div className="text-center max-w-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-text-secondary font-poppins text-base sm:text-lg mt-4 break-words">No orders found</p>
            <p className="text-text-secondary font-poppins text-sm mt-2 break-words">
              Orders will appear here once customers make purchases
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg mt-6 overflow-hidden">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-4 gap-y-4">
          {/* Table Header */}
          <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 rounded-tl-md rounded-bl-md">
            Order ID
          </div>
          <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4">
            Date
          </div>
          <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4">
            Customer
          </div>
          <div className="text-[16px] font-poppins text-[#151D48] font-medium bg-[#EDF4FF] p-4 rounded-tr-md rounded-br-md">
            Actions
          </div>
         
          {/* Table Rows */}
          {orders.map((order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <>
                <div
                  className="py-4 bg-[#F9F9F9] px-4 rounded-tl-md rounded-bl-md font-medium text-[15px] text-text-secondary font-poppins"
                  key={`id-${order.id}`}
                >
                  {formatOrderId(order.id)}
                </div>
                <div 
                  className="py-4 bg-[#F9F9F9] px-4 font-medium text-[15px] text-text-secondary font-poppins" 
                  key={`date-${order.id}`}
                >
                  {orderDate}
                </div>
                <div 
                  className="py-4 bg-[#F9F9F9] px-4 font-medium text-[15px] text-text-secondary font-poppins" 
                  key={`customer-${order.id}`}
                >
                  {order.user.name}
                </div>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="py-4 bg-[#F9F9F9] px-4 rounded-tr-md rounded-br-md flex space-x-4"
                  key={`actions-${order.id}`}
                >
                  <div className="flex items-center gap-1 font-medium text-[15px] text-text-secondary font-poppins">
                    <GoEye className="text-[#7244FF]" />
                    <button className="text-[#7244FF] hover:underline">View details</button>
                  </div>
                </Link>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}