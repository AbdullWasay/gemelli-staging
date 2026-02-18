// import { getSidebarState } from "@/actions/sidebar-actions";
// import SettingsLayout from "@/components/pages/dashboardLayout/Dashboard/DashboardSettingsComponent/SettingsLayout";
// import SettingsToggleButton from "@/components/pages/dashboardLayout/Dashboard/DashboardSettingsComponent/SettingsToggleButton";
// import Heading from "@/components/ui/Heading/Heading";
// import React from "react";
// // import { IoSettingsOutline } from "react-icons/io5";


// export default async function SettingsLayoutPage({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const isSidebarOpen = await getSidebarState();
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-5">
//         <Heading className="">Settings</Heading>
//         {/* <IoSettingsOutline className="animate-spin hover:animate-none size-6 lg:hidden block text-red-400" /> */}
//         <SettingsToggleButton initialOpen={isSidebarOpen} />
//       </div>
//       <div className="flex bg-bg-primary rounded-[20px] overflow-hidden">
//         <SettingsLayout initialOpen={isSidebarOpen}/>
//         <main className="flex-1 px-6 py-4">{children}</main>
//       </div>
//     </div>
//   );
// }



import Heading from "@/components/ui/Heading/Heading";

import SettingsLayout from "@/components/pages/dashboardLayout/Dashboard/DashboardSettingsComponent/SettingsLayout";
import SettingsToggleButton from "@/components/pages/dashboardLayout/Dashboard/DashboardSettingsComponent/SettingsToggleButton";

export default function SettingsLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <Heading>Settings</Heading>
        <SettingsToggleButton />
      </div>
      <div className="flex bg-bg-primary rounded-[20px] overflow-hidden">
        <SettingsLayout />
        <main className="flex-1 px-6 py-4">{children}</main>
      </div>
    </div>
  );
}