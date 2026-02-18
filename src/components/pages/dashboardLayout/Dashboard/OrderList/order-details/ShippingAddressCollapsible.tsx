"use client";

import { ShippingAddressCollapsibleProps } from "@/types/Orders";
import { JSX, useState } from "react";

import type React from "react";
import CollapsibleHeader from "./CollapsibleHeader";
import MapModal from "./MapModal";

export default function ShippingAddressCollapsible({
  address,
}: ShippingAddressCollapsibleProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;

  return (
    <div className="bg-bg-primary mt-5 rounded-[12px]">
      <CollapsibleHeader
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Shipping Address"
      />

      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-[13px] text-text-secondary font-poppins font-medium">
            {address.street}
          </p>
          <p className="text-[13px] text-text-secondary font-poppins font-medium">
            {address.city}, {address.state} {address.zip}
          </p>
          <p className="text-[13px] text-text-secondary font-poppins font-medium">
            {address.country}
          </p>
          <div
            className="flex items-center mt-2 text-blue-500 text-sm cursor-pointer gap-2"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              setIsMapOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_37_5838)">
                <mask
                  id="mask0_37_5838"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                >
                  <path d="M0 0H20V20H0V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_37_5838)">
                  <path
                    d="M14.1259 2.54643C12.9867 1.40393 11.4942 0.833097 10.0009 0.833097C8.50839 0.833097 7.01505 1.40393 5.87672 2.54643C3.59839 4.8306 3.59839 8.53476 5.87672 10.8189L8.84839 13.6973C9.49505 14.3231 10.5209 14.3223 11.1667 13.6948L14.1259 10.8189C16.4042 8.53476 16.4042 4.8306 14.1259 2.54643Z"
                    stroke="#7244FF"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.5 6.66504C7.5 5.28421 8.61917 4.16504 10 4.16504C11.3808 4.16504 12.5 5.28421 12.5 6.66504C12.5 8.04587 11.3808 9.16504 10 9.16504C8.61917 9.16504 7.5 8.04587 7.5 6.66504Z"
                    stroke="#7244FF"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.31315 8.33286C2.49482 8.25036 0.833984 9.69536 0.833984 11.6662V15.062C0.833984 16.5495 1.82065 17.8579 3.25148 18.267L5.64315 19.0145C6.25482 19.2054 6.90815 19.2162 7.52565 19.0454L12.3606 17.6154C12.949 17.4562 13.5706 17.4612 14.1573 17.6304L16.0757 18.2795C17.6498 18.6629 19.1673 17.4704 19.1673 15.8504V11.5595C19.1673 10.1504 18.2806 8.89286 16.9531 8.41952L15.834 8.04702"
                    stroke="#7244FF"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_37_5838">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="text-sm text-[#7244FF] font-poppins font-medium">View Map</span>
          </div>

          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            address={fullAddress}
          />
        </div>
      )}
    </div>
  );
}
