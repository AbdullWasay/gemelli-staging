"use client";

import React, { useRef } from "react";
import { Subscription, subscriptions } from "@/data/Subscriptions";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SubscriptionTemplete from "@/components/shared/template/SubscriptionTemplete";
import Heading from "@/components/ui/Heading/Heading";

export function SubscripsionsSettingsComponent() {
  const invoiceRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownload = async (subscription: Subscription, index: number) => {
    const element = invoiceRefs.current[index];
    if (!element) {
      console.error("Invoice element not found");
      return;
    }

    try {
      const originalStyles = {
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        opacity: element.style.opacity,
        zIndex: element.style.zIndex,
      };

      Object.assign(element.style, {
        position: "fixed",
        left: "0",
        top: "0",
        opacity: "1",
        zIndex: "9999",
      });

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      Object.assign(element.style, originalStyles);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297],
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${subscription.reference}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg mt-6">
      <Heading className="!text-[16px] mb-6 !mt-0">
        Subscriptions & Plans
      </Heading>

      {/* Off-screen invoice templates */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {subscriptions.map((subscription, index) => (
          <div
            key={`invoice-${index}`}
            ref={(el) => {
              invoiceRefs.current[index] = el;
            }}
            className="p-4 bg-white"
            style={{ width: "210mm" }}
          >
            <SubscriptionTemplete subscription={subscription} />
          </div>
        ))}
      </div>

      <div className="w-full overflow-x-auto max-w-[100vw] lg:max-w-[calc(100vw-400px)] xl:max-w-[calc(100vw-600px)]">
        <div className="min-w-[1100px] grid grid-cols-6 gap-y-4">
          <div className="bg-[#FFF] p-4 min-w-[100px] text-[13px] font-poppins text-[#212121] font-medium rounded-tl-md rounded-bl-md">
            Plan
          </div>
          <div className="bg-[#FFF] p-4 min-w-[100px] text-[13px] font-poppins text-[#212121] font-medium">
            Reference
          </div>
          <div className="bg-[#FFF] p-4 min-w-[100px] text-[13px] font-poppins text-[#212121] font-medium">
            DATE
          </div>
          <div className="bg-[#FFF] p-4 min-w-[100px] text-[13px] font-poppins text-[#212121] font-medium">
            AMOUNT
          </div>
          <div className="bg-[#FFF] p-4 min-w-[100px] text-[13px] font-poppins text-[#212121] font-medium">
            STATUS
          </div>
          <div className="bg-[#FFF] p-4 min-w-[100px] text-[13px] font-poppins text-[#212121] font-medium rounded-tr-md rounded-br-md">
            Download
          </div>

          {/* Table Rows */}
          {subscriptions.map((data, index) => (
            <React.Fragment key={`row-${index}`}>
              <div className="bg-white font-poppins opacity-70 text-text-secondary text-[13px] font-medium p-4 rounded-tl-md rounded-bl-md">
                {data.plan}
              </div>
              <div className="bg-white opacity-70 font-poppins text-text-secondary text-[13px] font-medium p-4">
                {data.reference}
              </div>
              <div className="bg-white opacity-70 font-poppins text-text-secondary text-[13px] font-medium p-4">
                {data.date}
              </div>
              <div className="bg-white opacity-70 font-poppins text-text-secondary text-[13px] font-medium p-4">
                {data.amount}
              </div>
              <div className="bg-white opacity-70 font-poppins text-text-secondary text-[13px] font-medium p-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    data.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : data.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : ""
                  }`}
                >
                  {data.status.toLocaleLowerCase() == "paid" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.7071 0.29289C14.0976 0.68342 14.0976 1.31658 13.7071 1.70711L5.70711 9.7071C5.31658 10.0976 4.68342 10.0976 4.29289 9.7071L0.29289 5.7071C-0.09763 5.3166 -0.09763 4.68342 0.29289 4.29289C0.68342 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.5858L12.2929 0.29289C12.6834 -0.09763 13.3166 -0.09763 13.7071 0.29289Z"
                        fill="#00BB67"
                      />
                    </svg>
                  ) : (
                    <p>Opps</p>
                  )}
                </span>
              </div>
              <button
                className="bg-[#FFF] p-4 min-w-[100px] text-[13px] font-poppins text-[#212121] font-medium rounded-tr-md rounded-br-md flex space-x-4"
                onClick={() => handleDownload(data, index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_37_5534)">
                    <path
                      d="M17.5 10H15C14.0808 10 13.3333 10.7475 13.3333 11.6667C13.3333 12.5858 12.5858 13.3333 11.6667 13.3333H8.33333C7.41417 13.3333 6.66667 12.5858 6.66667 11.6667C6.66667 10.7475 5.91917 10 5 10H2.5C1.12167 10 0 11.1217 0 12.5V15.8333C0 18.1308 1.86917 20 4.16667 20H15.8333C18.1308 20 20 18.1308 20 15.8333V12.5C20 11.1217 18.8783 10 17.5 10ZM18.3333 15.8333C18.3333 17.2117 17.2117 18.3333 15.8333 18.3333H4.16667C2.78833 18.3333 1.66667 17.2117 1.66667 15.8333V12.5C1.66667 12.04 2.04 11.6667 2.5 11.6667L5 11.665V11.6667C5 13.505 6.495 15 8.33333 15H11.6667C13.505 15 15 13.505 15 11.6667H17.5C17.96 11.6667 18.3333 12.04 18.3333 12.5V15.8333Z"
                      fill="#A240DE"
                    />
                    <path
                      d="M6.07641 5.93352C5.75057 5.60768 5.75057 5.08102 6.07641 4.75518C6.40224 4.42935 6.92891 4.42935 7.25474 4.75518L9.16557 6.66602V0.832683C9.16557 0.371849 9.53807 -0.000650406 9.99891 -0.000650406C10.4597 -0.000650406 10.8322 0.371849 10.8322 0.832683V6.66602L12.7431 4.75518C12.9056 4.59268 13.1189 4.51102 13.3322 4.51102C13.5456 4.51102 13.7589 4.59268 13.9214 4.75518C14.2472 5.08102 14.2472 5.60768 13.9214 5.93352L11.1772 8.67768C10.8556 8.99935 10.4339 9.16102 10.0106 9.16352L9.99891 9.16602L9.98724 9.16352C9.56474 9.16102 9.14224 8.99935 8.82057 8.67768L6.07641 5.93352Z"
                      fill="#A240DE"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_37_5534">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
