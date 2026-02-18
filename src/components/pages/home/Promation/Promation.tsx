"use client";
import React from "react";
import FirstPromation from "./FirstPromation";
import SecondPromation from "./SecondPromation";

const Promation = () => {
  return (
    <div className="container p-0 mx-auto mb-7 mt-12 md:mt-20">
      {/* <div className="text-center poppins">
        <h1 className="font-semibold text-[28px] md:text-[32px]">
          Weekly Promotions
        </h1>
        <div className="lg:max-w-2xl mx-auto mt-3">
          <p className="text-[#333] opacity-80 text-base md:text-[17px] font-medium">
            Don’t miss out on our limited-time weekly promotions! Shop now for
            the best discounts on your favorite items.
          </p>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-3 lg:gap-5  mt-6 sm:mt-10 lg:mt-14 ">
        <div>
          <FirstPromation />
        </div>
        <div>
          <SecondPromation />
        </div>
      </div>
    </div>
  );
};

export default Promation;
