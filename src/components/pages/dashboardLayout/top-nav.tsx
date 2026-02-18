"use client";

import { DropdownMenu, DropdownMenuTrigger } from "./dropdown-menu";
import Image from "next/image";

import icon from "@/assets/images/manicon.png";
import { getProfileImageUrl } from "@/utils/imageUtils";
import NotificationDetails from "./NotificationDetails";
import Link from "next/link";
import TopNavbarSearch from "./top-navbar/TopNavbarSearch";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

export default function TopNav() {
  const handleSearch = (query: string) => {
    console.log("Search query in parent:", query);
  };

  // Get user data from Redux auth slice
  const user = useSelector(selectCurrentUser);

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between  h-full bg-[#F9F9F9]  py-5 -ml-[260px]">
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="h-16  flex items-center  border-gray-200"
      >
        <span className="text-[18px] lg:text-[27px] xl:text-[36px] font-bold hover:cursor-pointer text-primary font-rubik uppercase">
          Gemelli express
        </span>
      </Link>

      {/* Search */}
      <TopNavbarSearch onSearch={handleSearch} />

      <div className="flex items-center gap-3.5 ml-auto lg:ml-0 ">
        <Link
          href={"/dashboard/product-management/add-product"}
          className="flex items-center justify-center rounded-full lg:size-11 size-9 bg-primary text-white  "
        >
          <FaPlus />
        </Link>

        <NotificationDetails />

        <div style={{ zIndex: 10, position: "relative" }}>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none ">
              <div className="flex items-center gap-2">
                <Image
                  src={getProfileImageUrl(user?.profilePic, icon)}
                  alt={user?.name || "User avatar"}
                  width={28}
                  height={28}
                  className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-9 sm:h-9 cursor-pointer object-cover"
                />
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
