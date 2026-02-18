// "use client"
// import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';

// interface OrderData {
//     id: string;
//     customerInfo: {
//         email: string;
//         firstName: string;
//         lastName: string;
//         address: string;
//         city: string;
//         country: string;
//         areaCode: string;
//         phone: string;
//     };
//     paymentMethod: string;
//     total: number;
//     subTotal: number;
//     shipping: number;
//     date: string;
//     status: string;
//     cartItems: {
//         id: string;
//         title: string;
//         size: string;
//         brand: string;
//         quantity: number;
//         price: string;
//         currency?: string;
//         image?: string;
//     }[];
// }

// const OrderDetailsPage = () => {
//     const [orders, setOrders] = useState<OrderData[]>([]);

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
//             if (storedOrders && storedOrders.length > 0) {
//                 setOrders(storedOrders);
//             }
//         }
//     }, []);

//     // Format date for display
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const { currency: globalCurrency } = useSelector(
//         (state: RootState) => state.currency
//     );



//     return (
//         <div className='container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins'>
//             <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-6 lg:mb-10">Order Details</h1>

//             {orders.length === 0 ? (
//                 <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
//                     <p className="text-lg font-medium">No orders found</p>
//                 </div>
//             ) : (
//                 orders.map((order, orderIndex) => (
//                     <div key={order.id} className="mb-12">
//                         <h2 className="text-xl md:text-2xl font-semibold mb-4">Order #{order.id}</h2>
//                         <div className='flex flex-col md:flex-row gap-5'>
//                             <div className="w-full">
//                                 <div className="bg-[#F9F9F9] rounded-lg p-6">
//                                     {/* Header with delivery and total */}
//                                     <div className="flex justify-between items-center mb-6">
//                                         <div className="flex items-center gap-2 text-gray-600">
//                                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28" fill="none">
//                                                 <path d="M22.1667 5.83317H19.7435C19.3515 3.613 17.6983 1.78017 15.4572 1.20384C14.84 1.044 14.1983 1.41967 14.0362 2.04267C13.8752 2.66684 14.252 3.30267 14.8762 3.4625C16.4208 3.86034 17.5 5.2545 17.5 6.85284V19.8332H4.66667C3.37983 19.8332 2.33333 18.7867 2.33333 17.4998V12.8332H5.25C5.89517 12.8332 6.41667 12.3105 6.41667 11.6665C6.41667 11.0225 5.89517 10.4998 5.25 10.4998H2.33333C1.0465 10.4998 0 11.5463 0 12.8332V17.4998C0 19.6932 1.52133 21.5377 3.56417 22.0347C3.52217 22.2692 3.5 22.5083 3.5 22.7498C3.5 25.0015 5.33167 26.8332 7.58333 26.8332C9.835 26.8332 11.6667 25.0015 11.6667 22.7498C11.6667 22.5527 11.6515 22.359 11.6235 22.1665H16.3765C16.3485 22.359 16.3333 22.5527 16.3333 22.7498C16.3333 25.0015 18.165 26.8332 20.4167 26.8332C22.6683 26.8332 24.5 25.0015 24.5 22.7498C24.5 22.5083 24.4778 22.2692 24.4358 22.0347C26.4787 21.5377 28 19.6932 28 17.4998V11.6665C28 8.45 25.3832 5.83317 22.1667 5.83317ZM25.6667 11.6665V12.8332H19.8333V8.1665H22.1667C24.0963 8.1665 25.6667 9.73684 25.6667 11.6665ZM9.33333 22.7498C9.33333 23.7147 8.54817 24.4998 7.58333 24.4998C6.6185 24.4998 5.83333 23.7147 5.83333 22.7498C5.83333 22.5293 5.8765 22.3345 5.9395 22.1665H9.22833C9.29133 22.3345 9.3345 22.5293 9.3345 22.7498H9.33333ZM20.4167 24.4998C19.4518 24.4998 18.6667 23.7147 18.6667 22.7498C18.6667 22.5293 18.7098 22.3345 18.7728 22.1665H22.0617C22.1247 22.3345 22.1678 22.5293 22.1678 22.7498C22.1678 23.7147 21.3815 24.4998 20.4167 24.4998ZM23.3333 19.8332H19.8333V15.1665H25.6667V17.4998C25.6667 18.7867 24.6202 19.8332 23.3333 19.8332ZM0 2.33317C0 1.68917 0.5215 1.1665 1.16667 1.1665H10.6797C11.3248 1.1665 11.8463 1.68917 11.8463 2.33317C11.8463 2.97717 11.3248 3.49984 10.6797 3.49984H1.16667C0.5215 3.49984 0 2.97717 0 2.33317ZM0 6.99984C0 6.35584 0.5215 5.83317 1.16667 5.83317H8.34633C8.9915 5.83317 9.513 6.35584 9.513 6.99984C9.513 7.64384 8.9915 8.1665 8.34633 8.1665H1.16667C0.5215 8.1665 0 7.64384 0 6.99984Z" fill="#646464" />
//                                             </svg>
//                                             <span className="text-sm md:text-base font-medium">EXPRESS DELIVERY</span>
//                                         </div>
//                                         <div className="text-sm md:text-base font-medium">
//                                             {order.total.toFixed(2)} {globalCurrency}
//                                         </div>
//                                     </div>

//                                     {/* Product details */}
//                                     {order.cartItems.map((item, index) => (
//                                         <div key={`${order.id}-item-${index}`} className="flex items-center gap-4 pb-6 border-b border-text-black/30 mt-8">
//                                             <div className="flex-shrink-0 w-28 h-28 bg-white rounded-md overflow-hidden flex items-center justify-center">
//                                                 <Image
//                                                     src={item.image || "/placeholder.svg?height=80&width=80"}
//                                                     alt={item.title}
//                                                     width={80}
//                                                     height={80}
//                                                     className="object-contain"
//                                                 />
//                                             </div>
//                                             <div className="flex-1 flex flex-col justify-center h-20">
//                                                 <h3 className="font-semibold mb-1 text-base md:text-lg">{item.title}</h3>
//                                                 <div className="text-text-secondary/80 font-medium mb-1 text-sm md:text-base">SIZE : {item.size}, {item.brand}</div>
//                                                 <div className="text-text-secondary/80 font-medium mb-1 text-sm md:text-base">QUANTITY : {item.quantity}</div>
//                                                 <div className="text-primary font-semibold text-sm md:text-base"> {(() => {
//                                                     const [amount, currency] = item.price.trim().split(/\s+/);
//                                                     const formattedAmount = parseFloat(amount).toFixed(2);
//                                                     return `${formattedAmount} ${currency}`;
//                                                 })()}</div>
//                                             </div>
//                                         </div>
//                                     ))}

//                                     {/* Shipping address section */}
//                                     <div className="mt-4">
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <p className="font-medium text-text-black text-base md:text-lg">Shipping Address</p>
//                                         </div>
//                                         <div className="text-sm text-text-secondary mb-0">
//                                             {order.customerInfo.firstName} {order.customerInfo.lastName}<br />
//                                             {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.country}<br />
//                                             {order.customerInfo.phone}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col gap-5 w-full">
//                                 <div className="bg-[#F9F9F9] p-6 rounded-lg">
//                                     <div className="space-y-2">
//                                         <div className="flex items-center gap-2 text-base md:text-lg font-medium">
//                                             <h2>Order #</h2>
//                                             <span>{order.id}</span>
//                                         </div>
//                                         <p className="text-text-secondary/80 font-medium">Placed On {formatDate(order.date)}</p>
//                                         <p className="text-[#4046DE] font-medium">
//                                             Paid By {order.paymentMethod === 'card' ? 'Card' :
//                                                 order.paymentMethod === 'google' ? 'Google Pay' :
//                                                     order.paymentMethod}
//                                         </p>
//                                         <p className="font-medium">Status: <span className="capitalize">{order.status}</span></p>
//                                     </div>
//                                 </div>

//                                 <div className="bg-[#F9F9F9] p-6 rounded-lg">
//                                     <h2 className="text-lg md:text-xl font-semibold text-text-black mb-6">Order Summary</h2>

//                                     <div className="space-y-4">
//                                         <div className="flex justify-between">
//                                             <span className="text-text-secondary font-medium">Sub-Total</span>
//                                             <span className="font-medium">{order.subTotal.toFixed(2)} {globalCurrency} </span>
//                                         </div>

//                                         <div className="flex justify-between">
//                                             <span className="text-text-secondary font-medium">Shipping Fee</span>
//                                             <span className="font-medium">{order.shipping} {globalCurrency}</span>
//                                         </div>

//                                         <div className="flex justify-between mt-6">
//                                             <span className="text-text-secondary font-medium">Total</span>
//                                             <span className="text-xl font-bold">{order.total.toFixed(2)} {globalCurrency}</span>
//                                         </div>

//                                         <p className="text-[#4046DE] font-medium">
//                                             Paid By {order.paymentMethod === 'card' ? 'Card' :
//                                                 order.paymentMethod === 'google' ? 'Google Pay' :
//                                                     order.paymentMethod}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {orderIndex < orders.length - 1 && (
//                             <div className="border-b border-gray-200 my-10"></div>
//                         )}
//                     </div>
//                 ))
//             )}
//         </div>
//     )
// }

// export default OrderDetailsPage

//src\components\pages\OrderDetails\OrderDetailsPage.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/redux/features/orders/ordersApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { Select, Input, Button, message } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const OrderDetailsPage = () => {
    const params = useParams();
    const orderId = params.id as string;
    const user = useSelector(selectCurrentUser);
    const isSeller = user?.role === 'SELLER';

    // Fetch order details
    const { data: orderData, isLoading, error, refetch } = useGetOrderByIdQuery(orderId);
    const order = orderData?.data?.order;

    // Update order status mutation
    const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    // Local state for status updates
    const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({});
    const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});

    const { currency: globalCurrency } = useSelector(
        (state: RootState) => state.currency
    );

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle status update for a specific order item
    const handleUpdateStatus = async (orderItemId: string) => {
        const newStatus = statusUpdates[orderItemId];
        const trackingNumber = trackingNumbers[orderItemId];

        if (!newStatus) {
            message.warning('Please select a status');
            return;
        }

        try {
            await updateOrderStatus({
                orderItemId,
                status: newStatus,
                trackingNumber: trackingNumber || undefined,
            }).unwrap();

            message.success('Order status updated successfully');
            refetch();
            
            // Clear local state
            setStatusUpdates(prev => {
                const newState = { ...prev };
                delete newState[orderItemId];
                return newState;
            });
            setTrackingNumbers(prev => {
                const newState = { ...prev };
                delete newState[orderItemId];
                return newState;
            });
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update order status');
        }
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-orange-100 text-orange-800 border-orange-200',
            PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
            SHIPPED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            DELIVERED: 'bg-green-100 text-green-800 border-green-200',
            CANCELLED: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (isLoading) {
        return (
            <div className='container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins'>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className='container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins'>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 font-medium">Order not found</p>
                </div>
            </div>
        );
    }

    // Filter items for seller view
    const displayItems = isSeller 
        ? order.orderItems.filter(item => item.sellerId === user.id)
        : order.orderItems;

    return (
        <div className='container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins'>
            <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-6 lg:mb-10">
                Order Details
            </h1>

            <div className="mb-12">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                    Order #{order.id.slice(0, 8)}
                </h2>
                
                <div className='flex flex-col md:flex-row gap-5'>
                    {/* Left Column - Order Items */}
                    <div className="w-full">
                        <div className="bg-[#F9F9F9] rounded-lg p-6">
                            {/* Header with delivery and total */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28" fill="none">
                                        <path d="M22.1667 5.83317H19.7435C19.3515 3.613 17.6983 1.78017 15.4572 1.20384C14.84 1.044 14.1983 1.41967 14.0362 2.04267C13.8752 2.66684 14.252 3.30267 14.8762 3.4625C16.4208 3.86034 17.5 5.2545 17.5 6.85284V19.8332H4.66667C3.37983 19.8332 2.33333 18.7867 2.33333 17.4998V12.8332H5.25C5.89517 12.8332 6.41667 12.3105 6.41667 11.6665C6.41667 11.0225 5.89517 10.4998 5.25 10.4998H2.33333C1.0465 10.4998 0 11.5463 0 12.8332V17.4998C0 19.6932 1.52133 21.5377 3.56417 22.0347C3.52217 22.2692 3.5 22.5083 3.5 22.7498C3.5 25.0015 5.33167 26.8332 7.58333 26.8332C9.835 26.8332 11.6667 25.0015 11.6667 22.7498C11.6667 22.5527 11.6515 22.359 11.6235 22.1665H16.3765C16.3485 22.359 16.3333 22.5527 16.3333 22.7498C16.3333 25.0015 18.165 26.8332 20.4167 26.8332C22.6683 26.8332 24.5 25.0015 24.5 22.7498C24.5 22.5083 24.4778 22.2692 24.4358 22.0347C26.4787 21.5377 28 19.6932 28 17.4998V11.6665C28 8.45 25.3832 5.83317 22.1667 5.83317ZM25.6667 11.6665V12.8332H19.8333V8.1665H22.1667C24.0963 8.1665 25.6667 9.73684 25.6667 11.6665ZM9.33333 22.7498C9.33333 23.7147 8.54817 24.4998 7.58333 24.4998C6.6185 24.4998 5.83333 23.7147 5.83333 22.7498C5.83333 22.5293 5.8765 22.3345 5.9395 22.1665H9.22833C9.29133 22.3345 9.3345 22.5293 9.3345 22.7498H9.33333ZM20.4167 24.4998C19.4518 24.4998 18.6667 23.7147 18.6667 22.7498C18.6667 22.5293 18.7098 22.3345 18.7728 22.1665H22.0617C22.1247 22.3345 22.1678 22.5293 22.1678 22.7498C22.1678 23.7147 21.3815 24.4998 20.4167 24.4998ZM23.3333 19.8332H19.8333V15.1665H25.6667V17.4998C25.6667 18.7867 24.6202 19.8332 23.3333 19.8332ZM0 2.33317C0 1.68917 0.5215 1.1665 1.16667 1.1665H10.6797C11.3248 1.1665 11.8463 1.68917 11.8463 2.33317C11.8463 2.97717 11.3248 3.49984 10.6797 3.49984H1.16667C0.5215 3.49984 0 2.97717 0 2.33317ZM0 6.99984C0 6.35584 0.5215 5.83317 1.16667 5.83317H8.34633C8.9915 5.83317 9.513 6.35584 9.513 6.99984C9.513 7.64384 8.9915 8.1665 8.34633 8.1665H1.16667C0.5215 8.1665 0 7.64384 0 6.99984Z" fill="#646464" />
                                    </svg>
                                    <span className="text-sm md:text-base font-medium">EXPRESS DELIVERY</span>
                                </div>
                                <div className="text-sm md:text-base font-medium">
                                    ${order.totalAmount.toFixed(2)} {globalCurrency}
                                </div>
                            </div>

                            {/* Product details */}
                            {displayItems.map((item, index) => (
                                <div key={item.id} className="mb-6">
                                    <div className="flex items-center gap-4 pb-4 border-b border-text-black/30">
                                        <div className="flex-shrink-0 w-28 h-28 bg-white rounded-md overflow-hidden flex items-center justify-center">
                                            <Image
                                                src={item.imageUrl || "/placeholder.svg"}
                                                alt={item.productName}
                                                width={80}
                                                height={80}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1 text-base md:text-lg">{item.productName}</h3>
                                            {item.size && (
                                                <div className="text-text-secondary/80 font-medium mb-1 text-sm md:text-base">
                                                    SIZE: {item.size}
                                                </div>
                                            )}
                                            {item.productSku && (
                                                <div className="text-text-secondary/80 font-medium mb-1 text-sm md:text-base">
                                                    SKU: {item.productSku}
                                                </div>
                                            )}
                                            <div className="text-text-secondary/80 font-medium mb-1 text-sm md:text-base">
                                                QUANTITY: {item.quantity}
                                            </div>
                                            <div className="text-primary font-semibold text-sm md:text-base">
                                                ${(item.price * item.quantity).toFixed(2)} {globalCurrency}
                                            </div>
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.fulfillmentStatus)}`}>
                                                    {item.fulfillmentStatus}
                                                </span>
                                            </div>
                                            {item.trackingNumber && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    Tracking: <span className="font-medium">{item.trackingNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Seller Controls */}
                                    {isSeller && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <h4 className="font-semibold text-sm mb-3">Update Order Status</h4>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Select
                                                    value={statusUpdates[item.id] || item.fulfillmentStatus}
                                                    onChange={(value) => setStatusUpdates(prev => ({ ...prev, [item.id]: value }))}
                                                    style={{ width: '100%', maxWidth: 200 }}
                                                    size="large"
                                                >
                                                    <Option value="PENDING">Pending</Option>
                                                    <Option value="PROCESSING">Processing</Option>
                                                    <Option value="SHIPPED">Shipped</Option>
                                                    <Option value="DELIVERED">Delivered</Option>
                                                    <Option value="CANCELLED">Cancelled</Option>
                                                </Select>
                                                
                                                {(statusUpdates[item.id] === 'SHIPPED' || statusUpdates[item.id] === 'DELIVERED') && (
                                                    <Input
                                                        placeholder="Tracking Number (Optional)"
                                                        value={trackingNumbers[item.id] || ''}
                                                        onChange={(e) => setTrackingNumbers(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                        size="large"
                                                        style={{ maxWidth: 300 }}
                                                    />
                                                )}
                                                
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleUpdateStatus(item.id)}
                                                    loading={isUpdating}
                                                    disabled={!statusUpdates[item.id] || statusUpdates[item.id] === item.fulfillmentStatus}
                                                    size="large"
                                                >
                                                    Update Status
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Shipping address section */}
                            <div className="mt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="font-medium text-text-black text-base md:text-lg">Shipping Address</p>
                                </div>
                                <div className="text-sm text-text-secondary">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.areaCode}<br />
                                    {order.shippingAddress.country}<br />
                                    {order.shippingAddress.phone}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Info & Summary */}
                    <div className="flex flex-col gap-5 w-full md:w-1/2">
                        <div className="bg-[#F9F9F9] p-6 rounded-lg">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-base md:text-lg font-medium">
                                    <h2>Order #</h2>
                                    <span>{order.id.slice(0, 8)}</span>
                                </div>
                                <p className="text-text-secondary/80 font-medium">
                                    Placed On {formatDate(order.createdAt)}
                                </p>
                                <p className="text-[#4046DE] font-medium">
                                    Paid By {order.paymentMethod === 'card' ? 'Card' : order.paymentMethod}
                                </p>
                                <p className="font-medium">
                                    Payment Status: <span className={`capitalize ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </p>
                                <p className="font-medium">
                                    Customer: <span className="text-text-secondary">{order.user?.name || order.customerEmail}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#F9F9F9] p-6 rounded-lg">
                            <h2 className="text-lg md:text-xl font-semibold text-text-black mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary font-medium">Sub-Total</span>
                                    <span className="font-medium">${order.subTotal.toFixed(2)} {globalCurrency}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-text-secondary font-medium">Shipping Fee</span>
                                    <span className="font-medium">${order.shippingCost.toFixed(2)} {globalCurrency}</span>
                                </div>

                                <div className="flex justify-between pt-4 border-t border-gray-300">
                                    <span className="text-text-secondary font-medium">Total</span>
                                    <span className="text-xl font-bold">${order.totalAmount.toFixed(2)} {globalCurrency}</span>
                                </div>

                                <p className="text-[#4046DE] font-medium pt-2">
                                    Paid By {order.paymentMethod === 'card' ? 'Card' : order.paymentMethod}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;