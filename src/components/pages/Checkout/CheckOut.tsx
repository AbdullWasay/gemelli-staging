// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { useState, useEffect } from "react";
// import { Input, Checkbox, Select, Radio, Button, Card, Space, Divider, Form } from "antd";
// import ReusableButton from "@/components/shared/Button/MakeButton";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import { useGetCartQuery } from "@/redux/features/cart/cartApi";
// import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
// import { toast } from "react-toastify";

// interface LocalStorageCartItem {
//   id: string;
//   title: string;
//   price: string | number;  // Changed from just 'string'
//   currency: string;
//   image: string;
//   quantity: number;
//   brand: string;
//   size: string;
// }

// export default function CheckOut() {
//   const [form] = Form.useForm();
//   const router = useRouter();
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [billingAddress, setBillingAddress] = useState("same");
//   const [showBillingForm, setShowBillingForm] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [localCartItems, setLocalCartItems] = useState<LocalStorageCartItem[]>([]);
//   const [isLocalCart, setIsLocalCart] = useState(false);

//   const { currency: globalCurrency } = useSelector((state: RootState) => state.currency);
//   const user = useSelector((state: RootState) => state.auth.user);
//   const accessToken = useSelector((state: RootState) => state.auth.access_token);
  
//   // Debug: Log auth state
//   useEffect(() => {
//     console.log('🔐 Auth State:', { 
//       user, 
//       accessToken: accessToken ? '✅ Present' : '❌ Missing',
//       skipCartQuery: !user || !accessToken 
//     });
//   }, [user, accessToken]);

//   // Fetch cart from database if user is logged in
//   // FIXED: Only skip if BOTH are falsy, not if either is falsy
//   const shouldSkipCart = !user && !accessToken;
//   const { data: cartData, isLoading: cartLoading, error: cartError } = useGetCartQuery(undefined, {
//     skip: shouldSkipCart,
//   });

//   // Debug cart query
//   useEffect(() => {
//     console.log('🛒 Cart Query State:', {
//       shouldSkip: shouldSkipCart,
//       isLoading: cartLoading,
//       hasData: !!cartData,
//       itemCount: cartData?.data?.cart?.items?.length || 0,
//       error: cartError,
//     });
//   }, [shouldSkipCart, cartLoading, cartData, cartError]);

//   // Hook for creating orders
//   const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

//   const cart = cartData?.data?.cart;
//   const dbCartItems = cart?.items || [];

//   // Load localStorage cart
//   useEffect(() => {
//     if (!user || !accessToken) {
//       try {
//         const storedCart = localStorage.getItem("cart");
//         if (storedCart) {
//           const parsedCart = JSON.parse(storedCart);
//           setLocalCartItems(parsedCart);
//           setIsLocalCart(true);
//           console.log('📦 Loaded cart from localStorage:', parsedCart.length, 'items');
//         }
//       } catch (error) {
//         console.error("Error loading cart from localStorage:", error);
//       }
//     } else {
//       setIsLocalCart(false);
//       console.log('📦 Using database cart:', dbCartItems.length, 'items');
//     }
//   }, [user, accessToken, dbCartItems.length]);

//   const cartItems = isLocalCart ? localCartItems : dbCartItems;

//   // Calculate totals
//   const subTotal: number = isLocalCart
//     ? localCartItems.reduce((sum, item) => {
//         const price = typeof item.price === 'string' 
//           ? parseFloat(item.price.replace(/[^0-9.]/g, "")) 
//           : typeof item.price === 'number'
//           ? item.price
//           : 0;
//         return sum + price * item.quantity;
//       }, 0)
//     : dbCartItems.reduce((sum, item) => {
//         return sum + item.product.price * item.quantity;
//       }, 0);

//   const shippingCost: number = 20;
//   const total: number = subTotal + shippingCost;

//   const initialValues = {
//     country: "United States",
//   };

//   // Auto-fill address using geolocation
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//           );
//           const data = await res.json();

//           const address = data.address?.road || data.address?.suburb || "";
//           const city =
//             data.address?.city ||
//             data.address?.town ||
//             data.address?.village ||
//             data.address?.county ||
//             "";

//           form.setFieldsValue({
//             address: address,
//             city: city,
//           });
//         } catch (err) {
//           console.error("Reverse geocoding failed:", err);
//         }
//       });
//     }
//   }, [form]);

//   // Handle order creation
//   const handleCompleteOrder = async () => {
//     try {
//       // Validate form
//       await form.validateFields();

//       // Check if cart is empty
//       if (cartItems.length === 0) {
//         toast.error("Your cart is empty");
//         return;
//       }

//       // Check if user is logged in
//       if (!user || !accessToken) {
//         toast.error("Please login to complete your order");
//         router.push("/login");
//         return;
//       }

//       // Optional: Check if user is a buyer (not a seller)
//       if (user.role === "SELLER") {
//         toast.warning("Please use a buyer account to place orders");
//         return;
//       }

//       setIsProcessing(true);
//       console.log('🛒 Starting order creation...');

//       const formValues = form.getFieldsValue();

//       const customerInfo = {
//         email: formValues.email,
//         phone: formValues.phone,
//       };

//       const shippingAddress = {
//         firstName: formValues.firstName,
//         lastName: formValues.lastName,
//         address: formValues.address,
//         city: formValues.city,
//         country: formValues.country,
//         areaCode: formValues.areaCode,
//         phone: formValues.phone,
//       };

//       const billingAddressData =
//         billingAddress === "same"
//           ? { same: true }
//           : {
//               same: false,
//               name: formValues.billingAddressName,
//               address: formValues.billingAddress,
//               city: formValues.billingCity,
//               country: formValues.billingCountry,
//               areaCode: formValues.billingAreaCode,
//             };

//       const orderPayload = {
//         paymentMethod: "card",
//         customerInfo,
//         shippingAddress,
//         billingAddress: billingAddressData,
//       };

//       console.log('📤 Order payload:', orderPayload);

//       // Create order
//       const result = await createOrder(orderPayload).unwrap();

//       console.log('✅ Order result:', result);

//       if (result.success && result.data?.order) {
//         toast.success("Order created successfully!");
        
//         // Clear localStorage cart if it was used
//         if (isLocalCart) {
//           localStorage.removeItem("cart");
//           window.dispatchEvent(new Event("cartUpdated"));
//         }
        
//         // Redirect to success page
//         router.push(`/order-success?orderId=${result.data.order.id}`);
//       } else {
//         toast.error(result.error || "Failed to create order");
//         setIsProcessing(false);
//       }
//     } catch (error: any) {
//       console.error("❌ Checkout error:", error);
      
//       // Handle RTK Query error format
//       if (error?.data) {
//         toast.error(error.data.error || error.data.message || "Failed to process order");
//       } else if (error?.message) {
//         toast.error(error.message);
//       } else {
//         toast.error("Failed to process order. Please try again.");
//       }
      
//       setIsProcessing(false);
//     }
//   };

//   // Show loading only when fetching from database
//   if (!isLocalCart && cartLoading) {
//     return (
//       <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
//         <div className="flex justify-center items-center h-64">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   // Show error if cart fetch failed
//   if (!isLocalCart && cartError) {
//     console.error('Cart fetch error:', cartError);
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
//         <div className="flex flex-col items-center justify-center h-64">
//           <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
//           <Link href="/">
//             <ReusableButton variant="fill" className="px-8 py-3 !rounded-lg">
//               Continue Shopping
//             </ReusableButton>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
//       <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-6 lg:mb-10">
//         Checkout
//       </h1>

//       {/* Show login prompt if using localStorage cart */}
//       {isLocalCart && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
//           <p className="text-yellow-800 font-medium">
//             Please{" "}
//             <Link href="/login" className="text-primary underline">
//               login
//             </Link>{" "}
//             to complete your purchase
//           </p>
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row lg:gap-8">
//         {/* Left Column - Form */}
//         <div className="w-full lg:w-2/3">
//           <Form form={form} layout="vertical" initialValues={initialValues}>
//             {/* Contact Section */}
//             <div>
//               <h2 className="text-xl font-semibold mb-3">Contact</h2>
//               <Form.Item
//                 name="email"
//                 rules={[
//                   { required: true, message: "Please input your email!" },
//                   { type: "email", message: "Please enter a valid email" },
//                 ]}
//               >
//                 <Input placeholder="Enter Your E-Mail" size="large" className="py-3" />
//               </Form.Item>
//               <Form.Item name="newsletter" valuePropName="checked" className="-mt-3">
//                 <Checkbox>
//                   <span className="text-text-secondary text-sm md:text-base">
//                     Email me with news and offers
//                   </span>
//                 </Checkbox>
//               </Form.Item>
//             </div>

//             {/* Personal Information */}
//             <div>
//               <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
//               <Form.Item
//                 name="country"
//                 className="mb-4"
//                 rules={[{ required: true, message: "Please select your country!" }]}
//               >
//                 <Select
//                   size="large"
//                   placeholder="Country / Region"
//                   style={{ height: "50px" }}
//                   options={[
//                     { value: "usa", label: "United States" },
//                     { value: "uk", label: "United Kingdom" },
//                     { value: "canada", label: "Canada" },
//                     { value: "australia", label: "Australia" },
//                   ]}
//                 />
//               </Form.Item>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mt-6">
//                 <Form.Item
//                   name="firstName"
//                   rules={[{ required: true, message: "Please input your first name!" }]}
//                 >
//                   <Input placeholder="First Name" size="large" className="py-3" />
//                 </Form.Item>
//                 <Form.Item
//                   name="lastName"
//                   rules={[{ required: true, message: "Please input your last name!" }]}
//                 >
//                   <Input placeholder="Last Name" size="large" className="py-3 md:mt-0" />
//                 </Form.Item>
//               </div>

//               <Form.Item
//                 name="address"
//                 className="mb-4"
//                 rules={[{ required: true, message: "Please input your address!" }]}
//               >
//                 <Input placeholder="Address" size="large" className="py-3" />
//               </Form.Item>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mt-6">
//                 <Form.Item name="city" rules={[{ required: true, message: "Please input your city!" }]}>
//                   <Input placeholder="City" size="large" className="py-3" />
//                 </Form.Item>
//                 <Form.Item
//                   name="areaCode"
//                   rules={[{ required: true, message: "Please input your area code!" }]}
//                 >
//                   <Input placeholder="Area Code" size="large" className="py-3 md:mt-0" />
//                 </Form.Item>
//               </div>

//               <Form.Item
//                 name="phone"
//                 className="mb-4"
//                 rules={[{ required: true, message: "Please input your phone number!" }]}
//               >
//                 <Input placeholder="Enter Your Phone No." size="large" className="py-3" />
//               </Form.Item>

//               <Form.Item name="saveInfo" valuePropName="checked">
//                 <Checkbox>
//                   <span className="text-text-secondary text-sm md:text-base">
//                     Save this information for next time
//                   </span>
//                 </Checkbox>
//               </Form.Item>
//             </div>

//             {/* Shipping Information */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
//               <div className="flex justify-between items-center bg-[#F9F9F9] p-4 rounded-lg text-base">
//                 <span className="text-text-secondary/80 font-medium">Express Delivery</span>
//                 <span className="font-medium text-text-black">
//                   {shippingCost} {globalCurrency}
//                 </span>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-3">Choose Payment Method</h2>
//               <p className="text-sm text-gray-500 mb-3">
//                 (Development Mode - Order will be created without payment)
//               </p>
//               <Radio.Group
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-full"
//               >
//                 <Space direction="vertical" className="w-full space-y-1">
//                   <Card
//                     className={`w-full cursor-pointer ${
//                       paymentMethod === "card" ? "border-primary bg-[#F9F9F9]" : "bg-[#F9F9F9]"
//                     }`}
//                     styles={{ body: { padding: "14px" } }}
//                     onClick={() => setPaymentMethod("card")}
//                   >
//                     <div className="flex items-center justify-between">
//                       <Space>
//                         <div className="flex items-center gap-4">
//                           <p className="text-base text-text-secondary/90 font-medium">
//                             Card Payment (Test Mode)
//                           </p>
//                         </div>
//                       </Space>
//                       <Radio value="card" />
//                     </div>
//                   </Card>
//                 </Space>
//               </Radio.Group>
//             </div>

//             {/* Billing Address */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
//               <Radio.Group
//                 value={billingAddress}
//                 onChange={(e) => {
//                   setBillingAddress(e.target.value);
//                   setShowBillingForm(e.target.value === "different");
//                 }}
//                 className="w-full"
//               >
//                 <Space direction="vertical" className="w-full space-y-1">
//                   <Card
//                     className={`w-full cursor-pointer ${
//                       billingAddress === "same" ? "border-primary bg-[#F9F9F9]" : "bg-[#F9F9F9]"
//                     }`}
//                     styles={{ body: { padding: "14px" } }}
//                     onClick={() => {
//                       setBillingAddress("same");
//                       setShowBillingForm(false);
//                     }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <p className="text-base text-text-secondary/90 font-medium">
//                         Same As Shipping Address
//                       </p>
//                       <Radio value="same" />
//                     </div>
//                   </Card>

//                   <Card
//                     className={`w-full cursor-pointer ${
//                       billingAddress === "different" ? "border-primary bg-[#F9F9F9]" : "bg-[#F9F9F9]"
//                     }`}
//                     styles={{ body: { padding: "14px" } }}
//                     onClick={() => {
//                       setBillingAddress("different");
//                       setShowBillingForm(true);
//                     }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <p className="text-base text-text-secondary/90 font-medium">
//                         Use a Different Billing Address
//                       </p>
//                       <Radio value="different" />
//                     </div>
//                   </Card>
//                 </Space>
//               </Radio.Group>

//               {showBillingForm && (
//                 <div className="mt-4 p-4 border border-gray-200 rounded-xl">
//                   <h3 className="text-lg font-medium mb-3">Billing Address Details</h3>
//                   <Form.Item
//                     name="billingAddressName"
//                     rules={[
//                       {
//                         required: billingAddress === "different",
//                         message: "Please input address name!",
//                       },
//                     ]}
//                   >
//                     <Input
//                       placeholder="Address Name (e.g., Home, Office)"
//                       size="large"
//                       className="py-3"
//                     />
//                   </Form.Item>
//                   <Form.Item
//                     name="billingCountry"
//                     rules={[
//                       {
//                         required: billingAddress === "different",
//                         message: "Please select your country!",
//                       },
//                     ]}
//                     initialValue="United States"
//                   >
//                     <Select
//                       size="large"
//                       placeholder="Country / Region"
//                       style={{ height: "50px" }}
//                       options={[
//                         { value: "usa", label: "United States" },
//                         { value: "uk", label: "United Kingdom" },
//                         { value: "canada", label: "Canada" },
//                         { value: "australia", label: "Australia" },
//                       ]}
//                     />
//                   </Form.Item>
//                   <Form.Item
//                     name="billingAddress"
//                     rules={[
//                       {
//                         required: billingAddress === "different",
//                         message: "Please input your address!",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Address" size="large" className="py-3" />
//                   </Form.Item>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                     <Form.Item
//                       name="billingCity"
//                       rules={[
//                         {
//                           required: billingAddress === "different",
//                           message: "Please input your city!",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="City" size="large" className="py-3" />
//                     </Form.Item>
//                     <Form.Item
//                       name="billingAreaCode"
//                       rules={[
//                         {
//                           required: billingAddress === "different",
//                           message: "Please input your area code!",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="Area Code" size="large" className="py-3 md:mt-0" />
//                     </Form.Item>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Complete Order Button - Desktop */}
//             <div className="hidden lg:block">
//               <ReusableButton
//                 variant="fill"
//                 className="w-full py-4 !rounded-xl text-base font-medium"
//                 onClick={handleCompleteOrder}
//                 disabled={isProcessing || isLocalCart || isCreatingOrder}
//               >
//                 {isProcessing || isCreatingOrder
//                   ? "PROCESSING..."
//                   : isLocalCart
//                   ? "LOGIN TO COMPLETE ORDER"
//                   : "COMPLETE ORDER (TEST MODE)"}
//               </ReusableButton>
//             </div>
//           </Form>
//         </div>

//         {/* Right Column - Order Summary */}
//         <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
//           <div className="bg-[#F9F9F9] p-6 rounded-lg sticky top-4">
//             <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

//             {/* Cart Items */}
//             <div className="mb-4 max-h-80 overflow-y-auto scrollbar-hide">
//               {isLocalCart
//                 ? localCartItems.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
//                           <Image
//                             src={item.image || "/placeholder.svg"}
//                             alt={item.title}
//                             width={64}
//                             height={64}
//                             className="object-contain w-full h-full"
//                           />
//                         </div>
//                         <div>
//                           <p className="font-medium">{item.title}</p>
//                           <p className="text-sm text-gray-500">Size: {item.size}</p>
//                           <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                         </div>
//                       </div>
//                       <p className="font-medium">
//                         {typeof item.price === 'string' 
//                           ? item.price 
//                           : `${item.price.toFixed(2)}`}
//                       </p>
//                     </div>
//                   ))
//                 : dbCartItems.map((item) => {
//                     const primaryImage = item.product.productImages.find((img) => img.isPrimary);
//                     const imageUrl = primaryImage?.url || item.product.productImages[0]?.url;

//                     return (
//                       <div
//                         key={item.id}
//                         className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
//                             <Image
//                               src={imageUrl || "/placeholder.svg"}
//                               alt={item.product.name}
//                               width={64}
//                               height={64}
//                               className="object-contain w-full h-full"
//                             />
//                           </div>
//                           <div>
//                             <p className="font-medium">{item.product.name}</p>
//                             {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
//                             <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                           </div>
//                         </div>
//                         <p className="font-medium">
//                           ${(item.product.price * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     );
//                   })}
//             </div>

//             <div className="flex gap-2 mb-6 w-full">
//               <Input placeholder="Discount Code Or Gift Card" className="py-[14px] flex-1 rounded-xl" />
//               <Button
//                 type="primary"
//                 className="py-6 text-white px-6 bg-[#4046DE] hover:!bg-[#4046DE]/90 text-base font-medium rounded-xl"
//               >
//                 Apply
//               </Button>
//             </div>

//             <div className="mb-4">
//               <div className="flex justify-between mb-2 font-medium text-base">
//                 <span className="text-text-secondary">Sub-Total</span>
//                 <span className="text-text-secondary">
//                   ${subTotal.toFixed(2)} {globalCurrency}
//                 </span>
//               </div>

//               <div className="flex justify-between mb-2 font-medium text-base">
//                 <span className="text-text-secondary">Shipping</span>
//                 <span className="text-text-secondary">
//                   ${shippingCost.toFixed(2)} {globalCurrency}
//                 </span>
//               </div>
//             </div>

//             <Divider style={{ margin: "12px 0" }} />

//             <div className="flex justify-between items-center">
//               <span className="font-medium text-base text-text-secondary">Total</span>
//               <span className="text-xl font-medium">
//                 ${total.toFixed(2)} {globalCurrency}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Complete Order Button */}
//       <div className="block lg:hidden mt-5">
//         <ReusableButton
//           variant="fill"
//           className="w-full py-4 !rounded-xl text-base font-medium"
//           onClick={handleCompleteOrder}
//           disabled={isProcessing || isLocalCart || isCreatingOrder}
//         >
//           {isProcessing || isCreatingOrder
//             ? "PROCESSING..."
//             : isLocalCart
//             ? "LOGIN TO COMPLETE ORDER"
//             : "COMPLETE ORDER (TEST MODE)"}
//         </ReusableButton>
//       </div>
//     </div>
//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Input, Checkbox, Select, Radio, Button, Card, Space, Divider, Form } from "antd";
import ReusableButton from "@/components/shared/Button/MakeButton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "@/redux/features/cart/cartApi";
import { useCreateCheckoutSessionMutation } from "@/redux/features/checkout/checkoutApi";
import { toast } from "react-toastify";

interface LocalStorageCartItem {
  id: string;
  title: string;
  price: string | number;
  currency: string;
  image: string;
  quantity: number;
  brand: string;
  size: string;
}

export default function CheckOut() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingAddress, setBillingAddress] = useState("same");
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localCartItems, setLocalCartItems] = useState<LocalStorageCartItem[]>([]);
  const [isLocalCart, setIsLocalCart] = useState(false);

  const { currency: globalCurrency } = useSelector((state: RootState) => state.currency);
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.access_token);

  // Fetch cart from database if user is logged in
  const shouldSkipCart = !user && !accessToken;
  const { data: cartData, isLoading: cartLoading, error: cartError } = useGetCartQuery(undefined, {
    skip: shouldSkipCart,
  });

  // Hook for creating Stripe checkout session
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const cart = cartData?.data?.cart;
  const dbCartItems = cart?.items || [];

  // Load localStorage cart
  useEffect(() => {
    if (!user || !accessToken) {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setLocalCartItems(parsedCart);
          setIsLocalCart(true);
          console.log('Loaded cart from localStorage:', parsedCart.length, 'items');
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    } else {
      setIsLocalCart(false);
      
    }
  }, [user, accessToken, dbCartItems.length]);

  const cartItems = isLocalCart ? localCartItems : dbCartItems;

  // Effective price: use discount when product is on sale (for DB cart)
  const getEffectivePrice = (product: { price: number; onSale?: boolean; discountPrice?: number | null }) =>
    (product?.onSale && product?.discountPrice != null) ? product.discountPrice! : (product?.price ?? 0);

  // Calculate totals
  const subTotal: number = isLocalCart
    ? localCartItems.reduce((sum, item) => {
        const price = typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^0-9.]/g, "")) 
          : typeof item.price === 'number'
          ? item.price
          : 0;
        return sum + price * item.quantity;
      }, 0)
    : dbCartItems.reduce((sum, item) => {
        return sum + getEffectivePrice(item.product as { price: number; onSale?: boolean; discountPrice?: number | null }) * item.quantity;
      }, 0);

  const shippingCost: number = 20;
  const total: number = subTotal + shippingCost;

  const initialValues = {
    country: "United States",
  };

  // Auto-fill address using geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const address = data.address?.road || data.address?.suburb || "";
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";

          form.setFieldsValue({
            address: address,
            city: city,
          });
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      });
    }
  }, [form]);

  // Handle Stripe Checkout
  const handleStripeCheckout = async () => {
    try {
      // Validate form
      await form.validateFields();

      // Check if cart is empty
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // Check if user is logged in
      if (!user || !accessToken) {
        toast.error("Please login to complete your order");
        router.push("/login");
        return;
      }

      // Check if user is a buyer (not a seller)
      if (user.role === "SELLER") {
        toast.warning("Please use a buyer account to place orders");
        return;
      }

      setIsProcessing(true);
      

      const formValues = form.getFieldsValue();

      const customerInfo = {
        email: formValues.email,
        phone: formValues.phone,
      };

      const shippingAddress = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        address: formValues.address,
        city: formValues.city,
        country: formValues.country,
        areaCode: formValues.areaCode,
        phone: formValues.phone,
      };

      const billingAddressData =
        billingAddress === "same"
          ? { same: true }
          : {
              same: false,
              name: formValues.billingAddressName,
              address: formValues.billingAddress,
              city: formValues.billingCity,
              country: formValues.billingCountry,
              areaCode: formValues.billingAreaCode,
            };

      const checkoutPayload = {
        customerInfo,
        shippingAddress,
        billingAddress: billingAddressData,
      };

      

      // Create Stripe checkout session
      const result = await createCheckoutSession(checkoutPayload).unwrap();

      

      if (result.success && result.data?.url) {
        // Redirect to Stripe Checkout using the URL
        window.location.href = result.data.url;
        // Note: Don't set isProcessing to false here as we're redirecting away
      } else {
        toast.error(result.error || "Failed to create checkout session");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("❌ Checkout error:", error);
      
      // Handle RTK Query error format
      if (error?.data) {
        toast.error(error.data.error || error.data.message || "Failed to process checkout");
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to process checkout. Please try again.");
      }
      
      setIsProcessing(false);
    }
  };

  // Show loading only when fetching from database
  if (!isLocalCart && cartLoading) {
    return (
      <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show error if cart fetch failed
  if (!isLocalCart && cartError) {
    console.error('Cart fetch error:', cartError);
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <Link href="/">
            <ReusableButton variant="fill" className="px-8 py-3 !rounded-lg">
              Continue Shopping
            </ReusableButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
      <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-6 lg:mb-10">
        Checkout
      </h1>

      {/* Show login prompt if using localStorage cart */}
      {isLocalCart && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-yellow-800 font-medium">
            Please{" "}
            <Link href="/login" className="text-primary underline">
              login
            </Link>{" "}
            to complete your purchase
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Left Column - Form */}
        <div className="w-full lg:w-2/3">
          <Form form={form} layout="vertical" initialValues={initialValues}>
            {/* Contact Section */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter Your E-Mail" size="large" className="py-3" />
              </Form.Item>
              <Form.Item name="newsletter" valuePropName="checked" className="-mt-3">
                <Checkbox>
                  <span className="text-text-secondary text-sm md:text-base">
                    Email me with news and offers
                  </span>
                </Checkbox>
              </Form.Item>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
              <Form.Item
                name="country"
                className="mb-4"
                rules={[{ required: true, message: "Please select your country!" }]}
              >
                <Select
                  size="large"
                  placeholder="Country / Region"
                  style={{ height: "50px" }}
                  options={[
                    { value: "United States", label: "United States" },
                    { value: "United Kingdom", label: "United Kingdom" },
                    { value: "Canada", label: "Canada" },
                    { value: "Australia", label: "Australia" },
                  ]}
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mt-6">
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: "Please input your first name!" }]}
                >
                  <Input placeholder="First Name" size="large" className="py-3" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: "Please input your last name!" }]}
                >
                  <Input placeholder="Last Name" size="large" className="py-3 md:mt-0" />
                </Form.Item>
              </div>

              <Form.Item
                name="address"
                className="mb-4"
                rules={[{ required: true, message: "Please input your address!" }]}
              >
                <Input placeholder="Address" size="large" className="py-3" />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mt-6">
                <Form.Item name="city" rules={[{ required: true, message: "Please input your city!" }]}>
                  <Input placeholder="City" size="large" className="py-3" />
                </Form.Item>
                <Form.Item
                  name="areaCode"
                  rules={[{ required: true, message: "Please input your area code!" }]}
                >
                  <Input placeholder="Area Code" size="large" className="py-3 md:mt-0" />
                </Form.Item>
              </div>

              <Form.Item
                name="phone"
                className="mb-4"
                rules={[{ required: true, message: "Please input your phone number!" }]}
              >
                <Input placeholder="Enter Your Phone No." size="large" className="py-3" />
              </Form.Item>

              <Form.Item name="saveInfo" valuePropName="checked">
                <Checkbox>
                  <span className="text-text-secondary text-sm md:text-base">
                    Save this information for next time
                  </span>
                </Checkbox>
              </Form.Item>
            </div>

            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="flex justify-between items-center bg-[#F9F9F9] p-4 rounded-lg text-base">
                <span className="text-text-secondary/80 font-medium">Express Delivery</span>
                <span className="font-medium text-text-black">
                  {shippingCost} {globalCurrency}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Choose Payment Method</h2>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full space-y-1">
                  <Card
                    className={`w-full cursor-pointer ${
                      paymentMethod === "card" ? "border-primary bg-[#F9F9F9]" : "bg-[#F9F9F9]"
                    }`}
                    styles={{ body: { padding: "14px" } }}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center justify-between">
                      <Space>
                        <div className="flex items-center gap-4">
                          <p className="text-base text-text-secondary/90 font-medium">
                            Card Payment via Stripe
                          </p>
                        </div>
                      </Space>
                      <Radio value="card" />
                    </div>
                  </Card>
                </Space>
              </Radio.Group>
            </div>

            {/* Billing Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <Radio.Group
                value={billingAddress}
                onChange={(e) => {
                  setBillingAddress(e.target.value);
                  setShowBillingForm(e.target.value === "different");
                }}
                className="w-full"
              >
                <Space direction="vertical" className="w-full space-y-1">
                  <Card
                    className={`w-full cursor-pointer ${
                      billingAddress === "same" ? "border-primary bg-[#F9F9F9]" : "bg-[#F9F9F9]"
                    }`}
                    styles={{ body: { padding: "14px" } }}
                    onClick={() => {
                      setBillingAddress("same");
                      setShowBillingForm(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base text-text-secondary/90 font-medium">
                        Same As Shipping Address
                      </p>
                      <Radio value="same" />
                    </div>
                  </Card>

                  <Card
                    className={`w-full cursor-pointer ${
                      billingAddress === "different" ? "border-primary bg-[#F9F9F9]" : "bg-[#F9F9F9]"
                    }`}
                    styles={{ body: { padding: "14px" } }}
                    onClick={() => {
                      setBillingAddress("different");
                      setShowBillingForm(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base text-text-secondary/90 font-medium">
                        Use a Different Billing Address
                      </p>
                      <Radio value="different" />
                    </div>
                  </Card>
                </Space>
              </Radio.Group>

              {showBillingForm && (
                <div className="mt-4 p-4 border border-gray-200 rounded-xl">
                  <h3 className="text-lg font-medium mb-3">Billing Address Details</h3>
                  <Form.Item
                    name="billingAddressName"
                    rules={[
                      {
                        required: billingAddress === "different",
                        message: "Please input address name!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Address Name (e.g., Home, Office)"
                      size="large"
                      className="py-3"
                    />
                  </Form.Item>
                  <Form.Item
                    name="billingCountry"
                    rules={[
                      {
                        required: billingAddress === "different",
                        message: "Please select your country!",
                      },
                    ]}
                    initialValue="United States"
                  >
                    <Select
                      size="large"
                      placeholder="Country / Region"
                      style={{ height: "50px" }}
                      options={[
                        { value: "United States", label: "United States" },
                        { value: "United Kingdom", label: "United Kingdom" },
                        { value: "Canada", label: "Canada" },
                        { value: "Australia", label: "Australia" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="billingAddress"
                    rules={[
                      {
                        required: billingAddress === "different",
                        message: "Please input your address!",
                      },
                    ]}
                  >
                    <Input placeholder="Address" size="large" className="py-3" />
                  </Form.Item>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    <Form.Item
                      name="billingCity"
                      rules={[
                        {
                          required: billingAddress === "different",
                          message: "Please input your city!",
                        },
                      ]}
                    >
                      <Input placeholder="City" size="large" className="py-3" />
                    </Form.Item>
                    <Form.Item
                      name="billingAreaCode"
                      rules={[
                        {
                          required: billingAddress === "different",
                          message: "Please input your area code!",
                        },
                      ]}
                    >
                      <Input placeholder="Area Code" size="large" className="py-3 md:mt-0" />
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Order Button - Desktop */}
            <div className="hidden lg:block">
              <ReusableButton
                variant="fill"
                className="w-full py-4 !rounded-xl text-base font-medium"
                onClick={handleStripeCheckout}
                disabled={isProcessing || isLocalCart}
              >
                {isProcessing
                  ? "REDIRECTING TO STRIPE..."
                  : isLocalCart
                  ? "LOGIN TO COMPLETE ORDER"
                  : "PROCEED TO PAYMENT"}
              </ReusableButton>
            </div>
          </Form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-[#F9F9F9] p-6 rounded-lg sticky top-4">
            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

            {/* Cart Items */}
            <div className="mb-4 max-h-80 overflow-y-auto scrollbar-hide">
              {isLocalCart
                ? localCartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">
                        {typeof item.price === 'string' 
                          ? item.price 
                          : `${item.price.toFixed(2)}`}
                      </p>
                    </div>
                  ))
                : dbCartItems.map((item) => {
                    const primaryImage = item.product.productImages.find((img) => img.isPrimary);
                    const imageUrl = primaryImage?.url || item.product.productImages[0]?.url;
                    const product = item.product as { price: number; onSale?: boolean; discountPrice?: number | null };
                    const effectivePrice = getEffectivePrice(product);

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                            <Image
                              src={imageUrl || "/placeholder.svg"}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="font-medium flex flex-col items-end">
                          <span>
                            {(effectivePrice * item.quantity).toFixed(2)} MDL
                          </span>
                          {product.onSale && product.discountPrice != null && product.price > effectivePrice && (
                            <span className="text-sm text-text-secondary/70 line-through">
                              {(product.price * item.quantity).toFixed(2)} MDL
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>

            <div className="flex gap-2 mb-6 w-full">
              <Input placeholder="Discount Code Or Gift Card" className="py-[14px] flex-1 rounded-xl" />
              <Button
                type="primary"
                className="py-6 text-white px-6 bg-[#4046DE] hover:!bg-[#4046DE]/90 text-base font-medium rounded-xl"
              >
                Apply
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2 font-medium text-base">
                <span className="text-text-secondary">Sub-Total</span>
                <span className="text-text-secondary">
                  {subTotal.toFixed(2)} MDL
                </span>
              </div>

              <div className="flex justify-between mb-2 font-medium text-base">
                <span className="text-text-secondary">Shipping</span>
                <span className="text-text-secondary">
                  {shippingCost.toFixed(2)} MDL
                </span>
              </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div className="flex justify-between items-center">
              <span className="font-medium text-base text-text-secondary">Total</span>
              <span className="text-xl font-medium">
                {total.toFixed(2)} MDL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Complete Order Button */}
      <div className="block lg:hidden mt-5">
        <ReusableButton
          variant="fill"
          className="w-full py-4 !rounded-xl text-base font-medium"
          onClick={handleStripeCheckout}
          disabled={isProcessing || isLocalCart}
        >
          {isProcessing
            ? "REDIRECTING TO STRIPE..."
            : isLocalCart
            ? "LOGIN TO COMPLETE ORDER"
            : "PROCEED TO PAYMENT"}
        </ReusableButton>
      </div>
    </div>
  );
}