"use client";
import Image from "next/image";

type DashboardCardProps = {
  userName?: string;
  welcomeMessage?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  productOfMonth?: {
    title?: string;
    name?: string;
    price?: number;
    currency?: string;
    rating?: number;
    maxRating?: number;
    image: string;
  };
  gradientFrom?: string;
  gradientTo?: string;
};

export default function DashboardCard({
  userName = "Steve Smith",
  welcomeMessage = "Welcome Back",
  description = "Here's how your products are performing. Below, you'll find insights into your recent sales, top-performing products, and progress towards your bonus goal. Let's make this month your best one yet!",
  buttonText = "REVIEW STATS",
  buttonAction = () => console.log("Button clicked"),
  productOfMonth = {
    title: "Product Of The Month",
    name: "Apple Watch Ultra",
    price: 40,
    currency: "USDT",
    rating: 4.5,
    maxRating: 5,
    image: "/placeholder.svg?height=150&width=150",
  },
  gradientFrom = "bg-red-500",
  gradientTo = "bg-purple-500",
}: DashboardCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full mx-auto ">
      {/* Main Card */}
      <div
        className={`rounded-xl p-6 md:p-8 flex-1 flex flex-col justify-center  text-white bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
      >
        <h2 className="text-[22px] font-semibold font-poppins text-white mb-1">
          {welcomeMessage}, {userName}!
        </h2>
        <p className="text-[14px] font-poppins font-normal opacity-90 mb-6 max-w-[771px]">
          {description}
        </p>
        <button
          onClick={buttonAction}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 w-max rounded-md text-[14px] font-poppins transition-colors duration-200"
        >
          {buttonText}
        </button>
      </div>

      {/* Product of the Month Card */}
      {productOfMonth && (
        <div className="bg-[#F9F9F9] rounded-xl p-6 shadow-sm w-full md:w-64 flex flex-col items-center md:items-start">
          <h3 className="text-[#0F0F0F] text-[14px] font-semibold font-poppins mb-4">
            {productOfMonth.title}
          </h3>
          <div className="flex flex-col items-center">
            <div className="mb-4 relative w-32 h-32">
              <Image
                src={productOfMonth.image || "/placeholder.svg"}
                alt={productOfMonth.name || "Product image"}
                fill
                className="object-contain"
              />
            </div>
            <h4 className="text-[#0F0F0F] font-semibold font-poppins text-[16px]">
              {productOfMonth.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-text-secondary font-medium font-poppins text-[14px] uppercase">
                {productOfMonth.price} {productOfMonth.currency}
              </span>
              {productOfMonth.rating && (
                <div className="flex items-center">
                  <span className="mx-1 text-text-secondary font-medium font-poppins text-[14px] uppercase">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <path
                        d="M12.8132 6.78072L10.3523 8.90424L11.102 12.0799C11.1434 12.2523 11.1327 12.4331 11.0714 12.5995C11.0101 12.7658 10.9008 12.9102 10.7575 13.0145C10.6141 13.1188 10.443 13.1783 10.2659 13.1854C10.0887 13.1925 9.91344 13.1469 9.76217 13.0545L7.00045 11.3548L4.23709 13.0545C4.08584 13.1464 3.91078 13.1915 3.73394 13.1841C3.5571 13.1768 3.38639 13.1172 3.24331 13.013C3.10024 12.9089 2.99119 12.7647 2.9299 12.5986C2.86861 12.4326 2.85782 12.2521 2.89889 12.0799L3.65139 8.90424L1.19045 6.78072C1.05663 6.66507 0.959851 6.51255 0.912195 6.34221C0.864539 6.17188 0.868121 5.99128 0.922494 5.82297C0.976867 5.65465 1.07962 5.50609 1.21792 5.39583C1.35623 5.28557 1.52395 5.2185 1.70014 5.20299L4.9267 4.94268L6.17139 1.93049C6.23876 1.76633 6.35343 1.62591 6.50081 1.52708C6.6482 1.42826 6.82164 1.37549 6.99909 1.37549C7.17654 1.37549 7.34998 1.42826 7.49736 1.52708C7.64474 1.62591 7.75941 1.76633 7.82678 1.93049L9.07092 4.94268L12.2975 5.20299C12.474 5.21792 12.6422 5.28462 12.781 5.39473C12.9199 5.50484 13.0231 5.65346 13.0778 5.82197C13.1325 5.99049 13.1363 6.1714 13.0886 6.34205C13.041 6.51269 12.944 6.66548 12.8099 6.78127L12.8132 6.78072Z"
                        fill="#FF9900"
                      />
                    </svg>
                  </span>
                  <span className="text-text-secondary font-medium font-poppins text-[14px] uppercase">
                    {productOfMonth.rating}/{productOfMonth.maxRating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
