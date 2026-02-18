"use client"

import { useState } from "react"

import type { JSX } from "react/jsx-runtime"
import CollapsibleHeader from "./CollapsibleHeader"

export default function ConversionSummaryCollapsible(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className="bg-bg-primary mt-5 rounded-[12px] py-4">
      <CollapsibleHeader isOpen={isOpen} setIsOpen={setIsOpen} title="Conversion Summary" />

      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-[14px] text-text-secondary font-poppins font-medium mb-2">View export for conversion details available for this order.</p>
          <button className="text-[#7244FF] text-sm hover:underline font-medium">Learn More</button>
        </div>
      )}
    </div>
  )
}
