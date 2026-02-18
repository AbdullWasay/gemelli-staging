"use client";

import { CollapsibleProps } from "@/types/Orders";
import type { JSX } from "react";

export default function CollapsibleHeader({
  isOpen,
  setIsOpen,
  title,
  className
}: CollapsibleProps): JSX.Element {
  return (
    <div
      className="p-4 flex justify-between items-center cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <h2 className={`${className} text-[15px] text-black font-poppins font-medium`}>
        {title}
      </h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>

    </div>
  );
}
