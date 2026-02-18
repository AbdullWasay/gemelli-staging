"use client";
import React, { useState } from "react";
import Profile01 from "./profile-01";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContentProps extends DropdownMenuProps {
  align?: string;
  sideOffset?: number;
  className?: string;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenuTrigger = ({
  children,
  className,
}: DropdownMenuTriggerProps) => {
  const userData = useSelector(selectCurrentUser);

  return (
    <div
      className={`flex items-center gap-3 cursor-pointer poppins ${className}`}
    >
      <div>
        <p className="text-base font-medium text-[#151D48] uppercase">
          {userData?.name || "Account"}
        </p>
        <p className="text-[#005BFF] text-sm font-medium">
          {userData?.role || "USER"}
        </p>
      </div>
      {children}
      <ChevronDown className="w-4 h-4 text-gray-800" />
    </div>
  );
};

export const DropdownMenuContent = ({
  children,
  align = "start",
  sideOffset = 0,
  className = "",
}: DropdownMenuContentProps) => {
  return (
    <div
      className={`absolute z-[10000] ${
        align === "end" ? "right-0" : "left-0"
      } ${className}`}
      style={{
        marginTop: sideOffset,
        top: "100%",
      }}
    >
      <div className="relative p-2 bg-white  border border-zinc-200 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      {isOpen && (
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-[280px] sm:w-80"
        >
          <Profile01 />
        </DropdownMenuContent>
      )}
    </div>
  );
};
