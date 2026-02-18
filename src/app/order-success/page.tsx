// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "antd";
// import congoImg from "@/assets/images/congo.png";

// export default function OrderSuccessPage() {
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get("session_id");
//   const [isVerifying, setIsVerifying] = useState(true);

//   useEffect(() => {
//     if (sessionId) {
//       // Verify the session with backend
//       // The webhook should have already created the order
//       setTimeout(() => {
//         setIsVerifying(false);
//       }, 2000);
//     } else {
//       setIsVerifying(false);
//     }
//   }, [sessionId]);

//   if (isVerifying) {
//     return (
//       <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
//         <div className="flex justify-center items-center h-64">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
//       <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center p-6">
//         <div className="flex items-center justify-center mb-6">
//           <Image
//             src={congoImg}
//             alt="Success"
//             width={120}
//             height={120}
//             className="object-contain"
//           />
//         </div>

//         <h1 className="text-3xl font-semibold text-text-black mb-4">Congratulations!</h1>

//         <p className="text-lg text-text-secondary mb-8">
//           Your order has been successfully placed and is being processed.
//         </p>

//         <div className="bg-[#F9F9F9] p-6 rounded-lg w-full mb-8">
//           <p className="text-base text-text-secondary mb-2">
//             We have sent a confirmation email with your order details.
//           </p>
//           <p className="text-base text-text-secondary">
//             Expected delivery: <span className="font-semibold text-text-black">Within 1 hour</span>
//           </p>
//         </div>

//         <div className="flex flex-col gap-4 w-full">
//           <Link href="/orders" className="w-full">
//             <Button
//               type="primary"
//               size="large"
//               className="w-full bg-primary hover:!bg-primary/90 py-6 text-base font-medium"
//             >
//               View My Orders
//             </Button>
//           </Link>

//           <Link href="/" className="w-full">
//             <Button
//               size="large"
//               className="w-full border-2 border-primary text-primary hover:!border-primary/80 hover:!text-primary/80 py-6 text-base font-medium"
//             >
//               Continue Shopping
//             </Button>
//           </Link>
//         </div>

//         {sessionId && (
//           <p className="text-sm text-text-secondary mt-6">
//             Session ID: {sessionId.substring(0, 20)}...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ReusableButton from "@/components/shared/Button/MakeButton";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    // Clear localStorage cart since order was successful
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));

    // Simulate checking order creation (webhook should have handled it)
    const timer = setTimeout(() => {
      setLoading(false);
      setOrderCreated(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Processing your order...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 mb-14 lg:mb-20 lg:mt-14 font-poppins">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-green-100 rounded-full p-6 mb-6">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-2 max-w-md">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>

        {sessionId && (
          <p className="text-sm text-gray-500 mb-8">
            Session ID: {sessionId.substring(0, 20)}...
          </p>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-md">
          <p className="text-blue-800 text-sm">
            You will receive an email confirmation shortly with your order details and tracking information.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/orders">
            <ReusableButton variant="fill" className="px-8 py-3 !rounded-lg">
              View My Orders
            </ReusableButton>
          </Link>
          
          <Link href="/">
            <ReusableButton variant="outline" className="px-8 py-3 !rounded-lg">
              Continue Shopping
            </ReusableButton>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 w-full max-w-md">
          <h3 className="font-semibold mb-3">What happens next?</h3>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li>✓ Order confirmation email sent</li>
            <li>✓ Seller(s) notified to prepare your items</li>
            <li>✓ Tracking information will be provided once shipped</li>
            <li>✓ Expected delivery: 3-5 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}