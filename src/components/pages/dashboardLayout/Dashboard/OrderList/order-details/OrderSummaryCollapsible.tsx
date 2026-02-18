"use client"

import { OrderSummaryCollapsibleProps } from "@/types/Orders"
import { JSX, useState } from "react"
import CollapsibleHeader from "./CollapsibleHeader"


export default function OrderSummaryCollapsible({ summary }: OrderSummaryCollapsibleProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className="bg-bg-primary mt-5 rounded-[12px] pb-8 pt-4">
      <CollapsibleHeader isOpen={isOpen} setIsOpen={setIsOpen} title="Order Summary" />

      {isOpen && (
        <div className="px-4 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[16px] text-text-secondary font-poppins font-medium">Sub-Total</span>
              <span className="text-[16px] text-text-secondary font-poppins font-medium">{summary.subtotal} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[16px] text-text-secondary font-poppins font-medium">Shipping</span>
              <span className="text-[16px] text-text-secondary font-poppins font-medium">{summary.shipping} USDT</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-[16px] text-text-secondary font-poppins font-medium">Total</span>
              <span className="text-[16px] text-text-secondary font-poppins font-medium">{summary.total} USDT</span>
            </div>
            <div className="flex gap-1 ">
              <span className="text-[16px] text-primary font-poppins font-medium">Paid by</span>
              <span className="text-[16px] text-primary font-poppins font-medium">{summary.paymentMethod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
