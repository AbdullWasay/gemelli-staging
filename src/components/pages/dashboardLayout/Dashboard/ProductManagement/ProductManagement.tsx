import Heading from "@/components/ui/Heading/Heading";
import React from "react";
import PMcard from "./PMcard";
import { ProductOverviewTable } from "./ProductOverviewTable";


const ProductManagement = () => {
  return (
    <div className="px-4 sm:px-0 max-w-full overflow-x-hidden">
      <Heading className="!text-[20px] sm:!text-[24px]">Product Management</Heading>
      <PMcard />

      <Heading className="!text-[18px] sm:!text-[20px] mt-6 sm:mt-8">Products overview</Heading>
      <ProductOverviewTable />
    </div>
  );
};

export default ProductManagement;
