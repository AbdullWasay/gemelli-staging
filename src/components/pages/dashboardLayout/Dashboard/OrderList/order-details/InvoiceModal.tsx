"use client"

import { useRef, useEffect, JSX } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import InvoiceTemplate from "./InvoiceTemplate"
import { Order } from "@/types/Orders"

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close modal with escape key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const generatePDF = async (): Promise<void> => {
    if (!invoiceRef.current) return

    try {
      const originalBackground = invoiceRef.current.style.background
      invoiceRef.current.style.background = "white"

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      invoiceRef.current.style.background = originalBackground

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`invoice-${order.id}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("There was an error generating the PDF. Please try again.")
    }
  }

  const printInvoice = async (): Promise<void> => {
    if (!invoiceRef.current) return

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Please allow pop-ups to print the invoice")
        return
      }

      printWindow.document.open()
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${order.id}</title>
            <style>
              body { margin: 0; padding: 0; }
              img { width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL()}" />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      console.error("Error printing invoice:", error)
      alert("There was an error printing the invoice. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-xl w-full max-w-full sm:max-w-4xl max-h-[90vh] flex flex-col mx-2"
      >
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Invoice #{order.id}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700" 
            aria-label="Close invoice"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-2 sm:p-4 flex-1 overflow-auto">
          <div ref={invoiceRef} className="bg-white p-4 sm:p-6 shadow-sm border rounded-md">
            <InvoiceTemplate order={order} />
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t flex flex-wrap justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition-colors"
          >
            Close
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={printInvoice}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition-colors"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  )
}