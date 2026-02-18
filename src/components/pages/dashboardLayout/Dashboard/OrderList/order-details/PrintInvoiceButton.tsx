"use client"

import { useState } from "react"

import type { JSX } from "react/jsx-runtime"
import InvoiceModal from "./InvoiceModal"
import { Order } from "@/types/Orders"

interface PrintInvoiceButtonProps {
  order: Order
}

export default function PrintInvoiceButton({ order }: PrintInvoiceButtonProps): JSX.Element {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false)

  return (
    <>
      <button
        onClick={() => setIsInvoiceModalOpen(true)}
        className="bg-primary  text-white px-4 py-2 rounded-xl text-sm transition-colors md:w-[294px] w-full h-[56px] font-poppins font-semibold"
      >
        PRINT INVOICE
      </button>

      <InvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} order={order} />
    </>
  )
}
