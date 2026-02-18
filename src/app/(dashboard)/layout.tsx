// import Sidebar from "@/components/pages/dashboardLayout/sidebar";
// import TopNav from "@/components/pages/dashboardLayout/top-nav";
// // import Link from "next/link";
// // import { FaPlus } from "react-icons/fa6";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <div className={`flex h-screen font-poppins`}>
//           <Sidebar className="!flex-shrink-0" />
//           <div className="w-full flex flex-1 flex-col">
//             <header className="h-[100px]">
//               <TopNav />
//             </header>

//             {/* <Link
//               href={"/dashboard/product-management/add-product"}
//               className="lg:hidden items-center justify-center rounded-full size-11 bg-primary text-white  flex md:relative fixed right-6 top-1/2 -translate-y-1/2 z-[5656566]"
//             >
//               <FaPlus />
//             </Link> */}
//             <main className="flex-1 overflow-auto p-6 bg-white flex-shrink-0">
//               {children}
//             </main>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }
import Sidebar from "@/components/pages/dashboardLayout/sidebar";
import TopNav from "@/components/pages/dashboardLayout/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen font-poppins">
      <Sidebar className="!flex-shrink-0" />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-[100px]">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-white flex-shrink-0">
          {children}
        </main>
      </div>
    </div>
  );
}