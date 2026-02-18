import React from "react";
import StoreProducts from "@/components/pages/home/StoreProducts/StoreProducts";

const page = () => {
  return (
    <div className="font-poppins">
      <div className="xl:px-20">
        {/* <Categories />         */}
        {/* Store-wise Products */}
        <div className="my-10">
          <StoreProducts />
        </div>
      </div>
    </div>
  );
};

export default page;
