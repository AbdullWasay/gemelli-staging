"use client"

import { CustomerInfoCollapsibleProps } from "@/types/Orders"
import { JSX, useState } from "react"
import CollapsibleHeader from "./CollapsibleHeader"


export default function CustomerInfoCollapsible({ customer }: CustomerInfoCollapsibleProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className="bg-bg-primary mt-5 rounded-[12px]  pb-4">
      <CollapsibleHeader isOpen={isOpen} setIsOpen={setIsOpen} title="Customer" />

      {isOpen && (
        <div className="mt-2 pt-0 pl-4">
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-[14px] text-text-secondary font-poppins font-medium">{customer.name}</span>
          </div>
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-[14px] text-text-secondary font-poppins font-medium">
              {customer.orders} order{Number(customer.orders) !== 1 ? "s" : ""}
            </span>
          </div>
          {customer.taxExempt && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-[14px] text-text-secondary font-poppins font-medium">Customer is tax-exempt</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
