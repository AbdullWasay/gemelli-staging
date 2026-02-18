"use client";

import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import watch from "@/assets/Banner/watch.png";

import DashboardCard from "./Dashboard/DashboardCard";
import Heading from "@/components/ui/Heading/Heading";
import Statistics from "./Dashboard/Statistics";
import SalesAndTarget from "./Dashboard/SalesAndTarget";
import TopFiveProducts from "./Dashboard/TopFiveProducts";

// import Content from "./content";

export default function Dashboard() {
  const statsRef = useRef<HTMLDivElement>(null);
  const user = useSelector(selectCurrentUser);
  const userName = user?.name || "User";

  const handleReviewStats = () => {
    statsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const productOfMonthData = {
    title: "Product Of The Month",
    name: "Apple Watch Ultra",
    price: 40,
    currency: "USDT",
    rating: 4.5,
    maxRating: 5,
    image: watch.src,
  };

  return (
    <div>
      <h4 className="text-[20px] font-semibold font-poppins mb-[55px]">
        Dashboard
      </h4>

      <DashboardCard
        userName={userName}
        gradientFrom="from-[#FF3A44]"
        gradientTo="to-[#7157BA]"
        productOfMonth={productOfMonthData}
        buttonAction={handleReviewStats}
      />

      <div ref={statsRef}>
      <Heading>Statistics</Heading>
      <Statistics />
      </div>

      <Heading>Sales Performance vs. Target</Heading>
      <SalesAndTarget/>


      <Heading>Top 5 products</Heading>
      <TopFiveProducts/>

    </div>
  );
}
