// // src/lib/order-utils.ts

// import { Order } from "@/types/Orders";

// /**
//  * Transform database order to frontend Order type
//  */
// export function transformOrderForFrontend(dbOrder: any): Order {
//   const orderDate = new Date(dbOrder.createdAt).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   // Get the first order item for display
//   const firstItem = dbOrder.orderItems?.[0];
  
//   // Calculate total quantity across all items
//   const totalQuantity = dbOrder.orderItems?.reduce(
//     (sum: number, item: any) => sum + item.quantity, 
//     0
//   ) || 0;

//   return {
//     id: dbOrder.id,
//     date: orderDate,
//     customer: {
//       name: dbOrder.user?.name || '',
//       orders: "1", // You might want to fetch customer's total order count
//       taxExempt: false,
//     },
//     contact: {
//       email: dbOrder.customerEmail || dbOrder.user?.email || '',
//       phone: dbOrder.customerPhone || null,
//     },
//     item: {
//       name: firstItem?.productName || '',
//       brand: '', // Add if you have brand in your schema
//       size: firstItem?.size || '',
//       quantity: totalQuantity.toString(),
//       price: `$${(firstItem?.price || 0).toFixed(2)}`,
//       image: firstItem?.imageUrl || '',
//     },
//     summary: {
//       subtotal: `$${(dbOrder.subTotal || 0).toFixed(2)}`,
//       shipping: `$${(dbOrder.shippingCost || 0).toFixed(2)}`,
//       total: `$${(dbOrder.totalAmount || 0).toFixed(2)}`,
//       paymentMethod: dbOrder.paymentMethod || 'card',
//     },
//     total: `$${(dbOrder.totalAmount || 0).toFixed(2)}`,
//     shippingAddress: dbOrder.shippingAddress || {
//       street: '',
//       city: '',
//       state: '',
//       zip: '',
//       country: '',
//     },
//     billingAddress: dbOrder.billingAddress?.sameAsShipping !== undefined 
//       ? dbOrder.billingAddress 
//       : {
//           sameAsShipping: true,
//           ...(dbOrder.billingAddress || {}),
//         },
//   };
// }

// /**
//  * Get order status display info
//  */
// export function getOrderStatusInfo(order: any) {
//   const isPaymentPaid = order.paymentStatus === 'PAID';
//   const isFulfilled = order.orderItems?.every(
//     (item: any) => item.fulfillmentStatus === 'FULFILLED'
//   );

//   return {
//     payment: {
//       status: isPaymentPaid ? 'paid' : 'pending',
//       label: isPaymentPaid ? 'Payment Received' : 'Payment Pending',
//       className: isPaymentPaid 
//         ? 'text-[#00AC61] bg-[#00AC6114]' 
//         : 'text-[#FF9500] bg-[#FF950014]',
//     },
//     fulfillment: {
//       status: isFulfilled ? 'fulfilled' : 'unfulfilled',
//       label: isFulfilled ? 'Fulfilled' : 'Unfulfilled',
//       className: isFulfilled
//         ? 'bg-[#00AC6114] text-[#00AC61]'
//         : 'bg-[#FF3A4414] text-[#FF3A44]',
//     },
//   };
// }

// /**
//  * Format order ID for display
//  */
// export function formatOrderId(orderId: string, length: number = 8): string {
//   return `#${orderId.slice(0, length)}`;
// }

// /**
//  * Get authentication headers
//  */
// export function getAuthHeaders() {
//   const token = localStorage.getItem('token');
  
//   if (!token) {
//     throw new Error('No authentication token found');
//   }

//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   };
// }

// /**
//  * Get current seller ID
//  */
// export function getCurrentSellerId(): string {
//   const userStr = localStorage.getItem('user');
  
//   if (!userStr) {
//     throw new Error('User data not found');
//   }

//   const user = JSON.parse(userStr);
  
//   if (!user.id) {
//     throw new Error('User ID not found');
//   }

//   return user.id;
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/order-utils.ts

import { Order } from "@/types/Orders";

/**
 * Transform database order to frontend Order type
 */
export function transformOrderForFrontend(dbOrder: any): Order {
  const orderDate = new Date(dbOrder.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get the first order item for display
  const firstItem = dbOrder.orderItems?.[0];
  
  // Calculate total quantity across all items
  const totalQuantity = dbOrder.orderItems?.reduce(
    (sum: number, item: any) => sum + item.quantity, 
    0
  ) || 0;

  return {
    id: dbOrder.id,
    date: orderDate,
    customer: {
      name: dbOrder.user?.name || '',
      orders: "1", // You might want to fetch customer's total order count
      taxExempt: false,
    },
    contact: {
      email: dbOrder.customerEmail || dbOrder.user?.email || '',
      phone: dbOrder.customerPhone || null,
    },
    item: {
      name: firstItem?.productName || '',
      brand: '', // Add if you have brand in your schema
      size: firstItem?.size || '',
      quantity: totalQuantity.toString(),
      price: `$${(firstItem?.price || 0).toFixed(2)}`,
      image: firstItem?.imageUrl || '',
    },
    summary: {
      subtotal: `$${(dbOrder.subTotal || 0).toFixed(2)}`,
      shipping: `$${(dbOrder.shippingCost || 0).toFixed(2)}`,
      total: `$${(dbOrder.totalAmount || 0).toFixed(2)}`,
      paymentMethod: dbOrder.paymentMethod || 'card',
    },
    total: `$${(dbOrder.totalAmount || 0).toFixed(2)}`,
    shippingAddress: dbOrder.shippingAddress || {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    billingAddress: dbOrder.billingAddress?.sameAsShipping !== undefined 
      ? dbOrder.billingAddress 
      : {
          sameAsShipping: true,
          ...(dbOrder.billingAddress || {}),
        },
  };
}

/**
 * Get order status display info
 */
export function getOrderStatusInfo(order: any) {
  const isPaymentPaid = order.paymentStatus === 'PAID';
  const isFulfilled = order.orderItems?.every(
    (item: any) => item.fulfillmentStatus === 'FULFILLED'
  );

  return {
    payment: {
      status: isPaymentPaid ? 'paid' : 'pending',
      label: isPaymentPaid ? 'Payment Received' : 'Payment Pending',
      className: isPaymentPaid 
        ? 'text-[#00AC61] bg-[#00AC6114]' 
        : 'text-[#FF9500] bg-[#FF950014]',
    },
    fulfillment: {
      status: isFulfilled ? 'fulfilled' : 'unfulfilled',
      label: isFulfilled ? 'Fulfilled' : 'Unfulfilled',
      className: isFulfilled
        ? 'bg-[#00AC6114] text-[#00AC61]'
        : 'bg-[#FF3A4414] text-[#FF3A44]',
    },
  };
}

/**
 * Format order ID for display
 */
export function formatOrderId(orderId: string, length: number = 8): string {
  return `#${orderId.slice(0, length)}`;
}