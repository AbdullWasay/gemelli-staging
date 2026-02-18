"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SettingsLayout = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

 
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState) setIsOpen(savedState === "true");
  }, []);

  
  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(isOpen));
  }, [isOpen]);




  
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  const menuItems = [
    {
      id: 1,
      label: "Account",
      path: "/dashboard/settings/account",
    },
    {
      id: 2,
      label: "Sales",
      path: "/dashboard/settings/sales",
    },
    {
      id: 3,
      label: "Financial",
      path: "/dashboard/settings/financial",
    },
    {
      id: 4,
      label: "AI & Referrals",
      path: "/dashboard/settings/ai-and-referrals",
    },
    {
      id: 5,
      label: "Subscriptions & Plans",
      path: "/dashboard/settings/subscriptions-and-plans",
    },
    {
      id: 6,
      label: "Notifications",
      path: "/dashboard/settings/notifications",
    },
    {
      id: 7,
      label: "Security & Privacy",
      path: "/dashboard/settings/security-and-privacy",
    },
  ];

  return (
    <div className="font-poppins text-[15px] text-text-secondary">
      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 !z-[1000000] xl:hidden ">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-64 bg-white z-50 px-4 pt-[200px]">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  href={item.path}
                  key={item.id}
                  className={`p-2 rounded transition-colors text-[15px] text-[#646464] font-poppins font-medium  ${
                    pathname === item.path ? "text-primary" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden xl:flex flex-col w-64 border-r h-[95%] my-4 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            href={item.path}
            key={item.id}
            className={`p-2 rounded transition-colors text-[15px] text-[#646464] font-poppins font-medium ${
              pathname === item.path ? "text-primary" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsLayout;
