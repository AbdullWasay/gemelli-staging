import Heading from "@/components/ui/Heading/Heading";
import { campaigns } from "@/data/Campaigns";
import React from "react";

const CampaignsPerformance = () => {
  return (
    <div className="w-full">
      <Heading className="!text-[18px] mb-4">Campaigns overview</Heading>

      {/* Container for horizontal scrolling */}
      <div className="w-full overflow-x-auto">
        {/* Custom table with minimum width */}
        <div className="grid grid-cols-5 gap-y-4 min-w-[600px]">
          {/* Table Header */}
          <div className="text-[16px] font-poppins text-[#151D48] font-medium  bg-[#EDF4FF] p-4 rounded-tl-md rounded-bl-md">
            Campaign
          </div>
          <div className="text-[16px] font-poppins text-[#151D48] font-medium  bg-[#EDF4FF] p-4">Impressions</div>
          <div className="text-[16px] font-poppins text-[#151D48] font-medium  bg-[#EDF4FF] p-4">Clicks</div>
          <div className="text-[16px] font-poppins text-[#151D48] font-medium  bg-[#EDF4FF] p-4">CPC</div>
          <div className="text-[16px] font-poppins text-[#151D48] font-medium  bg-[#EDF4FF] p-4 rounded-tr-md rounded-br-md">
            Spend
          </div>

          {/* Table Rows */}
          {campaigns.map((order, index) => (
            <React.Fragment key={`row-${index}`}>
              <div className="py-4 bg-[#F9F9F9] px-4 rounded-tl-md rounded-bl-md font-medium text-[15px] text-text-secondary font-poppins">
                {order.name}
              </div>
              <div className="py-4 bg-[#F9F9F9] px-4 font-medium text-[15px] text-text-secondary font-poppins">{order.impressions}</div>
              <div className="py-4 bg-[#F9F9F9] px-4 font-medium text-[15px] text-text-secondary font-poppins">{order.clicks}</div>
              <div className="py-4 bg-[#F9F9F9] px-4 font-medium text-[15px] text-text-secondary font-poppins">{order.cpc}</div>
              <div className="py-4 bg-[#F9F9F9] px-4 rounded-tr-md rounded-br-md font-medium text-[15px] text-text-secondary font-poppins">
                {order.spend}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPerformance;
