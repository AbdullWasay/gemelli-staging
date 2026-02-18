"use client"

import { useState } from "react"


import type { JSX } from "react/jsx-runtime"
import CollapsibleHeader from "./CollapsibleHeader"
import { ContactInfoCollapsibleProps } from "@/types/Orders"

export default function ContactInfoCollapsible({ contact }: ContactInfoCollapsibleProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className="bg-bg-primary mt-5 rounded-[12px]">
      <CollapsibleHeader isOpen={isOpen} setIsOpen={setIsOpen} title="Contact Information" />

      {isOpen && (
        <div className="p-4 pt-0">
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[14px] text-text-secondary font-poppins font-medium">{contact.email}</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-sm text-[#7244FF] font-poppins font-medium">{contact.phone || "No Phone Number"}</span>
          </div>
        </div>
      )}
    </div>
  )
}
