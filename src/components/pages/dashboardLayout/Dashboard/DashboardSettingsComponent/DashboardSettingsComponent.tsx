"use client";

import Heading from "@/components/ui/Heading/Heading";
import { IoSettingsOutline } from "react-icons/io5";
// import React, { useState } from "react";
// import SettingsLayout from "./SettingsLayout";

const DashboardSettingsComponent = () => {
  // const [open,setOpen]=useState(false)
  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading className="!text-[24px] mb-[20px]">Settings</Heading>

        <IoSettingsOutline className="animate-spin hover:animate-none size-6 lg:hidden block text-red-400" onClick={()=>{
          // setOpen(true)
        }}/>
      </div>

      {/* <SettingsLayout open={open} /> */}
    </div>
  );
};

export default DashboardSettingsComponent;
