import { Order } from "@/types/Orders"
import Image from "next/image"
import type { JSX } from "react"

interface InvoiceTemplateProps {
  order: Order
}

export default function InvoiceTemplate({ order }: InvoiceTemplateProps): JSX.Element {
  // Format date for invoice
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate due date (30 days from now for example)
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30)
  const formattedDueDate = dueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="font-sans text-gray-800 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">#{order.id}</p>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <div className="font-bold text-lg sm:text-xl">Your Company Name</div>
          <div className="text-gray-600 text-xs sm:text-sm mt-1">
            <p>123 Business Street</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
            <p className="mt-1">contact@yourcompany.com</p>
          </div>
        </div>
      </div>

      {/* Bill To & Invoice Details */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 gap-4">
        <div className="w-full sm:w-1/2">
          <h2 className="font-bold text-gray-700 text-sm sm:text-base mb-2">BILL TO</h2>
          <div className="text-gray-600 text-xs sm:text-sm">
            <p className="font-semibold">{order.customer.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-1">{order.contact.email}</p>
            {order.contact.phone && <p>{order.contact.phone}</p>}
          </div>
        </div>
        <div className="w-full sm:w-auto text-left sm:text-right">
          <div className="mb-2 text-xs sm:text-sm">
            <span className="font-bold text-gray-700">Invoice Date:</span>
            <span className="ml-2 text-gray-600">{currentDate}</span>
          </div>
          <div className="mb-2 text-xs sm:text-sm">
            <span className="font-bold text-gray-700">Due Date:</span>
            <span className="ml-2 text-gray-600">{formattedDueDate}</span>
          </div>
          <div className="mb-2 text-xs sm:text-sm">
            <span className="font-bold text-gray-700">Order Date:</span>
            <span className="ml-2 text-gray-600">{order.date}</span>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-gray-700">Payment Method:</span>
            <span className="ml-2 text-gray-600">{order.summary.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-6 sm:mb-8 overflow-x-auto">
        <table className="w-full text-left min-w-[600px] sm:min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-sm">Item</th>
              <th className="py-2 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-sm">Description</th>
              <th className="py-2 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-sm text-right">Quantity</th>
              <th className="py-2 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-sm text-right">Price</th>
              <th className="py-2 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-sm text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3 sm:py-4 px-2 sm:px-4">
                <div className="flex items-center">
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3">
                    <Image
                      src={order.item.image || "/placeholder.svg"}
                      alt={order.item.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs sm:text-sm">{order.item.name}</span>
                </div>
              </td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                Size: {order.item.size}, {order.item.brand}
              </td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm">{order.item.quantity}</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm">{order.item.price} USDT</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm">
                {Number(order.item.price) * Number(order.item.quantity)} USDT
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-6 sm:mb-8">
        <div className="w-full sm:w-64">
          <div className="flex justify-between py-1 sm:py-2 text-xs sm:text-sm">
            <span className="font-medium">Subtotal:</span>
            <span>{order.summary.subtotal} USDT</span>
          </div>
          <div className="flex justify-between py-1 sm:py-2 text-xs sm:text-sm">
            <span className="font-medium">Shipping:</span>
            <span>{order.summary.shipping} USDT</span>
          </div>
          <div className="flex justify-between py-1 sm:py-2 border-t border-gray-200 font-bold text-xs sm:text-sm">
            <span>Total:</span>
            <span>{order.summary.total} USDT</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <h3 className="font-semibold text-sm sm:text-[15px] text-black mb-1 sm:mb-2">Notes</h3>
        <p className="text-gray-600 text-xs sm:text-sm">
          Thank you for your business! Payment is due within 30 days. Please make checks payable to Your Company Name or
          you can use the payment method specified in this invoice.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200">
        <p>If you have any questions about this invoice, please contact us at support@yourcompany.com</p>
      </div>
    </div>
  )
}