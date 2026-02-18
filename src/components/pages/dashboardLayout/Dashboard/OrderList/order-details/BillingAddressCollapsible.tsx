"use client"


import { JSX, useState } from "react"

import type React from "react"
import CollapsibleHeader from "./CollapsibleHeader"


export default function BillingAddressCollapsible(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true)


  return (
    <div className="bg-bg-primary mt-5 rounded-[12px]">
      <CollapsibleHeader isOpen={isOpen} setIsOpen={setIsOpen} title="Billing address" />

      {isOpen && (
        <div className="p-4 pt-0">
      
         <p className="text-[13px] text-text-secondary font-poppins font-medium">Same as shipping address </p>
        
        </div>
      )}
    </div>
  )
}
